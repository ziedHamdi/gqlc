const GraphQlSchema = require('../gqlc').default

const graphqlHTTP = require('express-graphql');

function formatError(error) {
	console.log("graphQl error : ", error.message)
	console.log("graphQl error stack: ", error.stack)
	return {
		message: error.message,
		locations: error.locations,
		stack: error.stack ? error.stack.split('\n') : [],
		path: error.path,
		zied: "oui"
	}
}

function addGraphqlRoute(app, url) {
	app.use(url ? url : '/graphql', function (err, req, res, next) {
		if (err.code === 'invalid_token') return next();
		return next(err);
	}, graphqlHTTP((req, res, graphQLParams) => {
		// console.log('trying if request is authorized (user:', req.user)
		return {
			schema: GraphQlSchema,
			graphiql: true,
			formatError,
			context: {
				user: req.user,
				sessionID: req.sessionID
			}
		}
	}))
}

export {addGraphqlRoute}