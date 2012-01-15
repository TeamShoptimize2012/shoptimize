###
    jit.coffee - Ansicht für die Darstellung der berechneten Einkaufsrouten.
###

Shoptimize = window.Shoptimize

root = this

lineWidthModification = 15
highlightedAdjacency = []

Shoptimize.JitGraph = ->

    jitContainer = $("<div id='graphframe'><div id='infovis'>")
        .appendTo($("#vizCanvas"))

Shoptimize.JitGraph.init = (data) ->
    initializeGraph data
  
    lineWidthModification = 15

    highlightedAdjacency = []


initializeGraph = (shopdata)  ->
    json = []
    numNodes = shopdata.shops.length-1

    maxWeight = 0
    for i in [0..numNodes]
        for j in [i..numNodes]
            w = shopdata.distances[i][j]
            if w isnt -1 and w isnt NaN and w isnt undefined
                maxWeight = Math.max(w, maxWeight)

        weightFactor = 100 / maxWeight / 100
        if weightFactor is Infinity
                weightFactor = 1

        for i in [0..numNodes]
            id = i
            name = shopdata.shops[id]
            adjacencies = []
            articles = []
            prices = []
            availability = []
            node =
                    "id" : id
                    "name" : name
                    "adjacencies" : adjacencies
                    "articles" : articles
                    "prices" : prices
                    "availability" : availability
                        
                json.push node

                for j in [i..numNodes]
                #Hinzufuegen von Kanten
                    if shopdata.distances[i][j] >= 0 and i < j
                        edge = new Object
                        edge['nodeTo'] = j
                        edge['nodeFrom'] = i
                        data = new Object
                        data['cost'] = shopdata.distances[i][j]
                        lineCost = data['cost']
                        if lineCost is 0
                                lineCost = 1

                        data['lineWidth'] = data['cost'] * weightFactor *
                                MAX_LINE_WIDTH
                        edge['data'] = data
                        adjacencies.push edge
                
                #Hinzufuegen der Preise und der Verfuegbarkeit
                for j in [0..shopdata.prices.length-1]
                    articles.push shopdata.articles[j]
                    prices.push shopdata.prices[j][i]
                    # availability.push shopdata.availability[j][i]

        $('#infovis').empty()
        init json

mapRouteToPathArray = (route) ->
        path = []
        for shop in route
                path.push shop[0] + 1

        return path

Shoptimize.JitGraph.highlightSolutionInGraph = (floydWarshall, solution, color) ->

        realPath = [0]
        virtualPath = mapRouteToPathArray solution.best_route

        for nextShop in virtualPath
                path = getPath(floydWarshall, realPath[realPath.length-1], nextShop)
                realPath = realPath.concat path
                realPath.push nextShop

        path = getPath(floydWarshall, realPath[realPath.length-1], 0)
        realPath = realPath.concat path
        realPath.push 0

        highlightRoute(realPath, color)

        return

# Highlights a whole route `path` in the graph from `nodeFrom`
# to `nodeTo`.
highlightRoute = (path, color) ->

        if highlightedAdjacency.length isnt 0
                unhighlightAllEdges()
 
        currentNode = path[0]
        for nextNode, i in path when i isnt 0
                JitGraph.highlightEdge(currentNode, nextNode, color)
                currentNode = nextNode

# Highlights an edge in the graph by specifying
# source node, target node and the color
#
# In order to find the appropriate edge, all adjacencies of the source
# node are searched for the the target node. The animation is implemented
# by temporarily changing the edges line width and permanently changing
# the color to the specified color.
Shoptimize.JitGraph.highlightEdge = (nodeFrom, nodeTo, color) ->

        graph = window.fd.graph
        node = graph.getNode(nodeFrom)
        adj = graph.getAdjacence(nodeFrom, nodeTo)

        adj.data['toSmallerValue'] = false
        if nodeFrom > nodeTo
                adj.data['toSmallerValue'] = true

        if highlightedAdjacency.indexOf(adj) isnt -1
                adj.setData('type', 'doubleArrowEdge')
        else
                adj.setData('type', 'singleArrowEdge')

        highlightedAdjacency.push adj
        lineWidth = adj.getData('lineWidth')
        adj.setData('color', color)

        fd.plot()

        return

# After selecting a new route all the edges should be unhighlighted.
Shoptimize.unhighlightAllEdges = ->

        while highlightedAdjacency.length isnt 0
                adj = highlightedAdjacency.pop()
                adj.setData('color', GRAPH_EDGE_COLOR)
                adj.setData('type', 'costs')

        fd.plot()

iStuff = navigator.userAgent.match(/iPhone/i) or navigator.userAgent.match(/iPad/i)
nativeCanvasSupport =  typeof HTMLCanvasElement is 'object' or  typeof HTMLCanvasElement is 'function'

textSupport = nativeCanvasSupport and (typeof document.createElement('canvas').getContext('2d').fillText is 'function')
labelType = if not nativeCanvasSupport or (textSupport and not iStuff) then 'Native' else 'HTML'
nativeTextSupport = labelType is 'Native'
useGradients = nativeCanvasSupport
animate = not (iStuff or not nativeCanvasSupport)

renderArrow = (ctx, from, to, edge) ->
        vect = new $jit.Complex(to.x - from.x, to.y - from.y)
        vect.$scale(edge['Edge'].dim / vect.norm())
        intermediatePoint = new $jit.Complex(to.x - vect.x, to.y - vect.y)
        normal = new $jit.Complex(-vect.y / 2, vect.x / 2)
        v1 = intermediatePoint.add(normal)
        v2 = intermediatePoint.$add(normal.$scale(-1))
        
        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(v1.x, v1.y)
        ctx.lineTo(v2.x, v2.y)
        ctx.lineTo(to.x, to.y)
        ctx.closePath()
        ctx.fill()

