(function() {
  var Shoptimize, flotgraph_initialized, flothandle, plotdata, root;

  Shoptimize = window.Shoptimize;

  root = this;

  plotdata = [];

  flotgraph_initialized = false;

  flothandle = null;

  Shoptimize.FlotGraph = function() {};

  Shoptimize.FlotGraph.init = function() {
    var flotContainer;
    flotgraph_initialized = false;
    return flotContainer = $("<div id='flotgraph' class='flotgraph'>").appendTo($("#vizCanvas"));
  };

  Shoptimize.FlotGraph.build_graph_data = function(solutions) {
    var best_cost, bestiteration, purchase, solution, total, travel, x, _i, _len;
    travel = {
      label: "Wegkosten",
      data: []
    };
    purchase = {
      label: "Ladenkosten",
      data: []
    };
    total = {
      label: "Gesamtkosten",
      data: []
    };
    bestiteration = 0;
    plotdata = [];
    x = 0;
    best_cost = Number.POSITIVE_INFINITY;
    for (_i = 0, _len = solutions.length; _i < _len; _i++) {
      solution = solutions[_i];
      travel.data.push([x, solution.travel_cost]);
      purchase.data.push([x, solution.article_cost]);
      total.data.push([x, solution.min_cost]);
      if (solution.min_cost < best_cost) {
        best_cost = solution.min_cost;
        bestiteration = x;
      }
      x++;
    }
    plotdata.push(travel);
    plotdata.push(purchase);
    plotdata.push(total);
    plotdata.bestiteration = bestiteration;
    return plotdata;
  };

  Shoptimize.FlotGraph.init_flotgraph = function(drop, floydWarshall) {
    var legends, options, placeholder, snapToGrid;
    var _this = this;
    options = {
      series: {
        lines: {
          show: true
        }
      },
      points: {
        show: true
      },
      grid: {
        hoverable: true,
        clickable: true
      },
      crosshair: {
        mode: "x",
        color: FLOT_CROSSHAIR_COLOR,
        lineWidth: 2
      },
      xaxis: {
        tickDecimals: 0,
        tickSize: 5,
        ticks: [[plotdata.bestiteration, "beste Route"]]
      }
    };
    placeholder = $("#flotgraph");
    flothandle = $.plot(placeholder, plotdata, options);
    legends = $("#flotgraph .legendLabel");
    legends.each(function() {
      return $(_this).css('width', $(_this).width());
    });
    if (!flotgraph_initialized) {
      flotgraph_initialized = true;
      snapToGrid = function(event, pos, item) {
        var diff, result;
        result = {
          x: -1,
          y: pos.y
        };
        diff = pos.x - Math.round(pos.x);
        if (Math.abs(diff) < FLOT_CROSSHAIR_SNAP) result.x = Math.round(pos.x);
        return result;
      };
      placeholder.on("plotclick", function(event, pos, item) {
        var snapped;
        snapped = snapToGrid(event, pos, item);
        if (snapped.x > -1) {
          item = new Object();
          item.dataIndex = snapped.x;
        }
        if (item) return GoogleMaps.loadRouteIntoPlayer(item.dataIndex);
      });
      return placeholder.on("plothover", function(event, pos, item) {
        var dataset, forcedPosition, i, series, suffix, _ref, _results;
        forcedPosition = snapToGrid(event, pos, item);
        if (forcedPosition.x > -1) {
          pos.x = forcedPosition.x;
          flothandle.lockCrosshair(forcedPosition);
          item = new Object();
          item.dataIndex = forcedPosition.x;
        } else {
          flothandle.unlockCrosshair();
        }
        suffix = ["", "", ""];
        dataset = flothandle.getData();
        if (item) {
          JitGraph.highlightSolutionInGraph(floydWarshall, RESULTS.solutions[item.dataIndex], GRAPH_ROUTE_COLOR);
          suffix[0] = " = " + plotdata[0].data[item.dataIndex][1];
          suffix[1] = " = " + plotdata[1].data[item.dataIndex][1];
          suffix[2] = " = " + plotdata[2].data[item.dataIndex][1];
        }
        _results = [];
        for (i = 0, _ref = dataset.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
          series = dataset[i];
          _results.push($("#flotgraph .legendLabel").eq(i).html(series.label + suffix[i]));
        }
        return _results;
      });
    }
  };

}).call(this);
