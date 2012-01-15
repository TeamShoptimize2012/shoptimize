(function() {
  var GREEDY_PATH, Result, data, graphCost, graphCostConfig, graphOptimalCost, greedyConfiguration, testCases;

  Result = (function() {

    function Result(numberShops, numberArticles, optimalCost, cost, articleCost, travelCost, optimalNumberShops, visitedShops, runningTime, parameter) {
      this.numberShops = numberShops;
      this.numberArticles = numberArticles;
      this.optimalCost = optimalCost;
      this.cost = cost;
      this.articleCost = articleCost;
      this.travelCost = travelCost;
      this.optimalNumberShops = optimalNumberShops;
      this.visitedShops = visitedShops;
      this.runningTime = runningTime;
      this.parameter = parameter;
      this.quality = cost / optimalCost;
      this.quality = Math.round(this.quality * 100) / 100;
    }

    return Result;

  })();

  GREEDY_PATH = "js/greedyWorker.js";

  testCases = [];

  graphCost = {
    data: []
  };

  graphOptimalCost = {
    data: []
  };

  graphCostConfig = {
    lines: {
      show: true
    },
    points: {
      show: true
    },
    grid: {
      clickable: true
    }
  };

  greedyConfiguration = {
    config_TA: 0,
    config_AA: 0,
    config_TS: 0,
    config_EP: 0,
    bench_TA: {
      min: 0,
      step: 0,
      max: 0
    },
    bench_AA: {
      min: 0,
      step: 0,
      max: 0
    },
    bench_TS: {
      min: 0,
      step: 0,
      max: 0
    },
    bench_EP: {
      min: 0,
      step: 0,
      max: 0
    },
    max_iterations: 3
  };

  data = {
    prices: [],
    distances: [],
    quantities: []
  };

  $(function() {
    var addResultEntry, findBestSolution, plotGraphs, processTests, reset, testAlgorithm;
    var _this = this;
    findBestSolution = function(solutions) {
      var bestSolution, lowestCost, solution, _i, _len;
      lowestCost = Infinity;
      bestSolution = null;
      for (_i = 0, _len = solutions.length; _i < _len; _i++) {
        solution = solutions[_i];
        if (solution.min_cost < lowestCost) {
          lowestCost = solution.min_cost;
          bestSolution = solution;
        }
      }
      return bestSolution;
    };
    processTests = function(algorithm, testNumber) {
      var accumulate, iterationcount, solutions, startTime, worker, workerPath;
      var _this = this;
      workerPath = GREEDY_PATH;
      worker = new Worker(workerPath);
      solutions = [];
      iterationcount = 0;
      accumulate = function(solution) {
        var bestSolution, endTime, greedyMax, max, result, runningTime;
        solutions.push(solution);
        greedyMax = greedyConfiguration.max_iterations;
        max = greedyMax;
        if (solutions.length === max) {
          endTime = new Date().getTime();
          bestSolution = findBestSolution(solutions);
          runningTime = endTime - startTime;
          result = new Result(data.prices.length + 1, data.prices.length, data.testSet.optimalCost, bestSolution.min_cost, bestSolution.article_cost, bestSolution.travel_cost, data.testSet.numberShops, bestSolution.best_route.length, runningTime, bestSolution.parameters);
          solutions = [];
          return addResultEntry(++iterationcount, result);
        }
      };
      worker.addEventListener('message', function(e) {
        if (e.data.solution) {
          return accumulate(e.data.solution);
        } else if (e.data.message === 'termination') {
          plotGraphs();
          $('#runGreedy').html("Greedy Algorithm").addClass("primary");
          $('#runGreedy').one('click', function(event) {
            $(this).html("Running").removeClass("primary");
            return testAlgorithm('Greedy', event);
          });
          return $("table#resultTable").trigger("update");
        }
      });
      startTime = new Date().getTime();
      return worker.postMessage({
        'command': 'benchmark',
        'settings': greedyConfiguration,
        'distances': data.distances,
        'prices': data.prices,
        'quantities': data.quantities
      });
    };
    addResultEntry = function(testNumber, result) {
      var tableRow;
      tableRow = $("<tr>");
      tableRow.append("<td><a id='result_" + testNumber + "' name='" + testNumber + "'>" + testNumber + "</a></td>");
      tableRow.append("<td>" + result.optimalCost + "</td>");
      tableRow.append("<td><strong>" + result.cost + "</strong></td>");
      tableRow.append("<td>x " + result.quality + "</td>");
      tableRow.append("<td>" + result.articleCost + "</td>");
      tableRow.append("<td>" + result.travelCost + "</td>");
      tableRow.append("<td>" + result.parameter.config_TA + " </td>");
      tableRow.append("<td>" + result.parameter.config_AA + " </td>");
      tableRow.append("<td>" + result.parameter.config_TS + " </td>");
      tableRow.append("<td>" + result.parameter.config_EP + " </td>");
      $("#resultTable tbody").append(tableRow);
      graphCost.data.push([testNumber, result.cost]);
      if (graphCost.data.length < 200 || graphCost.data.length % 25 === 0) {
        return plotGraphs();
      }
    };
    testAlgorithm = function(algorithm, event) {
      var parsedDistances, parsedPrices, testNumber, testSet;
      greedyConfiguration.bench_TA.min = parseInt($('#TA_min').val());
      greedyConfiguration.bench_TA.step = parseInt($('#TA_step').val());
      greedyConfiguration.bench_TA.max = parseInt($('#TA_max').val());
      greedyConfiguration.bench_AA.min = parseInt($('#AA_min').val());
      greedyConfiguration.bench_AA.step = parseInt($('#AA_step').val());
      greedyConfiguration.bench_AA.max = parseInt($('#AA_max').val());
      greedyConfiguration.bench_TS.min = parseInt($('#TS_min').val());
      greedyConfiguration.bench_TS.step = parseInt($('#TS_step').val());
      greedyConfiguration.bench_TS.max = parseInt($('#TS_max').val());
      greedyConfiguration.bench_EP.min = parseInt($('#EP_min').val());
      greedyConfiguration.bench_EP.step = parseInt($('#EP_step').val());
      greedyConfiguration.bench_EP.max = parseInt($('#EP_max').val());
      greedyConfiguration.max_iterations = parseInt($('#numberIterations').val());
      reset();
      testNumber = parseInt($('#testCount').val());
      testSet = tpplib[testNumber - 1];
      data.testSet = testSet;
      parsedPrices = parsePricesCSV(testSet.articles);
      data.prices = parsedPrices.matrix;
      data.quantities = parsedPrices.quantities;
      parsedDistances = parseDistancesCSV(testSet.shops);
      data.distances = (Shoptimize.floydWarshall(parsedDistances.matrix)).matrix;
      return processTests(algorithm, testNumber);
    };
    reset = function() {
      $('#resultTable > tbody:last').empty();
      graphCost.data = [];
      graphOptimalCost.data = [];
    };
    plotGraphs = function() {
      if ($('#qualityGraph').css('width') !== '0px') {
        return $.plot($('#qualityGraph'), [graphCost, graphOptimalCost], graphCostConfig);
      }
    };
    $('#runGreedy').one('click', function(event) {
      $(this).html("Running").removeClass("primary");
      return testAlgorithm('Greedy', event);
    });
    $('#qualityGraph').css('height', 220).css('overflow', 'hidden');
    plotGraphs();
    $('#resultTable').parent().css({
      height: '280px',
      overflowY: 'scroll'
    });
    $('#qualityGraph').on("plotclick", function(event, pos, item) {
      var target_top, tmp_row;
      if (item) {
        tmp_row = $("#resultTable tbody tr").index($('#result_' + (item.dataIndex + 1)).parent().parent());
        target_top = tmp_row * 37 - 26;
        $('#resultTable').parent().animate({
          scrollTop: target_top
        }, 1000);
        $("#resultTable tr").css({
          backgroundColor: "#FFFFFF"
        });
        return $("#result_" + (item.dataIndex + 1)).parent().parent().css({
          backgroundColor: "#E3FFE3"
        });
      }
    });
    return $("table#resultTable").tablesorter();
  });

}).call(this);
