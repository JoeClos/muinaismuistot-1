import $ from "jquery";
import TileLayer from "ol/layer/Tile";
import TileArcGISRestSource from "ol/source/TileArcGISRest";

export default function MuseovirastoArcGISWMS(
  muinaismuistotSettings,
  showLoadingAnimationFn,
  onLayerCreatedCallbackFn
) {
  var source;
  var layer;

  var init = function() {
    addMuinaismuistotLayer();
  };

  var addMuinaismuistotLayer = function() {
    source = createSource();
    layer = new TileLayer({
      source: source
    });
    layer.setOpacity(0.7);

    source.on("tileloadstart", function() {
      showLoadingAnimationFn(true);
    });
    source.on("tileloadend", function() {
      showLoadingAnimationFn(false);
    });
    source.on("tileloaderror", function() {
      showLoadingAnimationFn(false);
    });

    onLayerCreatedCallbackFn(layer);
  };

  var createSource = function() {
    return new TileArcGISRestSource(getMuinaismuistotLayerSourceParams());
  };

  var updateMuinaismuistotLayerSource = function() {
    if (layer) {
      source = createSource();
      layer.setSource(source);
    }
  };

  var getMuinaismuistotLayerSourceParams = function() {
    var layerIds = muinaismuistotSettings.getSelectedMuinaismuistotLayerIds();
    var layers = "";

    if (layerIds.length > 0) {
      layers = "show:" + layerIds.join(",");
    } else {
      //Hide all layers
      layers =
        "hide:" + muinaismuistotSettings.getMuinaismuistotLayerIds().join(",");
    }

    return {
      url: muinaismuistotSettings.getMuseovirastoArcGISWMSExportURL(),
      params: {
        layers: layers,
        layerDefs: muinaismuistotSettings.getFilterParamsLayerDefinitions()
      }
    };
  };

  this.updateVisibleLayersFromSettings = function() {
    updateMuinaismuistotLayerSource();
  };

  this.identifyFeaturesAt = function(coordinate, mapSize, mapExtent) {
    var queryoptions = {
      geometry: coordinate.join(","),
      geometryType: "esriGeometryPoint",
      tolerance: 10,
      imageDisplay: mapSize.join(",") + ",96",
      mapExtent: mapExtent.join(","),
      layers:
        "visible:" +
        muinaismuistotSettings.getSelectedMuinaismuistotLayerIds().join(","),
      f: "json",
      returnGeometry: "true"
    };

    return $.getJSON(
      muinaismuistotSettings.getMuseovirastoArcGISWMSIndentifyURL(),
      queryoptions
    );
  };

  this.findFeatures = function(searchText, callback) {
    var layerMap = muinaismuistotSettings.getMuinaismuistotLayerIdMap();
    var selectedLayerIds = muinaismuistotSettings.getSelectedMuinaismuistotLayerIds();

    //Muinaismustot areas always has same name as main point so do not search those
    var areaIndex = selectedLayerIds.indexOf(layerMap.Muinaisjäännökset_alue);
    if (areaIndex > -1) {
      selectedLayerIds.splice(areaIndex, 1);
    }

    var queryoptions = {
      searchText: searchText,
      contains: true,
      searchFields: "Kohdenimi, Nimi, KOHDENIMI",
      layers: selectedLayerIds.join(","),
      f: "json",
      returnGeometry: "true",
      returnZ: "false"
    };
    showLoadingAnimationFn(true);

    $.getJSON(
      muinaismuistotSettings.getMuseovirastoArcGISWMSFindFeaturesURL(),
      queryoptions,
      function(response) {
        callback(response.results);
        showLoadingAnimationFn(false);
      }
    );
  };

  init();
}
