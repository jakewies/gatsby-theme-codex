import React from 'react'
import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import Entry from '../components/entry'

export const pageQuery = graphql`
  query($id: String!) {
    entry: mdx(id: { eq: $id }) {
      body
    }
  }
`

export default ({ pageContext, data }) => {
  const { body } = data.entry

  return (
    <Entry {...pageContext}>
      <MDXRenderer>{body}</MDXRenderer>
    </Entry>
  )
}
