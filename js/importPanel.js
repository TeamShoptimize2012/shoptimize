(function() {

  /*
      importPanel.coffee - Menüführung für Daten-Import
  */

  var Shoptimize, cleanUp, data, invalidateData, isArticleDataValid, isDistanceDataValid, isShowingDefectsAtTheMoment, parseArticleData, parseDistanceData, readArticleFile, readDistanceFile, root, showDefects, showProceedButton, timeout;

  Shoptimize = window.Shoptimize;

  root = this;

  data = {
    distances: [],
    prices: [],
    shops: [],
    quantities: [],
    articles: [],
    floydWarshall: null
  };

  isDistanceDataValid = false;

  isArticleDataValid = false;

  invalidateData = function() {
    isDistanceDataValid = false;
    return isArticleDataValid = false;
  };

  timeout = false;

  isShowingDefectsAtTheMoment = true;

  showDefects = function(message) {
    var elem;
    if (!isShowingDefectsAtTheMoment) return;
    isShowingDefectsAtTheMoment = false;
    clearTimeout(timeout);
    timeout = after(2000, function() {
      return isShowingDefectsAtTheMoment = true;
    });
    elem = $("<div class='fehler'>" + message + "</div>").hide().prependTo("#fehlerBox").fadeIn().on("click", function() {
      return $(this).remove();
    });
    return after(3500, function() {
      return elem.fadeOut(function() {
        return $(this).remove();
      });
    });
  };

  parseDistanceData = function() {
    var distanceData, result;
    distanceData = $("#distanceFileInput").val();
    result = parseDistancesCSV(distanceData);
    if (result.error != null) {
      $('#distanceFileStatus').addClass('invalid').removeClass('valid');
      isDistanceDataValid = false;
      showDefects(result.error);
    } else {
      $('#distanceFileStatus').removeClass('invalid').addClass('valid');
      isDistanceDataValid = true;
      data.distances = result.matrix;
      data.shops = result.shops;
    }
    return showProceedButton();
  };

  parseArticleData = function() {
    var articleData, result;
    articleData = $("#articleFileInput").val();
    result = parsePricesCSV(articleData);
    if (result.error != null) {
      $('#articleFileStatus').addClass('invalid').removeClass('valid');
      isArticleDataValid = false;
      showDefects(result.error);
    } else {
      $('#articleFileStatus').removeClass('invalid').addClass('valid');
      isArticleDataValid = true;
      data.prices = result.matrix;
      data.quantities = result.quantities;
      data.articles = result.articles;
    }
    return showProceedButton();
  };

  readDistanceFile = function(event) {
    var file, fileReader;
    fileReader = new FileReader();
    file = event.target.files.item(0);
    fileReader.onload = function(event) {
      var distanceDataText;
      distanceDataText = event.target.result;
      $("#distanceFileInput").val(distanceDataText);
      return parseDistanceData();
    };
    return fileReader.readAsText(file);
  };

  readArticleFile = function(event) {
    var file, fileReader;
    fileReader = new FileReader();
    file = event.target.files.item(0);
    fileReader.onload = function(event) {
      var articleDataText;
      articleDataText = event.target.result;
      $("#articleFileInput").val(articleDataText);
      return parseArticleData();
    };
    return fileReader.readAsText(file);
  };

  showProceedButton = function() {
    if (isDistanceDataValid && isArticleDataValid) {
      return $("#proceedButton").fadeIn();
    } else {
      return $("#proceedButton").fadeOut();
    }
  };

  cleanUp = function() {
    $("#mouseOver").hide();
    $("#homeButton").fadeOut(function() {
      return $(this).remove();
    });
    return $(".import").fadeOut(function() {
      return $(this).remove();
    });
  };

  Shoptimize.ImportPanel = function() {
    install(root, Shoptimize);
    invalidateData();
    replaceMessage("Bitte laden Sie die Daten für <b>Geschäfte und Artikel</b>!");
    $("<textarea id='distanceFileInput' class='import'>").hide().appendTo("#vizCanvas").on("keyup", function() {
      return parseDistanceData();
    });
    $("<div class='status invalid import' id='distanceFileStatus'>").hide().appendTo("#vizCanvas").text("Wegkosten geladen");
    $("<input type='file' id='distanceFileLoader' class='import'>").hide().appendTo("#vizCanvas").on("change", function(ev) {
      return readDistanceFile(ev);
    });
    $("<div class='status invalid import' id='articleFileStatus'>").hide().appendTo("#vizCanvas").text("Artikelkosten geladen");
    $("<textarea id='articleFileInput' class='import'>").hide().appendTo("#vizCanvas").on("keyup", function() {
      return parseArticleData();
    });
    $("<input type='file' id='articleFileLoader' class='import'>").hide().appendTo("#vizCanvas").on("change", function(ev) {
      return readArticleFile(ev);
    });
    $("<div class='button iconButton' id='homeButton'>Zurück</div>").hide().appendTo("#vizCanvas").on("click", function() {
      cleanUp();
      return StartPanel();
    });
    $("<div class='import' id='fehlerBox'>").hide().appendTo("#vizCanvas");
    $(".import, #homeButton").fadeIn();
    return $("<div class='button iconButton import' id='proceedButton'>Weiter</div>").hide().appendTo("#vizCanvas").on("click", function() {
      $("#mouseOver").hide().appendTo("#vizCanvas");
      cleanUp();
      return ControlPanel(data);
    });
  };

}).call(this);
