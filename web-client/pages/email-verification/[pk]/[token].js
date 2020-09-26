import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

// Components
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'

// Utils
import { makeStyles } from '@material-ui/core/styles'
import { apiClient } from '../../../utils'

// Redux
import { useDispatch } from 'react-redux'
import { hideNav } from '../store/actions/appAction'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '80%'
  }
}))

const EmailVerification = ({ isOk }) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  // hide navbar
  useEffect(() => { dispatch(hideNav()) }, [])

  if (isOk) {
    return (
      <Container className={classes.root}>
        <Typography component="h1" variant="h5">
          Your account has been activate successfully.
        </Typography>
      </Container>
    )
  }

  return (
    <Container className={classes.root}>
      <Typography component="h1" variant="h5">
          Activation link is invalid.
      </Typography>
    </Container>

  )
}

EmailVerification.getInitialProps = async (ctx) => {
  const { pk, token } = ctx.query

  try {
    await apiClient({
      method: 'post',
      url: '/activate-email',
      data: {
        pk,
        token
      }
    }, false)

    return { isOk: true }
  } catch (error) {
    return { isOk: false }
  }
}

EmailVerification.propTypes = {
  isOk: PropTypes.bool
}

export default EmailVerification
