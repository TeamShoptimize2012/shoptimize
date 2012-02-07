#Menüführung um ein eigenes Szenario anzulegen

Shoptimize = window.Shoptimize

root = this

cleanUp = ->
    $("#mouseOver").hide()
    $("#homeButton").fadeOut -> $(this).remove()
    $(".editData").fadeOut -> $(this).remove()

editData = (data, doneEdit) ->

    if not data? or Object.keys(data).length == 0
        data =
            shops: []	
            distances: []
            allDistances: []
            articles: []
            prices: []
            history: []
            icons: []

    replaceMessage "Bitte geben Sie hier die <b>Geschäfte</b> an und die Preise der verfügbaren <b>Artikel</b>. (<i>-1 oder Garbage für nicht verfügbar)</i>)"

    selectedIcons = []
    articlePrices = []
    articleNames = []
    articles = 0
    shops = 0

    makePriceTag = (g, a) ->
        $("<input type='text' class='editData tile textInput shop#{g} article#{a}'>")
            .hide()
            .appendTo("#vizCanvas")
            .val(Math.round(articlePrices[a-1] * 100 + articlePrices[a-1] * (0.5 + Math.random()) * 100) / 100)
            .css
                top: gridPos(g + 3)
                left: gridPos(a + 4)
            .fadeIn()
            .on "click", ->
                $(this).select()
            .on "blur", ->
                val = parseFloat($(this).val())
                if val >= 0
                    $(this).val(Math.round(val * 100) / 100)
                else
                    $(this).val("-1")

    showProgressButton = ->
        $("<div class='editData weiter iconButton button clickable'>")
            .hide()
            .appendTo("#vizCanvas")
            .text("Weiter")
            .fadeIn()
            .on "click", ->
                data =
                    articles: []
                    prices: []
                    shops: []
                    icons: []

                for s in [1..shops]
                    data.shops.push $(".shopName.no#{s}").val()
                for a in [1..articleNames.length]
                    data.articles.push articleNames[a-1]
                    data.prices.push []
                    for s in [1..shops]
                        data.prices[a-1].push $(".editData.tile.textInput.article#{a}.shop#{s}").val()
                for i in selectedIcons
                    data.icons.push i

                cleanUp()
                doneEdit data
                
    newArticle = ->
        articles++
        if articles >= MAX_ARTICLES
            $("#addArticleButton").fadeOut -> $(this).remove()

    addArticle = ->
        newArticle()
        articlePrices.push((nextInt(2000) + 300) / 100)

        if shops > 0
            for s in [1..shops]
                makePriceTag s, articles
        showProgressButton()

        $("<div id='awfulOverlay'>")
            .hide()
            .appendTo("body")
            .css
                position: 'fixed'
                top: 0, left: 0
                width: "100%"
                height: "100%"
                background: 'rgba(0, 0, 0, 0.1)'

        ICON_GRID_OFFSET_X = 5
        ICON_GRID_OFFSET_Y = 6
        ICON_GRID_COLS = 8

        OFFSET_X = 20
        OFFSET_Y = 20
        
        $("<div id='awfulCanvas'>")
            .appendTo("#awfulOverlay")
            .css
                position: 'absolute'
                top: $("#vizCanvas").offset().top + OFFSET_Y
                left: $("#vizCanvas").offset().left + OFFSET_X
                width: "100%"
                height: "100%"

        $("<div class='editData chooseIconPane'>")
            .appendTo("#awfulCanvas")
            .css
                top: gridPos(ICON_GRID_OFFSET_Y - 2) - 10 + OFFSET_Y
                left: gridPos(ICON_GRID_OFFSET_X) - 10 + OFFSET_X
                width: gridSize(ICON_GRID_COLS) + 20
                height: gridSize(Math.ceil(NUM_ICONS / ICON_GRID_COLS + 2)) + 20
            .text("Legen Sie einen Namen fest und wählen danach ein Icon aus!")

        articleIcon = $("<div class='editData articleIcon tile no#{articles} noPic'>")
            .appendTo("#vizCanvas")
            .css
                top: $("#addArticleButton").css("top")
                left: $("#addArticleButton").css("left")

        textInput = $("<input type='text' class='editData articleName textInput' />")
            .appendTo("#awfulCanvas")
            .css
                top: gridPos(ICON_GRID_OFFSET_Y - 2) + OFFSET_Y + 32
                left: gridPos(ICON_GRID_OFFSET_X) + OFFSET_X
                width: gridSize(5)
            .val("Artikel #{articles}")

        makeIcon = (num) ->
            icon = $("<div class='editData pic#{num} tile chooseIcon'>")
                .appendTo("#awfulCanvas")
                .css
                    top: gridPos(ICON_GRID_OFFSET_Y + Math.floor((num-1) / ICON_GRID_COLS)) + OFFSET_Y
                    left: gridPos(ICON_GRID_OFFSET_X + ((num-1) % ICON_GRID_COLS)) + OFFSET_X

            if num in selectedIcons
                icon.css
                    opacity: 0.2
                    cursor: 'default'
            else
                icon.one 'click', ->
                        $(".chooseIcon").off 'mouseenter'
                        for i in [1..NUM_ICONS]
                            $(".editData.articleIcon.no#{articles}").removeClass("pic#{i}")
                        $(".editData.articleIcon.no#{articles}").addClass("pic#{num}")
                        $("#awfulOverlay").fadeOut -> $(this).remove()
                        selectedIcons.push num
                        articleNames.push textInput.val()
                        attachLabel(articleIcon, textInput.val())
                    .on 'mouseenter', ->
                        for i in [1..NUM_ICONS]
                            $(".editData.articleIcon.no#{articles}").removeClass("pic#{i}")
                        $(".editData.articleIcon.no#{articles}").addClass("pic#{num}")
                        $(".editData.articleIcon.no#{articles}").removeClass("noPic")

        for i in [1..NUM_ICONS]
            makeIcon i

        $("#awfulOverlay").fadeIn()
        textInput.focus().select()
        $("#addArticleButton").animate({left: "+=#{gridPos 1}"})

    $("<div id='addArticleButton' class='editData addButton tile clickable'>")
        .hide().appendTo("#vizCanvas")
        .css
            top: gridPos 3
            left: gridPos 5
        .one("click", -> $("#addArticleHint").fadeOut -> $(this).remove())
        .on "click", ->
            addArticle()

    makeShop = (num) ->
        $("<div class='editData tile shopIcon no#{num}'>")
            .hide().appendTo("#vizCanvas").fadeIn()
            .css
                top: gridPos(3 + num)
                left: gridPos 0

        $("<input type='text' class='textInput editData shopName no#{num}'>")
            .hide().appendTo("#vizCanvas")
            .val("Geschäft #{num}")
            .css
                top: gridPos(3 + num)
                left: gridPos 1
                width: gridSize 4
            .on "keyup", (ev) ->
                if ev.which == 13 && shops < MAX_SHOPS
                    addShop()

    newShop = ->
        shops++
        if shops >= MAX_SHOPS
            $("#addShopButton").fadeOut -> $(this).remove()
        return makeShop shops

    shopName1 = newShop()

    addShop = ->
        newShop()?.fadeIn().focus().select()
        $("#addShopButton").animate({top: "+=#{gridPos 1}"})
        $("#addShopHint").fadeOut -> $(this).remove()

        if articles > 0
            for a in [1..articles]
                makePriceTag shops, a

    $("<div id='addShopButton' class='editData addButton tile clickable'>")
        .hide().appendTo("#vizCanvas")
        .css
            top: gridPos 5
            left: gridPos 4
        .on "click", ->
            addShop()

    $(".editData").fadeIn()

    shopName1.focus().select()

    after 500, ->
          $("<div id='addArticleHint' class='editData hint toTheLeft'>")
            .hide().appendTo("#vizCanvas")
            .text("Hier Artikel hinzufügen")
            .css
                top: gridPos 3
                left: gridPos 6
            .fadeIn()

        $("<div id='addShopHint' class='editData hint toTheLeft'>")
            .hide().appendTo("#vizCanvas")
            .text("Hier Geschäfte hinzufügen")
            .css
                top: gridPos 5
                left: gridPos 5
            .fadeIn()


