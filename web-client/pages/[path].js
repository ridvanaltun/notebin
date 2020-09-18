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

const Note = ({ path, note, hasPassword }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  // States
  const [noteText, setNoteText] = useState(note.text)
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
          setNoteText(res.data.text)
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

  if (handlingPassword) {
    return (
      <>
        <NoteToolbar path={path} noteText={noteText} />
        <div>
          Password Handling...
        </div>
      </>
    )
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
  // const isServer = !!ctx.req

  try {
    // Fetch Note
    const res = await apiClient({
      method: 'get',
      url: `/notes/${path}`
    })
    return { hasPassword: false, note: res.data, path }
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
      return { hasPassword: false, note: res.data, path }
    }

    if (noteHasPassword) {
      // const redirectLocation = `/${path}/login`

      // if (isServer) { ctx.res.writeHead(302, { Location: redirectLocation }).end() }

      return { hasPassword: true, note: { text: '' }, path }
    }

    // Other Errors
    return { error }
  }
}

Note.propTypes = {
  path: PropTypes.string,
  note: PropTypes.object,
  redirect: PropTypes.string,
  hasPassword: PropTypes.bool
}

export default Note
