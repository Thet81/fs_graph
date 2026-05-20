// resolvers.js

const {GraphQLError} = require("graphql")
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const jwt = require('jsonwebtoken')

let authors = [
  {
    name: "Robert Martin",
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: "Martin Fowler",
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963,
  },
  {
    name: "Fyodor Dostoevsky",
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821,
  },
  {
    name: "Joshua Kerievsky", // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  {
    name: "Sandi Metz", // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

let books = [
  {
    title: "Clean Code",
    published: 2008,
    author: "Robert Martin",
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Agile software development",
    published: 2002,
    author: "Robert Martin",
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ["agile", "patterns", "design"],
  },
  {
    title: "Refactoring, edition 2",
    published: 2018,
    author: "Martin Fowler",
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Refactoring to patterns",
    published: 2008,
    author: "Joshua Kerievsky",
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "patterns"],
  },
  {
    title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
    published: 2012,
    author: "Sandi Metz",
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "design"],
  },
  {
    title: "Crime and punishment",
    published: 1866,
    author: "Fyodor Dostoevsky",
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "crime"],
  },
  {
    title: "Demons",
    published: 1872,
    author: "Fyodor Dostoevsky",
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "revolution"],
  },
]

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount : async ()=> Author.collection.countDocuments(),
    // allBooks resolver accept both author and genre as optional parameter
    allBooks : async (root, args)=> {
      console.log("args inside allBooks are ", args);
      const query = {}
      if(args.author){  
        const author = await Author.findOne({name : args.author})
        if(!author){
          return []
        }
        query.author = author._id
      }

      if(args.genres){
       query.genres = args.genres
      }
     	return Book.find(query).populate('author')
    },
    allAuthors : async ()=>{
    	return Author.find({})
    },
    allUsers : async ()=> {
      const user =  await User.find({})
      console.log(user)
      return user
    },
    me :  (root,args,context)=>{
      return context.currentUser
    } 
  },
  Mutation : {
    addBook : async (root, args, context)=> {
    const currentUser = context.currentUser;

    if(!currentUser){
      throw new GraphQLError('not authenticated',{
        extensions : {
          code : 'UNAUTHENTICATED'
        }
      })
    }
    const {title,author,published,genres} = args
      const bookExists = await Book.exists({title})
      if(bookExists){
      	throw new GraphQLError(`Book title must be unique : ${args.title}`,{
      		extensions : {
      			code : 'BAD_USER_INPUT',
      			invalidArgs : args.title
      		}
      	})
      }
      const book = new Book({
      	title,
      	published,
      	genres
      })
      const authorOfTheBook = await Author.findOne({name : author})
      console.log(authorOfTheBook)
      console.log("the id of author of the book is ",authorOfTheBook._id)
      book.author = authorOfTheBook._id;
      try {
        await book.save()
      }catch (error){
        throw new GraphQLError(`Saving the book failed ${error}`, {
          extensions : {
            code : 'BAD_USER_INPUT',
            invalidArgs : args.title,
            error
          }
        })
      }
      return book
    },
    editAuthor : async (root, args, context)=> {
      const author = await Author.findOne({name : args.name})
      const currentUser = context.currentUser;

      if(!currentUser){
        throw new GraphQLError("not authenticated",{
          extensions : {
            code : "UNAUTHENTICATED"
          }
        })
      }
      if(!args.setBornTo){
          throw new GraphQLError(`Book title must be unique : ${args.title}`,{
          extensions : {
            code : 'BAD_USER_INPUT',
            invalidArgs : args.title
          }
        })
      }
      author.born = args.setBornTo
      return author.save();
    },
    createAuthor : async (root, args)=> {
    	const author = new Author({...args})
    	
      try {
        await author.save()
      }catch(error){
        throw new GraphQLError(`Saving the author failed : ${error}`,{
          extensions : {
            code : 'BAD_USER_INPUT',
            invalidArgs : args.name,
            error
          }
        })
      }
      return author
    },
    createUser : async (root, args)=> {
      const user = new User({...args})
      try {
        await user.save()
      }catch(error){
        throw new GraphQLError(`Saving the user failed ${error}`, {
          extensions : {
            code : 'BAD_USER_INPUT',
            invalidArgs : args.username,
            error
          }
        })
      }
      return user
    },
    login : async (root,args)=> {
      const user = await User.findOne({username : args.username})
      console.log('user is ',user)
      //for now I am assuming that all user have the same password called secret
      if(!user || args.password !== 'secret'){
        throw new GraphQLError(`Wrong Credentials`, {
          extensions : {
            code : 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = {
        username : user.username,
        id : user._id
      }

      return {value : jwt.sign(userForToken,process.env.JWT_SECRET)}
    }
  }
}

module.exports = resolvers;