import React, {useEffect} from 'react'
import Router from 'next/router'
import {makeStyles} from '@material-ui/core/styles'

// Components
import CircularProgress from '@material-ui/core/CircularProgress'

// Redux
import {useSelector} from 'react-redux'

// Styles
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    '& > * + *': {
      marginLeft: theme.spacing(2)
    }
  }
}))

const withUser = Comp => () => {
  const classes = useStyles()

  // Redux States
  const {user} = useSelector(state => state.auth)

  const isUserNotExist = !user.username

  const redirectTo = '/login?redirected=true'

  useEffect(() => {
    if (isUserNotExist) {
      Router.replace(redirectTo)
    }
  })

  if (isUserNotExist) {
    return (
      <div className={classes.root}>
        <CircularProgress />
      </div>
    )
  }

  return <Comp />
}

export default withUser
