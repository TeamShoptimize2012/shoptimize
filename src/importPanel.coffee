###
    importPanel.coffee - Menüführung für Daten-Import
###

Shoptimize = window.Shoptimize
root = this

data =
    distances     : []
    prices        : []
    shops         : []
    quantities    : []
    articles      : []
    floydWarshall : null

isDistanceDataValid = false
isArticleDataValid = false

invalidateData = ->
    isDistanceDataValid = false
    isArticleDataValid = false

timeout = false
isShowingDefectsAtTheMoment = true

showDefects = (message) ->
    if not isShowingDefectsAtTheMoment
        return

    isShowingDefectsAtTheMoment = false
    clearTimeout timeout
    timeout = after 2000, ->
        isShowingDefectsAtTheMoment = true

    elem = $("<div class='fehler'>#{message}</div>")
        .hide()
        .prependTo("#fehlerBox")
        .fadeIn()
        .on "click", ->
            $(this).remove()
    after 3500, ->
        elem.fadeOut ->
            $(this).remove()
        

parseDistanceData = ->

    distanceData = $("#distanceFileInput").val()
    result = parseDistancesCSV distanceData
    if result.error?
        $('#distanceFileStatus').addClass('invalid').removeClass('valid')
        isDistanceDataValid = false
        showDefects result.error
    else
        $('#distanceFileStatus').removeClass('invalid').addClass('valid')
        isDistanceDataValid = true
        data.distances = result.matrix
        data.shops = result.shops

    showProceedButton()

parseArticleData = ->
   
    articleData = $("#articleFileInput").val()
    result = parsePricesCSV articleData
    if result.error?
        $('#articleFileStatus').addClass('invalid').removeClass('valid')
        isArticleDataValid = false
        showDefects result.error
    else
        $('#articleFileStatus').removeClass('invalid').addClass('valid')
        isArticleDataValid = true
        data.prices = result.matrix
        data.quantities = result.quantities
        data.articles = result.articles

    showProceedButton()

# Die Funktion `readShopFile` ist dafür zuständig, dass
# die Artikeldateien analysiert und angezeigt werden.
readDistanceFile = (event) ->
    fileReader = new FileReader()
    file = event.target.files.item(0)

    fileReader.onload = (event) ->
        distanceDataText = event.target.result
        $("#distanceFileInput").val(distanceDataText)
        parseDistanceData()

    fileReader.readAsText(file)

# Die Funktion `readArticleFile` ist dafür zuständig, dass
# die Artikeldateien analysiert und angezeigt werden.
readArticleFile = (event) ->
    fileReader = new FileReader()
    file = event.target.files.item(0)

    fileReader.onload = (event) ->
        articleDataText = event.target.result
        $("#articleFileInput").val(articleDataText)
        parseArticleData()

    fileReader.readAsText(file)

showProceedButton = ->

    if isDistanceDataValid and isArticleDataValid
        $("#proceedButton").fadeIn()
    else
        $("#proceedButton").fadeOut()

cleanUp = ->
    $("#mouseOver").hide()
    $("#homeButton").fadeOut -> $(this).remove()
    $(".import").fadeOut -> $(this).remove()

Shoptimize.ImportPanel = ->
    install root, Shoptimize
    invalidateData()

    replaceMessage("Bitte laden Sie die Daten für <b>Geschäfte und Artikel</b>!")

    # Daten für die Wegkosten
    $("<textarea id='distanceFileInput' class='import'>")
        .hide().appendTo("#vizCanvas")
        .on "keyup", ->
            parseDistanceData()

    $("<div class='status invalid import' id='distanceFileStatus'>")
        .hide().appendTo("#vizCanvas")
        .text("Wegkosten geladen")

    $("<input type='file' id='distanceFileLoader' class='import'>")
        .hide().appendTo("#vizCanvas")
        .on "change", (ev) ->
            readDistanceFile ev

    # Daten für die Artikel
    $("<div class='status invalid import' id='articleFileStatus'>")
        .hide().appendTo("#vizCanvas")
        .text("Artikelkosten geladen")

    $("<textarea id='articleFileInput' class='import'>")
        .hide().appendTo("#vizCanvas")
        .on "keyup", ->
            parseArticleData()

    $("<input type='file' id='articleFileLoader' class='import'>")
        .hide().appendTo("#vizCanvas")
        .on "change", (ev) ->
            readArticleFile ev

    $("<div class='button iconButton' id='homeButton'>Zurück</div>")
        .hide().appendTo("#vizCanvas")
        .on "click", ->
            cleanUp()
            StartPanel()

    $("<div class='import' id='fehlerBox'>")
        .hide().appendTo("#vizCanvas")

    $(".import, #homeButton").fadeIn()

    $("<div class='button iconButton import' id='proceedButton'>Weiter</div>")
        .hide().appendTo("#vizCanvas")
        .on "click", ->
            $("#mouseOver").hide().appendTo("#vizCanvas")
            cleanUp()
            ControlPanel data
