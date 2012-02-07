# **flot.coffee**
# Ansicht für die Darstellung der berechneten Einkaufsrouten.
# Dies wird mit der Hilfe von JQuery Flot getan.
# Nähere Informationen finden sie [hier](http://code.google.com/p/flot/)
# 
# **Shoptimize** ist der globale Kontext, an dem sich jede Seite anmeldet
Shoptimize = window.Shoptimize
#
# **root** wird verwendet als ersatz fuer this verwendet,
# so dass nicht immer this.aufruf erfolgen muss 
#
root = this
#
# Daten die für das Zeichnen des Flot-Graphs benutzt werden 
plotdata = []
flotgraph_initialized = false
flothandle = null
#
#
Shoptimize.FlotGraph = () ->
#
# Hilfsfunktion um den Flotgraphen zu initialisieren
Shoptimize.FlotGraph.init = ->
    # flotgraph_initialized
    flotgraph_initialized = false

    flotContainer = $("<div id='flotgraph' class='flotgraph'>")
        .appendTo($("#vizCanvas"))
#
#
#In dieser Methode wird die Datenstruktur die vom Flotgraph verwendet wird aufgebaut
#
Shoptimize.FlotGraph.build_graph_data = (solutions) ->
    travel =
        label: "Wegkosten"
        data: []
    purchase =
        label: "Ladenkosten"
        data: []
    total =
        label: "Gesamtkosten"
        data: []
    bestiteration =  0
    plotdata = []
    x = 0
    best_cost = Number.POSITIVE_INFINITY
        
    for solution in solutions
        travel.data.push [x, solution.travel_cost]
        purchase.data.push [x, solution.article_cost]
        total.data.push [x, solution.min_cost]
        if solution.min_cost < best_cost
            best_cost = solution.min_cost
            bestiteration = x
        x++
        
    plotdata.push travel
    plotdata.push purchase
    plotdata.push total
    plotdata.bestiteration = bestiteration
    return plotdata

#
#Methode die den Flotgraph initiiert und zeichnet
Shoptimize.FlotGraph.init_flotgraph = (drop, floydWarshall) ->
    options =
        series:
            lines:
                show: true
        points:
            show: true
        grid:
            hoverable: true
            clickable: true
        crosshair:
            mode: "x"
            color: FLOT_CROSSHAIR_COLOR
            lineWidth: 2
        xaxis:
            tickDecimals: 0
            tickSize: 5
            ticks: [[plotdata.bestiteration , "beste Route"]]
    placeholder = $("#flotgraph")
    flothandle = $.plot(placeholder, plotdata, options)
    legends = $("#flotgraph .legendLabel")
    
    legends.each =>
        $(this).css('width', $(this).width())

    if(!flotgraph_initialized)
        flotgraph_initialized = true
        
        snapToGrid = (event, pos, item) =>
            result =
                x: -1
                y: pos.y
            diff = pos.x - Math.round(pos.x)
            if Math.abs(diff) < FLOT_CROSSHAIR_SNAP
                result.x = Math.round(pos.x)
            result

        placeholder.on "plotclick", (event, pos, item) =>
            snapped = snapToGrid(event, pos, item)
            if(snapped.x > -1)
                item = new Object()
                item.dataIndex = snapped.x
            if (item)
                GoogleMaps.loadRouteIntoPlayer(item.dataIndex)
                
        placeholder.on "plothover", (event, pos, item) =>
            forcedPosition = snapToGrid(event, pos, item)

            if forcedPosition.x > -1
                pos.x = forcedPosition.x
                flothandle.lockCrosshair(forcedPosition)
                item = new Object()
                item.dataIndex = forcedPosition.x
            else
                flothandle.unlockCrosshair()

            suffix = ["","",""]
            dataset = flothandle.getData()
            
            if (item)
                JitGraph.highlightSolutionInGraph(floydWarshall, RESULTS.solutions[item.dataIndex], GRAPH_ROUTE_COLOR)
   
                suffix[0] = " = "+plotdata[0].data[item.dataIndex][1]
                suffix[1] = " = "+plotdata[1].data[item.dataIndex][1]
                suffix[2] = " = "+plotdata[2].data[item.dataIndex][1]

            for i in [0..dataset.length - 1]
                series = dataset[i]
                $("#flotgraph .legendLabel").eq(i).html(series.label+suffix[i])
