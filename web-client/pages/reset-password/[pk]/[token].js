import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

// Components
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'

// Custom Components
import { PasswordInput } from '../../../components'

// Icons
import DoneAll from '@material-ui/icons/DoneAll'
import Error from '@material-ui/icons/Error'
import LockOpen from '@material-ui/icons/LockOpen'

// Utils
import { makeStyles } from '@material-ui/core/styles'
import { apiClient } from '../../../utils'

// Redux
import { useDispatch } from 'react-redux'
import { hideNav, setTitle } from '../../../store/actions/appAction'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  paper: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  icon: {
    fontSize: 120
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  }
}))

const ResetPassword = ({ pk, token }) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  // states
  const [complete, setComplete] = useState(false)
  const [isOk, setIsOk] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loading, setLoading] = useState(false)

  // hide navbar
  useEffect(() => { dispatch(hideNav()) }, [])

  // Change App Title
  useEffect(() => { dispatch(setTitle('Reset Password')) }, [])

  // functions
  const handleResetPassword = async (event) => {
    event.preventDefault()
    setLoading(true)

    // clear states for any case
    setPasswordError('')

    try {
      await apiClient({
        method: 'post',
        url: '/reset-password',
        data: {
          pk,
          token,
          new_password: password
        }
      }, false)
      setIsOk(true)
      setComplete(true)
    } catch (error) {
      // new password in bad format
      if (error.response && error.response.status === 400 && error.response.data.new_password) {
        setPasswordError(error.response.data.new_password)
        setComplete(false)
      } else {
        setIsOk(false)
        setComplete(true)
      }
    } finally {
      setLoading(false)
    }
  }

  // render password input first
  if (!complete) {
    return (
      <Container component="main" maxWidth="xs" className={classes.root}>
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOpen />
          </Avatar>
          <Typography component="h1" variant="h5">
          Reset Your Password
          </Typography>
          <form className={classes.form} onSubmit={handleResetPassword}>
            <PasswordInput
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="New Password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => { setPassword(event.target.value) }}
              error={!!passwordError}
              helperText={passwordError}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
            Change Password
            </Button>
          </form>
        </div>
      </Container>
    )
  }

  if (isOk) {
    return (
      <Container className={classes.root}>
        <Box m={2}>
          <DoneAll className={classes.icon} />
        </Box>
        <Typography component="h1" variant="h5">
          Your password changed successfully.
        </Typography>
      </Container>
    )
  }

  return (
    <Container className={classes.root}>
      <Box m={2}>
        <Error className={classes.icon} />
      </Box>
      <Typography component="h1" variant="h5">
          Reset password link is invalid.
      </Typography>
    </Container>
  )
}

ResetPassword.getInitialProps = (ctx) => {
  const { pk, token } = ctx.query

  return { pk, token }
}

ResetPassword.propTypes = {
  pk: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired
}

export default ResetPassword
