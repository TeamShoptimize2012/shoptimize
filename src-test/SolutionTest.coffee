log = (msg) ->
	jstestdriver.console.log msg

tests = {

	testSolution: ->

		articles = [ "Banana", "Butter", "Bread"  ]
		shops = ["Kaisers", "Rewe"]

		# prices[0] = article Banana
		# prices[1] = article Butter
		# prices[2] = article Bread 
		prices = [ [1.20, -1], [-1, 1.49], [2.30, 2.70] ]
		distances = [

	       	[0,1,2],
			[1,0,3],
			[2,3,0]
		]

		route = [

			 [1,1,0,1],
			 [2,0,1,0]
		]


		solution = new OptimalSolution(articles, shops, prices, distances)
		result = solution.solve()
		log result.min
		log result.route
}


ParserTest = TestCase("SolutionTest", tests)
