const path = require('path')

const Codex = require.resolve('./src/templates/codex')
const Topic = require.resolve('./src/templates/topic')
const Entry = require.resolve('./src/templates/entry')

exports.createPages = async ({ graphql, actions }, pluginOptions) => {
  const { createPage } = actions
  const { urlPrefix = '/codex' } = pluginOptions
  const metaKey = '_meta'

  const getTopic = node => path.parse(node.parent.relativePath).dir

  const createUrl = node => {
    const topic = getTopic(node)
    return path.join(urlPrefix, topic, node.parent.name)
  }

  // codexData.edges.node.frontmatter is kind of a hack right now.
  // only _meta.md files support the description frontmatter. entry files
  // don't. Using frontmatter for topic metadata in a :topic/_meta.md file
  // was the only solution i could come up with that seems elegant enough
  // for the end user. There is probably a better way. BUT, this solution
  // is scalable in case I want to support more metadata in the future.
  const result = await graphql(`
    {
      codex: allMdx {
        edges {
          node {
            id
            wordCount {
              words
            }
            frontmatter {
              title
              description
            }
            parent {
              ... on File {
                name
                relativePath
                relativeDirectory
                sourceInstanceName
                mtimeMs
                modifiedTime(fromNow: true)
                birthTime(formatString: "MMM DD YYYY")
              }
            }
          }
        }
      }
    }
  `)

  if (result.errors) {
    console.log(result.errors)
    throw new Error(`Could not query your codex`, result.errors)
  }

  const codex = result.data.codex.edges
    .filter(({ node }) => node.parent.sourceInstanceName === 'codex')
    .reduce((acc, { node }) => {
      const topic = getTopic(node)

      // at this point, any entry that isn't in a topic will not be added
      // to the map, meaning it won't have a generated page. This is something
      // that should be supported, i.e., entries with no topic.
      if (!topic) {
        return acc
      }

      acc[topic] = acc[topic] || {}
      acc[topic].entries = acc[topic].entries || []
      acc[topic].lastModified = acc[topic].lastModified || {
        inMs: null,
        formatted: null
      }

      if (node.parent.name === metaKey) {
        // this suffers from the problem that if 2 _meta files exist
        // in a topic, the last one will be used. Probably need to address this.
        if (node.frontmatter) {
          acc[topic].description = node.frontmatter.description
        }

        return acc
      }

      // TOPIC LAST MODIFIED
      const modifiedInMs = node.parent.mtimeMs
      const modifiedFormatted = node.parent.modifiedTime

      // compares current val of acc.topic.lastModified (could be nothing) to the entries modified time
      // and takes the bigger value
      acc[topic].lastModified =
        acc[topic].lastModified.inMs > modifiedInMs
          ? acc[topic].lastModified
          : { inMs: modifiedInMs, formatted: modifiedFormatted }

      // TOPIC ENTRIES
      acc[topic].entries.push({
        id: node.id,
        url: createUrl(node),
        ...node
      })

      return acc
    }, {})

  // only operate on topics that have entries
  const topicStore = Object.entries(codex).filter(
    ([topicName, { entries }]) => entries.length > 0
  )

  topicStore.forEach(
    ([topicName, { description: topicDescription, entries, lastModified }]) => {
      const topicUrl = path.join(urlPrefix, topicName)
      const capitalizedTopicName = capitalize(topicName)
      // Create index page for each Topic
      createPage({
        path: topicUrl,
        context: {
          name: capitalizedTopicName,
          description: topicDescription,
          entries: entries.map(
            ({ id, frontmatter, parent, url, wordCount }) => ({
              id,
              title: frontmatter.title,
              updatedAt: parent.modifiedTime,
              url,
              wordCount: wordCount.words
            })
          )
        },
        component: Topic
      })

      // Create page for each entry
      entries.forEach(entry => {
        createPage({
          path: entry.url,
          context: {
            id: entry.id,
            title: entry.frontmatter.title,
            created: entry.parent.birthTime,
            updated: entry.parent.modifiedTime,
            topic: {
              name: capitalizedTopicName,
              url: topicUrl
            }
          },
          component: Entry
        })
      })
    }
  )

  // Create index page for entire Codex
  createPage({
    path: urlPrefix,
    context: {
      topics: topicStore.map(
        ([topicName, { description, entries, lastModified }]) => ({
          name: capitalize(topicName),
          description,
          url: path.join(urlPrefix, topicName),
          entryCount: entries.length,
          lastUpdated: lastModified
        })
      )
    },
    component: Codex
  })
}

const capitalize = name => name.charAt(0).toUpperCase() + name.slice(1)
