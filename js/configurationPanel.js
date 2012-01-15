(function() {
  var Shoptimize, addInput, cleanUp, greedysettings, i, isShowingDefectsAtTheMoment, isVisible, loadNewConfig, parseValue, root, showDefects, showProceedButton, validParams;

  Shoptimize = window.Shoptimize;

  root = this;

  greedysettings = null;

  isShowingDefectsAtTheMoment = true;

  isVisible = true;

  validParams = {
    one: true,
    two: true,
    three: true,
    four: true,
    five: true
  };

  i = 1;

  cleanUp = function() {
    $("#mouseOver").hide();
    $("#homeButton").fadeOut(function() {
      return $(this).remove();
    });
    $("input").fadeOut(function() {
      return $(this).remove();
    });
    $("label").fadeOut(function() {
      return $(this).remove();
    });
    $(".button").fadeOut(function() {
      return $(this).remove();
    });
    return $("#fehlerBox").remove();
  };

  parseValue = function(value, target, nr) {
    var newVal;
    newVal = parseInt(value);
    if (!(newVal >= 0 && newVal <= 100)) {
      validParams[nr] = false;
      showDefects("Die Parameter natürliche Zahlen zwischen 0 und 100 sein!");
    } else {
      validParams[nr] = true;
      greedysettings[target] = newVal;
    }
    return showProceedButton();
  };

  showDefects = function(message) {
    var elem, timeout;
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

  showProceedButton = function() {
    var key, val;
    for (key in validParams) {
      val = validParams[key];
      if (!val) {
        if (isVisible) {
          $("#config_findRoute").fadeOut();
          isVisible = false;
        }
        return;
      }
    }
    if (!isVisible) {
      $("#config_findRoute").fadeIn();
      isVisible = true;
    }
  };

  loadNewConfig = function(newConfig) {
    $("#ta").attr('value', newConfig.ta);
    $("#aa").attr('value', newConfig.aa);
    $("#ts").attr('value', newConfig.ts);
    $("#ep").attr('value', newConfig.ep);
    $("#max_iterations").attr('value', newConfig.max_iterations);
    greedysettings = newConfig;
  };

  addInput = function(nr, val, paramName, labelText, hoverText) {
    var element, label;
    label = $("<label class='configuration " + nr + "' for='" + paramName + "'>").hide().appendTo($("#vizCanvas")).html(labelText).delay(i * 100).fadeIn();
    element = $("<input type='text' id='" + paramName + "' class='configuration " + nr + " textInput'>").hide().appendTo($("#vizCanvas")).attr("value", val).delay(i * 100).fadeIn().on("keyup", function() {
      return parseValue(this.value, paramName, nr);
    });
    attachLabel(element, hoverText);
    attachLabel(label, hoverText);
    i++;
  };

  Shoptimize.ConfigurationPanel = function(data) {
    var choseone, findRouteButton, largetravel, zerotravel;
    install(root, Shoptimize);
    replaceMessage("Bitte wählen Sie die von Ihnen gewünschten <strong>Einstellungen</strong> und starten Sie dann die Berechnung!");
    greedysettings = PARAMETER_SETS["default"];
    choseone = $("<div class='button iconButton' id='config_choseone'>").hide().appendTo($("#vizCanvas")).text("Wenige Geschäfte besuchen").fadeIn().on("click", function() {
      return loadNewConfig(PARAMETER_SETS.fewshops);
    });
    attachLabel(choseone, "Konfiguration für Szenario 'Möglichst wenige Geschäfte besuchen' laden.");
    largetravel = $("<div class='button iconButton' id='config_largetravel'>").hide().appendTo($("#vizCanvas")).text("Hohe Fahrtkosten").fadeIn().on("click", function() {
      return loadNewConfig(PARAMETER_SETS.hugetravel);
    });
    attachLabel(largetravel, "Konfiguration für Szenario 'Hohe Fahrtkosten' laden.");
    zerotravel = $("<div class='button iconButton' id='config_zerotravel'>").hide().appendTo($("#vizCanvas")).text("Keine Fahrtkosten").fadeIn().on("click", function() {
      return loadNewConfig(PARAMETER_SETS.notravel);
    });
    attachLabel(zerotravel, "Konfiguration für Szenario 'Keine Fahrtkosten' laden.");
    findRouteButton = $("<div class='button iconButton' id='config_findRoute'>").hide().appendTo($("#vizCanvas")).text("Route finden").fadeIn().on("click", function() {
      cleanUp();
      $("#mouseOver").hide();
      $("#messagePane").fadeOut();
      return RoutePanel(data, greedysettings);
    });
    attachLabel(findRouteButton, "Routen berechnen und anzeigen");
    addInput('one', greedysettings.ta, "ta", "Tendency Article", "Wahrscheinlichkeit für Additional Article");
    addInput('two', greedysettings.aa, "aa", "Additional Article", "Faktor für zusätzliche Artikel betrachten");
    addInput('three', greedysettings.ts, "ts", "Tendency Shop", "Wahrscheinlichkeit für zusätzliche Geschäfte betrachten");
    addInput('four', greedysettings.ep, "ep", "Early Purchase", "Faktor für vorzeitiges Einkaufen");
    addInput('five', greedysettings.max_iterations, "max_iterations", "Anzahl Ergebnisse", "Anzahl an Ergebnissen, die ermittelt werden.");
    $("<div class='configuration' id='fehlerBox'>").appendTo("#vizCanvas");
    $("<div class='button iconButton' id='homeButton'>Zurück</div>").hide().appendTo("#vizCanvas").fadeIn().on("click", function() {
      cleanUp();
      return StartPanel();
    });
  };

}).call(this);
