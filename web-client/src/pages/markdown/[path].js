import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import ReactMarkdown from 'react-markdown'

// Components
import Box from '@material-ui/core/Box'

// Custom Components
import {Blank, PasswordHandling} from '../../components'

// Redux
import {useDispatch} from 'react-redux'
import {setTitle} from '../../store/actions/appAction'

// Utils
import {useRouter} from 'next/router'
import {apiClient, useCookie} from '../../utils'

const MarkdownPreview = ({noteInfo, path, hasPassword}) => {
  const dispatch = useDispatch()
  const router = useRouter()

  console.log(noteInfo)

  // States
  const [note, setNote] = useState(noteInfo)
  const [handlingPassword, setHandlingPassword] = useState(hasPassword)
  const [passwordCookie] = useCookie(`notes-${path}`, false)

  // Change App Title
  useEffect(() => {
    dispatch(setTitle('Markdown Preview'))
  }, [])

  // Handle password
  useEffect(() => {
    async function fetchNoteWithPassword() {
      if (passwordCookie) {
        try {
          // Fetch Note with password
          const res = await apiClient(
            {
              method: 'post',
              url: `/notes/${path}`,
              data: {
                password: passwordCookie
              }
            },
            false
          )
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

  if (note.text) {
    return (
      <Box m={10}>
        <ReactMarkdown>{note.text}</ReactMarkdown>
      </Box>
    )
  }

  if (handlingPassword) return <PasswordHandling />

  return <Blank />
}

MarkdownPreview.getInitialProps = async ctx => {
  const {path} = ctx.query

  try {
    // Fetch Note
    const res = await apiClient(
      {
        method: 'get',
        url: `/notes/${path}`
      },
      false
    )

    return {hasPassword: false, noteInfo: res.data, path}
  } catch (error) {
    // Handle Error
    const noteNotFounded = error.response && error.response.status === 404
    const noteHasPassword = error.response && error.response.status === 400

    if (noteNotFounded) {
      // Create Note
      const res = await apiClient(
        {
          method: 'post',
          url: '/notes',
          data: {
            path
          }
        },
        false
      )

      return {hasPassword: false, noteInfo: res.data, path}
    }

    if (noteHasPassword) return {hasPassword: true, noteInfo: {}, path}

    // Other Errors
    return {error}
  }
}

MarkdownPreview.propTypes = {
  noteInfo: PropTypes.object,
  path: PropTypes.string,
  hasPassword: PropTypes.bool
}

export default MarkdownPreview
