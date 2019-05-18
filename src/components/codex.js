import React from 'react'
import { Link } from 'gatsby'

function Codex({ topics }) {
  return (
    <>
      <header>
        <h2>Codex</h2>
      </header>
      <ul>
        {topics.map(({ name, url, entryCount }) => (
          <li key={name}>
            <Link to={url}>{name}</Link>
            <p>Entries: {entryCount}</p>
          </li>
        ))}
      </ul>
    </>
  )
}

export default Codex
