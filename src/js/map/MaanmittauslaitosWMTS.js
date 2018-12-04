import $ from "jquery";
import TileLayer from "ol/layer/tile";
import WMTSCapabilities from "ol/format/WMTSCapabilities";
import WMTSSource from "ol/source/WMTS";

export default function MaanmittauslaitosWMTS(onLayersCreatedCallbackFn) {
  var mmlMaastokarttaLayer;
  var mmlTaustakarttaLayer;
  var maastokarttaLayerSource;
  var taustakarttaLayerSource;

  var init = function() {
    loadMMLWmtsCapabilitiesAndAddLayers();
  };

  var loadMMLWmtsCapabilitiesAndAddLayers = function() {
    $.ajax({
      url:
        "https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/WMTSCapabilities.xml",
      success: function(response) {
        addWmtsLayers(response);
      }
    });
  };

  var addWmtsLayers = function(response) {
    var parser = new WMTSCapabilities();
    var capabilities = parser.read(response);

    maastokarttaLayerSource = new WMTSSource(
      WMTSSource.optionsFromCapabilities(capabilities, {
        layer: "maastokartta"
      })
    );
    taustakarttaLayerSource = new WMTSSource(
      WMTSSource.optionsFromCapabilities(capabilities, {
        layer: "taustakartta"
      })
    );

    mmlMaastokarttaLayer = new TileLayer({
      title: "Maastokartta",
      source: maastokarttaLayerSource,
      visible: false
    });
    mmlTaustakarttaLayer = new TileLayer({
      title: "Taustakartta",
      source: taustakarttaLayerSource,
      visible: true
    });

    onLayersCreatedCallbackFn(mmlMaastokarttaLayer, mmlTaustakarttaLayer);
  };

  this.getVisibleLayerName = function() {
    if (mmlMaastokarttaLayer && mmlMaastokarttaLayer.getVisible()) {
      return "maastokartta";
    } else if (mmlTaustakarttaLayer && mmlTaustakarttaLayer.getVisible()) {
      return "taustakartta";
    }
    return "taustakartta";
  };

  this.setVisibleLayerName = function(layerName) {
    if (layerName === "taustakartta") {
      mmlMaastokarttaLayer.setVisible(false);
      mmlTaustakarttaLayer.setVisible(true);
    } else if (layerName === "maastokartta") {
      mmlMaastokarttaLayer.setVisible(true);
      mmlTaustakarttaLayer.setVisible(false);
    }
  };

  init();
}
