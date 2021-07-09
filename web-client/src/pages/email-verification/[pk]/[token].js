import React, {useEffect} from 'react'
import PropTypes from 'prop-types'

// Components
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'

// Icons
import DoneAll from '@material-ui/icons/DoneAll'
import Error from '@material-ui/icons/Error'

// Utils
import {makeStyles} from '@material-ui/core/styles'
import {apiClient} from '../../../utils'

// Redux
import {useDispatch} from 'react-redux'
import {hideNav} from '../../../store/actions/appAction'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  icon: {
    fontSize: 120
  }
}))

const EmailVerification = ({isOk}) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  // hide navbar
  useEffect(() => {
    dispatch(hideNav())
  }, [])

  if (isOk) {
    return (
      <Container className={classes.root}>
        <Box m={2}>
          <DoneAll className={classes.icon} />
        </Box>
        <Typography component="h1" variant="h5">
          Your account has been activate successfully.
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
        Activation link is invalid.
      </Typography>
    </Container>
  )
}

EmailVerification.getInitialProps = async ctx => {
  const {pk, token} = ctx.query

  try {
    await apiClient(
      {
        method: 'post',
        url: '/activate-email',
        data: {
          pk,
          token
        }
      },
      false
    )

    return {isOk: true}
  } catch (error) {
    return {isOk: false}
  }
}

EmailVerification.propTypes = {
  isOk: PropTypes.bool
}

export default EmailVerification
