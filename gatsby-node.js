const path = require('path')

const Codex = require.resolve('./src/templates/codex')
const Topic = require.resolve('./src/templates/topic')
const Entry = require.resolve('./src/templates/entry')

exports.createPages = async ({ graphql, actions }, pluginOptions) => {
  const { createPage } = actions
  const { urlPrefix = '/codex' } = pluginOptions

  const getTopic = node => path.parse(node.parent.relativePath).dir

  const createUrl = node => {
    const topic = getTopic(node)
    return path.join(urlPrefix, topic, node.parent.name)
  }

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

  topicStore.forEach(([topicName, { entries, lastModified }]) => {
    const topicUrl = path.join(urlPrefix, topicName)
    const capitalizedTopicName = capitalize(topicName)
    // Create index page for each Topic
    createPage({
      path: topicUrl,
      context: {
        name: capitalizedTopicName,
        entries: entries.map(({ id, frontmatter, parent, url, wordCount }) => ({
          id,
          title: frontmatter.title,
          updatedAt: parent.modifiedTime,
          url,
          wordCount: wordCount.words
        }))
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
  })

  // Create index page for entire Codex
  createPage({
    path: urlPrefix,
    context: {
      topics: topicStore.map(([topicName, { entries, lastModified }]) => ({
        name: capitalize(topicName),
        url: path.join(urlPrefix, topicName),
        entryCount: entries.length,
        lastUpdated: lastModified
      }))
    },
    component: Codex
  })
}

const capitalize = name => name.charAt(0).toUpperCase() + name.slice(1)
