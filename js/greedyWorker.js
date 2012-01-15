(function() {
  var build_av, build_mk, chooseMarketId, error, norm_rand, pi, removeUndef, solution, solve_greedy, solver, sortByNumber;
  var _this = this;

  importScripts("lib/seedrandom.js");

  pi = Number.POSITIVE_INFINITY;

  self.addEventListener("message", function(e) {
    var continueTest, tmp;
    if (e.data.command === "start") {
      return solver(e.data.settings, e.data.distances, e.data.prices, e.data.quantities, solution);
    } else if (e.data.command === "benchmark") {
      tmp = e.data.settings;
      tmp.config_TA = tmp.bench_TA.min;
      tmp.config_AA = tmp.bench_AA.min;
      tmp.config_TS = tmp.bench_TS.min;
      tmp.config_EP = tmp.bench_EP.min;
      while (true) {
        solver(tmp, e.data.distances, e.data.prices, e.data.quantities, solution);
        continueTest = true;
        if (tmp.config_TA + tmp.bench_TA.step <= tmp.bench_TA.max) {
          tmp.config_TA += tmp.bench_TA.step;
        } else {
          tmp.config_TA = tmp.bench_TA.min;
          if (tmp.config_AA + tmp.bench_AA.step <= tmp.bench_AA.max) {
            tmp.config_AA += tmp.bench_AA.step;
          } else {
            tmp.config_AA = tmp.bench_AA.min;
            if (tmp.config_TS + tmp.bench_TS.step <= tmp.bench_TS.max) {
              tmp.config_TS += tmp.bench_TS.step;
            } else {
              tmp.config_TS = tmp.bench_TS.min;
              if (tmp.config_EP + tmp.bench_EP.step <= tmp.bench_EP.max) {
                tmp.config_EP += tmp.bench_EP.step;
              } else {
                tmp.config_EP = tmp.bench_EP.min;
                continueTest = false;
              }
            }
          }
        }
        if (!continueTest) break;
      }
      return self.postMessage({
        "message": "termination"
      });
    }
  });

  solution = function(msg) {
    return self.postMessage({
      "solution": msg
    });
  };

  error = function(msg) {
    return self.postMessage({
      "error": msg
    });
  };

  solve_greedy = function(settings, distances, prices, buy, callback_end, callback_each) {
    return solver(settings, distances, prices, buy, callback_end, callback_each);
  };

  build_mk = function(prices) {
    var i, inof, mk, order, price, prod, soprice, x, _ref, _ref2;
    mk = [];
    for (prod = 0, _ref = prices.length - 1; 0 <= _ref ? prod <= _ref : prod >= _ref; 0 <= _ref ? prod++ : prod--) {
      order = [];
      price = prices[prod].slice();
      soprice = price.slice().sort();
      for (i = 0, _ref2 = soprice.length - 1; 0 <= _ref2 ? i <= _ref2 : i >= _ref2; 0 <= _ref2 ? i++ : i--) {
        x = soprice.splice(0, 1);
        if (x > 0) {
          inof = price.indexOf(x[0]);
          order.push(inof);
          price[inof] = -2;
        }
      }
      mk.push(order);
    }
    return mk;
  };

  build_av = function(prices) {
    var av, costs, offers, price, prod, _i, _j, _len, _len2;
    av = [];
    for (_i = 0, _len = prices.length; _i < _len; _i++) {
      prod = prices[_i];
      costs = 0;
      offers = 0;
      for (_j = 0, _len2 = prod.length; _j < _len2; _j++) {
        price = prod[_j];
        if (price > 0) {
          costs += price;
          offers++;
        }
      }
      av.push(costs / offers);
    }
    return av;
  };

  norm_rand = function() {
    var u, v;
    u = Math.random();
    v = Math.random();
    return Math.abs(Math.cos(2 * Math.PI * u) * Math.sqrt(2 * Math.log(v)));
  };

  chooseMarketId = function(step2_threshold, numShops) {
    var result, rnd;
    rnd = Math.random();
    result = {
      gambled: false,
      choice: 0
    };
    if (rnd < step2_threshold) {
      rnd = norm_rand();
      rnd = Math.random();
      result.gambled = true;
      result.choice = Math.floor(rnd * numShops);
    }
    return result;
  };

  sortByNumber = function(a, b) {
    return a - b;
  };

  removeUndef = function() {
    return true;
  };

  solver = function(settings, distances, prices, buy, callback_end, callback_each) {
    var X, article, article_cost, article_cost_of, av, ci, config_AA, config_EP, config_TA, config_TS, cost, currentLocation, di, ei, feasabileMarkets, final_route, i, inBasket, item, itemindex, iter, iterationdata, j, leftArticles, minprice, minshop, mk, nextShop, nthbest, numArticles, numShops, pickOne, plainstations, result, route, route_two, routereplaydata, seed, shop, shopindex, si, sortedRanks, station, step, step1_threshold, step2_decision, ti, travel_cost, travel_cost_of, tries, unvisitedShops, x, _i, _j, _k, _l, _len, _len2, _len3, _len4, _len5, _len6, _m, _n, _ref, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _results;
    for (i = 0, _ref = prices.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
      for (j = 0, _ref2 = prices[i].length - 1; 0 <= _ref2 ? j <= _ref2 : j >= _ref2; 0 <= _ref2 ? j++ : j--) {
        if (prices[i][j] > -1) prices[i][j] = prices[i][j] * buy[i];
      }
    }
    mk = build_mk(prices);
    av = build_av(prices);
    numArticles = prices.length;
    numShops = prices[0].length;
    config_TA = Math.min(settings.config_TA, 100) / 100;
    config_AA = Math.min(settings.config_AA, 100) / 100;
    config_TS = Math.min(settings.config_TS, 100) / 100;
    config_EP = Math.min(settings.config_EP, 100) / 100;
    _results = [];
    for (tries = 0, _ref3 = settings.max_iterations - 1; 0 <= _ref3 ? tries <= _ref3 : tries >= _ref3; 0 <= _ref3 ? tries++ : tries--) {
      seed = new Date().getTime();
      Math.seedrandom(seed);
      unvisitedShops = (function() {
        var _ref4, _results2;
        _results2 = [];
        for (x = 0, _ref4 = numShops - 1; 0 <= _ref4 ? x <= _ref4 : x >= _ref4; 0 <= _ref4 ? x++ : x--) {
          _results2.push(x);
        }
        return _results2;
      })();
      leftArticles = (function() {
        var _ref4, _results2;
        _results2 = [];
        for (x = 0, _ref4 = numArticles - 1; 0 <= _ref4 ? x <= _ref4 : x >= _ref4; 0 <= _ref4 ? x++ : x--) {
          _results2.push(x);
        }
        return _results2;
      })();
      currentLocation = 0;
      route = [];
      plainstations = [];
      routereplaydata = [];
      X = Math.random();
      step1_threshold = 0;
      if (X < config_TA) step1_threshold = Math.floor(config_AA * numShops);
      while (leftArticles.length > 0) {
        di = [];
        si = [];
        ci = [];
        ti = [];
        ei = [];
        step = [];
        feasabileMarkets = 0;
        for (_i = 0, _len = unvisitedShops.length; _i < _len; _i++) {
          shop = unvisitedShops[_i];
          for (_j = 0, _len2 = leftArticles.length; _j < _len2; _j++) {
            article = leftArticles[_j];
            if (prices[article][shop] > 0) {
              nthbest = mk[article].indexOf(shop);
              if (nthbest <= step1_threshold) {
                if (!(di[shop] != null)) di[shop] = [];
                di[shop].push(article);
              } else if (prices[article][shop] <= av[article] * config_EP) {
                if (!(ei[shop] != null)) ei[shop] = [];
                ei[shop].push(article);
              }
            }
          }
          if ((di[shop] != null)) {
            ci[shop] = distances[currentLocation][shop + 1];
            si[shop] = 0;
            feasabileMarkets++;
            _ref4 = di[shop];
            for (_k = 0, _len3 = _ref4.length; _k < _len3; _k++) {
              item = _ref4[_k];
              si[shop] += prices[item][shop];
            }
            if (!(ei[shop] != null)) ei[shop] = [];
          }
        }
        if (feasabileMarkets === 0) {
          error("Something went wrong but I dunno why :/ - Feasible Markets = 0");
          return;
        }
        for (_l = 0, _len4 = unvisitedShops.length; _l < _len4; _l++) {
          shop = unvisitedShops[_l];
          if ((di[shop] != null)) ti[shop] = parseInt(si[shop] - ci[shop]);
        }
        sortedRanks = ti.slice().filter(removeUndef);
        sortedRanks.sort(sortByNumber).reverse();
        step2_decision = chooseMarketId(config_TS, feasabileMarkets);
        pickOne = step2_decision.choice;
        nextShop = ti.indexOf(sortedRanks[pickOne]);
        step2_decision.shop = nextShop;
        step = [nextShop].concat(di[nextShop]).concat(ei[nextShop]);
        route.push(step);
        plainstations.push([nextShop]);
        /*
                    Vizualize iterationdata before cleanup
        */
        iterationdata = {
          di: di,
          si: si,
          ei: ei,
          ti: ti,
          ci: ci,
          step2_decision: step2_decision,
          sri: sortedRanks,
          prevLoc: currentLocation,
          nextLoc: nextShop + 1
        };
        routereplaydata.push(iterationdata);
        _ref5 = di[nextShop].concat(ei[nextShop]);
        for (_m = 0, _len5 = _ref5.length; _m < _len5; _m++) {
          inBasket = _ref5[_m];
          leftArticles.splice(leftArticles.indexOf(inBasket), 1);
        }
        unvisitedShops.splice(unvisitedShops.indexOf(nextShop), 1);
        currentLocation = nextShop + 1;
      }
      route_two = plainstations.slice();
      for (itemindex = 0, _ref6 = numArticles - 1; 0 <= _ref6 ? itemindex <= _ref6 : itemindex >= _ref6; 0 <= _ref6 ? itemindex++ : itemindex--) {
        minprice = pi;
        minshop = -1;
        for (iter = 0, _ref7 = plainstations.length - 1; 0 <= _ref7 ? iter <= _ref7 : iter >= _ref7; 0 <= _ref7 ? iter++ : iter--) {
          shopindex = plainstations[iter][0];
          if (prices[itemindex][shopindex] > 0 && prices[itemindex][shopindex] < minprice) {
            minshop = iter;
            minprice = prices[itemindex][shopindex];
          }
        }
        route_two[minshop].push(itemindex);
      }
      final_route = [];
      for (_n = 0, _len6 = route_two.length; _n < _len6; _n++) {
        station = route_two[_n];
        if (station.length > 1) final_route.push(station);
      }
      travel_cost_of = function(route) {
        var i, real_route, station, travel_cost, _len7, _o, _ref8;
        travel_cost = 0;
        real_route = [0];
        for (_o = 0, _len7 = route.length; _o < _len7; _o++) {
          station = route[_o];
          real_route.push(station[0] + 1);
        }
        real_route.push(0);
        for (i = 1, _ref8 = real_route.length - 1; 1 <= _ref8 ? i <= _ref8 : i >= _ref8; 1 <= _ref8 ? i++ : i--) {
          travel_cost += distances[real_route[i - 1]][real_route[i]];
        }
        return travel_cost;
      };
      article_cost_of = function(route) {
        var article_cost, i, station, _len7, _o, _ref8;
        article_cost = 0;
        for (_o = 0, _len7 = route.length; _o < _len7; _o++) {
          station = route[_o];
          for (i = 1, _ref8 = station.length - 1; 1 <= _ref8 ? i <= _ref8 : i >= _ref8; 1 <= _ref8 ? i++ : i--) {
            article_cost += prices[station[i]][station[0]];
          }
        }
        return article_cost;
      };
      article_cost = Math.round(article_cost_of(final_route) * 100) / 100;
      travel_cost = Math.round(travel_cost_of(final_route) * 100) / 100;
      cost = Math.round(article_cost * 100 + travel_cost * 100) / 100;
      result = {
        min_cost: cost,
        article_cost: article_cost,
        travel_cost: travel_cost,
        best_route: final_route,
        seed: seed,
        iteration: tries,
        parameters: {
          config_TA: settings.config_TA,
          config_AA: settings.config_AA,
          config_TS: settings.config_TS,
          config_EP: settings.config_EP
        },
        routereplaydata: routereplaydata
      };
      _results.push(callback_end(result));
    }
    return _results;
  };

}).call(this);
