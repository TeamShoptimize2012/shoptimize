# ***controlPanel.coffee***
# Menü um auszuwählen ob man
# *die Einstellungsdaten konfigurieren
# *zu den gegebenen Daten und mit den Standardeinstellungen Routen berechnen
# *oder Routen berechnen lassen und die beste gefundene Route erklären lassen will
#
# **Shoptimize** ist der globale Kontext, an dem sich jede Seite anmeldet
Shoptimize = window.Shoptimize
#
# **root** wird verwendet als ersatz fuer this verwendet,
# so dass nicht immer this.aufruf erfolgen muss 

root = this
#
# **vizdata** enthält Daten die benötigt werden
# um die Erklärungs-Animation auszuführen
vizdata =
    shops : []
    distances : []
    allDistances : []
    articles : []
    prices : []
    history : []
#
# **initData: ** ist eine Hilfsfunktion, die die Floyd-Warshall Funktion aufruft
# und das Ergebnis in das für die routenberechnung benötigte Daten-Objekt einträgt
initData = (data) ->
    data.floydWarshall = floydWarshall data.distances
    data.hasNoTravelCost = false
#
# **initVizData** ist eine Hilfsfunktion um die von der Erklär-Animation benötigten
# Daten zu füllen.
initVizData = (data) ->
    vizdata.shops = data.shops
    vizdata.distances = data.distances
    vizdata.allDistances = data.floydWarshall data.distances
    vizdata.prices = data.prices
#
# **cleanup:** Funktion, die das DOM aufräumt, wenn eine neue Seite aufgerufen wird   
cleanUp = ->
    $("#mouseOver").hide()
    $("#homeButton").fadeOut -> $(this).remove()
    $(".button").fadeOut ->
        $(this).remove()
    return
#
#Hauptfunktion, die auch am globalen Kontext angemeldet wird.
# Hier wird das DOM aufgebaut, dass der Seite ihr aussehen gibt.
Shoptimize.ControlPanel = (data) ->
    install root, Shoptimize

    #
    replaceMessage("Nehmen Sie <b>Einstellungen</b> vor, 
    lassen Sie die <b>Route berechnen</b> 
    oder lassen Sie sich den <b>Algorithmus erklären</b>")
    #
    initData data
    #
    configureSettings = $("<div class='button iconButton' id='configureSettings'>")
        .hide()
        .appendTo($("#vizCanvas"))
        .text("Einstellungen")
        .fadeIn()
        .on "click", ->
                cleanUp()
                ConfigurationPanel data
    #
    findRouteButton = $("<div class='button iconButton' id='findRoute'>")
        .hide()
        .appendTo($("#vizCanvas"))
        .text("Route finden")
        .fadeIn()
        .on "click", ->
                cleanUp()
                $("#messagePane").fadeOut()
                RoutePanel data
    #
    if (data.articles.length <= MAX_ARTICLES and (data.shops.length-1) <= Shoptimize.MAX_SHOPS)
        explainRouteButton = $("<div class='button iconButton' id='explainRoute'>")
            .hide()
            .appendTo($("#vizCanvas"))
            .text("Route erklären")
            .fadeIn()
            .on "click", ->
                greedysettings =
                    ta: 0
                    aa: 0
                    ts: 0
                    ep: 0
                    max_iterations: 1
                     
                startClean = (conf) ->
                    worker = new Worker('js/greedyWorker.js')
                    worker.addEventListener "message", (e) =>

                        if e.data.solution
                            data.history = e.data.solution.routereplaydata
                            data.allDistances = data.floydWarshall.matrix
                            Shoptimize.Viz()
                            Shoptimize.startViz data
                        
                    worker.addEventListener "error", (e) =>
                        console.log e.data
                    

                    conf.config_TA = conf.ta
                    conf.config_AA = conf.aa
                    conf.config_TS = conf.ts
                    conf.config_EP = conf.ep

                    algorithmdistances = data.floydWarshall.matrix
                                    
                    worker.postMessage
                        'command': "start"
                        'settings' : conf
                        'distances' : algorithmdistances
                        'prices' : data.prices
                        'quantities' : data.quantities

                cleanUp()
                startClean greedysettings
    #            
    $("<div class='button iconButton' id='homeButton'>Zurück</div>")
        .hide().appendTo("#vizCanvas")
        .fadeIn()
        .on "click", ->
            cleanUp()
            StartPanel()
    #
    attachLabel configureSettings, "Einstellungen konfigurieren"
    attachLabel findRouteButton, """
        <span>Routen berechnen:</span>
        <p>Mit Hilfe der erweiterten Heuristik werden die Ergebnisse des Optimierungsvorgangs angezeigt.</p>
        """
    attachLabel explainRouteButton, """
        <span>Diese Daten können visualisiert werden:</span>
        <p>Anhand der Basis-Heuristik wird erklärt, wie der Algorithmus Entscheidungen trifft.</p>
        """
    return
