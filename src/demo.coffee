# **demo.coffee**
# Diese Datei enthält alle von der Anwendung verwendeten
# Testdaten
# Alle hier aufgelisteten Datenkonstrukte verwenden einige
# oder alle folgende Typen:
# *shops: Liste aller in dem Datensatz vorkommender Orte
# *distanes: Matrix aller Entfernungen aller Orte untereinander;
# -1 bedeutet, dass keine Direkte Verbindung vorhanden ist
# *allDistances: wie distances;
# es werden aber fehlende Einträge durch den Floyd-Warshall Algorithmus
# ergänzt
# *articles: Liste aller zu kaufenden Artikel
# *prices: Matrix aller Preise aller Artikel in allen Geschäften;
# -1 bedeutet, dass der Artikel nicht in dem Geschäft zu kaufen ist
# *history: Eine liste aller Ereignisse,
# die durch die Erklär-Animation verwendet wird.
# Das sind Testdaten zum Debuggen.
window.Shoptimize.sampleData5 = {
    shops: ["zu Hause", "Rewe", "NETTO", "Lidl", "Real", "Kaisers"]
    distances: [
        [0, 3, 4, 6, 1, 1]
        [3, 0, 2, -1, 1, 1]
        [4, 2, 0, 3, 1, 1]
        [6, -1, 3, 0, 1, 1]
        [1, 1, 1, 1, 1, 1]
        [1, 1, 1, 1, 1, 1]]
    allDistances: [
        [0, 3, 4, 6, 1, 1]
        [3, 0, 2, -1, 1, 1]
        [4, 2, 0, 3, 1, 1]
        [6, -1, 3, 0, 1, 1]
        [1, 1, 1, 1, 0, 1]
        [1, 1, 1, 1, 1, 0]]
    articles: ["Zucker", "Brot", "Gitarre", "Atombombe", "Mikrofon", "Diamant", "MacBook", "Malzbier", "Monitor", "Frisch gepresster Orangensaft"]
    prices: [
        [14.95, 16.99, 11.5, 10, -1]
        [4.99, 4.59, 4.99, -1, -1]
        [-1, 12.9, 11.99, 20, 19]
        [5.99, 4.55, 4.95, 4.3, 4.2]
        [19.9, 19.95, -1, 3.2, 17]
        [-1, 8.19, 7.99, -1, -1]
        [5.99, 4.55, 4.95, -1, 9]
        [19.9, 19.95, -1, 10, 17]
        [-1, 8.19, 7.99, 10.85, 9.15]
        [5.99, 4.55, 4.95, -1, 4.5]]
    history: [
        {
            di: [
                [1,3]
                [2,5,6,7]
                [0]
                [4,8]
                [9]
            ]
            si: [42,1337,4711,1012,1111]
            prevLoc: 0
            nextLoc: 2
        }
        {
            di: [
                [1,3]
                null
                [0]
                [4,8]
                [9]
            ]
            si: [42,null,4711,1012,1111]
            prevLoc: 2
            nextLoc: 3
        }
        {
            di: [
                [1,3]
                null
                null
                [4,8]
                [9]
            ]
            si: [42,null,null,1012,1111]
            prevLoc: 3
            nextLoc: 5
        }
        {
            di: [
                [1,3]
                null
                null
                [4,8]
            ]
            si: [42,null,null,1012]
            prevLoc: 5
            nextLoc: 4
        }
        {
            di: [
                [1,3]
            ]
            si: [1012]
            prevLoc: 4
            nextLoc: 1
        }
    ]
}

