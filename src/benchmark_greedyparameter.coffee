#### benchmark_greedyparameter.coffee
# Diese Datei wird dafür verwendet durch eine Art Bruteforce-Ansatz
# die Parameter zu bestimmen, die für bestimmte Probleme die besten
# Ergebnisse liefern.
#
# Die Klasse **Result** kapselt die Ergebnisse eines Benchmarks.
#
# Das **Result** enthält die Anzahl der Geschäfte und Artikel die in
# dem Testfall verwendet wurden, die optimale Anzahl von Geschäften und
# Artikeln. Desweiteren enthält es die Kosten der besten Lösung unseres
# Algorithmus und die optimalen Kosten des Problems, so dass man diese
# vergleichen kann. Zu guter Letzt enthält sie noch die Laufzeit in
# Millisekunden.
class Result
        constructor: (@numberShops, @numberArticles
        , @optimalCost, @cost, @articleCost, @travelCost
        , @optimalNumberShops, @visitedShops, @runningTime, @parameter) ->
# Die Qualität ist eine von uns gewählte Variable, mit der wir Abschätzen
# können wie gut unser Algorithmus im Vergleich zu optimalen Lösung
# abgeschnitten hat.                
                @quality = cost / optimalCost
                @quality = Math.round(@quality * 100) / 100
#
# Pfad der JavaScript-Datei die geladen werden muss um den Algorithmus verwenden
# zu können.
# Die Dokumentation befindet sich [hier](greedyWorker.html):
GREEDY_PATH = "js/greedyWorker.js"
#
# Ein Array, dass die Anzahl der Artikel und Geschäfte für jeden Testfall enthält.
testCases = []
#
# Die Daten-Konstrukte **graphCost**, *graphOptimalCost* und **graphCostConfig**
# enthalten Daten, die vom Flot-Graph verwendet werden. 
# Näheres zu Flot findet man [hier](http://code.google.com/p/flot/)
graphCost =
        data : []
#
graphOptimalCost =
        data : []
#
graphCostConfig =
        lines  :
                show : true
        points :
                show : true
        grid:
            clickable: true
#
# Konfigurationsdaten für unseren Algorithmus.
# Nähere Informationen finden Sie im Entwurfsdokument. 
greedyConfiguration =
        config_TA : 0
        config_AA : 0
        config_TS : 0
        config_EP : 0
        bench_TA:
            min: 0
            step: 0
            max: 0
        bench_AA:
            min: 0
            step: 0
            max: 0
        bench_TS:
            min: 0
            step: 0
            max: 0
        bench_EP:
            min: 0
            step: 0
            max: 0
        max_iterations : 3
#
# Datenkonstrukt, dass der Algorithmus benötigt. Diese werden
# aus der [demo.coffee](demo.html) geladen.
# *prices: Array mit den Preisen für einen Artikel pro Geschäft
# *distances: Array mit den Entfernungen der Orte untereinander
# *quantities: Anzahl der zu kaufenden Artikel
data =
    prices: []
    distances: []
    quantities: []
