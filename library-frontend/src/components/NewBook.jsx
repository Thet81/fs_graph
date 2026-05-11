import { useState } from 'react'
import {useMutation} from '@apollo/client/react'
import {ADD_BOOK, ALL_BOOKS} from '../queries'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [createBook] = useMutation(ADD_BOOK,{
    refetchQueries : [{query : ALL_BOOKS}]
  });

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    if(!title || !author || !published || !genres){
      alert("You must specify all fields")
      return;
    }
    console.log('add book...')
    createBook({variables : {title, author, published : parseInt(published), genres}})

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
         <label>
           title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
         </label>
        </div>
        <div>
          <label>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
          </label>
        </div>
        <div>
         <label>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
         </label>
        </div>
        <div>
         <label>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
         </label>
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook
