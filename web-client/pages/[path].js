import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

// Components
import Box from '@material-ui/core/Box'

// Custom Components
import { NoteToolbar, NotePaper } from '../components'

// Redux
import { useDispatch } from 'react-redux'
import { setTitle } from '../store/actions/appAction'

// Utils
import { useRouter } from 'next/router'
import { apiClient } from '../utils'

const Note = ({ path, note, redirect }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  // Redirect if note has password
  if (redirect) router.push(redirect)

  // States
  const [noteText, setNoteText] = useState(note.text)

  // Change App Title
  useEffect(() => {
    dispatch(setTitle('Notebin'))
  }, [])

  return (
    <>
      <NoteToolbar path={path} noteText={noteText} />
      <NotePaper
        value={noteText}
        onChange={(event) => { setNoteText(event.target.value) }}
      />
    </>
  )
}

Note.getInitialProps = async (ctx) => {
  const { path } = ctx.query
  const isServer = !!ctx.req

  try {
    // Fetch Note
    const res = await apiClient({
      method: 'get',
      url: `/notes/${path}`
    })
    return { note: res.data, path }
  } catch (error) {
    // Handle Error
    const noteNotFounded = error.response && error.response.status === 404
    const noteHasPassword = error.response && error.response.status === 400

    // Create Note
    if (noteNotFounded) {
      const res = await apiClient({
        method: 'post',
        url: '/notes',
        data: {
          path
        }
      })
      return { note: res.data, path }
    }

    if (noteHasPassword) {
      const redirectLocation = `/${path}/login`

      if (isServer) ctx.res.writeHead(302, { Location: redirectLocation }).end()

      return { redirect: redirectLocation }
    }

    // Other Errors
    return { error }
  }
}

Note.propTypes = {
  path: PropTypes.string,
  note: PropTypes.object,
  redirect: PropTypes.string,
  error: PropTypes.object
}

export default Note