#
# **Funktion, die beim initialisieren des HTML-Dokuments** ausgeführt wird.
$ ->
        # Da der Webworker jede Lösung zurückgibt, benötigen wir diese
        # Funktion um die beste zu ermitteln
        findBestSolution = (solutions) ->

                lowestCost = Infinity
                bestSolution = null
                for solution in solutions
                        if solution.min_cost < lowestCost
                                lowestCost = solution.min_cost
                                bestSolution = solution

                return bestSolution
        #
        # Eine Rekursive Funktion um alle Parameter durchprobieren zu können.
        # Geht wie folgt vor:
        # *Überprüfe ob alle Konfigurationen durchprobiert wurden
        # *Wenn nicht, starte den Worker mit der gegeben Konfiguration
        # *Es wird ein Event-Callback angemeldet, der eine Funktion aufruft, die alle Zwischenergebnisse sammelt und das beste zurückgibt.
        # *Wiederhole
        processTests = (algorithm, testNumber) ->
                #
                workerPath = GREEDY_PATH
                worker = new Worker(workerPath)
                #
                solutions = []
                iterationcount = 0
                #
                # Akkumulieren der Ergebnisse und Ermitteln des besten Ergebnis 
                accumulate = (solution) ->
                        solutions.push solution
                        greedyMax = greedyConfiguration.max_iterations
                        max = greedyMax
                        #
                        if solutions.length is max
                                endTime = new Date().getTime()
                                #
                                bestSolution = findBestSolution solutions
                                runningTime = endTime - startTime
                                result = new Result((data.prices.length + 1), data.prices.length,
                                        data.testSet.optimalCost, bestSolution.min_cost,
                                        bestSolution.article_cost, bestSolution.travel_cost,
                                        data.testSet.numberShops, bestSolution.best_route.length,
                                        runningTime, bestSolution.parameters)
                                solutions = []
                                addResultEntry(++iterationcount, result)
                                #
                worker.addEventListener 'message', (e) =>
                    # Überprüfe ob der Testlauf terminiert hat und gib die Ergebnisse aus wenn dem so ist.
                    # Füge das Ergebnis der Ergebnismenge hinzu, wenn nicht.
                    if(e.data.solution)
                        accumulate(e.data.solution)
                    #
                    else if(e.data.message == 'termination')
                        plotGraphs()
                        #
                        # Zurücksetzen der GUI um einen weiteren Testlauf starten zu können
                        $('#runGreedy').html("Greedy Algorithm").addClass("primary")
                        $('#runGreedy').one 'click', (event) ->
                            $(this).html("Running").removeClass("primary")
                            testAlgorithm('Greedy', event)
                        $("table#resultTable").trigger("update")
                        #
                # Ermitteln der Laufzeit durch das JavaScript Date-Onjekt
                startTime = new Date().getTime()
                #Wir schicken eine Nachricht an den Werbworker dass er loslegen soll
                worker.postMessage(
                        'command'   : 'benchmark'
                        'settings'  : greedyConfiguration
                        'distances' : data.distances
                        'prices'    : data.prices
                        'quantities': data.quantities
                )
        #
        # Aufbauen der Ergebnis-Tabelle und bauen des Flot-Graphs
        addResultEntry = (testNumber, result) ->
                tableRow = $("<tr>")
                tableRow.append "<td><a id='result_#{testNumber}' name='#{testNumber}'>#{testNumber}</a></td>"
                tableRow.append "<td>#{result.optimalCost}</td>"
                tableRow.append "<td><strong>#{result.cost}</strong></td>"
                tableRow.append "<td>x #{result.quality}</td>"
                tableRow.append "<td>#{result.articleCost}</td>"
                tableRow.append "<td>#{result.travelCost}</td>"
                tableRow.append "<td>#{result.parameter.config_TA} </td>"
                tableRow.append "<td>#{result.parameter.config_AA} </td>"
                tableRow.append "<td>#{result.parameter.config_TS} </td>"
                tableRow.append "<td>#{result.parameter.config_EP} </td>"
                $("#resultTable tbody").append tableRow
                #
                graphCost.data.push [testNumber, result.cost]
                #
                if graphCost.data.length < 200 || graphCost.data.length % 25 == 0
                    plotGraphs()

        # Parsen der Parameter und Aufruf der Verarbeitung
        testAlgorithm = (algorithm, event) ->
                greedyConfiguration.bench_TA.min = parseInt $('#TA_min').val()
                greedyConfiguration.bench_TA.step = parseInt $('#TA_step').val()
                greedyConfiguration.bench_TA.max = parseInt $('#TA_max').val()
                greedyConfiguration.bench_AA.min = parseInt $('#AA_min').val()
                greedyConfiguration.bench_AA.step = parseInt $('#AA_step').val()
                greedyConfiguration.bench_AA.max = parseInt $('#AA_max').val()
                greedyConfiguration.bench_TS.min = parseInt $('#TS_min').val()
                greedyConfiguration.bench_TS.step = parseInt $('#TS_step').val()
                greedyConfiguration.bench_TS.max = parseInt $('#TS_max').val()
                greedyConfiguration.bench_EP.min = parseInt $('#EP_min').val()
                greedyConfiguration.bench_EP.step = parseInt $('#EP_step').val()
                greedyConfiguration.bench_EP.max = parseInt $('#EP_max').val()
                #
                greedyConfiguration.max_iterations = parseInt $('#numberIterations').val()
                reset()
                #
                testNumber = parseInt $('#testCount').val()
                testSet = tpplib[testNumber - 1]
                data.testSet = testSet
                parsedPrices = parsePricesCSV testSet.articles
                data.prices = parsedPrices.matrix
                data.quantities = parsedPrices.quantities
                parsedDistances = parseDistancesCSV testSet.shops
                data.distances = (Shoptimize.floydWarshall parsedDistances.matrix).matrix
                #
                processTests(algorithm, testNumber)
                #
        # Zurücksetzen der Ergebnistabelle
        reset = () ->
                $('#resultTable > tbody:last').empty()
                graphCost.data = []
                graphOptimalCost.data = []
                return
                #
        #Plotten des Flot-Graphs
        plotGraphs = () ->
                if $('#qualityGraph').css('width') isnt '0px'
                    $.plot($('#qualityGraph'), [graphCost, graphOptimalCost], graphCostConfig)
                    #
        #Anmelden des Click-Events zum Starten der Testläufe
        $('#runGreedy').one 'click', (event) ->
                $(this).html("Running").removeClass("primary")
                testAlgorithm('Greedy', event)
                #
        $('#qualityGraph').css('height',220).css('overflow','hidden')
        plotGraphs()
        #
        $('#resultTable').parent().css({height: '280px', overflowY: 'scroll'})
        $('#qualityGraph').on "plotclick", (event, pos, item) =>
            if (item)
                #
                tmp_row = $("#resultTable tbody tr").index($('#result_'+(item.dataIndex+1)).parent().parent())
                target_top = tmp_row*37 - 26
                $('#resultTable').parent().animate({scrollTop:target_top}, 1000)
                $("#resultTable tr").css({backgroundColor: "#FFFFFF"})
                $("#result_"+(item.dataIndex+1)).parent().parent().css({backgroundColor: "#E3FFE3"})
                #
        $("table#resultTable").tablesorter()