const path = require('path')

const Codex = require.resolve('./src/templates/codex')
const Topic = require.resolve('./src/templates/topic')
const Entry = require.resolve('./src/templates/entry')

exports.createPages = async ({ graphql, actions }, pluginOptions) => {
  const { createPage } = actions
  const { codexPath = '/codex' } = pluginOptions

  const getTopic = node => path.parse(node.parent.relativePath).dir

  const createUrl = node => {
    const topic = getTopic(node)
    return path.join(codexPath, topic, node.parent.name)
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
      acc[topic].entries.push({
        url: createUrl(node),
        ...node
      })

      return acc
    }, {})

  const topicStore = Object.entries(codex).filter(
    ([topicName, { entries }]) => entries.length > 0
  )

  topicStore.forEach(([topicName, { entries }]) => {
    const topicUrl = path.join(codexPath, topicName)
    const capitalizedTopicName = capitalize(topicName)

    createPage({
      path: topicUrl,
      context: {
        name: capitalizedTopicName,
        entries: entries.map(({ parent, url }) => ({
          name: parent.name,
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
          name: entry.parent.name,
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
    path: codexPath,
    context: {
      topics: topicStore.map(([topicName, { entries }]) => ({
        name: capitalize(topicName),
        url: path.join(codexPath, topicName),
        entryCount: entries.length
      }))
    },
    component: Codex
  })
}

const capitalize = name => name.charAt(0).toUpperCase() + name.slice(1)
