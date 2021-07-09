import React, {useState} from 'react'
import PropTypes from 'prop-types'

// Components
import Box from '@material-ui/core/Box'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'

// Utils
import {makeStyles} from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  toolbar: {
    display: 'flex',
    backgroundColor: '#727fd8'
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  }
}))

const CodePreviewToolbar = ({handleLanguageChange, defaultLanguage}) => {
  const classes = useStyles()

  // States
  const [open, setOpen] = useState(false)
  const [codeLanguage, setCodeLanguage] = useState(defaultLanguage)

  const handleChange = event => {
    const newLanguage = event.target.value
    setCodeLanguage(newLanguage)
    handleLanguageChange(newLanguage)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Box className={classes.root}>
      <AppBar position="static">
        <Toolbar variant="dense" className={classes.toolbar}>
          <Button onClick={handleOpen}>
            {'This piece of code is shown to you in'} &nbsp;
            <b>
              <u>{`${codeLanguage}`}</u>
            </b>{' '}
            {', click to change!'}
          </Button>
          <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            open={open}
            onClose={handleClose}>
            <DialogTitle>Change Language</DialogTitle>
            <DialogContent>
              <form className={classes.container}>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="demo-dialog-native">Language</InputLabel>
                  <Select
                    id="demo-dialog-select"
                    value={codeLanguage}
                    onChange={handleChange}
                    input={<Input />}>
                    <MenuItem value="javascript">JavaScript</MenuItem>
                    <MenuItem value="python">Python</MenuItem>
                    <MenuItem value="php">PHP</MenuItem>
                  </Select>
                </FormControl>
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

CodePreviewToolbar.propTypes = {
  handleLanguageChange: PropTypes.func.isRequired,
  defaultLanguage: PropTypes.string.isRequired
}

export default CodePreviewToolbar
