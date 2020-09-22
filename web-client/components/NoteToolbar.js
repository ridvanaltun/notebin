import React, { useState, useEffect } from 'react'
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
import Slider from '@material-ui/core/Slider'

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
import { Check, Close, Code, FileCopy, Archive, Lock, LockOpen, Pageview, SaveAlt, Spellcheck, TextFormat, Create, FormatSize } from '@material-ui/icons'

// Redux
import { useSelector } from 'react-redux'

// Utils
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import { apiClient, openInNewTab, downloadPage, capitalizeFirstLetter } from '../utils'

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

const NoteToolbar = ({ path, note, password, updatePassword, spellcheck, setSpellcheck, fontSize, updateFontSize }) => {
  const classes = useStyles()
  const router = useRouter()

  // States
  const [passwordOptionsModal, setPasswordOptionsModal] = useState(false)
  const [changeUrlModal, setChangeUrlModal] = useState(false)
  const [changeFontSizeModal, setChangeFontSizeModal] = useState(false)
  const [newNotePassword, setNewNotePassword] = useState('')
  const [newPath, setNewPath] = useState(path)
  const [isTracked, setIsTracked] = useState(false)

  // Redux States
  const { user, accessToken } = useSelector(state => state.auth)

  // todo: note info for user and bind it to note object
  // we need is_tracking info
  useEffect(() => {
    async function fetchNoteDetailsForUser () {
      const res = await apiClient({
        method: 'get',
        url: `/notes/${path}/info`
      })

      if (res.data.is_tracked) setIsTracked(true)
    }
    if (accessToken) fetchNoteDetailsForUser()
  }, [])

  const onCodeViewPress = () => {
    openInNewTab(`/code/${path}`)
  }

  const onMarkdownViewPress = () => {
    openInNewTab(`/markdown/${path}`)
  }

  const onDownloadPress = () => {
    downloadPage(note.text)
  }

  const onCopyPress = () => {
    copy(note.text)
    toast.info('🚀 Note copied!', { autoClose: 2000 })
  }

  const onTrackTogglePress = () => {
    if (isTracked) {
      apiClient({
        method: 'delete',
        url: `/trackings/${path}`
      }).then(() => {
        setIsTracked(false)
        toast.info('Untracked', { autoClose: 1000 })
      // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        toast.error('Tracking did not delete. An error occured!', { autoClose: false })
      })
    } else {
      apiClient({
        method: 'post',
        url: `/trackings/${path}`
      }).then(() => {
        setIsTracked(true)
        toast.info('Tracked', { autoClose: 1000 })
      // eslint-disable-next-line handle-callback-err
      }).catch(error => {
        toast.error('Tracking did not add. An error occured!', { autoClose: false })
      })
    }
  }

  const onBackupPress = () => {
    apiClient({
      method: 'post',
      url: '/backups',
      data: {
        path
      }
    }).then(() => {
      toast.info('Backed Up', { autoClose: 1000 })
      // eslint-disable-next-line handle-callback-err
    }).catch(error => {
      toast.error('Backup could not create. An error occured!', { autoClose: false })
    })
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
    if (isTracked) {
      return <ToolbarItem icon={<Close />} disabled={!(user.username)} title="Untrack" onClick={onTrackTogglePress} />
    }

    return <ToolbarItem icon={<Check />} disabled={!(user.username)} title="Track" onClick={onTrackTogglePress} />
  }

  const renderSpellcheckItem = () => {
    if (spellcheck) {
      return <ToolbarItem icon={<TextFormat />} tooltip="Disable Spellcheck" onClick={onSpellcheckTogglePress} />
    }

    return <ToolbarItem icon={<Spellcheck />} tooltip="Enable Spellcheck" onClick={onSpellcheckTogglePress} />
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
    apiClient({
      method: 'patch',
      url: `/notes/${path}`,
      data: {
        path: newPath
      }
    }, false).then(() => {
      router.push(`/${newPath}`, undefined, { shallow: true })
      toast.info('Note successfully moved!')
      setChangeUrlModal(false)
    }).catch(error => {
      // path already in use
      if (error.response && error.response.status === 400 && error.response.data.path) {
        toast.error(capitalizeFirstLetter(error.response.data.path[0]), { autoClose: false })
      }
    })
  }

  const closeChangeUrlModal = () => {
    setChangeUrlModal(false)
    setNewPath(path)
  }

  const renderChangeUrlModal = () => {
    return (
      <Dialog open={changeUrlModal} onClose={closeChangeUrlModal} aria-labelledby="form-dialog-title">
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
            value={newPath}
            onChange={(event) => { setNewPath(event.target.value) }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeChangeUrlModal} color="primary">
              Cancel
          </Button>
          <Button onClick={handleChangeUrl} type="submit" color="primary" disabled={newPath === path}>
              Apply
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  const renderChangeFontSizeModal = () => {
    return (
      <Dialog open={changeFontSizeModal} onClose={() => { setChangeFontSizeModal(false) }} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Change Font Size</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {'You can change font size from here.'}
          </DialogContentText>
          <Slider
            style={{ marginTop: 10 }}
            defaultValue={fontSize}
            getAriaValueText={(value) => `${value}px`}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            onChange={(event, value) => { updateFontSize(value) }}
            step={1}
            marks
            min={11}
            max={25}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setChangeFontSizeModal(false) }} color="primary">
              Close
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  return (
    <>
      <Box className={classes.root}>
        <AppBar position="static">
          <Toolbar variant="dense" className={classes.toolbar}>
            {renderTrackItem()}
            <ToolbarItem icon={<Archive />} disabled={!(user.username)} title="Archive" onClick={onBackupPress} />
            {renderLockItem()}
            <Divider className={classes.divider} orientation="vertical" flexItem light />
            <ToolbarItem icon={<Code />} title="Code" onClick={onCodeViewPress} />
            <ToolbarItem icon={<Pageview />} title="Markdown" onClick={onMarkdownViewPress} />
            <Divider className={classes.divider} orientation="vertical" flexItem light />
            <ToolbarItem icon={<SaveAlt />} tooltip="Download" disabled={!note.text} onClick={onDownloadPress} />
            <ToolbarItem icon={<FileCopy />} tooltip="Copy" disabled={!note.text} onClick={onCopyPress} />
            <ToolbarItem icon={<FormatSize />} tooltip="Change Font Size" onClick={() => { setChangeFontSizeModal(true) }} />
            {renderSpellcheckItem()}
            <ToolbarItem icon={<Create />} tooltip="Change Url" onClick={onChangeUrlPress} />
          </Toolbar>
        </AppBar>
      </Box>
      {renderPasswordOptionsModal()}
      {renderChangeUrlModal()}
      {renderChangeFontSizeModal()}
    </>
  )
}

NoteToolbar.propTypes = {
  path: PropTypes.string.isRequired,
  password: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ]),
  note: PropTypes.object.isRequired,
  updatePassword: PropTypes.func.isRequired,
  setSpellcheck: PropTypes.func.isRequired,
  spellcheck: PropTypes.bool.isRequired,
  fontSize: PropTypes.string.isRequired,
  updateFontSize: PropTypes.func.isRequired
}

export default NoteToolbar
