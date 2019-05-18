import React from 'react'
import { Link } from 'gatsby'

function Topic({ name, entries }) {
  return (
    <>
      <header>
        <h2>{name}</h2>
      </header>
      <ul>
        {entries.map(entry => (
          <li key={entry.title}>
            <Link to={entry.url}>/{entry.title}.md</Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export default Topic
