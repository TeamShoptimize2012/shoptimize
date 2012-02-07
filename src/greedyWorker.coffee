importScripts "lib/seedrandom.js"

pi = Number.POSITIVE_INFINITY

self.addEventListener "message", (e) =>
    if(e.data.command == "start")
        solver e.data.settings, e.data.distances, e.data.prices, e.data.quantities, solution
    else if(e.data.command == "benchmark")

        tmp = e.data.settings

        tmp.config_TA = tmp.bench_TA.min
        tmp.config_AA = tmp.bench_AA.min
        tmp.config_TS = tmp.bench_TS.min
        tmp.config_EP = tmp.bench_EP.min

        while true
            solver tmp, e.data.distances, e.data.prices, e.data.quantities, solution

            continueTest = true
            if(tmp.config_TA + tmp.bench_TA.step <= tmp.bench_TA.max)
                tmp.config_TA += tmp.bench_TA.step
            else
                tmp.config_TA = tmp.bench_TA.min
                if(tmp.config_AA + tmp.bench_AA.step <= tmp.bench_AA.max)
                    tmp.config_AA += tmp.bench_AA.step
                else
                    tmp.config_AA = tmp.bench_AA.min
                    if(tmp.config_TS + tmp.bench_TS.step <= tmp.bench_TS.max)
                        tmp.config_TS += tmp.bench_TS.step
                    else
                        tmp.config_TS = tmp.bench_TS.min
                        if(tmp.config_EP + tmp.bench_EP.step <= tmp.bench_EP.max)
                            tmp.config_EP += tmp.bench_EP.step
                        else
                            tmp.config_EP = tmp.bench_EP.min
                            continueTest = false
            
            if !continueTest
                break
        self.postMessage(
            "message": "termination")

solution = (msg) ->
    self.postMessage("solution" : msg)

error = (msg) ->
    self.postMessage("error" : msg)
    
solve_greedy = (settings, distances, prices, buy, callback_end, callback_each) ->
    solver(settings, distances, prices, buy, callback_end, callback_each)
    
build_mk = (prices) ->
    mk = []
    for prod in [0..prices.length-1]
        order = []
        price = prices[prod].slice()
        soprice = price.slice().sort()
        for i in [0..soprice.length-1]
            x = soprice.splice(0,1)
            if x>0
                inof = price.indexOf(x[0])
                order.push(inof)
                price[inof] = -2
        mk.push(order)
    mk
    
build_av = (prices) ->
    av = []
    for prod in prices
        costs = 0
        offers = 0
        for price in prod
            if(price>0)
                costs += price
                offers++
        av.push(costs/offers)
    av
    
norm_rand = ->
    u = Math.random()
    v = Math.random()
    Math.abs(Math.cos(2*Math.PI*u)*Math.sqrt(2*Math.log(v)))
  

chooseMarketId = (step2_threshold, numShops) ->
    rnd = Math.random()
    result =
        gambled: false
        choice: 0
    if (rnd < step2_threshold)
        rnd = norm_rand()
        
        rnd = Math.random()
        
        result.gambled = true
        result.choice = Math.floor(rnd * numShops)
    result

sortByNumber = (a,b) -> a - b
removeUndef = () -> true

# the greedy solver
#
# SETTINGS is an object with the following configuration options:
# * trend_article
# * treshhold_article
# * treshhold_bestmarket
# * early_purchaser
# * max_iterations
#
# The algorithm follows some simple rules:
# 1 - rate shops
# 2 - choose a shop
# 3 - buy items
# 1+3 - repeat until everything bought
# 4 - optimize shops for articles
#
#
# 1 - at each step rate every (unvisited) shop is ranked
#       basic: shoppinglist for every shop containing articles that are cheapest in shop Mi
#       adv  : put articles on the list where Mi is 2nd/3rd/4..-best option to buy
# 
# 2 - choose among the shops influenced by shoppinglist Di
#       basic: choose Mi where rank = (Si - travelcost to Mi) is highest
#       adv:   choose 2nd or 3rd .. best-shop
#
# 3 - buy items in new shop
#       basic: buy all items on Di
#       adv:   buy also items that are either
#           Ci- %-cheaper than average price among all (left?) shops (for every article seperatly)
#           Ci+ not more expensice than treshhold
#
# 4 - return final route
#       basic: return route as build in 1-3
#       adv:   change shops for articles, where prices where lower on later shops
#
#
# Terms
# Mi  - shop i
# Di  - Shoppinglist for a given shop with articles that are still left to buy and which are cheapest in shop Mi
# Si  - Sum of all articleprices in given shop Mi for Di
# Ci- - Shoopinglist of items that are cheaper than average(for each article) 
# Ci+ - Shoopinglist of items that are not more expensive than treshhold
#

