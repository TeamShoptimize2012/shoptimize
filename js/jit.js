(function() {

  /*
      jit.coffee - Ansicht für die Darstellung der berechneten Einkaufsrouten.
  */

  var Log, Shoptimize, animate, highlightRoute, highlightedAdjacency, iStuff, init, initializeGraph, labelType, lineWidthModification, mapRouteToPathArray, nativeCanvasSupport, nativeTextSupport, renderArrow, renderEdgeCost, root, textSupport, useGradients;

  Shoptimize = window.Shoptimize;

  root = this;

  lineWidthModification = 15;

  highlightedAdjacency = [];

  Shoptimize.JitGraph = function() {
    var jitContainer;
    return jitContainer = $("<div id='graphframe'><div id='infovis'>").appendTo($("#vizCanvas"));
  };

  Shoptimize.JitGraph.init = function(data) {
    initializeGraph(data);
    lineWidthModification = 15;
    return highlightedAdjacency = [];
  };

  initializeGraph = function(shopdata) {
    var adjacencies, articles, availability, data, edge, i, id, j, json, lineCost, maxWeight, name, node, numNodes, prices, w, weightFactor, _ref, _results;
    json = [];
    numNodes = shopdata.shops.length - 1;
    maxWeight = 0;
    _results = [];
    for (i = 0; 0 <= numNodes ? i <= numNodes : i >= numNodes; 0 <= numNodes ? i++ : i--) {
      for (j = i; i <= numNodes ? j <= numNodes : j >= numNodes; i <= numNodes ? j++ : j--) {
        w = shopdata.distances[i][j];
        if (w !== -1 && w !== NaN && w !== void 0) {
          maxWeight = Math.max(w, maxWeight);
        }
      }
      weightFactor = 100 / maxWeight / 100;
      if (weightFactor === Infinity) weightFactor = 1;
      for (i = 0; 0 <= numNodes ? i <= numNodes : i >= numNodes; 0 <= numNodes ? i++ : i--) {
        id = i;
        name = shopdata.shops[id];
        adjacencies = [];
        articles = [];
        prices = [];
        availability = [];
        node = {
          "id": id,
          "name": name,
          "adjacencies": adjacencies,
          "articles": articles,
          "prices": prices,
          "availability": availability
        };
        json.push(node);
        for (j = i; i <= numNodes ? j <= numNodes : j >= numNodes; i <= numNodes ? j++ : j--) {
          if (shopdata.distances[i][j] >= 0 && i < j) {
            edge = new Object;
            edge['nodeTo'] = j;
            edge['nodeFrom'] = i;
            data = new Object;
            data['cost'] = shopdata.distances[i][j];
            lineCost = data['cost'];
            if (lineCost === 0) lineCost = 1;
            data['lineWidth'] = data['cost'] * weightFactor * MAX_LINE_WIDTH;
            edge['data'] = data;
            adjacencies.push(edge);
          }
        }
        for (j = 0, _ref = shopdata.prices.length - 1; 0 <= _ref ? j <= _ref : j >= _ref; 0 <= _ref ? j++ : j--) {
          articles.push(shopdata.articles[j]);
          prices.push(shopdata.prices[j][i]);
        }
      }
      $('#infovis').empty();
      _results.push(init(json));
    }
    return _results;
  };

  mapRouteToPathArray = function(route) {
    var path, shop, _i, _len;
    path = [];
    for (_i = 0, _len = route.length; _i < _len; _i++) {
      shop = route[_i];
      path.push(shop[0] + 1);
    }
    return path;
  };

  Shoptimize.JitGraph.highlightSolutionInGraph = function(floydWarshall, solution, color) {
    var nextShop, path, realPath, virtualPath, _i, _len;
    realPath = [0];
    virtualPath = mapRouteToPathArray(solution.best_route);
    for (_i = 0, _len = virtualPath.length; _i < _len; _i++) {
      nextShop = virtualPath[_i];
      path = getPath(floydWarshall, realPath[realPath.length - 1], nextShop);
      realPath = realPath.concat(path);
      realPath.push(nextShop);
    }
    path = getPath(floydWarshall, realPath[realPath.length - 1], 0);
    realPath = realPath.concat(path);
    realPath.push(0);
    highlightRoute(realPath, color);
  };

  highlightRoute = function(path, color) {
    var currentNode, i, nextNode, _len, _results;
    if (highlightedAdjacency.length !== 0) unhighlightAllEdges();
    currentNode = path[0];
    _results = [];
    for (i = 0, _len = path.length; i < _len; i++) {
      nextNode = path[i];
      if (!(i !== 0)) continue;
      JitGraph.highlightEdge(currentNode, nextNode, color);
      _results.push(currentNode = nextNode);
    }
    return _results;
  };

  Shoptimize.JitGraph.highlightEdge = function(nodeFrom, nodeTo, color) {
    var adj, graph, lineWidth, node;
    graph = window.fd.graph;
    node = graph.getNode(nodeFrom);
    adj = graph.getAdjacence(nodeFrom, nodeTo);
    adj.data['toSmallerValue'] = false;
    if (nodeFrom > nodeTo) adj.data['toSmallerValue'] = true;
    if (highlightedAdjacency.indexOf(adj) !== -1) {
      adj.setData('type', 'doubleArrowEdge');
    } else {
      adj.setData('type', 'singleArrowEdge');
    }
    highlightedAdjacency.push(adj);
    lineWidth = adj.getData('lineWidth');
    adj.setData('color', color);
    fd.plot();
  };

  Shoptimize.unhighlightAllEdges = function() {
    var adj;
    while (highlightedAdjacency.length !== 0) {
      adj = highlightedAdjacency.pop();
      adj.setData('color', GRAPH_EDGE_COLOR);
      adj.setData('type', 'costs');
    }
    return fd.plot();
  };

  iStuff = navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i);

  nativeCanvasSupport = typeof HTMLCanvasElement === 'object' || typeof HTMLCanvasElement === 'function';

  textSupport = nativeCanvasSupport && (typeof document.createElement('canvas').getContext('2d').fillText === 'function');

  labelType = !nativeCanvasSupport || (textSupport && !iStuff) ? 'Native' : 'HTML';

  nativeTextSupport = labelType === 'Native';

  useGradients = nativeCanvasSupport;

  animate = !(iStuff || !nativeCanvasSupport);

  renderArrow = function(ctx, from, to, edge) {
    var intermediatePoint, normal, v1, v2, vect;
    vect = new $jit.Complex(to.x - from.x, to.y - from.y);
    vect.$scale(edge['Edge'].dim / vect.norm());
    intermediatePoint = new $jit.Complex(to.x - vect.x, to.y - vect.y);
    normal = new $jit.Complex(-vect.y / 2, vect.x / 2);
    v1 = intermediatePoint.add(normal);
    v2 = intermediatePoint.$add(normal.$scale(-1));
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(v1.x, v1.y);
    ctx.lineTo(v2.x, v2.y);
    ctx.lineTo(to.x, to.y);
    ctx.closePath();
    return ctx.fill();
  };

  renderEdgeCost = function(ctx, from, to, edge) {
    var middle;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    middle = new Object();
    middle['x'] = from.x - (from.x - to.x) / 2 - 10;
    middle['y'] = from.y - (from.y - to.y) / 2 - 10;
    ctx.font = "14pt Helvetica";
    ctx.fillStyle = "#000000";
    return ctx.fillText(edge.data.cost, middle['x'], middle['y']);
  };

  Log = {
    elem: false,
    write: function(text) {
      if (!this.elem) {
        this.elem = $("#log");
        this.elem.css({
          position: 'absolute',
          left: $(window).width() / 2 + 'px',
          top: $(window).height() / 2 + 'px'
        });
        this.elem.show();
      }
      return this.elem.html(text);
    },
    close: function() {
      if (this.elem) return this.elem.hide();
    }
  };

  init = function(json) {
    var _this = this;
    $jit.ForceDirected.Plot.EdgeTypes.implement({
      'singleArrowEdge': {
        'render': function(edge, canvas) {
          var ctx, from, swap, tmp, to;
          from = edge.nodeFrom.pos;
          to = edge.nodeTo.pos;
          ctx = canvas.getCtx();
          swap = edge.data.toSmallerValue;
          if (swap) {
            tmp = from;
            from = to;
            to = tmp;
          }
          renderArrow(ctx, from, to, edge);
          return renderEdgeCost(ctx, from, to, edge);
        }
      },
      'doubleArrowEdge': {
        'render': function(edge, canvas) {
          var ctx, from, to;
          from = edge.nodeFrom.pos;
          to = edge.nodeTo.pos;
          ctx = canvas.getCtx();
          renderArrow(ctx, from, to, edge);
          renderArrow(ctx, to, from, edge);
          return renderEdgeCost(ctx, from, to, edge);
        }
      },
      'costs': {
        'render': function(edge, canvas) {
          var ctx, from, to;
          from = edge.nodeFrom.pos;
          to = edge.nodeTo.pos;
          ctx = canvas.getCtx();
          return renderEdgeCost(ctx, from, to, edge);
        }
      }
    });
    window.fd = new $jit.ForceDirected({
      injectInto: 'infovis',
      animate: true,
      Navigation: {
        enable: true,
        panning: 'avoid nodes',
        zooming: 10
      },
      Node: {
        overridable: true,
        dim: 10,
        color: GRAPH_NODE_COLOR,
        type: 'circle'
      },
      Edge: {
        type: 'costs',
        overridable: true,
        color: GRAPH_EDGE_COLOR,
        lineWidth: 1.0,
        dim: 25
      },
      Label: {
        size: 14,
        style: 'bold',
        color: '#000'
      },
      Tips: {
        enable: false
      },
      Events: {
        enable: true,
        onMouseEnter: function() {
          fd.canvas.getElement().style.cursor = 'move';
        },
        onMouseLeave: function() {
          fd.canvas.getElement().style.cursor = '';
        },
        onDragMove: function(node, eventInfo, e) {
          var pos;
          pos = eventInfo.getPos();
          node.pos.setc(pos.x, pos.y);
          fd.plot();
        },
        onTouchMove: function(node, eventInfo, e) {
          $jit.util.event.stop(e);
          _this.onDragMove(node, eventInfo, e);
        },
        onClick: function(node, eventInfo, e) {
          var article, availhere, html, i, iconClass, preisCol, preishtml, pricehere, styleclass, _ref;
          return;
          if (!node) {
            $('#inner-details').hide();
            return;
          }
          html = "<h2><label>" + node.name;
          preishtml = "";
          if (node.id > 0) {
            html += "&nbsp; - &nbsp;Preise &nbsp;";
            preishtml += "<table border='0' cellpadding='0' width='100%'>";
            preisCol = node.id - 1;
            for (i = 0, _ref = thisjson.articles.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
              article = thisjson.articles[i];
              pricehere = thisjson.prices[i][preisCol];
              availhere = thisjson.availability[i][preisCol];
              preishtml += "<tr><td>" + article + "</td>";
              if (availhere) {
                iconClass = "ui-icon-closethick";
                styleclass = "";
              } else {
                styleclass = "ui-state-disabled";
                iconClass = "ui-icon-check";
              }
              preishtml += ("<td><input type='text' class=" + styleclass + " size='4' onkeyup='editPrice(") + i + "," + preisCol + ",this)' value='" + pricehere + "'/></td>";
              preishtml += "<td class=" + styleclass + "><span class='ui-icon " + iconClass + "' style='float:right;' onClick='editAvailability(" + i + "," + preisCol + "," + pricehere + ",this)'>  </span></td>";
              preishtml += "</tr>";
            }
          }
          html += "</label></h2>";
          $('#inner-details').find('.portlet-header').html(html);
          $('#inner-details').find('.portlet-content').html(preishtml);
          $('#inner-details').css('top', e.pageY + 10).css('left', e.pageX + 10).show();
        }
      },
      iterations: 50,
      levelDistance: 220,
      onCreateLabel: function(domElement, node) {
        domElement.innerHTML = node.name;
        node.eachAdjacency(function(adj) {
          return adj.setData('lineWidth', adj.data.lineWidth);
        });
      },
      onPlaceLabel: function(domElement, node) {
        var left, top, w;
        left = parseInt(domElement.style.left);
        top = parseInt(domElement.style.top);
        w = domElement.offsetWidth;
        domElement.style.left = (left - w / 2) + 'px';
        domElement.style.top = (top + 10) + 'px';
        domElement.style.display = '';
      }
    });
    window.fd.loadJSON(json);
    window.fd.computeIncremental({
      iter: 40,
      property: 'end',
      onStep: function(perc) {
        Log.write("" + perc + "% loaded...");
      },
      onComplete: function() {
        fd.animate({
          modes: ['linear'],
          transition: $jit.Trans.linear,
          duration: 500
        });
        Log.close();
      }
    });
  };

}).call(this);
