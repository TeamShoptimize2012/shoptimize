(function() {

  /*
   viz.coffee
   In dieser Datei ist die Visualisierung und Erklärung des Algorithmus implementiert
  */

  /*
  */

  var DELAY, Shoptimize, root, startViz1, startViz2, startViz3, startViz4, startViz5, startViz6, startViz7, vizDone, vizStep, vizStep2, vizStep3;

  Shoptimize = window.Shoptimize;

  root = this;

  /*
  Anmelden am globalen Kontext
  */

  Shoptimize.Viz = function() {
    return install(root, Shoptimize);
  };

  /*
  Globale Verzögerung für Animationen
  */

  DELAY = 3000;

  Shoptimize.startViz = function(data) {
    var s, shops;
    if (!(data != null)) console.log("Keine Daten");
    if (!(data.history != null)) console.log("Keine History");
    if (data.history.length <= 0) return;
    shops = (function() {
      var _i, _len, _ref, _results;
      _ref = data.shops;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        s = _ref[_i];
        _results.push(s);
      }
      return _results;
    })();
    if (!(data.home != null)) {
      data.home = shops.shift();
      data.shops = shops;
    }
    replaceMessage("Beginne Lösung mit einem <b>gierigen Algorithmus</b>.");
    return after(DELAY, function() {
      return startViz1(data);
    });
  };

  startViz1 = function(data) {
    var i, _ref;
    replaceMessage("Es gibt <b>" + data.articles.length + " Artikel</b> die wir kaufen wollen:");
    for (i = 1, _ref = data.articles.length; 1 <= _ref ? i <= _ref : i >= _ref; 1 <= _ref ? i++ : i--) {
      $("<div class='article bigIcon no" + i + " of" + data.articles.length + "'>").hide().appendTo("#vizCanvas").delay(i * 100 + 500).fadeIn();
    }
    return after(DELAY, function() {
      return startViz2(data);
    });
  };

  startViz2 = function(data) {
    var i, _ref, _ref2, _ref3;
    for (i = 1, _ref = data.articles.length; 1 <= _ref ? i <= _ref : i >= _ref; 1 <= _ref ? i++ : i--) {
      $(".article.bigIcon.no" + i).delay(i * 100).fadeOut(function() {
        return $(this).remove();
      });
    }
    data.breadCrumbPos = 0;
    replaceMessage("Diese können wir in <b>" + data.shops.length + " Geschäften</b> kaufen:");
    for (i = 1, _ref2 = data.shops.length; 1 <= _ref2 ? i <= _ref2 : i >= _ref2; 1 <= _ref2 ? i++ : i--) {
      $("<div class='shop pane no" + i + " of" + data.shops.length + "'>").hide().appendTo("#vizCanvas").delay(i * 100 + 500).fadeIn();
    }
    for (i = 1, _ref3 = data.shops.length; 1 <= _ref3 ? i <= _ref3 : i >= _ref3; 1 <= _ref3 ? i++ : i--) {
      $("<div class='shop icon no" + i + " of" + data.shops.length + "'>").hide().appendTo("#vizCanvas").delay(i * 100 + 500).fadeIn();
    }
    return after(DELAY, function() {
      return startViz3(data);
    });
  };

  startViz3 = function(data) {
    replaceMessage("Zu folgenden <b>Preisen</b> sind die Artikel in den Geschäften zu erwerben:");
    return after(500, function() {
      return startViz4(data);
    });
  };

  startViz4 = function(data) {
    var i, j, _ref, _ref2, _ref3;
    for (i = 1, _ref = data.articles.length; 1 <= _ref ? i <= _ref : i >= _ref; 1 <= _ref ? i++ : i--) {
      for (j = 1, _ref2 = data.shops.length; 1 <= _ref2 ? j <= _ref2 : j >= _ref2; 1 <= _ref2 ? j++ : j--) {
        if (data.prices[i - 1][j - 1] >= 0) {
          $(".shop.icon.no" + j).delay(j * 50).fadeOut();
          $("<div class='article price no" + i + " in" + j + " of" + data.shops.length + "'>").hide().appendTo("#vizCanvas").css({
            left: parseInt($(".shop.pane.no" + j).css("left")) + 10 + gridPos(1),
            top: parseInt($(".shop.pane.no" + j).css("top")) + 10 + gridPos(i - 1)
          }).text(data.prices[i - 1][j - 1]).delay(j * 50 + i * j * 50).fadeIn();
          $("<div class='article icon no" + i + " in" + j + " of" + data.shops.length + "'>").hide().appendTo("#vizCanvas").css({
            left: parseInt($(".shop.pane.no" + j).css("left")) + 10,
            top: parseInt($(".shop.pane.no" + j).css("top")) + 10 + gridPos(i - 1)
          }).delay(j * 50 + i * j * 50).fadeIn();
        }
        $(".shop.pane.no" + j).animate({
          height: gridSize(data.articles.length) + 20
        }, j * 50 + i * j * 50);
      }
    }
    for (i = 1, _ref3 = data.articles.length; 1 <= _ref3 ? i <= _ref3 : i >= _ref3; 1 <= _ref3 ? i++ : i--) {
      attachLabel(".article.icon.no" + i, data.articles[i - 1]);
    }
    return after(DELAY, function() {
      return startViz5(data);
    });
  };

  startViz5 = function(data) {
    var homeIcon;
    homeIcon = $("<div class='home icon'>").hide().appendTo("#vizCanvas").fadeIn();
    attachLabel(homeIcon, data.home);
    replaceMessage("Mit unserer Einkaufsroute fangen wir natürlich <b>zu Hause</b> an.");
    return after(DELAY, function() {
      return startViz6(data);
    });
  };

  startViz6 = function(data) {
    replaceMessage("Um die <b>Fahrtkosten zu miniminiere</b> besuchen wir <b>kein Geschäft mehr als einmal</b>.");
    return after(DELAY, function() {
      return startViz7(data);
    });
  };

  startViz7 = function(data) {
    replaceMessage("Um zu entscheiden welches Geschäft wir zuerst besuchen, ermitteln wir <b>wo welcher Artikel am günstigsten</b> angeboten wird.");
    return after(DELAY, function() {
      var adjustArticle, di, i, j, k, _i, _len, _ref;
      $(".article").addClass("disgraced");
      after(1500, function() {
        return $(".disgraced").fadeOut(function() {
          return $(this).remove();
        });
      });
      for (i = 1, _ref = data.shops.length; 1 <= _ref ? i <= _ref : i >= _ref; 1 <= _ref ? i++ : i--) {
        di = data.history[0].di[i - 1];
        k = 0;
        for (_i = 0, _len = di.length; _i < _len; _i++) {
          j = di[_i];
          adjustArticle = function(i, j, k) {
            var highlights;
            highlights = $(".article.price.no" + (j + 1) + ".in" + i).clone();
            highlights.hide().addClass("priceHighlight chosen").appendTo("#vizCanvas").fadeIn();
            $(".article.icon.no" + (j + 1) + ".in" + i).add(".article.price.no" + (j + 1) + ".in" + i).removeClass("disgraced");
            return after(1000, function() {
              return $(".article.icon.no" + (j + 1) + ".in" + i).add(".article.price.no" + (j + 1) + ".in" + i).animate({
                top: parseInt($(".shop.pane.no" + i).css("top")) + 10 + gridPos(k)
              }, 500);
            });
          };
          adjustArticle(i, j, k++);
        }
      }
      return after(2000 + DELAY, function() {
        replaceMessage("Jetzt müssen wir noch entscheiden, <b>in welcher Reihenfolge</b> wir die Artikel einkaufen.");
        return after(DELAY, function() {
          return vizStep(data, 0);
        });
      });
    });
  };

  vizStep = function(data, num) {
    var fahrtKosten, i, itemKosten, left, step, top, _ref;
    if (!(data.history[num] != null)) {
      vizDone(data);
      return;
    }
    step = data.history[num];
    if (num > 0) {
      replaceMessage("Jetzt schauen wir <u>wieder</u>, <b>wie viel es uns kostet zu welchem Shop</b> zu kommen:");
    } else {
      replaceMessage("Jetzt schauen wir, <b>wie viel es uns kostet zu welchem Shop</b> zu kommen:");
    }
    for (i = 1, _ref = data.shops.length; 1 <= _ref ? i <= _ref : i >= _ref; 1 <= _ref ? i++ : i--) {
      if (!(step.di[i - 1] != null)) continue;
      fahrtKosten = data.allDistances[step.prevLoc][i];
      itemKosten = step.si[i - 1];
      top = parseInt($(".shop.pane.no" + i).css("top"));
      top += $(".shop.pane.no" + i).height();
      left = parseInt($(".shop.pane.no" + i).css("left")) + 10;
      $("<div class='disgraced shopCost no" + i + "'>").hide().appendTo("#vizCanvas").css({
        top: top + "px",
        left: left + "px"
      }).html("<span class='articleCost'>" + (roundCurrency(itemKosten)) + "</span>\n<span class='travelCost'>" + (roundCurrency(fahrtKosten)) + "</span>\n<span class='rank'>" + (roundCurrency(itemKosten - fahrtKosten)) + "</span>").delay(i * 50).fadeIn();
    }
    if (num === 0) {
      return $("<div id='zuendendeIdee' class='disgraced'>").html("Die zündende Idee für den gierigen Algorithmus ist,\n<b>so viel wie möglich zu den günstigsten Konditionen</b> einzukaufen.\nFür unsere Zwecke ist es also gut, Geld auszugeben,\nwenn wir dafür auch etwas kriegen. Für den Weg wollen wir\naber möglichst wenig ausgeben! Daher wählen wir das Geschäft\nin dem wir zuerst einkaufen danach, ob wir möglichst viel\nGeld <b>nach Abzug der Wegkosten</b> dort ausgeben können.\nDiesen Wert nennen wir <b>die Güte</b> des Geschäfts.\nDie Güte ist abhängig von unserer aktuellen Position.").appendTo("#vizCanvas").one("click", function() {
        $(this).fadeOut(function() {
          return $(this).remove();
        });
        return vizStep2(data, num);
      });
    } else {
      return after(DELAY, function() {
        return vizStep2(data, num);
      });
    }
  };

  vizStep2 = function(data, num) {
    var step;
    step = data.history[num];
    replaceMessage("Wir wählen daher das <b>" + step.nextLoc + ". Geschäft</b>.");
    $("<div class='redArrowDown disgraced'>").css({
      top: "-48px",
      left: (parseInt($(".shop.pane.no" + step.nextLoc).css("left")) + 66) + "px"
    }).appendTo("#vizCanvas").animate({
      top: parseInt($(".shopCost.no" + step.nextLoc).css("top")) - 165
    });
    return after(DELAY, function() {
      $(".disgraced").fadeOut(function() {
        return $(this).remove();
      });
      return vizStep3(data, num);
    });
  };

  vizStep3 = function(data, num) {
    var i, itemCost, startPos, step, travelCost, _i, _len, _ref;
    step = data.history[num];
    replaceMessage("Schritt <b>" + (num + 1) + " von " + data.history.length + "</b>");
    startPos = data.breadCrumbPos;
    data.breadCrumbPos++;
    $("<div class='icon shop no" + step.nextLoc + "'>").hide().appendTo("#vizCanvas").fadeIn().css({
      top: 0,
      left: gridPos(data.breadCrumbPos)
    });
    _ref = step.di[step.nextLoc - 1];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      data.breadCrumbPos++;
      $(".icon.article.no" + (i + 1)).animate({
        top: 0,
        left: gridPos(data.breadCrumbPos)
      }, 400);
      $(".article.price.no" + (i + 1)).fadeOut(function() {
        return $(this).remove();
      });
    }
    travelCost = data.allDistances[step.prevLoc][step.nextLoc];
    itemCost = step.si[step.nextLoc - 1];
    $("<div class='descriptor'>").hide().appendTo("#vizCanvas").append($("<div class='travelCost'>").text(roundCurrency(travelCost))).append($("<div class='arrow'>")).append($("<div class='itemCost'>").text(roundCurrency(itemCost))).css({
      left: gridPos(startPos + 1),
      width: gridSize(data.breadCrumbPos - startPos)
    }).fadeIn();
    $(".shop.pane.no" + step.nextLoc).fadeOut(function() {
      return $(this).remove();
    });
    return after(1500, function() {
      return vizStep(data, num + 1);
    });
  };

  vizDone = function(data) {
    var foobarloc, purchase, travel, x, _i, _len, _ref;
    data.breadCrumbPos++;
    $("<div class='home icon'>").hide().css({
      left: gridPos(data.breadCrumbPos)
    }).appendTo("#vizCanvas").fadeIn();
    replaceMessage("Schlussendlich gehen wir wieder <b>zum Startpunkt</b>.");
    purchase = 0;
    travel = 0;
    foobarloc = 0;
    _ref = data.history;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      x = _ref[_i];
      purchase += x.si[x.nextLoc - 1];
      travel += x.ci[x.nextLoc - 1];
      foobarloc = x.nextLoc - 1;
    }
    travel += data.allDistances[0][foobarloc];
    $("<div class=\"final travelCost\"><i>Wegkosten</i><b>" + (roundCurrency(travel)) + "</b></div>\n<div class=\"final purchaseCost\"><i>Einkauf</i><b>" + (roundCurrency(purchase)) + "</b></div>\n<div class=\"final totalCost\"><i>Gesamtkosten</i><b>" + (roundCurrency(purchase + travel)) + "</b></div>\n").hide().appendTo("#vizCanvas").fadeIn();
    return $("body").css({
      cursor: 'pointer'
    }).on("click", window.top.location.reload);
  };

}).call(this);
