
  window.Shoptimize.sampleData5 = {
    shops: ["zu Hause", "Rewe", "NETTO", "Lidl", "Real", "Kaisers"],
    distances: [[0, 3, 4, 6, 1, 1], [3, 0, 2, -1, 1, 1], [4, 2, 0, 3, 1, 1], [6, -1, 3, 0, 1, 1], [1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1]],
    allDistances: [[0, 3, 4, 6, 1, 1], [3, 0, 2, -1, 1, 1], [4, 2, 0, 3, 1, 1], [6, -1, 3, 0, 1, 1], [1, 1, 1, 1, 0, 1], [1, 1, 1, 1, 1, 0]],
    articles: ["Zucker", "Brot", "Gitarre", "Atombombe", "Mikrofon", "Diamant", "MacBook", "Malzbier", "Monitor", "Frisch gepresster Orangensaft"],
    prices: [[14.95, 16.99, 11.5, 10, -1], [4.99, 4.59, 4.99, -1, -1], [-1, 12.9, 11.99, 20, 19], [5.99, 4.55, 4.95, 4.3, 4.2], [19.9, 19.95, -1, 3.2, 17], [-1, 8.19, 7.99, -1, -1], [5.99, 4.55, 4.95, -1, 9], [19.9, 19.95, -1, 10, 17], [-1, 8.19, 7.99, 10.85, 9.15], [5.99, 4.55, 4.95, -1, 4.5]],
    history: [
      {
        di: [[1, 3], [2, 5, 6, 7], [0], [4, 8], [9]],
        si: [42, 1337, 4711, 1012, 1111],
        prevLoc: 0,
        nextLoc: 2
      }, {
        di: [[1, 3], null, [0], [4, 8], [9]],
        si: [42, null, 4711, 1012, 1111],
        prevLoc: 2,
        nextLoc: 3
      }, {
        di: [[1, 3], null, null, [4, 8], [9]],
        si: [42, null, null, 1012, 1111],
        prevLoc: 3,
        nextLoc: 5
      }, {
        di: [[1, 3], null, null, [4, 8]],
        si: [42, null, null, 1012],
        prevLoc: 5,
        nextLoc: 4
      }, {
        di: [[1, 3]],
        si: [1012],
        prevLoc: 4,
        nextLoc: 1
      }
    ]
  };

  window.Shoptimize.sampleData = {
    shops: ["g1", "g2", "g3"],
    home: "g0",
    distances: [[0, 3, 4, 6], [3, 0, 2, -1], [4, 2, 0, 3], [6, -1, 3, 0]],
    allDistances: [[0, 3, 4, 6], [3, 0, 2, 5], [4, 2, 0, 3], [6, 5, 3, 0]],
    articles: ["a1", "a2", "a3", "a4", "a5", "a6"],
    quantities: [1, 1, 1, 1, 1, 1],
    prices: [[14.95, 16.99, 11.5], [4.99, 4.59, 4.99], [-1, 12.9, 11.99], [5.99, 4.55, 4.95], [19.9, 19.95, -1], [-1, 8.19, 7.99]],
    history: [
      {
        "di": [[4], [1, 3], [0, 2, 5]],
        "si": [1989, 914, 3148],
        "ei": [[], [], []],
        "ti": [1689, 514, 2548],
        "sri": [2548, 1689, 514],
        "prevLoc": 0,
        "nextLoc": 3
      }, {
        "di": [[4], [1, 3]],
        "si": [1989, 914],
        "ei": [[], []],
        "ti": [null, 714, 2648],
        "sri": [1689, 514],
        "prevLoc": 3,
        "nextLoc": 1
      }, {
        "di": [null, [1, 3]],
        "si": [null, 914],
        "ei": [null, []],
        "ti": [null, 614],
        "sri": [614],
        "prevLoc": 1,
        "nextLoc": 2
      }
    ]
  };

  window.Shoptimize.Testdata = {
    InformatiCup1: {
      title: "InformatiCup Testdatensatz 1",
      shops: "Fahrtkosten,g0,g1,g2,g3\ng0,0,3,4,6\ng1,3,0,2,\ng2,4,2,0,3\ng3,6,,3,0",
      prices: "3,6\nArtikel\\Geschaeft,Menge,g1,g2,g3\na1,1,14.95,16.99,11.50\na2,1,4.99,4.59,4.99\na3,1,,12.90,11.99\na4,1,5.99,4.55,4.95\na5,1,19.90,19.95,\na6,1,,8.19,7.99"
    },
    InformatiCup2: {
      title: "InformatiCup Testdatensatz 2",
      shops: "Fahrtkosten,g0,g1,g2,g3\ng0,0,3,4,6\ng1,3,0,2,\ng2,4,2,0,3\ng3,6,,3,0",
      prices: "3,7\nArtikel\\Geschaeft,Menge,g1,g2,g3\na1,1,14.95,16.99,11.50\na2,1,4.99,4.59,4.99\na3,1,,12.90,11.99\na4,1,5.99,4.55,4.95\na5,1,19.90,19.95,\na6,1,,8.19,7.99\na7,1,5.95,9.90,"
    },
    Szenario1: {
      title: "Spezialfall 1: Keine Reisekosten",
      shops: "Fahrtkosten,Startpunkt,Supermarkt,Großhandel,Spätkauf\nStartpunkt,0,0,0,0\nSupermarkt,0,0,,\nGroßhandel,0,,0,\nSpätkauf,0,,,0",
      prices: "3,4\nArtikel\\Geschaeft,Menge,g1,g2,g3\nEisbergsalat,1,14.95,16.99,11.50\nEis,1,4.99,4.59,4.99\nHammer,1,,12.90,11.99\nClub Mate,1,5.99,4.55,4.95"
    },
    Szenario2: {
      title: "Spezialfall 2: Wähle nur ein Geschäft aus",
      shops: "Fahrtkosten,Zuhause,Supermarkt,Großhandel,Discounter\nZuhause,0,5,2,5\nSupermarkt,5,0,1,\nGroßhandel,2,1,0,3\nDiscounter,5,,3,0",
      prices: "3,4\nArtikel\\Geschaeft,Menge,Supermarkt,Großhandel,Discounter\nÄpfel 1kg,1,2.13,1.99,1.89\nZwiebel 1kg,1,1.59,0.79,0.99\nKäse 200g,1,2.00,1.20,1.59\nNudeln 500g,1,0.39,0.39,0.39"
    },
    Szenario3: {
      title: "Spezialfall 3: Hohe Reisekosten",
      shops: "Fahrtkosten,Zuhause,Supermarkt,Großhandel,Discounter\nZuhause,0,30,12,30\nSupermarkt,30,0,6,\nGroßhandel,12,6,0,18\nDiscounter,30,,18,0",
      prices: "3,4\nArtikel\\Geschaeft,Menge,Supermarkt,Großhandel,Discounter\nÄpfel 1kg,1,2.13,1.99,1.89\nZwiebel 1kg,1,1.59,0.79,0.99\nKäse 200g,1,2.00,1.20,1.59\nNudeln 500g,1,0.39,0.39,0.39"
    },
    Szenario4: {
      title: "Spezialfall 4: Alle Artikel werden überall angeboten",
      shops: "Fahrtkosten,Zuhause,Supermarkt,Großhandel,Discounter\nZuhause,0,1,7,5\nSupermarkt,1,0,1,1\nGroßhandel,7,1,0,3\nDiscounter,5,1,3,0",
      prices: "3,4\nArtikel\\Geschaeft,Menge,Supermarkt,Großhandel,Discounter\nÄpfel 1kg,1,2.13,1.99,1.89\nZwiebel 1kg,1,1.59,0.79,0.99\nKäse 200g,1,2.00,1.20,0.59\nNudeln 500g,1,0.39,0.39,0.39"
    },
    Szenario5: {
      title: "Optimierung durch den Greedy-Algorithmus",
      desc: "The purpose of this demo is to illustrate the need for step-4 of the greedy algorithm\ndue to early-purchase and/or ta+aa sometimes items are bought to not-best conditions\nthus it is advised to look for better markets after the route is final\nthis demo is prepared to have items that are equally expensive to allow for EP to kick in\ncompare best_route(without #4) and route_two(with #4), see that route_two may be cheaper than the best_route",
      shops: "Fahrtkosten,Startpunkt,Supermarkt,Großhandel,Spätkauf,Discounter\nStartpunkt,0,2,5,7,2\nSupermarkt,2,0,,,1\nGroßhandel,5,,0,,1\nSpätkauf,7,,,0,1\nDiscounter,2,1,1,1,0",
      prices: "4,6\nArtikel\\Geschaeft,Menge,Supermarkt,Großhandel,Spätkauf,Discounter\nKäse 200g,1,3.95,4.10,3.70,4.00\nKartoffeln 1kg,1,1.99,2.00,7.99,8.40\nKissen,1,10.1,30.2,,18.99\nBleistife,1,,4.55,4.95,1.00\nPapier,1,,,,40.00\nErdnüsse,1,15,13,14,11"
    },
    Szenario6: {
      title: "Ein größeres Beispiel",
      desc: "Something fancy to illustrate a bigger graph in JIT",
      shops: "Fahrtkosten,Startpunkt,Discounter,Supermarkt A,Supermarkt B,Großhandel A,Großhandel B,Spätkauf A,Spätkauf B,Spätkauf C,Spätkauf D\nStartpunkt,0,1, , , , , ,1, , \nDiscounter,1,0, ,1, ,1,1, , , \nSupermarkt A, , ,0, ,1, , ,1, , \nSupermarkt B, ,1, ,0,1, , , , ,1\nGroßhandel A, , ,1,1,0, , , ,1,1\nGroßhandel B, ,1, , , ,0,1, , , \nSpätkauf A, ,1, , , ,1,0, , , \nSpätkauf B,1, ,1, , , , ,0, , \nSpätkauf C, , , , ,1, , , ,0,1\nSpätkauf D, , , ,1,1, , , ,1,0",
      prices: "9,3\nArtikel\\Geschaeft,Menge,Discounter,Supermarkt A,Supermarkt B,Großhandel A,Großhandel B,Spätkauf A,Spätkauf B,Spätkauf C,Spätkauf D\nZement,5,1,5,5,5,5,5,5,5,5\nEis,5,5,5,5,5,5,1,5,5,5\nHammer,5,5,1,5,5,5,5,5,5,5"
    },
    Szenario7: {
      title: "Verdeutlichung der Parameter",
      desc: "Illustration for the parameters",
      shops: "Fahrtkosten,Zuhause,Großhandel A,Großhandel B,Großhandel C\nZuhause,0,1,3,4\nGroßhandel A,1,0,2,5\nGroßhandel B,3,2,0,3\nGroßhandel C,4,5,3,0",
      prices: "3,3\nArtikel\\Geschaeft,Menge,Großhandel A,Großhandel B,Großhandel C\nIntel Prozessor,1,5,4,3\nDesktop PC,1,5,6,7\nNotebook,1,5,1,2"
    },
    Szenario8: {
      title: "Verdeutlichung der Parameter",
      desc: "Illustration for the parameters",
      shops: "Fahrtkosten,Zuhause,Großhandel A,Großhandel B,Großhandel C,Großhandel D,Großhandel E\nZuhause,0,1,,4,5,\nGroßhandel A,1,0,2,,5,8\nGroßhandel B,,2,0,3,,9\nGroßhandel C,4,,3,0,,\nGroßhandel D,5,5,,,0,10\nGroßhandel E,,8,9,,10,0",
      prices: "5,10\nArtikel\\Geschaeft,Menge,Großhandel A,Großhandel B,Großhandel C,Großhandel D,Großhandel E\nA1,1,5,4,3,6,6\nA2,1,5,6,7,8,8\nA3,1,5,1,2,5,5\nA4,1,5,5,5,5,5\nA5,1,11,12,10,13,14\nA6,1,27,,20,23,22\nA7,1,12,25,5,,\nA8,1,,,5,4,3\nA9,1,,,,40,\nA10,1,15,13,14,11,10"
    }
  };
