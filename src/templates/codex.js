import React from 'react'
import Codex from '../components/codex'

export default ({ pathContext, ...pageProps }) => (
  <Codex topics={pathContext.topics} {...pageProps} />
)
