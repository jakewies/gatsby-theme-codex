module.exports = options => {
  const { src = 'codex' } = options

  return {
    plugins: [
      {
        resolve: 'gatsby-mdx',
        options: {
          extensions: ['.md', '.mdx']
        }
      },
      {
        resolve: 'gatsby-source-filesystem',
        options: {
          name: 'codex',
          path: src
        }
      }
    ]
  }
}
