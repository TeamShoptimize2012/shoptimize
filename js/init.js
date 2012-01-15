(function() {

  /*
      init.coffee - Initialisiert Shoptimize, hält grundlegende Konfiguration
  */

  var Shoptimize, initFactory, initGui;

  Shoptimize = window.Shoptimize;

  /* Allgemeine Definitionen für Effekte etc. finden sich im Folgenden
  */

  Shoptimize.MAX_SHOPS = 5;

  Shoptimize.MAX_ARTICLES = 10;

  Shoptimize.STARTUP_DELAY = 0;

  Shoptimize.CURTAIN_DELAY = 200;

  Shoptimize.HIDE_MESSAGE_DELAY = 3500;

  /* Die Ausmaße des Canvas werden maßgeblich durch diese Maße bestimmt
  */

  Shoptimize.GRID_SIZE = 48;

  Shoptimize.GRID_SPACING = 10;

  Shoptimize.GRID_WIDTH = 17;

  Shoptimize.GRID_HEIGHT = 10;

  Shoptimize.gridPos = function(x) {
    return (Shoptimize.GRID_SIZE + Shoptimize.GRID_SPACING) * x;
  };

  Shoptimize.gridSize = function(x) {
    return (Shoptimize.GRID_SIZE + Shoptimize.GRID_SPACING) * x - Shoptimize.GRID_SPACING;
  };

  Shoptimize.CANVAS_WIDTH = Shoptimize.gridSize(Shoptimize.GRID_WIDTH);

  Shoptimize.CANVAS_HEIGHT = Shoptimize.gridSize(Shoptimize.GRID_HEIGHT);

  Shoptimize.NUM_ICONS = 16;

  Shoptimize.NUM_SZENARIOS = 0;

  /* Die diversen vordefinierten Parameterisierungen die angeboten werden
  */

  Shoptimize.PARAMETER_SETS = {
    "default": {
      ta: 35,
      aa: 60,
      ts: 50,
      ep: 30,
      max_iterations: 10
    },
    notravel: {
      ta: 0,
      aa: 0,
      ts: 0,
      ep: 0,
      max_iterations: 10
    },
    fewshops: {
      ta: 100,
      aa: 100,
      ts: 0,
      ep: 0,
      max_iterations: 10
    },
    hugetravel: {
      ta: 100,
      aa: 50,
      ts: 0,
      ep: 100,
      max_iterations: 10
    }
  };

  Shoptimize.RESULTS = {
    solutions: [],
    bestcost: 0,
    bestiteration: 0,
    flotdata: null,
    flothandle: null
  };

  Shoptimize.FLOT_CROSSHAIR_COLOR = '#CB4B4B';

  Shoptimize.FLOT_CROSSHAIR_SNAP = 0.55;

  Shoptimize.GRAPH_ROUTE_COLOR = '#56C6FF';

  Shoptimize.GRAPH_EDGE_COLOR = '#D8D8D8';

  Shoptimize.GRAPH_EDGE_HIGHLIGHT_COLOR = '#006699';

  Shoptimize.GRAPH_NODE_COLOR = '#000000';

  Shoptimize.MAX_LINE_WIDTH = 6;

  window.replaceMessage = function(message) {
    var messages;
    messages = $("#messagePane .message");
    messages.fadeOut(function() {
      return messages.remove();
    });
    return $("<span class='message'>").hide().html(message).appendTo("#messagePane").fadeIn();
  };

  window.detachLabel = function(selector) {
    return $(selector).off("mouseenter").off("mouseleave");
  };

  window.attachLabel = function(selector, label) {
    detachLabel(selector);
    $(selector).on("mouseenter", function() {
      return $("#mouseOver").show().html(label);
    });
    return $(selector).on("mouseleave", function() {
      return $("#mouseOver").hide();
    });
  };

  initGui = function() {
    $("body").off("mousemove");
    $("<div id='mouseOver'>").hide().appendTo("body");
    $("body").on("mousemove", function(ev) {
      if ((ev.pageX + 15 + $("#mouseOver").width()) > $(document).width()) {
        return $("#mouseOver").css({
          left: ev.pageX - 10 - $("#mouseOver").width(),
          top: ev.pageY + 10
        });
      } else {
        return $("#mouseOver").css({
          left: ev.pageX + 10,
          top: ev.pageY + 10
        });
      }
    });
    $("<div id='vizDebugConf' class='debugButton'>D</div>").appendTo("body").on("click", function() {
      return $("#htmlElement").toggleClass("vizDebug");
    });
    $("<div id='vizDebugPlay' class='debugButton'>3</div>").appendTo("body").on("click", function() {
      var elements;
      elements = $("#vizCanvas *:not(#messagePane)");
      elements.fadeOut(function() {
        return $(this).remove();
      });
      return after(500, function() {
        Shoptimize.Viz();
        return Shoptimize.startViz(Shoptimize.sampleData);
      });
    });
    $("<div id='vizDebugPlay2' class='debugButton'>5</div>").appendTo("body").on("click", function() {
      var elements;
      elements = $("#vizCanvas *:not(#messagePane)");
      elements.fadeOut(function() {
        return $(this).remove();
      });
      return after(500, function() {
        Shoptimize.Viz();
        return Shoptimize.startViz(Shoptimize.sampleData5);
      });
    });
    $("<div id='vizDebugReset' class='debugButton'>R</div>").appendTo("body").on("click", function() {
      var elements;
      elements = $("#vizCanvas *, .debugButton");
      elements.fadeOut(function() {
        return $(this).remove();
      });
      return after(500, function() {
        initGui();
        return Shoptimize.StartPanel();
      });
    });
    attachLabel("#vizDebugConf", "Debug-Ansicht ein/ausschalten");
    attachLabel("#vizDebugPlay", "3 x 6 Sketch abspielen");
    attachLabel("#vizDebugPlay2", "5 x 10 Sketch abspielen");
    attachLabel("#vizDebugReset", "Seite zurücksetzen");
    $("#vizCanvas").css({
      "width": Shoptimize.CANVAS_WIDTH + "px",
      "height": Shoptimize.CANVAS_HEIGHT + "px",
      "margin-left": Shoptimize.CANVAS_WIDTH / -2
    });
    $("<div id='messagePane'>").appendTo($("#vizCanvas"));
    return initFactory();
  };

  initFactory = function() {
    return $('#vizCanvas').after('<div id="factory" class="hidden">\
        <table>\
            <tbody>\
                <tr class="newitemrow">\
                    <td >\
                        <input type="text" name="quantity" size="3" value="" onkeyup="changeArticleQuantity(this)"/>\
                        <input type="text" name="name" size="10" value="" onkeyup="changeArticleName(this)"/>\
                    </td>\
                </tr>\
            </tbody>\
            <tbody class="routereplay">\
                <tr class="walktoshop">\
                    <td><div class="icon"></div></td>\
                    <td class="description"></td>\
                    <td class="cost hint"></td>\
                </tr>\
                <tr class="buysomething">\
                    <td class="icon"></td>\
                    <td class="description"></td>\
                    <td class="cost hint"></td>\
                </tr>\
                <tr class="seperator">\
                    <td></td>\
                    <td><div class="simpleline"></div></td>\
                    <td class="cost"></td>\
                </tr>\
            </tbody>\
            <tbody class="summary">\
                <tr class="seperator">\
                    <td colspan="3"><div class="doubleline"></div></td>\
                </tr>\
                <tr>\
                    <td></td>\
                    <td>Fahrtkosten</td>\
                    <td class="cost travelcosts"></td>\
                </tr>\
                <tr>\
                    <td></td>\
                    <td>Ladenkosten</td>\
                    <td class="cost purchasecosts"></td>\
                </tr>\
                <tr class="seperator">\
                    <td></td>\
                    <td><div class="simpleline"></div></td>\
                    <td class="cost summary"></td>\
                </tr>\
            </tbody>\
        </table>\
        </div>');
  };

  /* 
      Haupt-Einstiegs-Punkt. Wenn alles (Stylesheets, Bibliotheken, Scripte) geladen
      wurden und vom Coffee-Compiler übersetzt wurden, wird diese Funktion ausgeführt.
  */

  $(function() {
    var _ref;
    Shoptimize.NUM_SZENARIOS = (_ref = Object.keys(Shoptimize.Testdata)) != null ? _ref.length : void 0;
    initGui();
    Shoptimize.StartPanel();
    return $("#vizLoading").delay(Shoptimize.STARTUP_DELAY).animate({
      opacity: 'toggle'
    }, Shoptimize.CURTAIN_DELAY, function() {
      return $("#vizLoading").remove();
    });
  });

}).call(this);
