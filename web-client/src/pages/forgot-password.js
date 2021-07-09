import React, {useEffect, useState} from 'react'

// Components
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'

// Icons
import {RotateLeft} from '@material-ui/icons'
import DoneAll from '@material-ui/icons/DoneAll'

// Utils
import {makeStyles} from '@material-ui/core/styles'
import {withGuest, apiClient} from '../utils'

// Redux
import {useDispatch} from 'react-redux'
import {setTitle} from '../store/actions/appAction'

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fixes IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  icon: {
    fontSize: 120
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '80%'
  }
}))

const ForgotPassword = () => {
  const classes = useStyles()
  const dispatch = useDispatch()

  // states
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [emailError, setEmailError] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [loading, setLoading] = useState(false)
  const [complete, setComplete] = useState(false)

  // Change App Title
  useEffect(() => {
    dispatch(setTitle('Forgot Password'))
  }, [])

  // todo
  const handleForgotPassword = async event => {
    event.preventDefault()
    setLoading(true)

    // clear states
    setEmailError('')
    setUsernameError('')

    try {
      await apiClient(
        {
          method: 'post',
          url: '/forgot-password',
          data: {
            username,
            email
          }
        },
        false
      )
      setComplete(true)
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.username
      ) {
        setUsernameError(error.response.data.username)
        setComplete(false)
      } else if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.email
      ) {
        setEmailError(error.response.data.email)
        setComplete(false)
      }
    } finally {
      setLoading(false)
    }
  }

  if (complete) {
    return (
      <Container className={classes.root}>
        <Box m={2}>
          <DoneAll className={classes.icon} />
        </Box>
        <Typography component="h1" variant="h5">
          Email sended.
        </Typography>
      </Container>
    )
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <RotateLeft />
        </Avatar>
        <Typography component="h1" variant="h5">
          Reset Your Password
        </Typography>
        <form className={classes.form} onSubmit={handleForgotPassword}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={event => {
              setUsername(event.target.value)
            }}
            error={!!usernameError}
            helperText={usernameError}
            disabled={loading}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={event => {
              setEmail(event.target.value)
            }}
            error={!!emailError}
            helperText={emailError}
            disabled={loading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={loading}>
            Send Email
          </Button>
        </form>
      </div>
    </Container>
  )
}

export default withGuest(ForgotPassword)
