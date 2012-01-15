
  window.install = function(into, from) {
    var key, _i, _len, _ref, _results;
    _ref = Object.keys(from);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      _results.push(into[key] = from[key]);
    }
    return _results;
  };

  window.findMinIndex = function(array) {
    var curMin, curMinIndex, elem, index, _i, _len;
    index = 0;
    curMin = Number.POSITIVE_INFINITY;
    curMinIndex = -1;
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      elem = array[_i];
      if (elem < curMin) {
        curMin = elem;
        curMinIndex = index;
      }
      index++;
    }
    return curMinIndex;
  };

  window.deg2rad = function(alpha) {
    return Math.PI * alpha / 180;
  };

  window.after = function(msec, func) {
    return setTimeout(func, msec);
  };

  window.nextInt = function(num) {
    return Math.floor(Math.random() * num);
  };

  window.sum = function(array) {
    var s, x, _i, _len;
    s = 0;
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      x = array[_i];
      s += x;
    }
    return s;
  };

  window.avg = function(array) {
    return (sum(array)) / array.length;
  };

  window.swap = function(array, index1, index2) {
    var swap_var;
    swap_var = array[index1];
    array[index1] = array[index2];
    array[index2] = swap_var;
    return array;
  };

  window.zero2D = function(rows, cols) {
    var array, row;
    array = [];
    row = [];
    while (cols--) {
      row.push(0);
    }
    while (rows--) {
      array.push(row.slice());
    }
    return array;
  };

  window.roundCurrency = function(price) {
    return Math.round(price * 100) / 100;
  };
