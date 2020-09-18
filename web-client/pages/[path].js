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
import { apiClient, useCookie } from '../utils'

const Note = ({ path, noteInfo, hasPassword }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  // States
  const [note, setNote] = useState(noteInfo)
  const [loading, setLoading] = useState(false)
  const [handlingPassword, setHandlingPassword] = useState(hasPassword)
  const [passwordCookie, updatePasswordCookie] = useCookie(`notes-${path}`, false)

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
          })
          setNote(res.data)
          setHandlingPassword(false)
        } catch (error) {
          // Go to note login page
          toast.info('🐱‍🐉 Saved password incorrect')
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

  // Change App Title
  useEffect(() => {
    dispatch(setTitle('Notebin'))
  }, [])

  const handleNoteChange = async (event) => {
    const newNoteText = event.target.value
    setNote({ ...note, text: newNoteText })

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

  if (handlingPassword) {
    return (
      <>
        <NoteToolbar path={path} note={note} password={passwordCookie} updatePassword={updatePasswordCookie} />
        <div>
          Password Handling...
        </div>
      </>
    )
  }

  return (
    <>
      <NoteToolbar path={path} note={note} password={passwordCookie} updatePassword={updatePasswordCookie} />
      <NotePaper value={note.text} onChange={handleNoteChange} />
      <LoadingOverlay loading={loading} />
    </>
  )
}

Note.getInitialProps = async (ctx) => {
  const { path } = ctx.query

  try {
    // Fetch Note
    const res = await apiClient({
      method: 'get',
      url: `/notes/${path}`
    })
    return { hasPassword: false, noteInfo: res.data, path }
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
      })
      return { hasPassword: false, noteInfo: res.data, path }
    }

    if (noteHasPassword) return { hasPassword: true, noteInfo: { text: '' }, path }

    // Other Errors
    return { error }
  }
}

Note.propTypes = {
  path: PropTypes.string,
  noteInfo: PropTypes.object,
  redirect: PropTypes.string,
  hasPassword: PropTypes.bool
}

export default Note