renderEdgeCost = (ctx, from, to, edge) ->

        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
        ctx.stroke()

        # add the weights as labels to each edge
        middle = new Object()
        middle['x'] = from.x - (from.x-to.x)/2 - 10
        middle['y'] = from.y - (from.y-to.y)/2 - 10
        ctx.font = "14pt Helvetica"
        ctx.fillStyle = "#000000"
        ctx.fillText(edge.data.cost, middle['x'], middle['y'])

Log =
    elem: false
    write: (text) ->
        if not @elem
            @elem = $("#log")
            @elem.css
                position : 'absolute'
                left : $(window).width()/2 + 'px'
                top : $(window).height()/2 + 'px'
            @elem.show()
        @elem.html(text)
    close: ->
        if @elem
            @elem.hide()

init = (json) ->
    $jit.ForceDirected.Plot.EdgeTypes.implement

        'singleArrowEdge' :
                'render' : (edge, canvas) ->

                        from = edge.nodeFrom.pos
                        to = edge.nodeTo.pos
                        ctx = canvas.getCtx()

                        # invert edge direction
                        swap = edge.data.toSmallerValue
                        if swap
                                tmp = from
                                from = to
                                to = tmp

                        renderArrow(ctx, from, to, edge)
                        renderEdgeCost(ctx, from, to, edge)

        'doubleArrowEdge' :
                'render' : (edge, canvas) ->

                        from = edge.nodeFrom.pos
                        to = edge.nodeTo.pos
                        ctx = canvas.getCtx()

                        renderArrow(ctx, from, to, edge)
                        renderArrow(ctx, to, from, edge)
                        renderEdgeCost(ctx, from, to, edge)

        'costs':
            'render': (edge, canvas) ->
                    from = edge.nodeFrom.pos
                    to = edge.nodeTo.pos
                    ctx = canvas.getCtx()
                    renderEdgeCost(ctx, from, to, edge)

                
    window.fd = new $jit.ForceDirected
        injectInto: 'infovis'
        animate: true
        Navigation:
            enable: true
            panning: 'avoid nodes'
            zooming: 10
        Node:
            overridable: true
            dim: 10
            color: GRAPH_NODE_COLOR
            type: 'circle'
        Edge:
            type: 'costs'
            overridable: true
            color: GRAPH_EDGE_COLOR
            lineWidth: 1.0
            dim: 25
        Label:
            size: 14
            style: 'bold'
            color: '#000'
        Tips:
            enable: false

        Events:
            enable: true
            onMouseEnter: ->
                fd.canvas.getElement().style.cursor = 'move'
                return
            onMouseLeave: ->
                fd.canvas.getElement().style.cursor = ''
                return
            onDragMove: (node, eventInfo, e) ->
                pos = eventInfo.getPos()
                node.pos.setc pos.x, pos.y
                fd.plot()
                return
            onTouchMove: (node, eventInfo, e) =>
                $jit.util.event.stop e
                @onDragMove(node, eventInfo, e)
                return
            onClick: (node, eventInfo, e) ->
                # dev - return immediately
                return

                if not node
                    $('#inner-details').hide()
                    return
                html = "<h2><label>" + node.name
                preishtml = ""
                # 0 is HOME
                if(node.id > 0)
                    html += "&nbsp; - &nbsp;Preise &nbsp;"
                    preishtml += "<table border='0' cellpadding='0' width='100%'>"
                    preisCol = node.id - 1
                    for i in [0..thisjson.articles.length-1]
                        article = thisjson.articles[i]
                        pricehere = thisjson.prices[i][preisCol]
                        availhere = thisjson.availability[i][preisCol]
                        preishtml += "<tr><td>"+article+"</td>"
                        if availhere
                            iconClass = "ui-icon-closethick"
                            styleclass = ""
                        else
                            styleclass = "ui-state-disabled"
                            iconClass = "ui-icon-check"
                        preishtml += "<td><input type='text' class=#{styleclass} size='4' onkeyup='editPrice("+i+","+preisCol+",this)' value='"+pricehere+"'/></td>"
                        preishtml += "<td class=#{styleclass}><span class='ui-icon #{iconClass}' style='float:right;' onClick='editAvailability(#{i},#{preisCol},#{pricehere},this)'>  </span></td>"
                        preishtml += "</tr>"
                html += "</label></h2>"
                $('#inner-details').find( '.portlet-header' ).html(html)
                $('#inner-details').find( '.portlet-content' ).html(preishtml)
                $('#inner-details')
                    .css('top', e.pageY+10)
                    .css('left', e.pageX+10)
                    .show()
                return
        iterations: 50
        levelDistance: 220
        onCreateLabel: (domElement, node) ->
            domElement.innerHTML = node.name
            node.eachAdjacency (adj) ->
                    adj.setData('lineWidth', adj.data.lineWidth)

            return
            
        onPlaceLabel: (domElement, node) ->
            left = parseInt(domElement.style.left)
            top  = parseInt(domElement.style.top)
            w    = domElement.offsetWidth
            domElement.style.left = (left - w / 2) + 'px'
            domElement.style.top  = (top + 10) + 'px'
            domElement.style.display = ''
            return
    window.fd.loadJSON(json)
    window.fd.computeIncremental
        iter: 40
        property: 'end'
        onStep: (perc) ->
            Log.write "#{perc}% loaded..."
            return
        onComplete: ->
            fd.animate
                modes: ['linear']
                transition: $jit.Trans.linear
                duration: 500
            Log.close()
            return
    return
