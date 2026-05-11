import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import {useQuery} from '@apollo/client/react'
import {gql} from '@apollo/client'
import {ALL_AUTHORS,ALL_BOOKS} from './queries'

const App = () => {
  const [page, setPage] = useState('authors')

  const allAuthorResult = useQuery(ALL_AUTHORS)
  const allBooksResult = useQuery(ALL_BOOKS)
  console.log('result is ', allBooksResult);
  if(allAuthorResult.loading || allBooksResult.loading){
    return (
      <div>
        loading...
      </div>
    )
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      <Authors show={page === 'authors'} authors={allAuthorResult.data.allAuthors}/>

      <Books show={page === 'books'} books={allBooksResult.data.allBooks}/>

      <NewBook show={page === 'add'} />
    </div>
  )
}

export default App
