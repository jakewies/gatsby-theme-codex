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

      if (!topic) {
        return acc
      }

      acc[topic] = acc[topic] || {}
      acc[topic].entries = acc[topic].entries || []
      acc[topic].lastModified = acc[topic].lastModified || {
        inMs: null,
        formatted: null
      }

      const modifiedInMs = node.parent.mtimeMs
      const modifiedFormatted = node.parent.modifiedTime

      acc[topic].lastModified =
        acc[topic].lastModified.inMs > modifiedInMs
          ? acc[topic].lastModified
          : { inMs: modifiedInMs, formatted: modifiedFormatted }

      acc[topic].entries.push({
        id: node.id,
        url: createUrl(node),
        ...node
      })

      return acc
    }, {})

  const topicStore = Object.entries(codex).filter(
    ([topicName, { entries }]) => entries.length > 0
  )

  topicStore.forEach(([topicName, { entries, lastModified }]) => {
    const topicUrl = path.join(urlPrefix, topicName)
    const capitalizedTopicName = capitalize(topicName)

    createPage({
      path: topicUrl,
      context: {
        name: capitalizedTopicName,
        entries: entries.map(({ id, parent, url }) => ({
          id,
          title: parent.name,
          updatedAt: parent.modifiedTime,
          url
        }))
      },
      component: Topic
    })

    entries.forEach(entry => {
      createPage({
        path: entry.url,
        context: {
          id: entry.id,
          title: entry.parent.name,
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
