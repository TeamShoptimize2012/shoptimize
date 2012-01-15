(function() {
  var MAX_INT, MAX_UINT, Shoptimize, root;

  MAX_INT = Math.pow(2, 31) - 1;

  MAX_UINT = Math.pow(2, 32) - 1;

  Shoptimize = window.Shoptimize;

  root = this;

  Shoptimize.floydWarshall = function(distances) {
    var i, j, k, matrix, n, next, virtual, _ref, _ref2, _ref3, _ref4, _ref5;
    n = distances.length;
    virtual = [];
    matrix = [];
    next = [];
    for (i = 0, _ref = n - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
      virtual[i] = [];
      matrix[i] = [];
      next[i] = [];
      for (j = 0, _ref2 = n - 1; 0 <= _ref2 ? j <= _ref2 : j >= _ref2; 0 <= _ref2 ? j++ : j--) {
        next[i][j] = Infinity;
        if (distances[i][j] >= 0) {
          virtual[i][j] = 0;
          matrix[i][j] = distances[i][j];
        } else {
          virtual[i][j] = 1;
          matrix[i][j] = MAX_UINT;
        }
      }
    }
    for (k = 0, _ref3 = n - 1; 0 <= _ref3 ? k <= _ref3 : k >= _ref3; 0 <= _ref3 ? k++ : k--) {
      for (i = 0, _ref4 = n - 1; 0 <= _ref4 ? i <= _ref4 : i >= _ref4; 0 <= _ref4 ? i++ : i--) {
        for (j = 0, _ref5 = n - 1; 0 <= _ref5 ? j <= _ref5 : j >= _ref5; 0 <= _ref5 ? j++ : j--) {
          if (matrix[i][k] + matrix[k][j] < matrix[i][j]) {
            matrix[i][j] = matrix[i][k] + matrix[k][j];
            next[i][j] = k;
          }
        }
      }
    }
    return {
      virtual: virtual,
      matrix: matrix,
      next: next
    };
  };

  Shoptimize.getPath = function(floydWarshall, i, j) {
    var intermediate, matrix, next;
    matrix = floydWarshall.matrix;
    next = floydWarshall.next;
    if (matrix[i][j] === MAX_UINT) logError("The graph is not complete");
    intermediate = next[i][j];
    if (intermediate === Infinity) {
      return [];
    } else {
      return getPath(floydWarshall, i, intermediate).concat(intermediate, getPath(floydWarshall, intermediate, j));
    }
  };

}).call(this);
