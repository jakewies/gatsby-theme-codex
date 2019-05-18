import React from 'react'

function Entry({ name, children }) {
  return (
    <>
      <h1>{name}</h1>
      {children}
    </>
  )
}

export default Entry
