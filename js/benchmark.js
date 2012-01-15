(function() {
  var GREEDY_PATH, REPETITIONS, Result, graphCost, graphOptimalCost, graphRunningTime, greedyConfiguration, testCases;

  Result = (function() {

    function Result(numberShops, numberArticles, optimalCost, cost, articleCost, travelCost, optimalNumberShops, visitedShops, runningTime) {
      this.numberShops = numberShops;
      this.numberArticles = numberArticles;
      this.optimalCost = optimalCost;
      this.cost = cost;
      this.articleCost = articleCost;
      this.travelCost = travelCost;
      this.optimalNumberShops = optimalNumberShops;
      this.visitedShops = visitedShops;
      this.runningTime = runningTime;
      this.quality = cost / optimalCost;
      this.quality = Math.round(this.quality * 100) / 100;
    }

    return Result;

  })();

  GREEDY_PATH = "js/greedyWorker.js";

  REPETITIONS = 100;

  testCases = [];

  graphCost = {
    data: [],
    lines: {
      show: true
    },
    points: {
      show: true
    }
  };

  graphOptimalCost = {
    data: [],
    lines: {
      show: true
    },
    points: {
      show: true
    }
  };

  graphRunningTime = {
    data: [],
    color: '#DC143C',
    lines: {
      show: true
    },
    points: {
      show: true
    }
  };

  greedyConfiguration = {
    config_TA: 100,
    config_AA: 60,
    config_TS: 30,
    config_EP: 70,
    max_iterations: 3
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
    processTests = function(algorithm, testNumber, maxTestNumber) {
      var articles, distances, parsedDistances, parsedPrices, prices, quantities, solutions, startTime, testSet, worker;
      var _this = this;
      if (testNumber > maxTestNumber) return;
      testSet = tpplib[testNumber - 1];
      parsedPrices = parsePricesCSV(testSet.articles);
      prices = parsedPrices.matrix;
      articles = parsedPrices.articles;
      quantities = parsedPrices.quantities;
      parsedDistances = parseDistancesCSV(testSet.shops);
      distances = (Shoptimize.floydWarshall(parsedDistances.matrix)).matrix;
      worker = new Worker(GREEDY_PATH);
      solutions = [];
      worker.addEventListener('message', function(e) {
        var accumulate, endTime;
        endTime = new Date().getTime();
        accumulate = function(solution) {
          var bestSolution, greedyMax, max, result, runningTime;
          solutions.push(solution);
          greedyMax = greedyConfiguration.max_iterations;
          max = greedyMax;
          if (solutions.length === max) {
            bestSolution = findBestSolution(solutions);
            runningTime = endTime - startTime;
            result = new Result(parsedPrices.shops.length + 1, articles.length, testSet.optimalCost, bestSolution.min_cost, bestSolution.article_cost, bestSolution.travel_cost, testSet.numberShops, bestSolution.best_route.length, runningTime);
            testCases.push([parsedPrices.shops.length + 1, articles.length]);
            addResultEntry(testNumber, result);
            return processTests(algorithm, testNumber + 1, maxTestNumber);
          }
        };
        return accumulate(e.data.solution);
      });
      startTime = new Date().getTime();
      return worker.postMessage({
        'command': 'start',
        'settings': greedyConfiguration,
        'distances': distances,
        'prices': prices,
        'quantities': quantities
      });
    };
    addResultEntry = function(testNumber, result) {
      var tableRow;
      tableRow = $('#resultTable > tbody:last').append($('<tr>'));
      tableRow.append("<td>" + testNumber + "</td>");
      tableRow.append("<td>" + result.numberShops + "</td>");
      tableRow.append("<td>" + result.numberArticles + "</td>");
      tableRow.append("<td>" + result.optimalCost + "</td>");
      tableRow.append("<td><strong>" + result.cost + "</strong></td>");
      tableRow.append("<td>x " + result.quality + "</td>");
      tableRow.append("<td>" + result.articleCost + "</td>");
      tableRow.append("<td>" + result.travelCost + "</td>");
      tableRow.append("<td>" + result.optimalNumberShops + "</td>");
      tableRow.append("<td>" + result.visitedShops + "</td>");
      tableRow.append("<td>" + result.runningTime + " ms</td>");
      graphCost.data.push([testNumber, result.cost]);
      graphOptimalCost.data.push([testNumber, result.optimalCost]);
      graphRunningTime.data.push([testNumber, result.runningTime]);
      return plotGraphs();
    };
    testAlgorithm = function(algorithm, event) {
      var maxTestNumber;
      greedyConfiguration.config_TA = parseInt($('#TA').val());
      greedyConfiguration.config_AA = parseInt($('#AA').val());
      greedyConfiguration.config_TS = parseInt($('#TS').val());
      greedyConfiguration.config_EP = parseInt($('#EP').val());
      greedyConfiguration.max_iterations = parseInt($('#numberIterations').val());
      maxTestNumber = parseInt($('#testCount').val());
      reset();
      return processTests(algorithm, 1, maxTestNumber);
    };
    reset = function() {
      $('#resultTable > tbody:last').empty();
      graphCost.data = [];
      graphOptimalCost.data = [];
      return graphRunningTime.data = [];
    };
    plotGraphs = function() {
      if ($('#qualityGraph').css('width') !== '0px') {
        $.plot($('#qualityGraph'), [graphCost, graphOptimalCost]);
      }
      if ($('#runningTimeGraph').css('width') !== '0px') {
        return $.plot($('#runningTimeGraph'), [graphRunningTime]);
      }
    };
    $('#runGreedy').bind('click', function(event) {
      return testAlgorithm('Greedy', event);
    });
    $('.tabs').tabs();
    $('.tabs').bind('change', function(event) {
      $('#qualityGraph').css('height', 300);
      $('#runningTimeGraph').css('height', 300);
      return plotGraphs();
    });
    $('#qualityGraph').css('height', 300);
    $('#runningTimeGraph').css('height', 300);
    return plotGraphs();
  });

}).call(this);
