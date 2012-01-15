(function() {

  /*
      gmaps.coffee - Ansicht für die Darstellung der berechneten Einkaufsrouten.
  */

  var Shoptimize, algorithmdistances, cleanUp, root, routedata;

  Shoptimize = window.Shoptimize;

  root = this;

  algorithmdistances = [];

  routedata = [];

  cleanUp = function() {
    var elements;
    elements = $("#vizCanvas *:not(#messagePane)");
    elements.fadeOut(function() {
      return $(this).remove();
    });
    return $("#messagePane").fadeIn();
  };

  Shoptimize.GoogleMaps = function() {
    var backButton, gmapsContainer;
    gmapsContainer = $("<div id='routereplay' class='nano'>").appendTo($("#vizCanvas")).html('<div class="routetablewrapper content"><table class="route" summary=""></table></div>');
    backButton = $("<div class='button iconButton' id='oneStepBack'>Zurück</div>").hide().appendTo($("#vizCanvas")).fadeIn().on("click", function() {
      cleanUp();
      return ControlPanel(routedata);
    });
    return $("#routereplay.nano").nanoScroller();
  };

  Shoptimize.GoogleMaps.init = function(data) {
    return routedata = data;
  };

  Shoptimize.GoogleMaps.setDistances = function(dist) {
    return algorithmdistances = dist;
  };

  Shoptimize.GoogleMaps.loadRouteIntoPlayer = function(routeindex) {
    var cost, current, data, from, highlightMovement, i, intermShopRow, intermediate, itemprice, itemprices, itemrow, itemstobuyhere, jsonroute, label, newrow, number, path, s, seperator, showAndResetRoutePlayer, solution, stations, summaryhtml, to, translateToJson, traveldistance, _i, _j, _len, _len2, _ref;
    solution = RESULTS.solutions[routeindex];
    data = routedata;
    showAndResetRoutePlayer = function() {
      $("#routereplay table.route").html("");
      /*
              $( "#routereplay #customExplain").remove()
              vizData = routedata
              vizData.shops = routedata.shops
              vizData.allDistances = routedata.floydWarshall.matrix
              vizData.history = solution.routereplaydata
              explainButton = $("<div class='button iconButton' id='customExplain'>")
                  .insertBefore("#routereplay table")
                  .text("Erklären")
                  .on "click", ->
                      elements = $("#vizCanvas *:not(#messagePane)")
                      elements.fadeOut ->
                          $(this).remove()
                      after 500, ->
                          Shoptimize.Viz()
                          Shoptimize.startViz vizData
      */
      return $("#routereplay").show();
    };
    showAndResetRoutePlayer();
    translateToJson = function(realsteps) {
      return realsteps.join(":");
    };
    highlightMovement = function(jsonsteps, high) {
      var step, steps, _ref, _results;
      steps = jsonsteps.split(":");
      unhighlightAllEdges();
      _results = [];
      for (step = 0, _ref = steps.length - 2; 0 <= _ref ? step <= _ref : step >= _ref; 0 <= _ref ? step++ : step--) {
        _results.push(JitGraph.highlightEdge(steps[step], steps[step + 1], GRAPH_EDGE_HIGHLIGHT_COLOR));
      }
      return _results;
    };
    stations = solution.translated_route.split(":");
    for (s = 0, _ref = stations.length - 2; 0 <= _ref ? s <= _ref : s >= _ref; 0 <= _ref ? s++ : s--) {
      from = parseInt(stations[s]);
      to = parseInt(stations[s + 1]);
      traveldistance = roundCurrency(algorithmdistances[from][to]);
      $("#routereplay table.route").append('<tbody class="movement"></tbody>');
      path = getPath(data.floydWarshall, from, to);
      current = from;
      jsonroute = [from];
      number = (s + 1) + ". ";
      if (path.length > 0) {
        for (_i = 0, _len = path.length; _i < _len; _i++) {
          intermediate = path[_i];
          intermShopRow = $("#factory tbody.routereplay tr.walktoshop").clone();
          intermShopRow.find(".description").html(number + "&Uuml;ber Gesch&auml;ft <strong>" + data.shops[intermediate] + "</strong>");
          cost = data.distances[current][intermediate];
          intermShopRow.find(".cost").html(cost);
          $("#routereplay table.route tbody:last-child").append(intermShopRow);
          current = intermediate;
          jsonroute.push(intermediate);
          number = "";
        }
      }
      label = number + "Gehe zu Gesch&auml;ft <strong>" + data.shops[to] + "</strong>";
      if (to === 0) {
        label = number + "Gehe zur&uuml;ck zum <strong>Startpunkt</strong>";
      }
      jsonroute.push(to);
      newrow = $("#factory tbody.routereplay tr.walktoshop").clone();
      newrow.find(".description").html(label);
      newrow.find(".cost").html(data.distances[current][to]);
      $("#routereplay table.route tbody:last-child").append(newrow);
      $("#routereplay table.route tbody:last-child tr:not(:nth-child(1)) td:nth-child(1)").empty();
      seperator = $("#factory tbody.routereplay tr.seperator").clone();
      seperator.find(".cost").html(traveldistance);
      $("#routereplay table.route tbody:last-child").append(seperator).attr('data-stat', translateToJson(jsonroute)).on('hover', function() {
        return highlightMovement($(this).attr('data-stat'), 1);
      }).on('mouseleave', function() {
        return unhighlightAllEdges();
      });
      if (to !== 0) {
        itemstobuyhere = solution.best_route[s].slice(1);
        itemprices = 0;
        $('<tbody class="payment">').insertAfter("#routereplay table.route tbody:last-child");
        for (_j = 0, _len2 = itemstobuyhere.length; _j < _len2; _j++) {
          i = itemstobuyhere[_j];
          itemprice = roundCurrency(data.prices[i][to - 1] * data.quantities[i]);
          itemprices += itemprice;
          itemrow = $("#factory tbody.routereplay tr.buysomething").clone();
          itemrow.find(".description").html("Kaufe " + data.quantities[i] + "x <strong>" + data.articles[i] + "</strong>");
          itemrow.find(".cost").html(itemprice);
          $("#routereplay table.route tbody:last-child").append(itemrow);
        }
        itemprices = roundCurrency(itemprices);
        seperator = $("#factory tbody.routereplay tr.seperator").clone();
        seperator.find(".cost").html(itemprices);
        $("#routereplay table.route tbody:last-child").append(seperator);
      }
    }
    summaryhtml = $("#factory tbody.summary").clone();
    summaryhtml.find(".cost.travelcosts").html(roundCurrency(solution.travel_cost));
    summaryhtml.find(".cost.purchasecosts").html(roundCurrency(solution.article_cost));
    summaryhtml.find(".cost.summary").html(roundCurrency(solution.min_cost));
    summaryhtml.insertAfter("#routereplay table.route tbody:last-child");
    return $("#routereplay.nano").nanoScroller();
  };

}).call(this);
