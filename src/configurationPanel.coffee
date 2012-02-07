# ***configurationPanel.coffee
# Ansicht für die Darstellung der Routeneinstellungen   
#
# **Shoptimize** ist der globale Kontext, an dem sich jede Seite anmeldet
Shoptimize = window.Shoptimize
#
# **root** wird verwendet als ersatz fuer this verwendet,
# so dass nicht immer this.aufruf erfolgen muss 
root = this
#
# **greedysettings** Dieses Objekt verwendet um die Konfigurations-
# einstellungen zu speichern, die später von unserem Algorithmus
# verwendet werden
greedysettings = null
#
# Die folgenden Objekte dienen der Logging-Fuktionalität dieser Seite
isShowingDefectsAtTheMoment = true
#
isVisible = true
#
validParams =
    one : true
    two : true
    three : true
    four : true
    five : true
#
i = 1
#
# **cleanup:** Funktion, die das DOM aufräumt, wenn eine neue Seite aufgerufen wird
cleanUp = ->
    $("#mouseOver").hide()
    $("#homeButton").fadeOut -> $(this).remove()
    $("input").fadeOut -> $(this).remove()
    $("label").fadeOut -> $(this).remove()
    $(".button").fadeOut -> $(this).remove()
    $("#fehlerBox").remove()
#
# **parseValue** parst einen Wert und überprüft ob dieser gültig ist.
parseValue = (value, target, nr) ->
    newVal = parseInt(value)
    #
    if (!(newVal >= 0 && newVal <= 100))
        validParams[nr] = false
        showDefects "Die Parameter natürliche Zahlen zwischen 0 und 100 sein!"
    else
        validParams[nr] = true
        greedysettings[target] = newVal
    #
    showProceedButton()
#
# **showDefetcs** ist eine Hilfsfunktion die Log-Nachrichten ausgibt
showDefects = (message) ->
    if not isShowingDefectsAtTheMoment
        return
    #
    isShowingDefectsAtTheMoment = false
    clearTimeout timeout
    timeout = after 2000, ->
        isShowingDefectsAtTheMoment = true
    #
    elem = $("<div class='fehler'>#{message}</div>")
        .hide()
        .prependTo("#fehlerBox")
        .fadeIn()
        .on "click", ->
            $(this).remove()
    after 3500, ->
        elem.fadeOut ->
            $(this).remove()
#
# **showProceedButton** zeigt die Schaltfläche zum fortfahren an oder auch nicht.
# Je nachdem ob die Eingaben gültig sind oder nicht.
showProceedButton = ->
    for key,val of validParams
        if !val
            if(isVisible)
                $("#config_findRoute").fadeOut()
                isVisible = false
            return
    #
    if !isVisible
        $("#config_findRoute").fadeIn()
        isVisible = true
    return
#
# **loadNewConfig: ** Hilfs-Funktion um eine Konfiguration für
# eins der vorgefertigten Szenarien zu laden.
loadNewConfig = (newConfig) ->
    $("#ta").attr('value', newConfig.ta)
    $("#aa").attr('value', newConfig.aa)
    $("#ts").attr('value', newConfig.ts)
    $("#ep").attr('value', newConfig.ep)
    $("#max_iterations").attr('value', newConfig.max_iterations)
    #    
    greedysettings = newConfig
    return
    #
#
# **addInput** Hilfsfunktion, die ein neues Input-Element und ein passendes
# Label hinzufügt und die benötigten Event-Listener anmeldet
addInput = (nr, val, paramName, labelText, hoverText) ->
    label = $("<label class='configuration #{nr}' for='#{paramName}'>")
        .hide().appendTo($("#vizCanvas"))
        .html(labelText)
        .delay(i * 100)
        .fadeIn()
    #
    element = $("<input type='text' id='#{paramName}' class='configuration #{nr} textInput'>")
        .hide().appendTo($("#vizCanvas"))
        .attr("value", val)
        .delay(i * 100)
        .fadeIn()
        .on "keyup", ->
            parseValue this.value, paramName, nr
    #
    attachLabel element, hoverText
    attachLabel label, hoverText
    i++
    return
#
# Hauptfunktion, die auch am globalen Kontext angemeldet wird.
# Hier wird das DOM aufgebaut, dass der Seite ihr aussehen gibt.
Shoptimize.ConfigurationPanel = (data) ->
    #umschreiben des lokalen Kontext zum gloabalen
    install root, Shoptimize
    #
    replaceMessage("Bitte wählen Sie die von Ihnen gewünschten <strong>Einstellungen</strong> und starten Sie dann die Berechnung!")
    #
    greedysettings = PARAMETER_SETS.default
    #
    choseone = $("<div class='button iconButton' id='config_choseone'>")
        .hide()
        .appendTo($("#vizCanvas"))
        .text("Wenige Geschäfte besuchen")
        .fadeIn()
        .on "click", ->
            loadNewConfig(PARAMETER_SETS.fewshops)
    #        
    attachLabel choseone, "Konfiguration für Szenario 'Möglichst wenige Geschäfte besuchen' laden."
    #        
    largetravel = $("<div class='button iconButton' id='config_largetravel'>")
        .hide()
        .appendTo($("#vizCanvas"))
        .text("Hohe Fahrtkosten")
        .fadeIn()
        .on "click", ->
            loadNewConfig(PARAMETER_SETS.hugetravel)
    #
    attachLabel largetravel, "Konfiguration für Szenario 'Hohe Fahrtkosten' laden."
    #       
    zerotravel = $("<div class='button iconButton' id='config_zerotravel'>")
        .hide()
        .appendTo($("#vizCanvas"))
        .text("Keine Fahrtkosten")
        .fadeIn()
        .on "click", ->
            loadNewConfig(PARAMETER_SETS.notravel)
    #
    attachLabel zerotravel, "Konfiguration für Szenario 'Keine Fahrtkosten' laden."
    #
    findRouteButton = $("<div class='button iconButton' id='config_findRoute'>")
        .hide()
        .appendTo($("#vizCanvas"))
        .text("Route finden")
        .fadeIn()
        .on "click", ->
            cleanUp()
            $("#mouseOver").hide()
            $("#messagePane").fadeOut()
            RoutePanel data, greedysettings
    #
    attachLabel findRouteButton, "Routen berechnen und anzeigen"
    #
    addInput 'one', greedysettings.ta, "ta", "Tendency Article", "Wahrscheinlichkeit für Additional Article"
    addInput 'two', greedysettings.aa, "aa", "Additional Article", "Faktor für zusätzliche Artikel betrachten"
    addInput 'three', greedysettings.ts, "ts", "Tendency Shop", "Wahrscheinlichkeit für zusätzliche Geschäfte betrachten"
    addInput 'four', greedysettings.ep, "ep", "Early Purchase", "Faktor für vorzeitiges Einkaufen"
    addInput 'five', greedysettings.max_iterations, "max_iterations", "Anzahl Ergebnisse", "Anzahl an Ergebnissen, die ermittelt werden."
    #
    $("<div class='configuration' id='fehlerBox'>")
        .appendTo("#vizCanvas")
    #
    $("<div class='button iconButton' id='homeButton'>Zurück</div>")
        .hide().appendTo("#vizCanvas")
        .fadeIn()
        .on "click", ->
            cleanUp()
            StartPanel()
    return
