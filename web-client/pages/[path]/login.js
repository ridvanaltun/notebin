import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'

// Components
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

// Custom Components
import { PasswordInput } from '../../components'

// Icons
import { LockOutlined } from '@material-ui/icons'

// Redux
import { useDispatch } from 'react-redux'
import { setTitle } from '../../store/actions/appAction'

// Utils
import { makeStyles } from '@material-ui/core/styles'
import { useRouter } from 'next/router'
import { apiClient, useCookie } from '../../utils'

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}))

const NoteLogin = ({ path, hasPassword }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const router = useRouter()

  // Redirect to note if note has not a password
  if (hasPassword === false) router.push(`/${path}`)

  // States
  const [password, setPassword] = useState('')
  const [passwordCookie, updatePasswordCookie] = useCookie(`notes-${path}`, false)

  // Change App Title
  useEffect(() => { dispatch(setTitle('Note Login')) }, [])

  const handleAccessNote = async (event) => {
    event.preventDefault()

    try {
      await apiClient({
        method: 'post',
        url: `/notes/${path}`,
        data: {
          password
        }
      }, false)
      // Save the password as cookie and redirect to note page
      updatePasswordCookie(password, 10)
      router.push(`/${path}`)
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.info('🐱‍🐉 Note password incorrect.')
      } else {
        toast.info('🐱‍🐉 An unknown error occured.')
      }
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Note Password
        </Typography>
        <form className={classes.form} onSubmit={handleAccessNote}>
          <PasswordInput
            autoFocus
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            id="password"
            value={password}
            onChange={(event) => { setPassword(event.target.value) }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Access to Note
          </Button>
        </form>
      </Box>
    </Container>
  )
}

NoteLogin.getInitialProps = async (ctx) => {
  const { path } = ctx.query
  const isServer = !!ctx.req
  const redirectLocation = `/${path}`

  try {
    // Fetch Note
    const res = await apiClient({
      method: 'get',
      url: `/notes/${path}/hasPassword`
    }, false)

    // Note has a password, stay the page
    if (res.data === 'OK') {
      return { path, hasPassword: true }
    }

    // The note dont have a password, go to note
    if (res.data === 'KO') {
      if (isServer) { ctx.res.writeHead(302, { Location: redirectLocation }).end() }

      return { path, hasPassword: false }
    }
  } catch (error) {
    // If occured error try to open note
    if (isServer) { ctx.res.writeHead(302, { Location: redirectLocation }).end() }

    return { path, hasPassword: false }
  }

  return { path }
}

NoteLogin.propTypes = {
  path: PropTypes.string,
  hasPassword: PropTypes.bool
}

export default NoteLogin
