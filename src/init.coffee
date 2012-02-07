###
    init.coffee - Initialisiert Shoptimize, hält grundlegende Konfiguration
###

Shoptimize = window.Shoptimize

### Allgemeine Definitionen für Effekte etc. finden sich im Folgenden ###

Shoptimize.MAX_SHOPS = 5
Shoptimize.MAX_ARTICLES = 10

# alles Millisekunden

Shoptimize.STARTUP_DELAY = 0 # Verzögerung, bevor der Vorhang gelüftet wird
Shoptimize.CURTAIN_DELAY = 200 # Dauer des Ausblendens von #vizLoading

Shoptimize.HIDE_MESSAGE_DELAY = 3500

### Die Ausmaße des Canvas werden maßgeblich durch diese Maße bestimmt ###

Shoptimize.GRID_SIZE = 48
Shoptimize.GRID_SPACING = 10

Shoptimize.GRID_WIDTH = 17
Shoptimize.GRID_HEIGHT = 10

Shoptimize.gridPos = (x) -> (Shoptimize.GRID_SIZE + Shoptimize.GRID_SPACING) * x
Shoptimize.gridSize = (x) -> (Shoptimize.GRID_SIZE + Shoptimize.GRID_SPACING) * x - Shoptimize.GRID_SPACING

Shoptimize.CANVAS_WIDTH = Shoptimize.gridSize Shoptimize.GRID_WIDTH
Shoptimize.CANVAS_HEIGHT = Shoptimize.gridSize Shoptimize.GRID_HEIGHT

Shoptimize.NUM_ICONS = 16

Shoptimize.NUM_SZENARIOS = 0

### Die diversen vordefinierten Parameterisierungen die angeboten werden ###
Shoptimize.PARAMETER_SETS =
    default:
        ta: 35
        aa: 60
        ts: 50
        ep: 30
        max_iterations: 10
    notravel:
        ta: 0
        aa: 0
        ts: 0
        ep: 0
        max_iterations: 10
    fewshops:
        ta: 100
        aa: 100
        ts: 0
        ep: 0
        max_iterations: 10
    hugetravel:
        ta: 100
        aa: 50
        ts: 0
        ep: 100
        max_iterations: 10

Shoptimize.RESULTS =
    solutions: []
    bestcost: 0
    bestiteration: 0
    flotdata: null
    flothandle: null


# The color which is used in the flotgraph as crosshair
Shoptimize.FLOT_CROSSHAIR_COLOR = '#CB4B4B'

# Used in the flotgraph as a threshold for the cursor to snap to a result
# if the x-coord of the cursor is within THIS range, snap to it
Shoptimize.FLOT_CROSSHAIR_SNAP = 0.55

# The color which is used to highlight a route in the graph.
Shoptimize.GRAPH_ROUTE_COLOR = '#56C6FF'
Shoptimize.GRAPH_EDGE_COLOR = '#D8D8D8'
Shoptimize.GRAPH_EDGE_HIGHLIGHT_COLOR = '#006699'
Shoptimize.GRAPH_NODE_COLOR = '#000000'
Shoptimize.MAX_LINE_WIDTH = 6

# Löscht alle bisherigen Message-Objekte aus der #messagePane und fügt ein neues hinzu.
window.replaceMessage = (message) ->
    messages = $("#messagePane .message")
    messages.fadeOut ->
        messages.remove()
    $("<span class='message'>")
        .hide()
        .html(message)
        .appendTo("#messagePane")
        .fadeIn()

window.detachLabel = (selector) ->
    $(selector).off("mouseenter").off("mouseleave")

window.attachLabel = (selector, label) ->
    detachLabel selector
    $(selector).on "mouseenter", ->
        $("#mouseOver").show().html(label)
    $(selector).on "mouseleave", ->
        $("#mouseOver").hide()

