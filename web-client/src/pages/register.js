import React, {useState, useEffect} from 'react'
import Link from 'next/link'

// Components
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
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
import {register} from '../store/actions/authAction'

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
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
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}))

const Register = () => {
  const classes = useStyles()
  const dispatch = useDispatch()

  // States
  const [registerClicked, setRegisterClicked] = useState(false)

  // Form States
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [emailUpdates, setEmailUpdates] = useState(false)

  // Redux States
  const {error} = useSelector(state => state.auth)

  // Change App Title
  useEffect(() => {
    dispatch(setTitle('Register'))
  }, [])

  const handleRegister = event => {
    event.preventDefault()
    dispatch(
      register(username, password, email, firstName, lastName, emailUpdates)
    )
    setRegisterClicked(true)
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} onSubmit={handleRegister}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                value={firstName}
                onChange={event => {
                  setFirstName(event.target.value)
                }}
                error={registerClicked && !!(error && error.first_name)}
                helperText={
                  registerClicked && error && error.first_name
                    ? error.first_name
                    : ''
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                value={lastName}
                onChange={event => {
                  setLastname(event.target.value)
                }}
                error={registerClicked && !!(error && error.last_name)}
                helperText={
                  registerClicked && error && error.last_name
                    ? error.last_name
                    : ''
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                value={username}
                onChange={event => {
                  setUsername(event.target.value)
                }}
                error={registerClicked && !!(error && error.username)}
                helperText={
                  registerClicked && error && error.username
                    ? error.username
                    : ''
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={event => {
                  setEmail(event.target.value)
                }}
                error={registerClicked && !!(error && error.email)}
                helperText={
                  registerClicked && error && error.email ? error.email : ''
                }
              />
            </Grid>
            <Grid item xs={12}>
              <PasswordInput
                variant="outlined"
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
                error={registerClicked && !!(error && error.password)}
                helperText={
                  registerClicked && error && error.password
                    ? error.password
                    : ''
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                checked={emailUpdates}
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
                onChange={event => {
                  setEmailUpdates(event.target.checked)
                }}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}>
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/login">
                <a>Already have an account? Sign in</a>
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  )
}

export default withGuest(Register)
