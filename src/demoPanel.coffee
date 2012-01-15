#### demoPanel.coffee
# In dieser Datei werden die Demoszenarien geladen
# 
#
# **Shoptimize** ist der globale Kontext, an dem sich jede Seite anmeldet
Shoptimize = window.Shoptimize
#
# **root** wird verwendet als ersatz fuer this verwendet,
# so dass nicht immer this.aufruf erfolgen muss 
#
root = this
# **parseDemo** Hilfsfunktion, die die parse-Funktionen
# verwendet um die Demoszenarien zu laden
parseDemo = (demoData) ->
    #
    data =
        distances     : []
        prices        : []
        shops         : []
        quantities    : []
        articles      : []
        floydWarshall : null
    #
    parsedDistances = parseDistancesCSV demoData.shops
    parsedArticles = parsePricesCSV demoData.prices
    #
    data.distances = parsedDistances.matrix
    data.shops = parsedDistances.shops
    data.prices = parsedArticles.matrix
    data.quantities = parsedArticles.quantities
    data.articles = parsedArticles.articles
    #
    return data
#
# Anzahl der Elemente pro Reihe
COLS = 5
#
# **cleanup:** Funktion, die das DOM aufräumt, wenn eine neue Seite aufgerufen wird
cleanUp = ->
    $("#mouseOver").hide()
    $("#homeButton").fadeOut -> $(this).remove()
    $(".demoCase").fadeOut ->
        $(this).remove()
#
# Hauptfunktion, die auch am globalen Kontext angemeldet wird.
# Hier wird das DOM aufgebaut, dass der Seite ihr aussehen gibt.
Shoptimize.DemoPanel = ->
    install root, Shoptimize
    #
    replaceMessage("Bitte wählen Sie ein <strong>Beispiel</storng> aus!")
    #
    # Fügt eine Schlatfläche hinzu, über die ein Demoszenario geladen werden kann
    makeDemoButton = (key, i) ->
    #
        row = Math.floor(i / COLS)
        col = i % COLS
    #
        newDemoCase= $("<div class='button demoCase demoPanel no#{i} row#{row} col#{col}'>")
            .hide()
            .text("#{i+1}")
            .appendTo("#vizCanvas")
            .delay(i * 50)
            .fadeIn()
            .on "click", ->
                cleanUp()
                data = parseDemo Testdata[key]
                ControlPanel data
                #
        attachLabel newDemoCase, Testdata[key].title
        #
    for key, i in Object.keys(Testdata)
        makeDemoButton key, i
        #
    $("<div class='button iconButton' id='homeButton'>Zurück</div>")
        .hide().appendTo("#vizCanvas")
        .fadeIn()
        .on "click", ->
            cleanUp()
            StartPanel()
     return