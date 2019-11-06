/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Link } from 'gatsby'

function Codex({ topics }) {
  return (
    <>
      <header
        sx={{
          // this uses the value from `theme.space[4]`
          padding: 4,
          // these use values from `theme.colors`
          color: 'background',
          backgroundColor: 'primary'
        }}
      >
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
