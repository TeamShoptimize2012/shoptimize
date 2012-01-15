MAX_INT  = Math.pow(2,31) - 1
MAX_UINT = Math.pow(2,32) - 1

Shoptimize = window.Shoptimize

root = this
# apply floyd warshall to an array
#
# DISTANCES should be a multidimensional quadratic array
#
# The function returns an object with the two properties
# `virtual` and `matrix`, where virtual is a matrix
# designating the virtual edges (i.e. which were not given)
# and the `matrix` is the actual adjacency matrix (what you
# probably want). In addition the `next` matrix provides
# information to reconstruct the path, where `next[i][j]`
# represents the highest index vertex to be travled through
# in order to travel the shortest path from `i` to `j`.
Shoptimize.floydWarshall = (distances) ->
    n = distances.length
    virtual = []
    matrix = []
    next = []

    for i in [0..n-1]
        virtual[i] = []
        matrix[i] = []
        next[i] = []
        for j in [0..n-1]
            next[i][j] = Infinity
            if distances[i][j] >= 0
                virtual[i][j] = 0
                matrix[i][j] = distances[i][j]
            else
                virtual[i][j] = 1
                matrix[i][j] = MAX_UINT

    for k in [0..n-1]
        for i in [0..n-1]
            for j in [0..n-1]
                    if matrix[i][k] + matrix[k][j] < matrix[i][j]
                            matrix[i][j] = matrix[i][k] + matrix[k][j]
                            next[i][j] = k

    return virtual: virtual, matrix: matrix, next: next

# Computes the path between two nodes `i` and `j` based on floydWarshall
# object returned by the `floyd_warshall` function. The function `getPath`
# returns an array of the nodes which have to be visited.
#
# Since the algorithm only require information about the travel cost, this
# function is only used to display the actual route in the graph
# which has to be taken in order to travel from one node to another.
Shoptimize.getPath = (floydWarshall, i, j) ->
        matrix = floydWarshall.matrix
        next = floydWarshall.next

        if matrix[i][j] is MAX_UINT
                logError "The graph is not complete"

        intermediate = next[i][j]

        # There is an edge from i to j with no nodes between
        if intermediate is Infinity
                return []
        else
                return getPath(floydWarshall, i, intermediate).concat(intermediate, getPath(floydWarshall, intermediate, j))

