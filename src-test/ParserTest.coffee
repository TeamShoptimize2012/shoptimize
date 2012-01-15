tests = {

	testParsePricesCSV: ->

		strPrices =
			"3,6\r\n" +
			"Artikel\\Geschaeft,Menge,g1,g2,g3\r\n" +
			"a1,1,14.95,16.99,11.50\r\n" +
			"a2,1,4.99,4.59,4.99\r\n" +
			"a3,1,,12.90,11.99\r\n" +
			"a4,1,5.99,4.55,4.95\r\n" +
			"a5,1,19.90,19.95,\r\n" +
			"a6,1,,8.19,7.99"

		result = parsePricesCSV(strPrices)

		assertSame("Number of articles", 6, result.articles.length)
		assertSame("Article #1", "a1", result.articles[0])
		assertSame("Article #2", "a2", result.articles[1])
		assertSame("Article #3", "a3", result.articles[2])
		assertSame("Article #4", "a4", result.articles[3])
		assertSame("Article #5", "a5", result.articles[4])
		assertSame("Article #6", "a6", result.articles[5])

		assertSame("Number of shops", 3, result.shops.length)
		assertSame("Shop #1", "g1", result.shops[0])
		assertSame("Shop #2", "g2", result.shops[1])
		assertSame("Shop #3", "g3", result.shops[2])

		assertSame("Article #1 at Shop #1", 14.95, result.matrix[0][0])
		assertSame("Article #2 at Shop #1",  4.99, result.matrix[1][0])
		assertSame("Article #3 at Shop #1", -1   , result.matrix[2][0])
		assertSame("Article #4 at Shop #1",  5.99, result.matrix[3][0])
		assertSame("Article #5 at Shop #1", 19.90, result.matrix[4][0])
		assertSame("Article #6 at Shop #1", -1   , result.matrix[5][0])

		assertSame("Article #1 at Shop #2", 16.99, result.matrix[0][1])
		assertSame("Article #2 at Shop #2",  4.59, result.matrix[1][1])
		assertSame("Article #3 at Shop #2", 12.90, result.matrix[2][1])
		assertSame("Article #4 at Shop #2",  4.55, result.matrix[3][1])
		assertSame("Article #5 at Shop #2", 19.95, result.matrix[4][1])
		assertSame("Article #6 at Shop #2",  8.19, result.matrix[5][1])

		assertSame("Article #1 at Shop #3", 11.50, result.matrix[0][2])
		assertSame("Article #2 at Shop #3",  4.99, result.matrix[1][2])
		assertSame("Article #3 at Shop #3", 11.99, result.matrix[2][2])
		assertSame("Article #4 at Shop #3",  4.95, result.matrix[3][2])
		assertSame("Article #5 at Shop #3", -1   , result.matrix[4][2])
		assertSame("Article #6 at Shop #3", 7.99 , result.matrix[5][2])

	testParseDistancesCSV: ->

		strDistances =
			"Fahrtkosten,g0,g1,g2,g3\r\n" +
			"g0,0,3,4,6\r\n" +
			"g1,3,0,2,\r\n" +
			"g2,4,2,0,3\r\n" +
			"g3,6,,3,0"

		result = parseDistancesCSV strDistances

		assertSame("Number of locations", 4, result.shops.length)
		assertSame("Home",    "g0", result.shops[0])
		assertSame("Shop #1", "g1", result.shops[1])
		assertSame("Shop #2", "g2", result.shops[2])
		assertSame("Shop #3", "g3", result.shops[3])

		assertSame("Distance from Home to Home",        0, result.matrix[0][0])
		assertSame("Distance from Home to Shop #1",     3, result.matrix[0][1])
		assertSame("Distance from Home to Shop #2",     4, result.matrix[0][2])
		assertSame("Distance from Home to Shop #3",     6, result.matrix[0][3])

		assertSame("Distance from Shop #1 to Home",     3, result.matrix[1][0])
		assertSame("Distance from Shop #1 to Shop #1",  0, result.matrix[1][1])
		assertSame("Distance from Shop #1 to Shop #2",  2, result.matrix[1][2])
		assertSame("Distance from Shop #1 to Shop #3", -1, result.matrix[1][3])

		assertSame("Distance from Shop #2 to Home",     4, result.matrix[2][0])
		assertSame("Distance from Shop #2 to Shop #1",  2, result.matrix[2][1])
		assertSame("Distance from Shop #2 to Shop #2",  0, result.matrix[2][2])
		assertSame("Distance from Shop #2 to Shop #3",  3, result.matrix[2][3])

		assertSame("Distance from Shop #3 to Home",     6, result.matrix[3][0])
		assertSame("Distance from Shop #3 to Shop #1", -1, result.matrix[3][1])
		assertSame("Distance from Shop #3 to Shop #2",  3, result.matrix[3][2])
		assertSame("Distance from Shop #3 to Shop #3",  0, result.matrix[3][3])
}


ParserTest = TestCase("Test parser.coffee", tests)