solver = (settings, distances, prices, buy, callback_end, callback_each) ->
    for i in [0..prices.length-1]
        for j in [0..prices[i].length-1]
            if prices[i][j] > -1
                prices[i][j] = prices[i][j] * buy[i]
    
    mk = build_mk prices
    av = build_av prices
    
    numArticles = prices.length
    numShops = prices[0].length
    
    config_TA = Math.min(settings.config_TA, 100) / 100
    config_AA = Math.min(settings.config_AA, 100) / 100
    config_TS = Math.min(settings.config_TS, 100) / 100
    config_EP = Math.min(settings.config_EP, 100) / 100
    

    for tries in [0..settings.max_iterations-1]
        seed = new Date().getTime()
        Math.seedrandom(seed)
        
        unvisitedShops = (x for x in [0..numShops-1])
        leftArticles = (x for x in [0..numArticles-1])
        currentLocation = 0
        route = []
        plainstations = []
        routereplaydata = []
        
        X = Math.random()
        step1_threshold = 0
        if (X < config_TA)
            step1_threshold = Math.floor(config_AA * numShops)
            
        
        while leftArticles.length > 0
            di = []         # shoppinglist at shop
            si = []         # expected sum to pay at shop
            ci = []         # travelcost to this shop
            ti = []         # difference from si-ci
            ei = []         # early-purchaseitems at shop
            step = []
            feasabileMarkets = 0
            
            # 1 - at each step rate every (unvisited) shop is ranked
            #       basic: shoppinglist for every shop containing articles that are cheapest in shop Mi
            #       adv  : put articles on the list where Mi is 2nd/3rd/4..-best option to buy            
            #logger.info "step1"          
            for shop in unvisitedShops
                for article in leftArticles
                    if(prices[article][shop]>0)
                        nthbest = mk[article].indexOf(shop)
                        if(nthbest <= step1_threshold)
                            if(!di[shop]?)
                                di[shop] = []
                            di[shop].push article
                        else if(prices[article][shop] <= av[article] * config_EP)
                            if(!ei[shop]?)
                                ei[shop] = []
                            ei[shop].push article
                if(di[shop]?)
                    ci[shop] = distances[currentLocation][shop+1]
                    si[shop] = 0
                    feasabileMarkets++
                    for item in di[shop]
                        si[shop] += prices[item][shop]
                    if(!ei[shop]?)
                        ei[shop] = []
    
    
            # 2 - choose among the shops influenced by shoppinglist Di
            #       basic: choose Mi where rank = (Si - travelcost to Mi) is highest
            #       adv:   choose 2nd or 3rd .. best-shop        
            #logger.info "step2"
            if(feasabileMarkets == 0)
                error "Something went wrong but I dunno why :/ - Feasible Markets = 0"
                return
                            
            for shop in unvisitedShops
                if(di[shop]?)
                    ti[shop] = parseInt(si[shop]-ci[shop])
            sortedRanks = ti.slice().filter(removeUndef)
            sortedRanks.sort(sortByNumber).reverse()
            step2_decision = chooseMarketId(config_TS, feasabileMarkets)
            pickOne = step2_decision.choice
            nextShop = ti.indexOf(sortedRanks[pickOne])
            step2_decision.shop = nextShop
    
            # 3 - buy items in new shop
            #       basic: buy all items on Di
            #       adv:   buy also items that are either
            #           Ci- %-cheaper than average price among all (left?) shops (for every article seperatly)
            #           Ci+ not more expensice than treshhold
            #logger.info "step3"
            step = [nextShop].concat(di[nextShop]).concat(ei[nextShop])
            route.push(step)
            plainstations.push([nextShop])

            
            ###
            Vizualize iterationdata before cleanup
            ###
            iterationdata =
                di: di
                si: si
                ei: ei
                ti: ti
                ci: ci
                step2_decision: step2_decision
                sri: sortedRanks
                prevLoc: currentLocation
                nextLoc: nextShop + 1
            routereplaydata.push iterationdata
    
    
            # X - remove shop from unvisitedShops and remove articles from leftArticles
            for inBasket in di[nextShop].concat(ei[nextShop])
                leftArticles.splice(leftArticles.indexOf(inBasket),1)
            unvisitedShops.splice(unvisitedShops.indexOf(nextShop),1)
            currentLocation = nextShop+1

        # 4 - return final route
        #       basic: return route as build in 1-3
        #       adv:   change shops for articles, where prices where lower on later shops
        # DEFERED: 4b works easier and maybe faster ;)

        # 4b- global search route
        # step1 . assign articles to shops
        route_two = plainstations.slice()
        for itemindex in [0..numArticles-1]
            minprice = pi
            minshop = -1
            for iter in [0..plainstations.length-1]
                shopindex = plainstations[iter][0]
                if (prices[itemindex][shopindex]>0 && prices[itemindex][shopindex]<minprice)
                    minshop = iter
                    minprice = prices[itemindex][shopindex]
            route_two[minshop].push(itemindex)
        # step2 . remove shops where nothing is bought (even though this may seem itchy, there is still the possibility that
        # a shop was selected due to many articles with 2nd/3rd.. best prices thus the assignment in step1 would leave this shop empty, thus
        # we don't need to visit it anymore and go straight to the next shop)
        final_route = []
        for station in route_two
            if(station.length > 1)
                final_route.push station

        travel_cost_of = (route) ->
            travel_cost = 0
            real_route = [0]
            for station in route
                real_route.push station[0]+1
            real_route.push 0
            for i in [1..real_route.length-1]
                travel_cost += distances[real_route[i-1]][real_route[i]]
            return travel_cost
    
        article_cost_of = (route) ->
            article_cost = 0
            for station in route
                for i in [1..station.length-1]
                    article_cost += prices[station[i]][station[0]]
            return article_cost


        article_cost =  Math.round(article_cost_of(final_route) * 100) / 100
        travel_cost = Math.round(travel_cost_of(final_route) * 100) / 100
        cost = Math.round(article_cost*100 + travel_cost*100) / 100
                      
        result =
            min_cost: cost
            article_cost: article_cost
            travel_cost: travel_cost
            best_route: final_route
            seed: seed
            iteration: tries
            parameters:
                config_TA: settings.config_TA
                config_AA: settings.config_AA
                config_TS: settings.config_TS
                config_EP: settings.config_EP
            routereplaydata : routereplaydata
        callback_end result
