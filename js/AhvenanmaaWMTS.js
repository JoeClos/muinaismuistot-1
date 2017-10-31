var AhvenanmaaWMTS = function(callbackFn) {
  var source;
  var layer;

  var init = function(callbackFn) {
    loadAlandWmtsCapabilitiesAndAddLayers(callbackFn);
  };

  var loadAlandWmtsCapabilitiesAndAddLayers = function(callbackFn) {
    $.ajax({
      url: 'capabilities/regeringen-wmts-capabilities.xml',
      success: function(response) {
        addAlandWmtsLayers(response, callbackFn);
      }
    });
  };

  var addAlandWmtsLayers = function(response, callbackFn) {
    var parser = new ol.format.WMTSCapabilities();
    var capabilities = parser.read(response);

    source = new ol.source.WMTS(ol.source.WMTS.optionsFromCapabilities(capabilities, {
      layer: 'inspire:fornminnen',
      format: 'image/png'
    }));

    layer = new ol.layer.Tile({
      title: 'Ahvenanmaa',
      source: source,
      visible: true
    });

    layer.setOpacity(0.7);
    callbackFn(layer);
  };

  this.getFeatureInfo = function(map, coordinate) {
    var view = map.getView();
    var source = layer.getSource();
    var tileUrlFunction = source.getTileUrlFunction();
    var tileGrid = source.getTileGrid();
    var zoom = view.getZoom();
    var resolution= tileGrid.getResolution(zoom);

    console.log('coordinate xy: ', coordinate);
    var transformedCoordinate = ol.proj.transform(coordinate, 'EPSG:3067', 'EPSG:4326');
    console.log('transformedCoordinate long lat: ', transformedCoordinate);

    var tileCoord = [zoom, transformedCoordinate[0], transformedCoordinate[1]];
    var sourceProjection = source.getProjection();
    var targetProjection = view.getProjection();
    var sourceTileGrid = source.getTileGridForProjection(sourceProjection);
    var targetTileGrid = source.getTileGridForProjection(targetProjection);

    var targetTileCoord = targetTileGrid.getTileCoordForCoordAndZ(coordinate, zoom);

    var wrappedTileCoord = source.getTileCoordForTileUrlFunction(targetTileCoord, targetProjection);
    wrappedTileCoord = wrappedTileCoord ? wrappedTileCoord : targetTileCoord;

    var targetExtent = targetTileGrid.getTileCoordExtent(wrappedTileCoord);
    var maxTargetExtent = targetTileGrid.getExtent();
    var sourceProjExtent = sourceProjection.getExtent();
    var limitedTargetExtent = maxTargetExtent ? ol.extent.getIntersection(targetExtent, maxTargetExtent) : targetExtent;

    var targetResolution = targetTileGrid.getResolution(zoom);
    var targetCenter = ol.extent.getCenter(limitedTargetExtent);
    var sourceResolution = ol.reproj.calculateSourceResolution(sourceProjection, targetProjection, targetCenter, targetResolution);
    var sourceZ = sourceTileGrid.getZForResolution(sourceResolution);
    console.log('sourceProjection', sourceProjection);
    console.log('targetProjection', targetProjection);
    console.log('sourceTileGrid', sourceTileGrid);
    console.log('targetTileGrid', targetTileGrid);
    console.log('targetTileCoord', targetTileCoord);
    console.log('wrappedTileCoord', wrappedTileCoord);
    console.log('targetExtent', targetExtent);
    console.log('maxTargetExtent', maxTargetExtent);
    console.log('sourceProjExtent', sourceProjExtent);
    console.log('limitedTargetExtent', limitedTargetExtent);
    console.log('targetResolution', targetResolution);
    console.log('targetCenter', targetCenter);
    console.log('sourceResolution', sourceResolution);
    console.log('sourceZ', sourceZ);


    tileCoord = tileGrid.getTileCoordForCoordAndZ(transformedCoordinate, sourceZ);
    console.log('tileCoord', tileCoord);

    var tileCoordForTileUrlFunction = source.getTileCoordForTileUrlFunction(tileCoord);
    console.log('tileCoordForTileUrlFunction', tileCoordForTileUrlFunction);

    var url = tileUrlFunction.call(source, tileCoord, ol.has.DEVICE_PIXEL_RATIO, sourceProjection);
    console.log('tileUrlFunction', url);

    var tileExtent = tileGrid.getTileCoordExtent(tileCoord);
    var tileResolution = sourceResolution;
    var pixelRatio = ol.has.DEVICE_PIXEL_RATIO;
    var x = Math.floor((coordinate[0] - tileExtent[0]) / (tileResolution / pixelRatio));
    var y = Math.floor((tileExtent[3] - coordinate[1]) / (tileResolution / pixelRatio));
    console.log('tileExtent', tileExtent);
    console.log('tileResolution', tileResolution);
    console.log('x', x);
    console.log('y', y);

    console.log('-----------------------------------------');
  };

  init(callbackFn);
};