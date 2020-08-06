import React, { useEffect, useState } from 'react'

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

const NoteLogin = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const router = useRouter()

  // States
  const [password, setPassword] = useState('')

  // Change App Title
  useEffect(() => {
    dispatch(setTitle('Note Login'))
  }, [])

  const handleChangeNotePassword = (event) => {
    event.preventDefault()
    router.push(`/${router.query.path}`)
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
        <form className={classes.form} onSubmit={handleChangeNotePassword}>
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

export default NoteLogin
