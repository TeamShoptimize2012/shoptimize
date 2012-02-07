###
    routePanel.coffee - Ansicht für die Darstellung der berechneten Einkaufsrouten.
###

Shoptimize = window.Shoptimize

root = this
TMPDATA = null

Shoptimize.RoutePanel = (data, greedysettings = PARAMETER_SETS.default) ->
    install root, Shoptimize

    FlotGraph()
    FlotGraph.init()
    JitGraph()
    JitGraph.init(data)
    GoogleMaps()
    GoogleMaps.init(data)

    solve_greedy(data, greedysettings)

solve_greedy = (data, conf) ->
    translate = (best_route) ->
        ret = [0]
        for step in best_route
            ret.push step[0]+1
        ret.push 0
        ret.join(":")

    worker = new Worker('js/greedyWorker.js')
    worker.addEventListener "message", (e) =>

        if e.data.solution
            if e.data.solution.min_cost < RESULTS.bestcost
                RESULTS.bestcost = e.data.solution.min_cost
                RESULTS.bestiteration = e.data.solution.iteration
            route = translate e.data.solution.best_route
            e.data.solution.translated_route = route
            RESULTS.solutions.push e.data.solution
            
            flotdata = FlotGraph.build_graph_data(RESULTS.solutions)
            FlotGraph.init_flotgraph flotdata, data.floydWarshall

            if RESULTS.solutions.length > 100
                worker.terminate()
    
    worker.addEventListener "error", (e) =>
        console.log e.data
    

    conf.config_TA = conf.ta
    conf.config_AA = conf.aa
    conf.config_TS = conf.ts
    conf.config_EP = conf.ep

    # if($("#checktravelcost").is(':checked'))

    algorithmdistances = data.floydWarshall.matrix
    #else
    #    algorithmdistances = zero2D(data.distances.length, data.distances[0].length)
    GoogleMaps.setDistances algorithmdistances


    ###
    locprices = []
    for i in [0..data.prices.length-1]
        locpricesrow = []
        for j in [0..data.prices.length-1]
            if data.availability[i][j]
                locpricesrow.push data.prices[i][j]
            else
                locpricesrow.push -1
        locprices.push locpricesrow
    ###

    worker.postMessage
        'command': "start"
        'settings' : conf
        'distances' : algorithmdistances
        'prices' : data.prices
        'quantities' : data.quantities

