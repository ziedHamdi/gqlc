import {addGraphqlRoute} from "./src/middleware/graphqlSetupVisitor";

const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV && process.env.NODE_ENV.trim() !== 'production';
console.log("running server in ", dev ? "developement" : "production", " mode")

const app = next({ dev });
const handle = app.getRequestHandler();
const session = require('express-session')



app
		.prepare()
		.then(() => {
			const server = express();

			addGraphqlRoute(server, '/graphql')

			server.use(session({
				secret: 'weAlly the citizens',
				resave: false,
				saveUninitialized: false,
				cookie: {secure: true}
			}))
			server.get('*', (req, res) => {
				console.log( "***************** handling request ", req.url)
				return handle(req, res);
			});

			server.listen(3000, err => {
				if (err) throw err;
				console.log('> Ready on http://localhost:3000');
			});
		})
		.catch(ex => {
			console.error(ex.stack);
			process.exit(1);
		});