(function() {
  var Shoptimize, cleanUp, root;

  Shoptimize = window.Shoptimize;

  root = this;

  cleanUp = function() {
    $("#mouseOver").hide();
    return $(".startPanel").fadeOut(function() {
      return $(this).remove();
    });
  };

  Shoptimize.StartPanel = function() {
    var dataButton, demoButton, explainButton, newButton;
    install(root, Shoptimize);
    replaceMessage("Bitte wählen Sie einen <strong>Menüpunkt</strong> aus!");
    newButton = $("<div class='button iconButton startPanel' id='newButton'>").hide().appendTo("#vizCanvas").text("Neuer Einkauf").on("click", function() {
      cleanUp();
      return AnlegenPanel();
    });
    demoButton = $("<div class='button iconButton startPanel' id='demoButton'>").hide().appendTo("#vizCanvas").text("Demo-Szenario laden").on("click", function() {
      cleanUp();
      return DemoPanel();
    });
    dataButton = $("<div class='button iconButton startPanel' id='dataButton'>").hide().appendTo("#vizCanvas").text("Daten laden").on("click", function() {
      cleanUp();
      return ImportPanel();
    });
    explainButton = $("<div class='button iconButton startPanel' id='explainButton'>").hide().appendTo("#vizCanvas").text("Algorithmus erklären").on("click", function() {
      cleanUp();
      DemoPanel();
      return after(1000, function() {
        $(".demoCase.no1").css({
          backgroundColor: '#C00'
        }).click();
        return after(1000, function() {
          return $("#explainRoute").css({
            backgroundColor: '#C00'
          }).click();
        });
      });
    });
    $(".startPanel").fadeIn();
    attachLabel(newButton, "Ein neues Szenario anlegen und durchspielen");
    attachLabel(demoButton, "Vorgefertigte Beispiele laden");
    attachLabel(dataButton, "Laden Sie Ihre eigenen Daten");
    return attachLabel(explainButton, "Algorithmus zu visualisieren");
  };

}).call(this);
