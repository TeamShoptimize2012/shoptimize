###
 viz.coffee
 In dieser Datei ist die Visualisierung und Erklärung des Algorithmus implementiert
###

###

###
Shoptimize = window.Shoptimize
root = this

###
Anmelden am globalen Kontext 
###
Shoptimize.Viz = ->
    install root, Shoptimize

###
Globale Verzögerung für Animationen
###
DELAY = 3000

# Startet den Visualisierungs-Vorgang
Shoptimize.startViz = (data) ->

#Zunächst überprüfen wir ob wir Daten haben, die visualisiert werden können
    if not data?
        console.log "Keine Daten"
    if not data.history?
        console.log "Keine History"
    if data.history.length <= 0
        return
 
    shops = (s for s in data.shops)

#Sollte sich kein Home in unserem Shops-Array befinden, fügen wir eins hinzu
    if not data.home?
        data.home = shops.shift()
        data.shops = shops
 
    replaceMessage("Beginne Lösung mit einem <b>gierigen Algorithmus</b>.")

    after DELAY, ->
        startViz1 data


startViz1 = (data) ->
    replaceMessage "Es gibt <b>#{data.articles.length} Artikel</b> die wir kaufen wollen:"
    
    for i in [1..data.articles.length]
        $("<div class='article bigIcon no#{i} of#{data.articles.length}'>")
            .hide()
            .appendTo("#vizCanvas")
            .delay(i * 100 + 500)
            .fadeIn()
    after DELAY, ->
        startViz2 data

startViz2 = (data) ->
    for i in [1..data.articles.length]
        $(".article.bigIcon.no#{i}")
            .delay(i * 100)
            .fadeOut -> $(this).remove()
        
    data.breadCrumbPos = 0

    replaceMessage "Diese können wir in <b>#{data.shops.length} Geschäften</b> kaufen:"
    for i in [1..data.shops.length]
        $("<div class='shop pane no#{i} of#{data.shops.length}'>")
            .hide()
            .appendTo("#vizCanvas")
            .delay(i * 100 + 500)
            .fadeIn()

    for i in [1..data.shops.length]
        $("<div class='shop icon no#{i} of#{data.shops.length}'>")
            .hide()
            .appendTo("#vizCanvas")
            .delay(i * 100 + 500)
            .fadeIn()

    after DELAY, ->
        startViz3 data

startViz3 = (data) ->
    replaceMessage "Zu folgenden <b>Preisen</b> sind die Artikel in den Geschäften zu erwerben:"

    after 500, ->
        startViz4 data

startViz4 = (data) ->
    # Jetzt werden die ganzen Artikel-Icons und Preis-Labels erstellt
    for i in [1..data.articles.length]
        for j in [1..data.shops.length]
            if data.prices[i-1][j-1] >= 0
                $(".shop.icon.no#{j}").delay(j * 50).fadeOut()
                $("<div class='article price no#{i} in#{j} of#{data.shops.length}'>")
                    .hide()
                    .appendTo("#vizCanvas")
                    .css(
                        left: parseInt($(".shop.pane.no#{j}").css("left")) + 10 + gridPos 1
                        top: parseInt($(".shop.pane.no#{j}").css("top")) + 10 + gridPos (i - 1)
                    )
                    .text(data.prices[i-1][j-1])
                    .delay(j * 50 + i * j * 50)
                    .fadeIn()
                $("<div class='article icon no#{i} in#{j} of#{data.shops.length}'>")
                    .hide()
                    .appendTo("#vizCanvas")
                    .css(
                        left: parseInt($(".shop.pane.no#{j}").css("left")) + 10
                        top: parseInt($(".shop.pane.no#{j}").css("top")) + 10 + gridPos (i - 1)
                    )
                    .delay(j * 50 + i * j * 50)
                    .fadeIn()
            $(".shop.pane.no#{j}")
                .animate({height: gridSize(data.articles.length) + 20}, j * 50 + i * j * 50)

    for i in [1..data.articles.length]
        attachLabel ".article.icon.no#{i}", data.articles[i-1]

    after DELAY, ->
        startViz5 data

