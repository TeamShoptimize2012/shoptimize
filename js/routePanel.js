(function() {

  /*
      routePanel.coffee - Ansicht für die Darstellung der berechneten Einkaufsrouten.
  */

  var Shoptimize, TMPDATA, root, solve_greedy;

  Shoptimize = window.Shoptimize;

  root = this;

  TMPDATA = null;

  Shoptimize.RoutePanel = function(data, greedysettings) {
    if (greedysettings == null) greedysettings = PARAMETER_SETS["default"];
    install(root, Shoptimize);
    FlotGraph();
    FlotGraph.init();
    JitGraph();
    JitGraph.init(data);
    GoogleMaps();
    GoogleMaps.init(data);
    return solve_greedy(data, greedysettings);
  };

  solve_greedy = function(data, conf) {
    var algorithmdistances, translate, worker;
    var _this = this;
    translate = function(best_route) {
      var ret, step, _i, _len;
      ret = [0];
      for (_i = 0, _len = best_route.length; _i < _len; _i++) {
        step = best_route[_i];
        ret.push(step[0] + 1);
      }
      ret.push(0);
      return ret.join(":");
    };
    worker = new Worker('js/greedyWorker.js');
    worker.addEventListener("message", function(e) {
      var flotdata, route;
      if (e.data.solution) {
        if (e.data.solution.min_cost < RESULTS.bestcost) {
          RESULTS.bestcost = e.data.solution.min_cost;
          RESULTS.bestiteration = e.data.solution.iteration;
        }
        route = translate(e.data.solution.best_route);
        e.data.solution.translated_route = route;
        RESULTS.solutions.push(e.data.solution);
        flotdata = FlotGraph.build_graph_data(RESULTS.solutions);
        FlotGraph.init_flotgraph(flotdata, data.floydWarshall);
        if (RESULTS.solutions.length > 100) return worker.terminate();
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
    GoogleMaps.setDistances(algorithmdistances);
    /*
        locprices = []
        for i in [0..data.prices.length-1]
            locpricesrow = []
            for j in [0..data.prices.length-1]
                if data.availability[i][j]
                    locpricesrow.push data.prices[i][j]
                else
                    locpricesrow.push -1
            locprices.push locpricesrow
    */
    return worker.postMessage({
      'command': "start",
      'settings': conf,
      'distances': algorithmdistances,
      'prices': data.prices,
      'quantities': data.quantities
    });
  };

}).call(this);
