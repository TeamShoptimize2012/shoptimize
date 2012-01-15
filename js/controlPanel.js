(function() {
  var Shoptimize, cleanUp, initData, initVizData, root, vizdata;

  Shoptimize = window.Shoptimize;

  root = this;

  vizdata = {
    shops: [],
    distances: [],
    allDistances: [],
    articles: [],
    prices: [],
    history: []
  };

  initData = function(data) {
    data.floydWarshall = floydWarshall(data.distances);
    return data.hasNoTravelCost = false;
  };

  initVizData = function(data) {
    vizdata.shops = data.shops;
    vizdata.distances = data.distances;
    vizdata.allDistances = data.floydWarshall(data.distances);
    return vizdata.prices = data.prices;
  };

  cleanUp = function() {
    $("#mouseOver").hide();
    $("#homeButton").fadeOut(function() {
      return $(this).remove();
    });
    $(".button").fadeOut(function() {
      return $(this).remove();
    });
  };

  Shoptimize.ControlPanel = function(data) {
    var configureSettings, explainRouteButton, findRouteButton;
    install(root, Shoptimize);
    replaceMessage("Nehmen Sie <b>Einstellungen</b> vor,     lassen Sie die <b>Route berechnen</b>     oder lassen Sie sich den <b>Algorithmus erklären</b>");
    initData(data);
    configureSettings = $("<div class='button iconButton' id='configureSettings'>").hide().appendTo($("#vizCanvas")).text("Einstellungen").fadeIn().on("click", function() {
      cleanUp();
      return ConfigurationPanel(data);
    });
    findRouteButton = $("<div class='button iconButton' id='findRoute'>").hide().appendTo($("#vizCanvas")).text("Route finden").fadeIn().on("click", function() {
      cleanUp();
      $("#messagePane").fadeOut();
      return RoutePanel(data);
    });
    if (data.articles.length <= MAX_ARTICLES && (data.shops.length - 1) <= Shoptimize.MAX_SHOPS) {
      explainRouteButton = $("<div class='button iconButton' id='explainRoute'>").hide().appendTo($("#vizCanvas")).text("Route erklären").fadeIn().on("click", function() {
        var greedysettings, startClean;
        greedysettings = {
          ta: 0,
          aa: 0,
          ts: 0,
          ep: 0,
          max_iterations: 1
        };
        startClean = function(conf) {
          var algorithmdistances, worker;
          var _this = this;
          worker = new Worker('js/greedyWorker.js');
          worker.addEventListener("message", function(e) {
            if (e.data.solution) {
              data.history = e.data.solution.routereplaydata;
              data.allDistances = data.floydWarshall.matrix;
              Shoptimize.Viz();
              return Shoptimize.startViz(data);
            }
          });
          worker.addEventListener("error", function(e) {
            return console.log(e.data);
          });
          conf.config_TA = conf.ta;
          conf.config_AA = conf.aa;
          conf.config_TS = conf.ts;
          conf.config_EP = conf.ep;
          algorithmdistances = data.floydWarshall.matrix;
          return worker.postMessage({
            'command': "start",
            'settings': conf,
            'distances': algorithmdistances,
            'prices': data.prices,
            'quantities': data.quantities
          });
        };
        cleanUp();
        return startClean(greedysettings);
      });
    }
    $("<div class='button iconButton' id='homeButton'>Zurück</div>").hide().appendTo("#vizCanvas").fadeIn().on("click", function() {
      cleanUp();
      return StartPanel();
    });
    attachLabel(configureSettings, "Einstellungen konfigurieren");
    attachLabel(findRouteButton, "<span>Routen berechnen:</span>\n<p>Mit Hilfe der erweiterten Heuristik werden die Ergebnisse des Optimierungsvorgangs angezeigt.</p>");
    attachLabel(explainRouteButton, "<span>Diese Daten können visualisiert werden:</span>\n<p>Anhand der Basis-Heuristik wird erklärt, wie der Algorithmus Entscheidungen trifft.</p>");
  };

}).call(this);
