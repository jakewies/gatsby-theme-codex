import React from 'react'
import Topic from '../components/topic'

export default ({ pageContext, ...pageProps }) => {
  return <Topic {...pageContext} {...pageProps} />
}
