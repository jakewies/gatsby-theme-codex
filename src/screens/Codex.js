import React from 'react'
import { Link } from 'gatsby'

function Codex({ topics }) {
  return (
    <>
      <header>
        <h2>Codex</h2>
      </header>
      <ul>
        {topics.map(({ name, url, lastUpdated, entryCount }) => (
          <li key={name}>
            <Link to={url}>{name}</Link>
            <p>Entries: {entryCount}</p>
            <p>last updated {lastUpdated}</p>
          </li>
        ))}
      </ul>
    </>
  )
}

export default Codex
