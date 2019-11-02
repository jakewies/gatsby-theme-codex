module.exports = options => {
  const { src = 'codex' } = options

  return {
    plugins: [
      {
        resolve: 'gatsby-source-filesystem',
        options: {
          name: 'codex',
          path: src
        }
      },
      {
        resolve: 'gatsby-plugin-mdx',
        options: {
          extensions: ['.mdx', '.md']
        }
      }
    ]
  }
}
