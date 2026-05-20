const { ApolloServer } = require("@apollo/server")
const { startStandaloneServer } = require("@apollo/server/standalone")
const resolvers = require('./resolvers')
const typeDefs = require('./schema')
const jwt = require('jsonwebtoken')
const User = require('./models/user')
const getUserFromHeader = async (auth)=> {
	if(!auth || !auth.startsWith(`Bearer `)){
		return null
	}
	
	try {
		const token = auth.substring(7)
		const decodedToken = jwt.verify(token,process.env.JWT_SECRET)
		console.log(decodedToken.id)
		return await User.findById(decodedToken.id)
	}catch(e){
		console.log('JWT verification failed : ', e.message)
		return null;
	}
}

const startServer = (port)=> {
	const server = new ApolloServer({
		resolvers,
		typeDefs
	})

	startStandaloneServer(server,{
		listen : {port},
		context : async ({req})=> {
			const auth = req.headers.authorization
			const currentUser = await getUserFromHeader(auth)
			return {currentUser}
		}
	}).then(({url})=> {
		console.log(`Server is ready at ${url}`)
	})
} 

module.exports = startServer