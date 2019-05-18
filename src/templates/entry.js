import React from 'react'
import { graphql } from 'gatsby'
import MDXRenderer from 'gatsby-mdx/mdx-renderer'
import Entry from '../components/entry'

export const pageQuery = graphql`
  query($id: String!) {
    entry: mdx(id: { eq: $id }) {
      code {
        body
      }
    }
  }
`

export default ({ pageContext, data }) => {
  const { code } = data.entry

  return (
    <Entry {...pageContext}>
      <MDXRenderer>{code.body}</MDXRenderer>
    </Entry>
  )
}
