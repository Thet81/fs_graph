// resolvers.js

const GraphQLError = require("graphql")
const Author = require('./models/author')
const Book = require('./models/book')

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
    allBooks : async (root, args)=> {
     	return Book.find({})
    },
    allAuthors : async ()=>{
    	return Author.find({})
    } 
  },
  Mutation : {
    addBook : async (root, args)=> {
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
      const authorOfTheBook = Author.findOne({name : args.author})
      book.author = authorOfTheBook._id;
      return book.save()
    },
    editAuthor : (root, args)=> {
      const {name, setBornTo} = args;
      const authorToUpdate = authors.find(author => author.name === name)

      if (!authorToUpdate){
        return null
      }
      const updatedAuthor = {name, born : setBornTo}
      authors = authors.map(author => author.name === name ? updatedAuthor : author)
      return updatedAuthor
    },
    createAuthor : async (root, args)=> {
    	const author = new Author({...args})
    	return author.save()
    }
  }
}

module.exports = resolvers;