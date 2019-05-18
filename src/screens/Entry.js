import React from 'react'

function Entry({ title, children }) {
  return (
    <>
      <h1>{title}</h1>
      {children}
    </>
  )
}

export default Entry
