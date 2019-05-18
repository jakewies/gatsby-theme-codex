import React from 'react'
import { Link } from 'gatsby'

function Topic({ name, description, entries }) {
  return (
    <>
      <header>
        <h2>{name}</h2>
        {description && <p>{description}</p>}
      </header>
      <ul>
        {entries.map(entry => (
          <li key={entry.name}>
            <Link to={entry.url}>/{entry.name}.md</Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export default Topic
