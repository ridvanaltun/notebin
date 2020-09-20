import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

// Components
import SyntaxHighlighter from 'react-syntax-highlighter'
import Box from '@material-ui/core/Box'

// Custom Components
import { Blank, CodePreviewToolbar, PasswordHandling } from '../../components'

// Redux
import { useDispatch } from 'react-redux'
import { setTitle } from '../../store/actions/appAction'

// Utils
import { useRouter } from 'next/router'
import { apiClient, useCookie } from '../../utils'

const CodePreview = ({ path, noteInfo, hasPassword, defaultLanguage }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  // States
  const [language, setLanguage] = useState(defaultLanguage)
  const [note, setNote] = useState(noteInfo)
  const [handlingPassword, setHandlingPassword] = useState(hasPassword)
  const [passwordCookie] = useCookie(`notes-${path}`, false)

  // Change App Title
  useEffect(() => { dispatch(setTitle('Code Preview')) }, [])

  // Use language of the route in first render
  useEffect(() => { router.push(`/code/${path}?language=${language}`, undefined, { shallow: true }) }, [])

  // Handle password
  useEffect(() => {
    async function fetchNoteWithPassword () {
      if (passwordCookie) {
        try {
          // Fetch Note with password
          const res = await apiClient({
            method: 'post',
            url: `/notes/${path}`,
            data: {
              password: passwordCookie
            }
          }, false)
          setNote(res.data)
          setHandlingPassword(false)
        } catch (error) {
          // Go to note login page
          const redirectLocation = `/${path}/login`
          router.push(redirectLocation)
        }
      } else {
        // Go to note login page directly
        const redirectLocation = `/${path}/login`
        router.push(redirectLocation)
      }
    }
    if (hasPassword) fetchNoteWithPassword()
  }, [])

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage)
    router.push(`/code/${path}?language=${newLanguage}`, undefined, { shallow: true })
  }

  if (handlingPassword) return <PasswordHandling />

  if (!note.text) return <Blank />

  return (
    <Box bgcolor="#F0F0F0">
      <CodePreviewToolbar handleLanguageChange={handleLanguageChange} defaultLanguage={defaultLanguage} />
      <Box m={5}>
        <SyntaxHighlighter language={language}>
          {note.text}
        </SyntaxHighlighter>
      </Box>
    </Box>
  )
}

CodePreview.getInitialProps = async (ctx) => {
  const { path, language } = ctx.query

  const defaultLanguage = language || 'javascript'

  try {
    // Fetch Note
    const res = await apiClient({
      method: 'get',
      url: `/notes/${path}`
    }, false)
    return { hasPassword: false, noteInfo: res.data, path, defaultLanguage }
  } catch (error) {
    // Handle Error
    const noteNotFounded = error.response && error.response.status === 404
    const noteHasPassword = error.response && error.response.status === 400

    if (noteNotFounded) {
      // Create Note
      const res = await apiClient({
        method: 'post',
        url: '/notes',
        data: {
          path
        }
      }, false)
      return { hasPassword: false, noteInfo: res.data, path, defaultLanguage }
    }

    if (noteHasPassword) return { hasPassword: true, noteInfo: { text: '' }, path, defaultLanguage }

    // Other Errors
    return { error }
  }
}

CodePreview.propTypes = {
  path: PropTypes.string,
  noteInfo: PropTypes.object,
  hasPassword: PropTypes.bool,
  defaultLanguage: PropTypes.string
}

export default CodePreview
