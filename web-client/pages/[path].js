import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'

// Custom Components
import { NoteToolbar, NotePaper, LoadingOverlay } from '../components'

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
  const [loading, setLoading] = useState(false)

  // Change App Title
  useEffect(() => {
    dispatch(setTitle('Notebin'))
  }, [])

  const handleNoteChange = async (event) => {
    const newNoteText = event.target.value
    setNoteText(newNoteText)

    // set loading
    const spinnerTimeout = setTimeout(() => {
      setLoading(true)
    }, 100)

    try {
      // update note on server
      await apiClient({
        method: 'patch',
        url: `/notes/${path}`,
        data: {
          text: newNoteText
        }
      })

      // clear loading
      setLoading(false)
      clearTimeout(spinnerTimeout)
    } catch (error) {
      if (error.response) {
        toast.info(
          `🐱‍🐉 An error occured. Error Code: ${error.response.status}`
        )
      } else {
        toast.info('🐱‍🐉 An unknown error occured.')
      }

      // clear loading
      setLoading(false)
      clearTimeout(spinnerTimeout)
    }
  }

  return (
    <>
      <NoteToolbar path={path} noteText={noteText} />
      <NotePaper value={noteText} onChange={handleNoteChange} />
      <LoadingOverlay loading={loading} />
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

      if (isServer) { ctx.res.writeHead(302, { Location: redirectLocation }).end() }

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
