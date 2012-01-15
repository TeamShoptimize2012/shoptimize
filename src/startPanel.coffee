#
# **startPanel.coffee**
# Das Start-Menü.
#

Shoptimize = window.Shoptimize
root = this

cleanUp = ->
    $("#mouseOver").hide()
    $(".startPanel").fadeOut -> $(this).remove()

Shoptimize.StartPanel = ->
    install root, Shoptimize

    replaceMessage("Bitte wählen Sie einen <strong>Menüpunkt</strong> aus!")

    newButton = $("<div class='button iconButton startPanel' id='newButton'>")
        .hide()
        .appendTo("#vizCanvas")
        .text("Neuer Einkauf")
        .on "click", ->
            cleanUp()
            AnlegenPanel()

    demoButton = $("<div class='button iconButton startPanel' id='demoButton'>")
        .hide()
        .appendTo("#vizCanvas")
        .text("Demo-Szenario laden")
        .on "click", ->
            cleanUp()
            DemoPanel()

    dataButton = $("<div class='button iconButton startPanel' id='dataButton'>")
        .hide()
        .appendTo("#vizCanvas")
        .text("Daten laden")
        .on "click", ->
            cleanUp()
            ImportPanel()

    explainButton = $("<div class='button iconButton startPanel' id='explainButton'>")
        .hide()
        .appendTo("#vizCanvas")
        .text("Algorithmus erklären")
        .on "click", ->
            cleanUp()
            DemoPanel()
            after 1000, ->
                $(".demoCase.no1")
                    .css
                        backgroundColor: '#C00'
                    .click()
                after 1000, ->
                    $("#explainRoute")
                        .css
                            backgroundColor: '#C00'
                        .click()


    $(".startPanel").fadeIn()

    attachLabel newButton, "Ein neues Szenario anlegen und durchspielen"
    attachLabel demoButton, "Vorgefertigte Beispiele laden"
    attachLabel dataButton, "Laden Sie Ihre eigenen Daten"
    attachLabel explainButton, "Algorithmus zu visualisieren"
