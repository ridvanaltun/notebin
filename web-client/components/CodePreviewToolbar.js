import React from 'react'

// Components
import Box from '@material-ui/core/Box'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'

// Utils
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'flex-end',
    backgroundColor: '#727fd8'
  }
}))

const CodePreviewToolbar = (props) => {
  const classes = useStyles()
  return (
    <Box className={classes.root}>
      <AppBar position="static">
        <Toolbar variant="dense" className={classes.toolbar}>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default CodePreviewToolbar