# Das sind die Testdaten zum Erklären des Algorithmus.
window.Shoptimize.sampleData = {
    shops: ["g1", "g2", "g3"]
    home: "g0"
    distances: [
        [0, 3, 4, 6]
        [3, 0, 2, -1]
        [4, 2, 0, 3]
        [6, -1, 3, 0]]
    allDistances: [
        [0, 3, 4, 6]
        [3, 0, 2, 5]
        [4, 2, 0, 3]
        [6, 5, 3, 0]]
    articles: ["a1", "a2", "a3", "a4", "a5", "a6"]
    quantities: [1,1,1,1,1,1]
    prices: [
        [14.95, 16.99, 11.5]
        [4.99, 4.59, 4.99]
        [-1, 12.9, 11.99]
        [5.99, 4.55, 4.95]
        [19.9, 19.95, -1]
        [-1, 8.19, 7.99]]
    history: [
        {
            "di": [
                [4]
                [1,3]
                [0,2,5]
            ]
            "si": [1989,914,3148] # Shopkosten
            "ei": [[],[],[]] # early purchase list
            "ti": [1689,514,2548]  # si - ci (ci ist travel cost)
            "sri": [2548,1689,514] # si sortiert (soRtiert)
            "prevLoc": 0 # 0 ist home
            "nextLoc": 3 # basierend auf diesen daten gehe zum ersten shop (0-ten shop, whatever)
        }
        {
            "di": [
                [4]
                [1,3]
            ],
            "si": [1989,914]
            "ei": [[],[]]
            "ti": [null,714,2648]
            "sri": [1689,514]
            "prevLoc": 3
            "nextLoc": 1
        }
        {
            "di": [
                null
                [1,3]
            ],
            "si": [null,914]
            "ei": [null,[]]
            "ti": [null,614]
            "sri": [614]
            "prevLoc": 1
            "nextLoc": 2
        }
    ]
}
#
# Das sind die Testdaten für die Demobeispiele.
window.Shoptimize.Testdata =

    InformatiCup1:
        title:  "InformatiCup Testdatensatz 1"
        shops:  """
                Fahrtkosten,g0,g1,g2,g3
                g0,0,3,4,6
                g1,3,0,2,
                g2,4,2,0,3
                g3,6,,3,0
                """
        prices: """
                3,6
                Artikel\\Geschaeft,Menge,g1,g2,g3
                a1,1,14.95,16.99,11.50
                a2,1,4.99,4.59,4.99
                a3,1,,12.90,11.99
                a4,1,5.99,4.55,4.95
                a5,1,19.90,19.95,
                a6,1,,8.19,7.99
                """

    InformatiCup2:
        title:  "InformatiCup Testdatensatz 2"
        shops:  """
                Fahrtkosten,g0,g1,g2,g3
                g0,0,3,4,6
                g1,3,0,2,
                g2,4,2,0,3
                g3,6,,3,0
                """
        prices: """
                3,7
                Artikel\\Geschaeft,Menge,g1,g2,g3
                a1,1,14.95,16.99,11.50
                a2,1,4.99,4.59,4.99
                a3,1,,12.90,11.99
                a4,1,5.99,4.55,4.95
                a5,1,19.90,19.95,
                a6,1,,8.19,7.99
                a7,1,5.95,9.90,
                """
    Szenario1:
        title:  "Spezialfall 1: Keine Reisekosten"
        shops:  """
                Fahrtkosten,Startpunkt,Supermarkt,Großhandel,Spätkauf
                Startpunkt,0,0,0,0
                Supermarkt,0,0,,
                Großhandel,0,,0,
                Spätkauf,0,,,0
                """
        prices: """
                3,4
                Artikel\\Geschaeft,Menge,g1,g2,g3
                Eisbergsalat,1,14.95,16.99,11.50
                Eis,1,4.99,4.59,4.99
                Hammer,1,,12.90,11.99
                Club Mate,1,5.99,4.55,4.95
                """
    Szenario2:
        title:  "Spezialfall 2: Wähle nur ein Geschäft aus"
        shops:  """
                Fahrtkosten,Zuhause,Supermarkt,Großhandel,Discounter
                Zuhause,0,5,2,5
                Supermarkt,5,0,1,
                Großhandel,2,1,0,3
                Discounter,5,,3,0
                """
        prices: """
                3,4
                Artikel\\Geschaeft,Menge,Supermarkt,Großhandel,Discounter
                Äpfel 1kg,1,2.13,1.99,1.89
                Zwiebel 1kg,1,1.59,0.79,0.99
                Käse 200g,1,2.00,1.20,1.59
                Nudeln 500g,1,0.39,0.39,0.39
                """
                
    Szenario3:
        title: "Spezialfall 3: Hohe Reisekosten"
        shops:  """
                Fahrtkosten,Zuhause,Supermarkt,Großhandel,Discounter
                Zuhause,0,30,12,30
                Supermarkt,30,0,6,
                Großhandel,12,6,0,18
                Discounter,30,,18,0
                """
        prices: """
                3,4
                Artikel\\Geschaeft,Menge,Supermarkt,Großhandel,Discounter
                Äpfel 1kg,1,2.13,1.99,1.89
                Zwiebel 1kg,1,1.59,0.79,0.99
                Käse 200g,1,2.00,1.20,1.59
                Nudeln 500g,1,0.39,0.39,0.39
                """
                
    Szenario4:
        title: "Spezialfall 4: Alle Artikel werden überall angeboten"
        shops:  """
                Fahrtkosten,Zuhause,Supermarkt,Großhandel,Discounter
                Zuhause,0,1,7,5
                Supermarkt,1,0,1,1
                Großhandel,7,1,0,3
                Discounter,5,1,3,0
                """
        prices: """
                3,4
                Artikel\\Geschaeft,Menge,Supermarkt,Großhandel,Discounter
                Äpfel 1kg,1,2.13,1.99,1.89
                Zwiebel 1kg,1,1.59,0.79,0.99
                Käse 200g,1,2.00,1.20,0.59
                Nudeln 500g,1,0.39,0.39,0.39
                """

    Szenario5:
        title:  "Optimierung durch den Greedy-Algorithmus"
        desc:   """
                The purpose of this demo is to illustrate the need for step-4 of the greedy algorithm
                due to early-purchase and/or ta+aa sometimes items are bought to not-best conditions
                thus it is advised to look for better markets after the route is final
                this demo is prepared to have items that are equally expensive to allow for EP to kick in
                compare best_route(without #4) and route_two(with #4), see that route_two may be cheaper than the best_route
                """
        shops:  """
                Fahrtkosten,Startpunkt,Supermarkt,Großhandel,Spätkauf,Discounter
                Startpunkt,0,2,5,7,2
                Supermarkt,2,0,,,1
                Großhandel,5,,0,,1
                Spätkauf,7,,,0,1
                Discounter,2,1,1,1,0
                """
        prices: """
                4,6
                Artikel\\Geschaeft,Menge,Supermarkt,Großhandel,Spätkauf,Discounter
                Käse 200g,1,3.95,4.10,3.70,4.00
                Kartoffeln 1kg,1,1.99,2.00,7.99,8.40
                Kissen,1,10.1,30.2,,18.99
                Bleistife,1,,4.55,4.95,1.00
                Papier,1,,,,40.00
                Erdnüsse,1,15,13,14,11
                """

    Szenario6:
        title:  "Ein größeres Beispiel"
        desc:   "Something fancy to illustrate a bigger graph in JIT"
        shops:  """
                Fahrtkosten,Startpunkt,Discounter,Supermarkt A,Supermarkt B,Großhandel A,Großhandel B,Spätkauf A,Spätkauf B,Spätkauf C,Spätkauf D
                Startpunkt,0,1, , , , , ,1, , 
                Discounter,1,0, ,1, ,1,1, , , 
                Supermarkt A, , ,0, ,1, , ,1, , 
                Supermarkt B, ,1, ,0,1, , , , ,1
                Großhandel A, , ,1,1,0, , , ,1,1
                Großhandel B, ,1, , , ,0,1, , , 
                Spätkauf A, ,1, , , ,1,0, , , 
                Spätkauf B,1, ,1, , , , ,0, , 
                Spätkauf C, , , , ,1, , , ,0,1
                Spätkauf D, , , ,1,1, , , ,1,0
                """
        prices: """
                9,3
                Artikel\\Geschaeft,Menge,Discounter,Supermarkt A,Supermarkt B,Großhandel A,Großhandel B,Spätkauf A,Spätkauf B,Spätkauf C,Spätkauf D
                Zement,5,1,5,5,5,5,5,5,5,5
                Eis,5,5,5,5,5,5,1,5,5,5
                Hammer,5,5,1,5,5,5,5,5,5,5
                """
    Szenario7:
        title:  "Verdeutlichung der Parameter"
        desc:   "Illustration for the parameters"
        shops:  """
                Fahrtkosten,Zuhause,Großhandel A,Großhandel B,Großhandel C
                Zuhause,0,1,3,4
                Großhandel A,1,0,2,5
                Großhandel B,3,2,0,3
                Großhandel C,4,5,3,0
                """
        prices: """
                3,3
                Artikel\\Geschaeft,Menge,Großhandel A,Großhandel B,Großhandel C
                Intel Prozessor,1,5,4,3
                Desktop PC,1,5,6,7
                Notebook,1,5,1,2
                """


    Szenario8:
        title:  "Verdeutlichung der Parameter"
        desc:   "Illustration for the parameters"
        shops:  """
                Fahrtkosten,Zuhause,Großhandel A,Großhandel B,Großhandel C,Großhandel D,Großhandel E
                Zuhause,0,1,,4,5,
                Großhandel A,1,0,2,,5,8
                Großhandel B,,2,0,3,,9
                Großhandel C,4,,3,0,,
                Großhandel D,5,5,,,0,10
                Großhandel E,,8,9,,10,0
                """
        prices: """
                5,10
                Artikel\\Geschaeft,Menge,Großhandel A,Großhandel B,Großhandel C,Großhandel D,Großhandel E
                A1,1,5,4,3,6,6
                A2,1,5,6,7,8,8
                A3,1,5,1,2,5,5
                A4,1,5,5,5,5,5
                A5,1,11,12,10,13,14
                A6,1,27,,20,23,22
                A7,1,12,25,5,,
                A8,1,,,5,4,3
                A9,1,,,,40,
                A10,1,15,13,14,11,10
                """