# Erstellt grundlegende Komponenten (#mouseOver, #messagePane, #vizCanvas)
initGui = ->
    
    $("body").off "mousemove"

    $("<div id='mouseOver'>")
        .hide()
        .appendTo("body")
    $("body").on "mousemove", (ev) ->
        if (ev.pageX + 15 + $("#mouseOver").width()) > $(document).width()
            $("#mouseOver").css
                left: ev.pageX - 10 - $("#mouseOver").width()
                top: ev.pageY + 10
        else
            $("#mouseOver").css
                left: ev.pageX + 10
                top: ev.pageY + 10

    $("<div id='vizDebugConf' class='debugButton'>D</div>")
        .appendTo("body")
        .on "click", ->
            $("#htmlElement").toggleClass "vizDebug"

    $("<div id='vizDebugPlay' class='debugButton'>3</div>")
        .appendTo("body")
        .on "click", ->
            elements = $("#vizCanvas *:not(#messagePane)")
            elements.fadeOut ->
                $(this).remove()
            after 500, ->
                Shoptimize.Viz()
                Shoptimize.startViz Shoptimize.sampleData

    $("<div id='vizDebugPlay2' class='debugButton'>5</div>")
        .appendTo("body")
        .on "click", ->
            elements = $("#vizCanvas *:not(#messagePane)")
            elements.fadeOut ->
                $(this).remove()
            after 500, ->
                Shoptimize.Viz()
                Shoptimize.startViz Shoptimize.sampleData5

    $("<div id='vizDebugReset' class='debugButton'>R</div>")
        .appendTo("body")
        .on "click", ->
            elements = $("#vizCanvas *, .debugButton")
            elements.fadeOut ->
                $(this).remove()
            after 500, ->
                initGui()
                Shoptimize.StartPanel()
    
    attachLabel "#vizDebugConf", "Debug-Ansicht ein/ausschalten"
    attachLabel "#vizDebugPlay", "3 x 6 Sketch abspielen"
    attachLabel "#vizDebugPlay2", "5 x 10 Sketch abspielen"
    attachLabel "#vizDebugReset", "Seite zurücksetzen"

    $("#vizCanvas").css
        "width":        Shoptimize.CANVAS_WIDTH  + "px"
        "height":       Shoptimize.CANVAS_HEIGHT + "px"
        "margin-left":  Shoptimize.CANVAS_WIDTH  / -2
    
    $("<div id='messagePane'>")
        .appendTo($("#vizCanvas"))
    
    initFactory()

initFactory = ->
    $('#vizCanvas').after(
        '<div id="factory" class="hidden">
        <table>
            <tbody>
                <tr class="newitemrow">
                    <td >
                        <input type="text" name="quantity" size="3" value="" onkeyup="changeArticleQuantity(this)"/>
                        <input type="text" name="name" size="10" value="" onkeyup="changeArticleName(this)"/>
                    </td>
                </tr>
            </tbody>
            <tbody class="routereplay">
                <tr class="walktoshop">
                    <td><div class="icon"></div></td>
                    <td class="description"></td>
                    <td class="cost hint"></td>
                </tr>
                <tr class="buysomething">
                    <td class="icon"></td>
                    <td class="description"></td>
                    <td class="cost hint"></td>
                </tr>
                <tr class="seperator">
                    <td></td>
                    <td><div class="simpleline"></div></td>
                    <td class="cost"></td>
                </tr>
            </tbody>
            <tbody class="summary">
                <tr class="seperator">
                    <td colspan="3"><div class="doubleline"></div></td>
                </tr>
                <tr>
                    <td></td>
                    <td>Fahrtkosten</td>
                    <td class="cost travelcosts"></td>
                </tr>
                <tr>
                    <td></td>
                    <td>Ladenkosten</td>
                    <td class="cost purchasecosts"></td>
                </tr>
                <tr class="seperator">
                    <td></td>
                    <td><div class="simpleline"></div></td>
                    <td class="cost summary"></td>
                </tr>
            </tbody>
        </table>
        </div>')


### 
    Haupt-Einstiegs-Punkt. Wenn alles (Stylesheets, Bibliotheken, Scripte) geladen
    wurden und vom Coffee-Compiler übersetzt wurden, wird diese Funktion ausgeführt.
###
$ ->
    # Daten wurden fertig übertragen, grundlegende Konfiguration initialisieren:
    Shoptimize.NUM_SZENARIOS = Object.keys(Shoptimize.Testdata)?.length

    initGui()

    Shoptimize.StartPanel()

    # Wenn die GUI aufgebaut ist, Vorhang auf!
    $("#vizLoading").delay(Shoptimize.STARTUP_DELAY).animate {opacity: 'toggle'}, Shoptimize.CURTAIN_DELAY, ->
        $("#vizLoading").remove() # schlussendlich Vorhang entfernen






