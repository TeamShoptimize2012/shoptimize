(function() {
  var COLS, Shoptimize, cleanUp, parseDemo, root;

  Shoptimize = window.Shoptimize;

  root = this;

  parseDemo = function(demoData) {
    var data, parsedArticles, parsedDistances;
    data = {
      distances: [],
      prices: [],
      shops: [],
      quantities: [],
      articles: [],
      floydWarshall: null
    };
    parsedDistances = parseDistancesCSV(demoData.shops);
    parsedArticles = parsePricesCSV(demoData.prices);
    data.distances = parsedDistances.matrix;
    data.shops = parsedDistances.shops;
    data.prices = parsedArticles.matrix;
    data.quantities = parsedArticles.quantities;
    data.articles = parsedArticles.articles;
    return data;
  };

  COLS = 5;

  cleanUp = function() {
    $("#mouseOver").hide();
    $("#homeButton").fadeOut(function() {
      return $(this).remove();
    });
    return $(".demoCase").fadeOut(function() {
      return $(this).remove();
    });
  };

  Shoptimize.DemoPanel = function() {
    var i, key, makeDemoButton, _len, _ref;
    install(root, Shoptimize);
    replaceMessage("Bitte wählen Sie ein <strong>Beispiel</storng> aus!");
    makeDemoButton = function(key, i) {
      var col, newDemoCase, row;
      row = Math.floor(i / COLS);
      col = i % COLS;
      newDemoCase = $("<div class='button demoCase demoPanel no" + i + " row" + row + " col" + col + "'>").hide().text("" + (i + 1)).appendTo("#vizCanvas").delay(i * 50).fadeIn().on("click", function() {
        var data;
        cleanUp();
        data = parseDemo(Testdata[key]);
        return ControlPanel(data);
      });
      return attachLabel(newDemoCase, Testdata[key].title);
    };
    _ref = Object.keys(Testdata);
    for (i = 0, _len = _ref.length; i < _len; i++) {
      key = _ref[i];
      makeDemoButton(key, i);
    }
    $("<div class='button iconButton' id='homeButton'>Zurück</div>").hide().appendTo("#vizCanvas").fadeIn().on("click", function() {
      cleanUp();
      return StartPanel();
    });
  };

}).call(this);