startViz5 = (data) ->
    homeIcon = $("<div class='home icon'>")
        .hide()
        .appendTo("#vizCanvas")
        .fadeIn()
    attachLabel homeIcon, data.home

    replaceMessage "Mit unserer Einkaufsroute fangen wir natürlich <b>zu Hause</b> an."

    after DELAY, ->
        startViz6 data

startViz6 = (data) ->
    replaceMessage "Um die <b>Fahrtkosten zu miniminiere</b> besuchen wir <b>kein Geschäft mehr als einmal</b>."

    after DELAY, ->
        startViz7 data

startViz7 = (data) ->
    replaceMessage "Um zu entscheiden welches Geschäft wir zuerst besuchen, ermitteln wir <b>wo welcher Artikel am günstigsten</b> angeboten wird."

    after DELAY, ->
        $(".article").addClass("disgraced")
        after 1500, -> $(".disgraced").fadeOut -> $(this).remove()

        for i in [1..data.shops.length]
            di = data.history[0].di[i-1]
            k = 0
            for j in di
                adjustArticle = (i, j, k) ->
                    highlights = $(".article.price.no#{j+1}.in#{i}").clone()
                    highlights
                        .hide()
                        .addClass("priceHighlight chosen")
                        .appendTo("#vizCanvas")
                        .fadeIn()

                    $(".article.icon.no#{j+1}.in#{i}")
                        .add(".article.price.no#{j+1}.in#{i}")
                        .removeClass("disgraced")

                    after 1000, ->
                        $(".article.icon.no#{j+1}.in#{i}")
                            .add(".article.price.no#{j+1}.in#{i}")
                            .animate {top: parseInt($(".shop.pane.no#{i}").css("top")) + 10 + gridPos k}, 500 # nach oben schieben

                adjustArticle i, j, k++

        after 2000 + DELAY, ->
            replaceMessage "Jetzt müssen wir noch entscheiden, <b>in welcher Reihenfolge</b> wir die Artikel einkaufen."

            after DELAY, ->
                vizStep data, 0

# Visualisiert Schritt NUM aus DATA
vizStep = (data, num) ->
    if not data.history[num]?
        vizDone data
        return

    step = data.history[num]
    
    if num > 0
        replaceMessage "Jetzt schauen wir <u>wieder</u>, <b>wie viel es uns kostet zu welchem Shop</b> zu kommen:"
    else
        replaceMessage "Jetzt schauen wir, <b>wie viel es uns kostet zu welchem Shop</b> zu kommen:"

    for i in [1..data.shops.length]
        if not step.di[i-1]?
            continue

        fahrtKosten = data.allDistances[step.prevLoc][i]
        itemKosten = step.si[i-1]

        top = parseInt($(".shop.pane.no#{i}").css("top"))

        top += $(".shop.pane.no#{i}").height()
        left = parseInt($(".shop.pane.no#{i}").css("left")) + 10
        $("<div class='disgraced shopCost no#{i}'>")
            .hide()
            .appendTo("#vizCanvas")
            .css(
                top: top + "px"
                left: left + "px"
            )
            .html("""
                  <span class='articleCost'>#{roundCurrency(itemKosten)}</span>
                  <span class='travelCost'>#{roundCurrency(fahrtKosten)}</span>
                  <span class='rank'>#{roundCurrency(itemKosten - fahrtKosten)}</span>
                  """).delay(i * 50).fadeIn()

    if num == 0
        $("<div id='zuendendeIdee' class='disgraced'>")
            .html("""
                  Die zündende Idee für den gierigen Algorithmus ist,
                  <b>so viel wie möglich zu den günstigsten Konditionen</b> einzukaufen.
                  Für unsere Zwecke ist es also gut, Geld auszugeben,
                  wenn wir dafür auch etwas kriegen. Für den Weg wollen wir
                  aber möglichst wenig ausgeben! Daher wählen wir das Geschäft
                  in dem wir zuerst einkaufen danach, ob wir möglichst viel
                  Geld <b>nach Abzug der Wegkosten</b> dort ausgeben können.
                  Diesen Wert nennen wir <b>die Güte</b> des Geschäfts.
                  Die Güte ist abhängig von unserer aktuellen Position.
                  """)
            .appendTo("#vizCanvas")
            .one "click", ->
                $(this).fadeOut ->
                    $(this).remove()
                vizStep2 data, num
    else
        after DELAY, ->
            vizStep2 data, num

