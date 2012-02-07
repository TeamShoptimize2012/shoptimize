####benchmark.coffee
# Diese Datei wird für einen Benchmark unseres Algorithmus gegen
# Testdaten die schon in anderen Arbeiten verwendet wurden. Eine
# Referenz zu diesen Arbeiten befindet sich im Entwurfsdokument.
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
        , @optimalNumberShops, @visitedShops, @runningTime) ->
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
# **REPETITIONS** definiert wie oft ein einzelner Test wiederholt werden soll,
# damit die Ergebnisse eine höhere Aussagekraft haben. 
REPETITIONS = 100
#
# Ein Array, dass die Anzahl der Artikel und Geschäfte für jeden Testfall enthält.
testCases = []
#
# Die Daten-Konstrukte:
# *graphCost
# *graphOptimalCost 
# * und graphRunningTime
# enthalten Daten, die vom Flot-Graph verwendet werden. 
# Näheres zu Flot findet man [hier](http://code.google.com/p/flot/)
graphCost =
        data : []
        lines  :
                show : true
        points :
                show : true
#
graphOptimalCost =
        data : []
        lines  :
                show : true
        points :
                show : true
#
graphRunningTime =
        data : []
        color : '#DC143C'
        lines :
                show : true
        points :
                show : true
#
# Konfigurationsdaten für unseren Algorithmus.
# Nähere Informationen finden Sie im Entwurfsdokument.
greedyConfiguration =
        config_TA          : 100
        config_AA          : 60
        config_TS          : 30
        config_EP          : 70
        max_iterations     : 3
#
# **Funktion, die beim initialisieren des HTML-Dokuments** ausgeführt wird.
$ ->
        # Da der Webworker jede Lösung zurückgibt, benötigen wir diese
        # Funktion um die beste zu ermitteln
        findBestSolution = (solutions) ->
                #
                lowestCost = Infinity
                bestSolution = null
                for solution in solutions
                        if solution.min_cost < lowestCost
                                lowestCost = solution.min_cost
                                bestSolution = solution
                                #
                return bestSolution
        #
        # Eine Rekursive Funktion um alle Testfälle durchprobieren zu können.
        # Geht wie folgt vor:
        # *Überprüfe ob alle Konfigurationen durchprobiert wurden
        # *Wenn nicht, starte den Worker mit den gegeben Testdaten
        # *Es wird ein Event-Callback angemeldet, der eine Funktion aufruft, die alle Zwischenergebnisse sammelt und das beste zurückgibt.
        # *Wiederhole
        processTests = (algorithm, testNumber, maxTestNumber) ->
                #
                if testNumber > maxTestNumber
                        return
                #
                testSet = tpplib[testNumber - 1]
                #
                parsedPrices = parsePricesCSV testSet.articles
                prices = parsedPrices.matrix
                articles = parsedPrices.articles
                quantities = parsedPrices.quantities
                #
                parsedDistances = parseDistancesCSV testSet.shops
                distances = (Shoptimize.floydWarshall parsedDistances.matrix).matrix
                #
                worker = new Worker(GREEDY_PATH)
                #
                solutions = []
                worker.addEventListener 'message', (e) =>
                        #
                        endTime = new Date().getTime()
                        #
                        # Akkumulieren der Ergebnisse und Ermitteln des besten Ergebnis
                        accumulate = (solution) ->
                                solutions.push solution
                                greedyMax = greedyConfiguration.max_iterations
                                max = greedyMax
                                #
                                if solutions.length is max
                                #
                                        bestSolution = findBestSolution solutions
                                        runningTime = endTime - startTime
                                        result = new Result((parsedPrices.shops.length + 1), articles.length,
                                                testSet.optimalCost, bestSolution.min_cost,
                                                bestSolution.article_cost, bestSolution.travel_cost,
                                                testSet.numberShops, bestSolution.best_route.length,
                                                runningTime)
                                #
                                        testCases.push [parsedPrices.shops.length + 1, articles.length]
                                        addResultEntry(testNumber, result)
                                        processTests(algorithm, testNumber + 1, maxTestNumber)
                                        #
                        return accumulate(e.data.solution)
                        #
                # Ermitteln der Laufzeit durch das JavaScript Date-Onjekt
                startTime = new Date().getTime()
                #Wir schicken eine Nachricht an den Werbworker dass er loslegen soll
                worker.postMessage(
                        'command'   : 'start'
                        'settings'  : greedyConfiguration
                        'distances' : distances
                        'prices'    : prices
                        'quantities': quantities
                )
        # Aufbauen der Ergebnis-Tabelle und bauen des Flot-Graphs
        addResultEntry = (testNumber, result) ->
                tableRow = $('#resultTable > tbody:last').append($('<tr>'))
                tableRow.append "<td>#{testNumber}</td>"
                tableRow.append "<td>#{result.numberShops}</td>"
                tableRow.append "<td>#{result.numberArticles}</td>"
                tableRow.append "<td>#{result.optimalCost}</td>"
                tableRow.append "<td><strong>#{result.cost}</strong></td>"
                tableRow.append "<td>x #{result.quality}</td>"
                tableRow.append "<td>#{result.articleCost}</td>"
                tableRow.append "<td>#{result.travelCost}</td>"
                tableRow.append "<td>#{result.optimalNumberShops}</td>"
                tableRow.append "<td>#{result.visitedShops}</td>"
                tableRow.append "<td>#{result.runningTime} ms</td>"
                #
                graphCost.data.push [testNumber, result.cost]
                graphOptimalCost.data.push [testNumber, result.optimalCost]
                graphRunningTime.data.push [testNumber, result.runningTime]
                #
                plotGraphs()
                #
        # Parsen der Parameter und Aufruf der Verarbeitung
        testAlgorithm = (algorithm, event) ->
                greedyConfiguration.config_TA = parseInt $('#TA').val()
                greedyConfiguration.config_AA = parseInt $('#AA').val()
                greedyConfiguration.config_TS = parseInt $('#TS').val()
                greedyConfiguration.config_EP = parseInt  $('#EP').val()
                greedyConfiguration.max_iterations = parseInt $('#numberIterations').val()
                #
                maxTestNumber = parseInt $('#testCount').val()
                #
                reset()
                processTests(algorithm, 1, maxTestNumber)
                #
        # Zurücksetzen der Ergebnistabelle
        reset = () ->
                $('#resultTable > tbody:last').empty()
                graphCost.data = []
                graphOptimalCost.data = []
                graphRunningTime.data = []
                #
        #Plotten des Flot-Graphs
        plotGraphs = () ->
                if $('#qualityGraph').css('width') isnt '0px'
                        $.plot($('#qualityGraph'), [graphCost, graphOptimalCost])
                        #
                if $('#runningTimeGraph').css('width') isnt '0px'
                        $.plot($('#runningTimeGraph'), [graphRunningTime])
                        #
        #Anmelden des Click-Events zum Starten der Testläufe
        $('#runGreedy').bind 'click', (event) =>
                testAlgorithm('Greedy', event)
        #
        $('.tabs').tabs()
        #
        $('.tabs').bind 'change', (event) =>
                $('#qualityGraph').css('height',300)
                $('#runningTimeGraph').css('height',300)
                plotGraphs()
        #
        $('#qualityGraph').css('height',300)
        $('#runningTimeGraph').css('height',300)
        plotGraphs()
