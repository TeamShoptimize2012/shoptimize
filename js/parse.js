(function() {
  var root, tmpstringbuffer;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.parsePricesCSV = function(string) {
    var articles, checkValues, firstBreak, firstLine, i, j, matrix, numArticles, numShops, price, quantities, quantity, shops, state, str, value, x, _i, _len, _ref, _ref2, _ref3;
    string += '\n';
    firstLine = string.slice(0, ((string.indexOf('\n')) - 1) + 1 || 9e9);
    checkValues = firstLine.split(',');
    if (checkValues.length !== 2) {
      return {
        error: 'Fehlerhaftes Dateiformat, muss mit Prüfsummen beginnen.'
      };
    }
    numShops = parseInt(checkValues[0]);
    numArticles = parseInt(checkValues[1]);
    articles = [];
    shops = [];
    matrix = [];
    quantities = [];
    firstBreak = string.indexOf('\n');
    str = string.slice(firstBreak + 1, (firstBreak + 24) + 1 || 9e9);
    if (str !== "Artikel/Geschaeft,Menge," && str !== "Artikel\\Geschaeft,Menge,") {
      return {
        error: 'Fehlerhaftes Dateiformat, muss mit "Artikel/Geschaeft,Menge," beginnen.'
      };
    }
    state = 0;
    value = "";
    quantity = 1;
    i = j = 0;
    _ref = string.slice(firstBreak + 25);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      x = _ref[_i];
      if (x === '\r') continue;
      switch (state) {
        case 0:
          switch (x) {
            case ',':
              shops.push(value);
              value = "";
              break;
            case '\n':
              shops.push(value);
              value = "";
              state = 1;
              break;
            default:
              value += x;
          }
          break;
        case 1:
          switch (x) {
            case ',':
              articles.push(value);
              matrix.push([]);
              state = 3;
              value = "";
              break;
            case '\n':
              continue;
            default:
              value += x;
          }
          break;
        case 3:
          if (x === ',') {
            quantity = parseInt(value);
            quantities.push(quantity);
            value = "";
            state = 2;
          } else {
            value += x;
          }
          break;
        case 2:
          switch (x) {
            case ',':
              price = parseFloat(value);
              matrix[i][j] = price;
              j += 1;
              value = "";
              break;
            case '\n':
              state = 1;
              price = parseFloat(value);
              matrix[i][j] = price;
              if (j + 1 !== numShops) {
                return {
                  error: "Fehlerhafter Dateiinhalt, inkorrekte Anzahl von Geschäften."
                };
              }
              i += 1;
              j = 0;
              value = "";
              break;
            default:
              value += x;
          }
      }
    }
    if (i !== numArticles) {
      return {
        error: "Fehlerhafter Dateiformat, inkorrekte Anzahl von Artikeln."
      };
    }
    for (i = 0, _ref2 = matrix.length - 1; 0 <= _ref2 ? i <= _ref2 : i >= _ref2; 0 <= _ref2 ? i++ : i--) {
      for (j = 0, _ref3 = matrix.length - 1; 0 <= _ref3 ? j <= _ref3 : j >= _ref3; 0 <= _ref3 ? j++ : j--) {
        if (matrix[i][j] !== matrix[i][j] || matrix[i][j] < 0) matrix[i][j] = -1;
      }
    }
    return {
      articles: articles,
      shops: shops,
      matrix: matrix,
      quantities: quantities
    };
  };

  root.parseDistancesCSV = function(string) {
    var i, j, matrix, shops, state, value, x, _i, _len, _ref, _ref2, _ref3;
    if (string.slice(0, 12) !== "Fahrtkosten,") {
      return {
        error: 'Fehlerhaftes Dateiformat, muss mit "Fahrtkosten" beginnen.'
      };
    }
    string += '\n';
    matrix = [];
    shops = [];
    state = 0;
    value = "";
    i = j = 0;
    _ref = string.slice(12);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      x = _ref[_i];
      if (x === '\r') continue;
      switch (state) {
        case 0:
          switch (x) {
            case ',':
              shops.push(value);
              value = "";
              break;
            case '\n':
              shops.push(value);
              state = 1;
              value = "";
              break;
            default:
              value += x;
          }
          break;
        case 1:
          switch (x) {
            case ',':
              if (shops[i] !== value) {
                return {
                  error: 'Fehlerhafter Dateiinhalt, ein Geschäftsbezeichner passt nicht.'
                };
              }
              state = 2;
              value = "";
              matrix.push([]);
              j = 0;
              break;
            case '\n':
              continue;
            default:
              value += x;
          }
          break;
        case 2:
          switch (x) {
            case ',':
              matrix[i][j] = parseFloat(value);
              j += 1;
              value = "";
              break;
            case '\n':
              state = 1;
              matrix[i][j] = parseFloat(value);
              i += 1;
              j = 0;
              value = "";
              break;
            default:
              value += x;
          }
      }
    }
    if (i !== shops.length) {
      return {
        error: 'Fehlerhafter Dateiinhalt, es fehlen Geschäfte.'
      };
    }
    for (i = 0, _ref2 = matrix.length - 1; 0 <= _ref2 ? i <= _ref2 : i >= _ref2; 0 <= _ref2 ? i++ : i--) {
      matrix[i][i] = 0;
      for (j = i, _ref3 = matrix.length - 1; i <= _ref3 ? j <= _ref3 : j >= _ref3; i <= _ref3 ? j++ : j--) {
        if (matrix[i][j] !== matrix[i][j] || matrix[i][j] < 0) matrix[i][j] = -1;
        matrix[j][i] = matrix[i][j];
      }
    }
    return {
      shops: shops,
      matrix: matrix
    };
  };

  tmpstringbuffer = "";

  root.parseTPP = function(string) {
    var a, art, articles, data, distances, edges, i, item, items, j, line, myReadLine, numOfArticles, numOfShops, offset, price, prices, s, shopid, shops, t, x, y, _ref, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
    string += '\n';
    tmpstringbuffer = string;
    myReadLine = function() {
      var line, ptr, x, _i, _len, _ref;
      line = "";
      ptr = 0;
      string = tmpstringbuffer;
      _ref = string.slice(0);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        x = _ref[_i];
        ptr++;
        if (x === '\r\n') {
          ptr++;
          break;
        } else if (x === '\r' || x === '\n') {
          break;
        } else {
          line += x;
        }
      }
      tmpstringbuffer = string.slice(ptr);
      return line;
    };
    numOfArticles = 0;
    numOfShops = 0;
    distances = [];
    prices = [];
    articles = [];
    shops = [];
    line = myReadLine();
    while (line !== "") {
      if (line.indexOf("DIMENSION :") === 0) {
        numOfShops = parseInt(line.split(":")[1]) - 1;
      }
      if (line === "DEMAND_SECTION :") {
        line = myReadLine();
        numOfArticles = parseInt(line);
        break;
      }
      line = myReadLine();
    }
    if (numOfArticles < 0) {
      return {
        error: 'Fehlerhafter Dateiinhalt, es gibt keine Artikel.'
      };
    }
    for (a = 0, _ref = numOfArticles - 1; 0 <= _ref ? a <= _ref : a >= _ref; 0 <= _ref ? a++ : a--) {
      prices.push([]);
      for (s = 0, _ref2 = numOfShops - 1; 0 <= _ref2 ? s <= _ref2 : s >= _ref2; 0 <= _ref2 ? s++ : s--) {
        prices[a].push(-1);
      }
    }
    for (i = 0, _ref3 = numOfArticles - 1; 0 <= _ref3 ? i <= _ref3 : i >= _ref3; 0 <= _ref3 ? i++ : i--) {
      line = myReadLine();
      art = "tppA " + line.split(" ")[0];
      articles.push(art);
    }
    for (s = 0; 0 <= numOfShops ? s <= numOfShops : s >= numOfShops; 0 <= numOfShops ? s++ : s--) {
      if (s > 0) shops.push("tppS " + s);
      distances.push([]);
      for (t = 0; 0 <= numOfShops ? t <= numOfShops : t >= numOfShops; 0 <= numOfShops ? t++ : t--) {
        if (s === t) {
          distances[s][t] = 0;
        } else {
          distances[s][t] = -1;
        }
      }
    }
    line = myReadLine();
    if (line === "OFFER_SECTION :") {
      line = myReadLine();
      for (x = 0, _ref4 = numOfShops - 1; 0 <= _ref4 ? x <= _ref4 : x >= _ref4; 0 <= _ref4 ? x++ : x--) {
        line = myReadLine();
        data = line.split(" ");
        shopid = parseInt(data[0]) - 2;
        items = parseInt(data[1]);
        for (y = 0, _ref5 = items - 1; 0 <= _ref5 ? y <= _ref5 : y >= _ref5; 0 <= _ref5 ? y++ : y--) {
          item = parseInt(data[y * 3 + 3]) - 1;
          price = parseInt(data[y * 3 + 4]);
          if (!price > 0) price = -1;
          prices[item][shopid] = price;
        }
      }
    }
    line = myReadLine();
    if (line === "EDGE_WEIGHT_SECTION :") {
      for (i = 0, _ref6 = numOfShops - 1; 0 <= _ref6 ? i <= _ref6 : i >= _ref6; 0 <= _ref6 ? i++ : i--) {
        line = myReadLine();
        edges = line.split(/\s+/);
        offset = numOfShops - (edges.length - 1);
        for (j = 1, _ref7 = edges.length - 1; 1 <= _ref7 ? j <= _ref7 : j >= _ref7; 1 <= _ref7 ? j++ : j--) {
          distances[i][offset + j] = parseInt(edges[j]);
          distances[offset + j][i] = parseInt(edges[j]);
        }
      }
    }
    tmpstringbuffer = "";
    return {
      articles: articles,
      shops: shops,
      distances: distances,
      prices: prices
    };
  };

}).call(this);