vizStep2 = (data, num) ->
    step = data.history[num]

    replaceMessage "Wir wählen daher das <b>#{step.nextLoc}. Geschäft</b>."

    $("<div class='redArrowDown disgraced'>")
        .css(
            top: "-48px"
            left: (parseInt($(".shop.pane.no#{step.nextLoc}").css("left")) + 66) + "px"
        )
        .appendTo("#vizCanvas")
        .animate {top: (parseInt($(".shopCost.no#{step.nextLoc}").css("top")) - 165) }

    after DELAY, ->
        $(".disgraced").fadeOut ->
            $(this).remove()

        vizStep3 data, num

vizStep3 = (data, num) ->
    step = data.history[num]

    replaceMessage "Schritt <b>#{num+1} von #{data.history.length}</b>"
    startPos = data.breadCrumbPos

#    shopNum = 0
#    for s in step.di
#        shopNum++
#        if not s?
#            continue
#        y = parseInt($(".shop.pane.no#{shopNum}").css("top")) + 10
#        x = parseInt($(".shop.pane.no#{shopNum}").css("left")) + 10
#        for i in s
#            $(".icon.article.no#{i+1}")
#                .css(
#                    top: y
#                    left: x
#                )
#                .fadeIn()
#            y += gridPos 1

    # jetzt die Route aufbauen
    data.breadCrumbPos++
    
    # Shop-Icon anzeigen
    $("<div class='icon shop no#{step.nextLoc}'>")
        .hide()
        .appendTo("#vizCanvas")
        .fadeIn()
        .css
            top: 0
            left: gridPos data.breadCrumbPos

    # Die einzelnen Articles nach oben schieben
    for i in step.di[step.nextLoc-1]
        data.breadCrumbPos++
        $(".icon.article.no#{i+1}")
            .animate({top: 0, left: gridPos data.breadCrumbPos}, 400)
        $(".article.price.no#{i+1}")
            .fadeOut -> $(this).remove() # Etiketten entfernen

    # Informationen in kleiner Leiste anzeigen
    travelCost = data.allDistances[step.prevLoc][step.nextLoc]
    itemCost = step.si[step.nextLoc-1]

    $("<div class='descriptor'>")
        .hide()
        .appendTo("#vizCanvas")
        .append($("<div class='travelCost'>").text(roundCurrency(travelCost)))
        .append($("<div class='arrow'>"))
        .append($("<div class='itemCost'>").text(roundCurrency(itemCost)))
        .css(
            left: gridPos(startPos + 1)
            width: gridSize(data.breadCrumbPos - startPos)
        ).fadeIn()

    # Den entsprechenden Shop ausblenden
    $(".shop.pane.no#{step.nextLoc}").fadeOut -> $(this).remove()

    after 1500, ->
        vizStep(data, num+1)

vizDone = (data) ->

    data.breadCrumbPos++

    $("<div class='home icon'>")
        .hide()
        .css(
            left: gridPos data.breadCrumbPos
        )
        .appendTo("#vizCanvas")
        .fadeIn()

    replaceMessage "Schlussendlich gehen wir wieder <b>zum Startpunkt</b>."

    purchase = 0
    travel = 0
    foobarloc = 0
    for x in data.history
        purchase += x.si[x.nextLoc-1]
        travel += x.ci[x.nextLoc-1]
        foobarloc = x.nextLoc-1
    travel += data.allDistances[0][foobarloc]

    $("""
         <div class="final travelCost"><i>Wegkosten</i><b>#{roundCurrency(travel)}</b></div>
         <div class="final purchaseCost"><i>Einkauf</i><b>#{roundCurrency(purchase)}</b></div>
         <div class="final totalCost"><i>Gesamtkosten</i><b>#{roundCurrency(purchase + travel)}</b></div>

      """).hide().appendTo("#vizCanvas").fadeIn()

    $("body")
        .css
            cursor: 'pointer'
        .on "click", window.top.location.reload
