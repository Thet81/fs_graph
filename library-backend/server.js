const { ApolloServer } = require("@apollo/server")
const { startStandaloneServer } = require("@apollo/server/standalone")
const resolvers = require('./resolvers')
const typeDefs = require('./schema')


const startServer = (port)=> {
	const server = new ApolloServer({
		resolvers,
		typeDefs
	})

	startStandaloneServer(server,{
		listen : {port},
	}).then(({url})=> {
		console.log(`Server is ready at ${url}`)
	})
} 

module.exports = startServer