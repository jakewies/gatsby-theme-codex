import React from 'react'
import { Link } from 'gatsby'

function Codex({ topics }) {
  return (
    <>
      <header>
        <h2>Codex</h2>
      </header>
      <ul>
        {topics.map(({ name, url, lastUpdated, description, entryCount }) => (
          <li key={name}>
            <Link to={url}>{name}</Link>
            {description && <p>{description}</p>}
            <p>Entries: {entryCount}</p>
            <p>last updated {lastUpdated}</p>
          </li>
        ))}
      </ul>
    </>
  )
}

export default Codex
