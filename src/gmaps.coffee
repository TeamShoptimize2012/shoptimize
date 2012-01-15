###
    gmaps.coffee - Ansicht für die Darstellung der berechneten Einkaufsrouten.
###

Shoptimize = window.Shoptimize

root = this

algorithmdistances = []
routedata = []

cleanUp = ->
    elements = $("#vizCanvas *:not(#messagePane)")
    elements.fadeOut ->
        $(this).remove()
    $("#messagePane").fadeIn()


Shoptimize.GoogleMaps = ->
    gmapsContainer = $("<div id='routereplay' class='nano'>")
        .appendTo($("#vizCanvas"))
        .html('<div class="routetablewrapper content"><table class="route" summary=""></table></div>')
  
    backButton = $("<div class='button iconButton' id='oneStepBack'>Zurück</div>")
        .hide()
        .appendTo($("#vizCanvas"))
        .fadeIn()
        .on "click", ->
            cleanUp()
            ControlPanel(routedata)


  
    $("#routereplay.nano").nanoScroller()

Shoptimize.GoogleMaps.init = (data) ->
     routedata = data

Shoptimize.GoogleMaps.setDistances = (dist) ->
    algorithmdistances = dist

# This functions loads a route into the google-maps-like routereplayer
# First of all, iterate over the route and create a row for the 'movement' either to a shop or back home
# If moved to a shop, create new rows for each item bought at the shop traveled to.
# After every step write some small summary
Shoptimize.GoogleMaps.loadRouteIntoPlayer = (routeindex) ->
    solution = RESULTS.solutions[routeindex]
    data = routedata

    showAndResetRoutePlayer = () ->
        $( "#routereplay table.route" ).html("")
        
        ###
        $( "#routereplay #customExplain").remove()
        vizData = routedata
        vizData.shops = routedata.shops
        vizData.allDistances = routedata.floydWarshall.matrix
        vizData.history = solution.routereplaydata
        explainButton = $("<div class='button iconButton' id='customExplain'>")
            .insertBefore("#routereplay table")
            .text("Erklären")
            .on "click", ->
                elements = $("#vizCanvas *:not(#messagePane)")
                elements.fadeOut ->
                    $(this).remove()
                after 500, ->
                    Shoptimize.Viz()
                    Shoptimize.startViz vizData
        ###
  

        $( "#routereplay").show()
    showAndResetRoutePlayer()

    translateToJson = (realsteps) ->
        realsteps.join(":")

    # triggered when hovering over a tbody.movement
    # highlight arrows pointing the RIGHT way and, (more important) restore old graph after leaving tbody
    highlightMovement = (jsonsteps, high) ->
        steps = jsonsteps.split(":")
        unhighlightAllEdges()
        for step in [0..steps.length-2]
           JitGraph.highlightEdge(steps[step], steps[step+1], GRAPH_EDGE_HIGHLIGHT_COLOR)

    
    stations = solution.translated_route.split(":")
    for s in [0..stations.length-2]
        from = parseInt(stations[s])
        to = parseInt(stations[s+1])
        traveldistance = roundCurrency(algorithmdistances[from][to])
        
        $("#routereplay table.route").append('<tbody class="movement"></tbody>')
        path = getPath(data.floydWarshall, from, to)
        current = from
        jsonroute = [from]
        number = (s+1)+". "
        if path.length > 0
            for intermediate in path
                intermShopRow = $( "#factory tbody.routereplay tr.walktoshop" ).clone()
                intermShopRow.find(".description").html(number+"&Uuml;ber Gesch&auml;ft <strong>"+data.shops[intermediate]+"</strong>")
                cost = data.distances[current][intermediate]
                intermShopRow.find(".cost").html(cost)
                $("#routereplay table.route tbody:last-child").append(intermShopRow)
                current = intermediate
                jsonroute.push intermediate
                number = ""
        label = number+"Gehe zu Gesch&auml;ft <strong>"+data.shops[to]+"</strong>"
        if(to==0)
            label = number+"Gehe zur&uuml;ck zum <strong>Startpunkt</strong>"
        jsonroute.push to
            
        newrow = $( "#factory tbody.routereplay tr.walktoshop" ).clone()
        newrow.find(".description").html(label)
        newrow.find(".cost").html(data.distances[current][to])

        $("#routereplay table.route tbody:last-child").append(newrow)


        $("#routereplay table.route tbody:last-child tr:not(:nth-child(1)) td:nth-child(1)").empty();   # remove personicon from every row except first row 
        seperator = $( "#factory tbody.routereplay tr.seperator" ).clone()
        seperator.find(".cost").html(traveldistance)
        $("#routereplay table.route tbody:last-child").append(seperator)
            .attr('data-stat', translateToJson(jsonroute))
            .on 'hover', ->
                highlightMovement($(this).attr('data-stat'), 1)
            .on 'mouseleave', ->
                unhighlightAllEdges()

        if(to!=0)
            itemstobuyhere = solution.best_route[s].slice(1)
            itemprices = 0
            $('<tbody class="payment">').insertAfter("#routereplay table.route tbody:last-child")
            for i in itemstobuyhere
                itemprice = roundCurrency(data.prices[i][to-1]*data.quantities[i])
                itemprices += itemprice

                itemrow = $( "#factory tbody.routereplay tr.buysomething" ).clone()
                itemrow.find(".description").html("Kaufe "+data.quantities[i]+"x <strong>"+data.articles[i]+"</strong>")
                itemrow.find(".cost").html(itemprice)
                $("#routereplay table.route tbody:last-child").append(itemrow)

            itemprices = roundCurrency(itemprices)
            seperator = $( "#factory tbody.routereplay tr.seperator" ).clone()
            seperator.find(".cost").html(itemprices)
            $("#routereplay table.route tbody:last-child").append(seperator)

    #  summary
    summaryhtml = $( "#factory tbody.summary" ).clone()
    summaryhtml.find(".cost.travelcosts").html(roundCurrency(solution.travel_cost))
    summaryhtml.find(".cost.purchasecosts").html(roundCurrency(solution.article_cost))
    summaryhtml.find(".cost.summary").html(roundCurrency(solution.min_cost))
    summaryhtml.insertAfter("#routereplay table.route tbody:last-child")
    
    $("#routereplay.nano").nanoScroller()


