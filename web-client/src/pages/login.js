import React, {useState, useEffect} from 'react'
import Link from 'next/link'

// Components
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'

// Custom Components
import {PasswordInput} from '../components'

// Icons
import {LockOutlined} from '@material-ui/icons'

// Utils
import {makeStyles} from '@material-ui/core/styles'
import {withGuest} from '../utils'

// Redux
import {useDispatch, useSelector} from 'react-redux'
import {setTitle} from '../store/actions/appAction'
import {login} from '../store/actions/authAction'

const useStyles = makeStyles(theme => ({
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
    width: '100%', // Fixes IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}))

const Login = () => {
  const classes = useStyles()
  const dispatch = useDispatch()

  // States
  const [loginClicked, setLoginClicked] = useState(false)

  // Form States
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // Redux States
  const {error, errorStatus, loading} = useSelector(state => state.auth)

  // Change App Title
  useEffect(() => {
    dispatch(setTitle('Login'))
  }, [])

  const handleLogin = event => {
    event.preventDefault()
    dispatch(login(username, password))
    setLoginClicked(true)
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} onSubmit={handleLogin}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoFocus
            autoComplete="username"
            value={username}
            onChange={event => {
              setUsername(event.target.value)
            }}
            error={
              loginClicked &&
              !!(error && (errorStatus === 400 || errorStatus === 401))
            }
            helperText={
              loginClicked &&
              (errorStatus === 400
                ? error.non_field_errors
                : errorStatus === 401
                ? error.detail
                : '')
            }
            disabled={loading}
          />
          <PasswordInput
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={event => {
              setPassword(event.target.value)
            }}
            error={
              loginClicked &&
              !!(error && (errorStatus === 400 || errorStatus === 401))
            }
            helperText={
              loginClicked &&
              (errorStatus === 400
                ? error.non_field_errors
                : errorStatus === 401
                ? error.detail
                : '')
            }
            disabled={loading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={loading}>
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/forgot-password">
                <a>Forgot password?</a>
              </Link>
            </Grid>
            <Grid item>
              <Link href="/register">
                <a>{"Don't have an account? Sign Up"}</a>
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  )
}

export default withGuest(Login)
