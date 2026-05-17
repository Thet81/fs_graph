// schema.js
const typeDefs = `
  type Book {
    title : String
    author : Author
    published : Int
    genres : [String]
  }

  type Author {
    name : String
    id : String
    born : Int
  }

  type Query {
    bookCount: Int
    authorCount : Int
    allBooks (author : String, genres : String) : [Book]
    allAuthors : [Author]
  }

  type Mutation {
    addBook(
      title : String
      author : String
      published : Int
      genres : [String]
    ) : Book
    editAuthor (name : String, setBornTo : Int) : Author
    createAuthor (
		name : String
		born : Int
    ) : Author
  }
`

module.exports = typeDefs