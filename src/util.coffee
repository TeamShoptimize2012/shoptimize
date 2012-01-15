# util.coffee - Hilfsfunktionen. Werden im globalen window-Objekt installiert.

# Kopiert die alle Objekte von `from` nach `to`.
window.install = (into, from) ->
    for key in Object.keys(from)
        into[key] = from[key]

# Findet den minimalen Indize.
window.findMinIndex = (array) ->
    index = 0
    curMin = Number.POSITIVE_INFINITY
    curMinIndex = -1
    for elem in array
        if elem < curMin
            curMin = elem
            curMinIndex = index
        index++
    return curMinIndex

window.deg2rad = (alpha) ->
    Math.PI * alpha / 180

window.after = (msec, func) ->
    setTimeout func, msec

# Liefert eine zufällige Zahl zwischen 0 und `num`.
window.nextInt = (num) -> Math.floor(Math.random() * num)

# Diese Funktion summiert ein Array auf und gibt das Ergebnisse zurück.
window.sum = (array) ->
    s = 0
    for x in array
        s += x
    return s

# Berechnet den Durchschnitt zu einem gegebenem Array.
window.avg = (array) -> (sum array) / array.length

# `swap` tauscht in einem Array zwei spezifizierte Elemente.
window.swap = (array, index1, index2) ->
    swap_var = array[index1]
    array[index1] = array[index2]
    array[index2] = swap_var
    return array

# Die Funktion `zero2D` erstellt ein Array mit leeren Elementen.
window.zero2D = (rows, cols) ->
  array = []
  row = []
  while (cols--)
    row.push(0)
  while (rows--)
    array.push(row.slice())
  array

# Diese Funktion rundet einen reelle Zahlen auf zwei Stellen nach dem Komma.
window.roundCurrency = (price) ->
    Math.round(price * 100) / 100

