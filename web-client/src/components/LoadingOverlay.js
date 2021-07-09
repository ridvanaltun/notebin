import React from 'react'
import PropTypes from 'prop-types'

// Components
import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'

// Utils
import {makeStyles} from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  overlay: {
    position: 'fixed',
    bottom: 20,
    right: 30,
    padding: 5,
    alignItems: 'center',
    display: 'flex',
    transition: 'opacity 0.1s ease, bottom 0.1s ease',
    animation: 'fade-in 0.1s ease-in-out',
    borderRadius: 50
  }
}))

const LoadingOverlay = ({loading}) => {
  const classes = useStyles()

  if (loading) {
    return (
      <Box className={classes.overlay}>
        <CircularProgress size={30} />
      </Box>
    )
  }

  return null
}

LoadingOverlay.propTypes = {
  loading: PropTypes.bool.isRequired
}

export default LoadingOverlay
