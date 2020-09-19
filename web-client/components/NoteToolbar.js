import React, { useState } from 'react'
import PropTypes from 'prop-types'
import copy from 'copy-to-clipboard'
import { toast } from 'react-toastify'

// Components
import Box from '@material-ui/core/Box'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

// Custom Components
import ToolbarItem from './ToolbarItem'
import PasswordInput from './PasswordInput'

// Form
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

// Icons
import { Check, Close, Code, FileCopy, Archive, Lock, LockOpen, Pageview, SaveAlt, Spellcheck, TextFormat, Create } from '@material-ui/icons'

// Redux
import { useSelector } from 'react-redux'

// Utils
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import { apiClient } from '../utils'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'flex-end',
    backgroundColor: '#727fd8'
  },
  divider: {
    margin: 5,
    marginLeft: 15,
    marginRight: 15
  }
}))

const NoteToolbar = ({ path, note, password, updatePassword }) => {
  const classes = useStyles()
  const router = useRouter()

  // States
  const [spellcheck, setSpellcheck] = useState(false)
  const [passwordOptionsModal, setPasswordOptionsModal] = useState(false)
  const [changeUrlModal, setChangeUrlModal] = useState(false)
  const [newNotePassword, setNewNotePassword] = useState('')
  const [newURL, setNewURL] = useState(path)

  // Redux States
  const { user } = useSelector(state => state.auth)

  const onCodeViewPress = () => {
    router.push(`/code/${path}`)
  }

  const onMarkdownViewPress = () => {
    router.push(`/markdown/${path}`)
  }

  const onDownloadPress = () => {
    const PDF = require('jspdf')
    const doc = new PDF()
    doc.setFontSize(16)
    doc.text(note.text, 10, 10)
    doc.save(`${path}.pdf`)
  }

  const onCopyPress = () => {
    copy(note.text)
    toast.info('🚀 Note copied!', { autoClose: 2000 })
  }

  const onTrackTogglePress = () => {
    //
  }

  const onArchivePress = () => {
    //
  }

  const onChangeUrlPress = () => {
    setChangeUrlModal(true)
  }

  const onSpellcheckTogglePress = () => {
    const newStatus = !spellcheck

    if (newStatus) {
      toast.info('🚀 Spellcheck active!', { autoClose: 2000 })
    } else {
      toast.info('🚀 Spellcheck passive!', { autoClose: 2000 })
    }

    setSpellcheck(newStatus)
  }

  const onPasswordOptionsPress = () => {
    setPasswordOptionsModal(true)
  }

  const renderLockItem = () => {
    if (note.has_password) {
      return <ToolbarItem icon={<Lock />} title="Locked" onClick={onPasswordOptionsPress} />
    }

    return (
      <ToolbarItem icon={<LockOpen />} title="Unlocked" onClick={onPasswordOptionsPress} />
    )
  }

  const renderTrackItem = () => {
    if (note.is_tracked) {
      return <ToolbarItem icon={<Close />} disabled={!(user.username)} title="Untrack" onClick={onTrackTogglePress} />
    }

    return <ToolbarItem icon={<Check />} disabled={!(user.username)} title="Track" onClick={onTrackTogglePress} />
  }

  const renderSpellcheckItem = () => {
    if (spellcheck) {
      return <ToolbarItem icon={<TextFormat />} onClick={onSpellcheckTogglePress} />
    }

    return <ToolbarItem icon={<Spellcheck />} onClick={onSpellcheckTogglePress} />
  }

  const handleChangeNotePassword = async (event) => {
    event.preventDefault()
    try {
      await apiClient({
        method: 'post',
        url: `/notes/${path}/password`,
        data: {
          password: newNotePassword
        }
      }, false)
      updatePassword(newNotePassword, 10)
      note.has_password = true
      setNewNotePassword('')
      toast.info('🚀 Password applied!', { autoClose: 2000 })
    } catch (error) {
      toast.info('🐱‍🐉 Error occured.')
    } finally {
      setPasswordOptionsModal(false)
    }
  }

  const handleRemoveNotePassword = async () => {
    try {
      await apiClient({
        method: 'delete',
        url: `/notes/${path}/password`,
        data: {
          password
        }
      }, false)
      note.has_password = false
      toast.info('🚀 Password removed!', { autoClose: 2000 })
    } catch (error) {
      toast.info('🐱‍🐉 Error occured.')
    } finally {
      setPasswordOptionsModal(false)
    }
  }

  const renderPasswordOptionsModal = () => {
    if (note.has_password) {
      return (
        <Dialog open={passwordOptionsModal} onClose={() => { setPasswordOptionsModal(false) }} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Remove Password</DialogTitle>
          <DialogContent>
            <DialogContentText>
            You can remove protection of this note.
            </DialogContentText>
            <DialogActions>
              <Button onClick={() => { setPasswordOptionsModal(false) }} color="primary">
              Cancel
              </Button>
              <Button color="primary" onClick={handleRemoveNotePassword}>
              Remove Password
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      )
    }

    return (
      <Dialog open={passwordOptionsModal} onClose={() => { setPasswordOptionsModal(false) }} aria-labelledby="form-dialog-title">
        <form onSubmit={handleChangeNotePassword}>
          <DialogTitle id="form-dialog-title">Add Password</DialogTitle>
          <DialogContent>
            <DialogContentText>
            To protect to this note, please enter a password here.
            </DialogContentText>
            <PasswordInput
              autoFocus
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              id="password"
              value={newNotePassword}
              onChange={(event) => { setNewNotePassword(event.target.value) }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setPasswordOptionsModal(false) }} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Add Password
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    )
  }

  const handleChangeUrl = () => {
    setChangeUrlModal(false)
  }

  const closeChangeUrlModal = () => {
    setChangeUrlModal(false)
    setNewURL(path)
  }

  const renderChangeUrlModal = () => {
    return (
      <Dialog open={changeUrlModal} onClose={closeChangeUrlModal} aria-labelledby="form-dialog-title">
        <form onSubmit={handleChangeUrl}>
          <DialogTitle id="form-dialog-title">Change URL</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {"You can change note's URL from here."}
            </DialogContentText>
            <TextField
              autoFocus
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="new-url"
              label="New URL"
              id="new-url"
              value={newURL}
              onChange={(event) => { setNewURL(event.target.value) }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeChangeUrlModal} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Apply
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    )
  }

  return (
    <>
      <Box className={classes.root}>
        <AppBar position="static">
          <Toolbar variant="dense" className={classes.toolbar}>
            {renderTrackItem()}
            <ToolbarItem icon={<Archive />} disabled={!(user.username)} title="Archive" onClick={onArchivePress} />
            {renderLockItem()}
            <Divider className={classes.divider} orientation="vertical" flexItem light />
            <ToolbarItem icon={<Code />} title="Code" onClick={onCodeViewPress} />
            <ToolbarItem icon={<Pageview />} title="Markdown" onClick={onMarkdownViewPress} />
            <Divider className={classes.divider} orientation="vertical" flexItem light />
            <ToolbarItem icon={<SaveAlt />} disabled={!note.text} onClick={onDownloadPress} />
            <ToolbarItem icon={<FileCopy />} disabled={!note.text} onClick={onCopyPress} />
            {renderSpellcheckItem()}
            <ToolbarItem icon={<Create />} onClick={onChangeUrlPress} />
          </Toolbar>
        </AppBar>
      </Box>
      {renderPasswordOptionsModal()}
      {renderChangeUrlModal()}
    </>
  )
}

NoteToolbar.propTypes = {
  path: PropTypes.string.isRequired,
  password: PropTypes.string,
  note: PropTypes.object.isRequired,
  updatePassword: PropTypes.func.isRequired
}

export default NoteToolbar
