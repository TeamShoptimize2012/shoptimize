root = exports ? this
   
root.parsePricesCSV = (string) ->
    string += '\n'
    firstLine = string[0 .. (string.indexOf '\n') - 1]
    checkValues = firstLine.split ','

    if checkValues.length != 2
        return error: 'Fehlerhaftes Dateiformat, muss mit Prüfsummen beginnen.'

    numShops = parseInt checkValues[0]
    numArticles = parseInt checkValues[1]
 
    articles = []
    shops = []
    matrix = []
    quantities = []

    firstBreak = string.indexOf '\n'
    str = string[firstBreak + 1 .. firstBreak + 24]
    if str != "Artikel/Geschaeft,Menge," && str != "Artikel\\Geschaeft,Menge,"
        return error: 'Fehlerhaftes Dateiformat, muss mit "Artikel/Geschaeft,Menge," beginnen.'

    state = 0
    value = ""
    quantity = 1
    i = j = 0
    
    for x in string[firstBreak + 25 ..]
        if x == '\r' then continue
        switch state
            when 0 then switch x
                when ','
                    shops.push value
                    value = ""
                when '\n'
                    shops.push value
                    value = ""
                    state = 1
                else value += x
            when 1 then switch x
                when ','
                    articles.push value
                    matrix.push []
                    state = 3
                    value = ""
                when '\n'
                    continue
                else value += x
            when 3
                if x == ','
                    quantity = parseInt value
                    quantities.push quantity
                    value = ""
                    state = 2
                else
                    value += x
            when 2 then switch x
                when ','
                    price = parseFloat value
                    matrix[i][j] = price
                    j += 1
                    value = ""
                when '\n'
                    state = 1
                    price = parseFloat value
                    matrix[i][j] = price
                    if j + 1 != numShops
                        return error: "Fehlerhafter Dateiinhalt, inkorrekte Anzahl von Geschäften."
                    i += 1
                    j = 0
                    value = ""
                else value += x

    if i != numArticles
        return error: "Fehlerhafter Dateiformat, inkorrekte Anzahl von Artikeln."
  
    for i in [0..matrix.length-1]
        for j in [0..matrix.length-1]
            if matrix[i][j] != matrix[i][j] || matrix[i][j] < 0
                matrix[i][j] = -1
    
    return {articles, shops, matrix, quantities}

# String -> Either {error} {shops, matrix}
# if matrix[i][j] == undefined then it is set to -1
root.parseDistancesCSV = (string) ->
    if string[0..11] != "Fahrtkosten,"
        return error: 'Fehlerhaftes Dateiformat, muss mit "Fahrtkosten" beginnen.'
    string += '\n'

    matrix = []
    shops = []

    state = 0
    value = ""
    i = j = 0

    for x in string[12..]
        if x == '\r' then continue
        switch state
            when 0 then switch x
                when ','
                    shops.push value
                    value = ""
                when '\n'
                    shops.push value
                    state = 1
                    value = ""
                else value += x
            when 1 then switch x
                when ','
                    if shops[i] != value
                        return error: 'Fehlerhafter Dateiinhalt, ein Geschäftsbezeichner passt nicht.'
                    state = 2
                    value = ""
                    matrix.push []
                    j = 0
                when '\n'
                    continue
                else value += x
            when 2 then switch x
                when ','
                    matrix[i][j] = parseFloat value
                    j += 1
                    value = ""
                when '\n'
                    state = 1
                    matrix[i][j] = parseFloat value
                    i += 1
                    j = 0
                    value = ""
                else value += x

    if i != shops.length
        return error: 'Fehlerhafter Dateiinhalt, es fehlen Geschäfte.'

    for i in [0..matrix.length-1]
        matrix[i][i] = 0
        for j in [i..matrix.length-1]
            if matrix[i][j] != matrix[i][j] || matrix[i][j] < 0
                matrix[i][j] = -1
            matrix[j][i] = matrix[i][j]

    return {shops, matrix}

tmpstringbuffer = ""
root.parseTPP = (string) ->
    string += '\n'
    tmpstringbuffer = string
    myReadLine = () ->
        line = ""
        ptr = 0
        string = tmpstringbuffer
        for x in string[0..]
            ptr++
            if x=='\r\n'
                ptr++
                break
            else if x=='\r' || x=='\n'
                break
            else
                line += x
        tmpstringbuffer = string.slice(ptr)
        line
    numOfArticles = 0
    numOfShops = 0
    distances = []
    prices = []
    articles = []
    shops = []
    line = myReadLine()
    while line != ""
        if (line.indexOf("DIMENSION :")==0)
            numOfShops = parseInt(line.split(":")[1])-1
        if (line == "DEMAND_SECTION :")
            line = myReadLine()
            numOfArticles = parseInt(line)
            break
        line = myReadLine()
    if(numOfArticles < 0)
        return error: 'Fehlerhafter Dateiinhalt, es gibt keine Artikel.'
        
    for a in [0..numOfArticles-1]
        prices.push []
        for s in [0..numOfShops-1]
            prices[a].push -1
            
    for i in [0..numOfArticles-1]
        line = myReadLine()
        art = "tppA "+line.split(" ")[0]
        articles.push art
        
    for s in [0..numOfShops]
        if(s>0)
            shops.push "tppS "+s
        distances.push []
        for t in [0..numOfShops]
            if(s==t)
                distances[s][t] = 0
            else
                distances[s][t] = -1
        
    line = myReadLine()
    if(line == "OFFER_SECTION :")
        line = myReadLine()     
        for x in [0..numOfShops-1]
            line = myReadLine()
            data = line.split(" ")
            shopid = parseInt(data[0]) - 2
            items = parseInt(data[1])
            for y in [0..items-1]
                item = parseInt(data[y*3+3]) - 1
                price = parseInt(data[y*3+4])
                if(!price>0)
                    price = -1
                prices[item][shopid] = price
    
    line = myReadLine()
    if(line == "EDGE_WEIGHT_SECTION :")
        for i in [0..numOfShops-1]
            line = myReadLine()
            edges = line.split(///\s+///)
            offset = numOfShops- (edges.length - 1)
            for j in [1..edges.length-1]
                distances[i][offset+j] = parseInt(edges[j])
                distances[offset+j][i] = parseInt(edges[j])
    
    tmpstringbuffer = ""
    {articles, shops, distances, prices}