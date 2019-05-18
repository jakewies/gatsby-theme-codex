module.exports = options => {
  // gatsby-theme-codex optionally accepts a `src` option
  // in the site config. If it is not passed in, it will look for
  // entries in /codex (outside of src)
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
