// schema.js
const typeDefs = `
  type User {
    username : String
    favoriteGenre : String
    id : ID!
  }

  type Token {
    value : String!
  }

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
    me : User
    allUsers : [User]
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
    createUser(
      username : String!
      favoriteGenre : String!
    ): User
    login(
      username : String!
      password : String!
    ) : Token
  }
`

module.exports = typeDefs