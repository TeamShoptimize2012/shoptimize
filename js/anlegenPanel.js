(function() {
  var Shoptimize, cleanUp, cleanUpDistances, doneEditData, doneEditDistances, editData, editDistances, root;
  var __hasProp = Object.prototype.hasOwnProperty, __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (__hasProp.call(this, i) && this[i] === item) return i; } return -1; };

  Shoptimize = window.Shoptimize;

  root = this;

  cleanUp = function() {
    $("#mouseOver").hide();
    $("#homeButton").fadeOut(function() {
      return $(this).remove();
    });
    return $(".editData").fadeOut(function() {
      return $(this).remove();
    });
  };

  editData = function(data, doneEdit) {
    var addArticle, addShop, articleNames, articlePrices, articles, makePriceTag, makeShop, newArticle, newShop, selectedIcons, shopName1, shops, showProgressButton;
    if (!(data != null) || Object.keys(data).length === 0) {
      data = {
        shops: [],
        distances: [],
        allDistances: [],
        articles: [],
        prices: [],
        history: [],
        icons: []
      };
    }
    replaceMessage("Bitte geben Sie hier die <b>Geschäfte</b> an und die Preise der verfügbaren <b>Artikel</b>. (<i>-1 oder Garbage für nicht verfügbar)</i>)");
    selectedIcons = [];
    articlePrices = [];
    articleNames = [];
    articles = 0;
    shops = 0;
    makePriceTag = function(g, a) {
      return $("<input type='text' class='editData tile textInput shop" + g + " article" + a + "'>").hide().appendTo("#vizCanvas").val(Math.round(articlePrices[a - 1] * 100 + articlePrices[a - 1] * (0.5 + Math.random()) * 100) / 100).css({
        top: gridPos(g + 3),
        left: gridPos(a + 4)
      }).fadeIn().on("click", function() {
        return $(this).select();
      }).on("blur", function() {
        var val;
        val = parseFloat($(this).val());
        if (val >= 0) {
          return $(this).val(Math.round(val * 100) / 100);
        } else {
          return $(this).val("-1");
        }
      });
    };
    showProgressButton = function() {
      return $("<div class='editData weiter iconButton button clickable'>").hide().appendTo("#vizCanvas").text("Weiter").fadeIn().on("click", function() {
        var a, i, s, _i, _len, _ref;
        data = {
          articles: [],
          prices: [],
          shops: [],
          icons: []
        };
        for (s = 1; 1 <= shops ? s <= shops : s >= shops; 1 <= shops ? s++ : s--) {
          data.shops.push($(".shopName.no" + s).val());
        }
        for (a = 1, _ref = articleNames.length; 1 <= _ref ? a <= _ref : a >= _ref; 1 <= _ref ? a++ : a--) {
          data.articles.push(articleNames[a - 1]);
          data.prices.push([]);
          for (s = 1; 1 <= shops ? s <= shops : s >= shops; 1 <= shops ? s++ : s--) {
            data.prices[a - 1].push($(".editData.tile.textInput.article" + a + ".shop" + s).val());
          }
        }
        for (_i = 0, _len = selectedIcons.length; _i < _len; _i++) {
          i = selectedIcons[_i];
          data.icons.push(i);
        }
        cleanUp();
        return doneEdit(data);
      });
    };
    newArticle = function() {
      articles++;
      if (articles >= MAX_ARTICLES) {
        return $("#addArticleButton").fadeOut(function() {
          return $(this).remove();
        });
      }
    };
    addArticle = function() {
      var ICON_GRID_COLS, ICON_GRID_OFFSET_X, ICON_GRID_OFFSET_Y, OFFSET_X, OFFSET_Y, articleIcon, i, makeIcon, s, textInput;
      newArticle();
      articlePrices.push((nextInt(2000) + 300) / 100);
      if (shops > 0) {
        for (s = 1; 1 <= shops ? s <= shops : s >= shops; 1 <= shops ? s++ : s--) {
          makePriceTag(s, articles);
        }
      }
      showProgressButton();
      $("<div id='awfulOverlay'>").hide().appendTo("body").css({
        position: 'fixed',
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: 'rgba(0, 0, 0, 0.1)'
      });
      ICON_GRID_OFFSET_X = 5;
      ICON_GRID_OFFSET_Y = 6;
      ICON_GRID_COLS = 8;
      OFFSET_X = 20;
      OFFSET_Y = 20;
      $("<div id='awfulCanvas'>").appendTo("#awfulOverlay").css({
        position: 'absolute',
        top: $("#vizCanvas").offset().top + OFFSET_Y,
        left: $("#vizCanvas").offset().left + OFFSET_X,
        width: "100%",
        height: "100%"
      });
      $("<div class='editData chooseIconPane'>").appendTo("#awfulCanvas").css({
        top: gridPos(ICON_GRID_OFFSET_Y - 2) - 10 + OFFSET_Y,
        left: gridPos(ICON_GRID_OFFSET_X) - 10 + OFFSET_X,
        width: gridSize(ICON_GRID_COLS) + 20,
        height: gridSize(Math.ceil(NUM_ICONS / ICON_GRID_COLS + 2)) + 20
      }).text("Legen Sie einen Namen fest und wählen danach ein Icon aus!");
      articleIcon = $("<div class='editData articleIcon tile no" + articles + " noPic'>").appendTo("#vizCanvas").css({
        top: $("#addArticleButton").css("top"),
        left: $("#addArticleButton").css("left")
      });
      textInput = $("<input type='text' class='editData articleName textInput' />").appendTo("#awfulCanvas").css({
        top: gridPos(ICON_GRID_OFFSET_Y - 2) + OFFSET_Y + 32,
        left: gridPos(ICON_GRID_OFFSET_X) + OFFSET_X,
        width: gridSize(5)
      }).val("Artikel " + articles);
      makeIcon = function(num) {
        var icon;
        icon = $("<div class='editData pic" + num + " tile chooseIcon'>").appendTo("#awfulCanvas").css({
          top: gridPos(ICON_GRID_OFFSET_Y + Math.floor((num - 1) / ICON_GRID_COLS)) + OFFSET_Y,
          left: gridPos(ICON_GRID_OFFSET_X + ((num - 1) % ICON_GRID_COLS)) + OFFSET_X
        });
        if (__indexOf.call(selectedIcons, num) >= 0) {
          return icon.css({
            opacity: 0.2,
            cursor: 'default'
          });
        } else {
          return icon.one('click', function() {
            var i;
            $(".chooseIcon").off('mouseenter');
            for (i = 1; 1 <= NUM_ICONS ? i <= NUM_ICONS : i >= NUM_ICONS; 1 <= NUM_ICONS ? i++ : i--) {
              $(".editData.articleIcon.no" + articles).removeClass("pic" + i);
            }
            $(".editData.articleIcon.no" + articles).addClass("pic" + num);
            $("#awfulOverlay").fadeOut(function() {
              return $(this).remove();
            });
            selectedIcons.push(num);
            articleNames.push(textInput.val());
            return attachLabel(articleIcon, textInput.val());
          }).on('mouseenter', function() {
            var i;
            for (i = 1; 1 <= NUM_ICONS ? i <= NUM_ICONS : i >= NUM_ICONS; 1 <= NUM_ICONS ? i++ : i--) {
              $(".editData.articleIcon.no" + articles).removeClass("pic" + i);
            }
            $(".editData.articleIcon.no" + articles).addClass("pic" + num);
            return $(".editData.articleIcon.no" + articles).removeClass("noPic");
          });
        }
      };
      for (i = 1; 1 <= NUM_ICONS ? i <= NUM_ICONS : i >= NUM_ICONS; 1 <= NUM_ICONS ? i++ : i--) {
        makeIcon(i);
      }
      $("#awfulOverlay").fadeIn();
      textInput.focus().select();
      return $("#addArticleButton").animate({
        left: "+=" + (gridPos(1))
      });
    };
    $("<div id='addArticleButton' class='editData addButton tile clickable'>").hide().appendTo("#vizCanvas").css({
      top: gridPos(3),
      left: gridPos(5)
    }).one("click", function() {
      return $("#addArticleHint").fadeOut(function() {
        return $(this).remove();
      });
    }).on("click", function() {
      return addArticle();
    });
    makeShop = function(num) {
      $("<div class='editData tile shopIcon no" + num + "'>").hide().appendTo("#vizCanvas").fadeIn().css({
        top: gridPos(3 + num),
        left: gridPos(0)
      });
      return $("<input type='text' class='textInput editData shopName no" + num + "'>").hide().appendTo("#vizCanvas").val("Geschäft " + num).css({
        top: gridPos(3 + num),
        left: gridPos(1),
        width: gridSize(4)
      }).on("keyup", function(ev) {
        if (ev.which === 13 && shops < MAX_SHOPS) return addShop();
      });
    };
    newShop = function() {
      shops++;
      if (shops >= MAX_SHOPS) {
        $("#addShopButton").fadeOut(function() {
          return $(this).remove();
        });
      }
      return makeShop(shops);
    };
    shopName1 = newShop();
    addShop = function() {
      var a, _ref, _results;
      if ((_ref = newShop()) != null) _ref.fadeIn().focus().select();
      $("#addShopButton").animate({
        top: "+=" + (gridPos(1))
      });
      $("#addShopHint").fadeOut(function() {
        return $(this).remove();
      });
      if (articles > 0) {
        _results = [];
        for (a = 1; 1 <= articles ? a <= articles : a >= articles; 1 <= articles ? a++ : a--) {
          _results.push(makePriceTag(shops, a));
        }
        return _results;
      }
    };
    $("<div id='addShopButton' class='editData addButton tile clickable'>").hide().appendTo("#vizCanvas").css({
      top: gridPos(5),
      left: gridPos(4)
    }).on("click", function() {
      return addShop();
    });
    $(".editData").fadeIn();
    shopName1.focus().select();
    after(500, function() {
      return $("<div id='addArticleHint' class='editData hint toTheLeft'>").hide().appendTo("#vizCanvas").text("Hier Artikel hinzufügen").css({
        top: gridPos(3),
        left: gridPos(6)
      }).fadeIn();
    });
    return $("<div id='addShopHint' class='editData hint toTheLeft'>").hide().appendTo("#vizCanvas").text("Hier Geschäfte hinzufügen").css({
      top: gridPos(5),
      left: gridPos(5)
    }).fadeIn();
  };

  cleanUpDistances = function() {
    return $(".editDistances").fadeOut(function() {
      return $(this).hide();
    });
  };

  editDistances = function(data, done) {
    var makeDistanceTag, s, s2s, showProgressDistancesButton, _ref;
    replaceMessage("Geben Sie hier an, <b>wie viel es kostet</b> um von einem Geschäft zu einem anderen zu kommen!");
    $("<div class='editDistances helpText'>\n<span>Wegkosten bearbeiten</span>\n<p>Hier können Sie die Wegkosten zwischen den Geschäften bearbeiten.\nEs ist durchaus erlaubt, dass nicht von jedem Punkt zu jedem anderen Punkt\neine Verbindung existiert; das heißt einige Textfelder dürfen auch leer bleiben.\nDie tatsächlichen Kosten um von einem Punkt zu einem anderen zu kommen\nwerden dann von <i>shoptimize</i> berechnet werden.\n</div>").hide().appendTo("#vizCanvas").fadeIn();
    showProgressDistancesButton = function() {
      return $("<div class='editDistances weiter iconButton button clickable'>").hide().appendTo("#vizCanvas").text("Weiter").fadeIn().on("click", function() {
        var s, s2s, v, _ref, _ref2, _ref3, _ref4, _ref5;
        data.distances = [];
        for (s = 0, _ref = data.shops.length; 0 <= _ref ? s <= _ref : s >= _ref; 0 <= _ref ? s++ : s--) {
          data.distances.push([]);
          for (s2s = 0, _ref2 = s - 1; 0 <= _ref2 ? s2s <= _ref2 : s2s >= _ref2; 0 <= _ref2 ? s2s++ : s2s--) {
            if (s2s < 0 || s2s === s) continue;
            v = parseFloat($("input.editDistances.from" + s2s + ".to" + s).val());
            console.log("" + s + " " + s2s + " " + v);
            data.distances[s][s2s] = v >= 0 ? v : -1;
          }
        }
        for (s = 0, _ref3 = data.shops.length; 0 <= _ref3 ? s <= _ref3 : s >= _ref3; 0 <= _ref3 ? s++ : s--) {
          for (s2s = 0, _ref4 = s - 1; 0 <= _ref4 ? s2s <= _ref4 : s2s >= _ref4; 0 <= _ref4 ? s2s++ : s2s--) {
            if (s2s < 0 || s2s === s) continue;
            data.distances[s2s][s] = data.distances[s][s2s];
          }
        }
        for (s = 0, _ref5 = data.shops.length; 0 <= _ref5 ? s <= _ref5 : s >= _ref5; 0 <= _ref5 ? s++ : s--) {
          data.distances[s][s] = 0;
        }
        cleanUpDistances();
        if (done != null) return done(data);
      });
    };
    for (s = 0, _ref = data.shops.length; 0 <= _ref ? s <= _ref : s >= _ref; 0 <= _ref ? s++ : s--) {
      makeDistanceTag = function(from, to) {
        $("<div class='editDistances tile textInput pendant from" + from + " to" + to + "'>").appendTo("#vizCanvas").css({
          left: gridPos(3 + from),
          top: gridPos(4 + to)
        }).text("?").show();
        return $("<input type='text' class='textInput editDistances tile from" + to + " to" + from + "'>").hide().appendTo("#vizCanvas").css({
          top: gridPos(4 + from),
          left: gridPos(3 + to)
        }).fadeIn().on("keyup", function() {
          var v;
          v = parseFloat($(this).val());
          return $(".pendant.from" + from + ".to" + to).text(v >= 0 ? v : "?");
        });
      };
      $("<div class='editDistances icon shop no" + s + "'>").hide().appendTo("#vizCanvas").css({
        left: gridPos(3 + s),
        top: gridPos(3)
      }).fadeIn();
      $("<div class='editDistances icon shop no" + s + "'>").hide().appendTo("#vizCanvas").css({
        left: gridPos(2),
        top: gridPos(4 + s)
      }).fadeIn();
      for (s2s = 0; 0 <= s ? s2s <= s : s2s >= s; 0 <= s ? s2s++ : s2s--) {
        if (s === s2s) continue;
        makeDistanceTag(s, s2s);
      }
    }
    return showProgressDistancesButton();
  };

  doneEditDistances = function(data) {
    var a;
    data.quantities = (function() {
      var _i, _len, _ref, _results;
      _ref = data.articles;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        a = _ref[_i];
        _results.push(1);
      }
      return _results;
    })();
    data.shops.unshift("Start");
    console.log(data);
    return Shoptimize.ControlPanel(data);
  };

  doneEditData = function(data) {
    return editDistances(data, doneEditDistances);
  };

  Shoptimize.AnlegenPanel = function() {
    install(root, Shoptimize);
    editData({}, doneEditData);
    return $("<div class='button iconButton' id='homeButton'>Zurück</div>").hide().appendTo("#vizCanvas").fadeIn().on("click", function() {
      cleanUp();
      return StartPanel();
    });
  };

}).call(this);
