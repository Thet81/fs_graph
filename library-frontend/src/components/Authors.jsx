import {useState} from 'react'
import {useMutation} from '@apollo/client/react'
import {UPDATE_AUTHOR, ALL_AUTHORS} from '../queries'

const Authors = (props) => {

  const [name, setName] = useState("")
  const [born, setBorn] = useState("");
  const [choice, setChoice] = useState("")
  const [editAuthor] = useMutation(UPDATE_AUTHOR,{
    refetchQueries : [{query : ALL_AUTHORS}]
  })

  if (!props.show) {
    return null
  }
  const authors = props.authors

  const handleSubmit = (e)=> {
    e.preventDefault()
    console.log(name,born)
    console.log("choice is", choice)
    editAuthor({variables : {name : choice, setBornTo : parseInt(born) }})
    setName('')
    setBorn('')
  }
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <h2>Set birthyear</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
            name 
         {/* <select value={choice} onChange={(e) => setChoice(e.target.value)}>
            <option value="apple">Apple</option>
            <option value="banana">Banana</option>
            <option value="orange">Orange</option>
          </select>*/}
          <select value={choice} onChange={(e) => setChoice(e.target.value)}>
             <option value="" disabled>Select an author</option>
            {
              authors.map(author=> (
                <option key={author.id} value={author.name}>{author.name}</option>
              ))
            }
          </select>
          </label>
          </div>
           <div>
            <label>
            born 
            <input 
              value ={born}
              onChange={({target})=> setBorn(target.value)}
            />
          </label>
          </div>
          <div>
            <button type="submit">update author</button>
          </div>
        </form>
      </div>

    </div>
  )
}

export default Authors
