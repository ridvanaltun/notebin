import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import ReactMarkdown from 'react-markdown'
import axios from 'axios'

// Custom Components
import { Blank } from '../../components'

// Redux
import { useDispatch } from 'react-redux'
import { setTitle } from '../../store/actions/appAction'

const MarkdownPreview = ({ content }) => {
  const dispatch = useDispatch()

  // Change App Title
  useEffect(() => {
    dispatch(setTitle('Markdown Preview'))
  }, [])

  if (content) {
    return <ReactMarkdown source={content} />
  }

  return <Blank />
}

MarkdownPreview.getInitialProps = async (ctx) => {
  const { path } = ctx.query
  const res = await axios.get('https://api.github.com/repos/vercel/next.js')
  const data = await res.data
  return { stars: data.stargazers_count }
}

MarkdownPreview.propTypes = {
  content: PropTypes.object
}

export default MarkdownPreview
