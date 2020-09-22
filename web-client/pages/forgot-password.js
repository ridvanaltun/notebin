import React, { useEffect } from 'react'

// Components
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'

// Icons
import { RotateLeft } from '@material-ui/icons'

// Utils
import { makeStyles } from '@material-ui/core/styles'
import { withGuest } from '../utils'

// Redux
import { useDispatch } from 'react-redux'
import { setTitle } from '../store/actions/appAction'

const useStyles = makeStyles((theme) => ({
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
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}))

const ForgotPassword = () => {
  const classes = useStyles()
  const dispatch = useDispatch()

  // Change App Title
  useEffect(() => { dispatch(setTitle('Forgot Password')) }, [])

  // todo
  const handleForgotPassword = (event) => {
    event.preventDefault()
    // dispatch()
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
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Send Email
          </Button>
        </form>
      </div>
    </Container>
  )
}

export default withGuest(ForgotPassword)