cleanUpDistances = ->
    $(".editDistances").fadeOut -> $(this).hide()

editDistances = (data, done) ->
    
    replaceMessage "Geben Sie hier an, <b>wie viel es kostet</b> um von einem Geschäft zu einem anderen zu kommen!"

    $("""<div class='editDistances helpText'>
         <span>Wegkosten bearbeiten</span>
         <p>Hier können Sie die Wegkosten zwischen den Geschäften bearbeiten.
         Es ist durchaus erlaubt, dass nicht von jedem Punkt zu jedem anderen Punkt
         eine Verbindung existiert; das heißt einige Textfelder dürfen auch leer bleiben.
         Die tatsächlichen Kosten um von einem Punkt zu einem anderen zu kommen
         werden dann von <i>shoptimize</i> berechnet werden.
         </div>""").hide().appendTo("#vizCanvas").fadeIn()

    showProgressDistancesButton = ->
        $("<div class='editDistances weiter iconButton button clickable'>")
            .hide()
            .appendTo("#vizCanvas")
            .text("Weiter")
            .fadeIn()
            .on "click", ->
                data.distances = []

                for s in [0..data.shops.length]
                    data.distances.push []
                    for s2s in [0..s-1]
                        if s2s < 0 || s2s == s
                            continue
                        v = parseFloat($("input.editDistances.from#{s2s}.to#{s}").val())
                        console.log "#{s} #{s2s} #{v}"
                        data.distances[s][s2s] = if v >= 0 then v else -1
                for s in [0..data.shops.length]
                    for s2s in [0..s-1]
                        if s2s < 0 || s2s == s
                            continue
                        data.distances[s2s][s] = data.distances[s][s2s]
                for s in [0..data.shops.length]
                    data.distances[s][s] = 0

                cleanUpDistances()
                if done?
                    done data

      
    for s in [0..data.shops.length]
        makeDistanceTag = (from, to) ->
            $("<div class='editDistances tile textInput pendant from#{from} to#{to}'>")
                .appendTo("#vizCanvas")
                .css
                    left:  gridPos(3 + from)
                    top: gridPos(4 + to)
                .text("?")
                .show()
            $("<input type='text' class='textInput editDistances tile from#{to} to#{from}'>")
                .hide()
                .appendTo("#vizCanvas")
                .css
                    top:  gridPos(4 + from)
                    left: gridPos(3 + to)
                .fadeIn()
                .on "keyup", ->
                    v = parseFloat($(this).val())
                    $(".pendant.from#{from}.to#{to}").text(if v >= 0 then v else "?")

        $("<div class='editDistances icon shop no#{s}'>")
            .hide()
            .appendTo("#vizCanvas")
            .css
                left: gridPos(3 + s)
                top:  gridPos(3)
            .fadeIn()
        $("<div class='editDistances icon shop no#{s}'>")
            .hide()
            .appendTo("#vizCanvas")
            .css
                left: gridPos(2)
                top:  gridPos(4 + s)
            .fadeIn()

        for s2s in [0..s]
            if s == s2s
                continue
            makeDistanceTag s, s2s
    
    showProgressDistancesButton()
         
doneEditDistances = (data) ->
    data.quantities = (1 for a in data.articles)
    data.shops.unshift "Start"
    console.log data
    Shoptimize.ControlPanel data

doneEditData = (data) ->
    editDistances data, doneEditDistances

Shoptimize.AnlegenPanel = ->
    install root, Shoptimize

    editData {}, doneEditData

    $("<div class='button iconButton' id='homeButton'>Zurück</div>")
        .hide().appendTo("#vizCanvas").fadeIn()
        .on "click", ->
            cleanUp()
            StartPanel()