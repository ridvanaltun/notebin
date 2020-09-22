import React, { useState, useEffect } from 'react'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Link from 'next/link'
import { toast } from 'react-toastify'

// Components
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'

// Dialog Components
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

// Tab Components
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

// Accordion Components
import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'

// Custom Components
import { TabPanel, MaterialTable, PasswordInput, Typography } from '../components'

// Icons
import { DeleteForever, VpnKey, Timeline, Backup, Settings, ExpandMore, Search } from '@material-ui/icons'

// Utils
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { withUser, apiClient, capitalizeFirstLetter, timeAgo, openInNewTab } from '../utils'

// Redux
import { useSelector, useDispatch } from 'react-redux'
import { setTitle } from '../store/actions/appAction'
import { deleteUser, updateEmail, updateProfile } from '../store/actions/authAction'

function a11yProps (index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`
  }
}

const materialTableStyle = {
  padding: 10,
  paddingBottom: 0,
  boxShadow: 'none',
  border: '1px solid rgba(0, 0, 0, 0.12)'
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: 20
  },
  userProfileCard: {
    width: '30%',
    padding: 20
  },
  tabsCard: {
    width: '65%'
  },
  noteTrackingContainer: {
    width: '100%',
    height: 250,
    maxWidth: 300,
    backgroundColor: theme.palette.background.paper
  },
  table: {
    minWidth: 650
  },
  changePasswordContainer: {
    width: '100%'
  },
  actionButton: {
    marginTop: 10
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  disabledSection: {
    color: '#c6c6c6'
  },
  hide: {
    display: 'none'
  },
  smallRoot: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  smallTabsCard: {
  }
}))

const Me = () => {
  const classes = useStyles()
  const theme = useTheme()
  const dispatch = useDispatch()
  const isPhoneOrTablet = useMediaQuery('(max-width:768px)')

  // States
  const [tabIndex, setTabIndex] = useState(0)
  const [deleteAccountDialog, setDeleteAccountDialog] = useState(false)
  const [expanded, setExpanded] = React.useState(false)
  const [emailChangeClicked, setEmailChangeClicked] = React.useState(false)
  const [profileUpdateClicked, setProfileUpdateClicked] = React.useState(false)

  // Redux States
  const { user, error } = useSelector(state => state.auth)

  // Form States
  const [currPassword, setCurrPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [firstName, setFirstName] = useState(user.first_name)
  const [lastName, setLastName] = useState(user.last_name)
  const [email, setEmail] = useState(user.email)

  // States for Errors
  const [currPasswordErr, setCurrPasswordErr] = useState('')
  const [newPasswordErr, setNewPasswordErr] = useState('')

  // States for Tables
  const [trackings, setTrackings] = useState([])
  const [backups, setBackups] = useState([])

  // Change App Title
  useEffect(() => { dispatch(setTitle(`${user.username}'s Profile`)) }, [])

  // Fetch backups and trackings in first render
  useEffect(() => {
    async function fetchMeDetails () {
      try {
        const res = await apiClient({
          method: 'get',
          url: '/me/details'
        })

        // collect data
        const { backups } = res.data
        const trackings = res.data.trackings.map(tracking => tracking.note)

        // process data
        const updatedTrackings = trackings.map(tracking => {
          const newTracking = { ...tracking }
          newTracking.created_at = timeAgo(newTracking.created_at)
          newTracking.updated_at = timeAgo(newTracking.updated_at)

          return newTracking
        })

        const updatedBackups = backups.map(backup => {
          const newBackup = { ...backup }
          newBackup.created_at = timeAgo(newBackup.created_at)
          newBackup.updated_at = timeAgo(newBackup.updated_at)

          return newBackup
        })

        setBackups(updatedBackups)
        setTrackings(updatedTrackings)
      } catch (error) {
        toast.error('An error occured when page loading', { autoClose: false })
      }
    }

    fetchMeDetails()
  }, [])

  //
  // Note Tracking Actions
  //

  const onNoteTrackingBackupPress = async (event, row) => {
    try {
      const res = await apiClient({
        method: 'post',
        url: '/backups',
        data: {
          path: row.path
        }
      })
      const b = { ...res.data, updated_at: timeAgo(res.data.updated_at), created_at: timeAgo(res.data.created_at) }
      setBackups(prevState => {
        const newBackupList = [...prevState]
        newBackupList.push(b)
        return newBackupList
      })
      toast.info('Backup created!')
    } catch (error) {
      toast.error('Backup could not create. An error occured!', { autoClose: false })
    }
  }

  const onNoteTrackingDeletePress = (oldData) => {
    return new Promise((resolve, reject) => {
      apiClient({
        method: 'delete',
        url: `/trackings/${oldData.path}`
      }).then(() => {
        setTimeout(() => {
          resolve()
          setTrackings((prevState) => {
            const newTrackingList = [...prevState]
            newTrackingList.splice(newTrackingList.indexOf(oldData), 1)
            return newTrackingList
          })
        }, 600)
      }).catch(error => {
        toast.error('Tracking did not delete. An error occured!', { autoClose: false })
        reject(error)
      })
    })
  }

  //
  // Note Backup Actions
  //

  const onBackupViewPress = (event, row) => {
    openInNewTab(`/backups/${row.unique_id}`)
  }

  const onBackupDeletePress = (oldData) => {
    return new Promise((resolve, reject) => {
      apiClient({
        method: 'delete',
        url: `/backups/${oldData.unique_id}`
      }).then(() => {
        setTimeout(() => {
          resolve()
          setBackups((prevState) => {
            const newBackupList = [...prevState]
            newBackupList.splice(newBackupList.indexOf(oldData), 1)
            return newBackupList
          })
        }, 600)
      }).catch(error => {
        toast.error('Backup did not delete. An error occured!', { autoClose: false })
        reject(error)
      })
    })
  }

  // Custom Columns
  const renderBackupIdColumn = (rowData) => {
    return (
      <Typography>
        {rowData.unique_id.substring(0, 8) + ' ...'}
      </Typography>
    )
  }

  const renderTrackingPathColumn = (rowData) => {
    return (
      <Link href={`/${rowData.path}`}>
        <a target="_blank">{rowData.path.length > 8 ? `${rowData.path.substring(0, 8) + ' ...'}` : rowData.path}</a>
      </Link>
    )
  }

  const renderBackupOrginalPathColumn = (rowData) => {
    return (
      <Link href={`/${rowData.original_path}`}>
        <a target="_blank">{rowData.original_path.length > 8 ? `${rowData.original_path.substring(0, 8) + ' ...'}` : rowData.original_path}</a>
      </Link>
    )
  }

  const renderBackupDate = (rowData) => {
    return (
      <Typography>
        {timeAgo(rowData.updated_at)}
      </Typography>
    )
  }

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  const onDeleteAccountPress = () => {
    setDeleteAccountDialog(false)
    dispatch(deleteUser())
  }

  const handleChangePassword = async (event) => {
    event.preventDefault()

    if (currPassword === newPassword) {
      toast.error("Current password and new password can't be same!", { autoClose: false })
      return
    }

    try {
      await apiClient({
        method: 'post',
        url: '/password',
        data: {
          current_password: currPassword,
          new_password: newPassword
        }
      })
      setNewPasswordErr('')
      setCurrPasswordErr('')
      setNewPassword('')
      setCurrPassword('')
      toast.info('🚀 Your password changed!', { autoClose: 2000 })
    } catch (err) {
      setNewPasswordErr('')
      setCurrPasswordErr('')
      if (err.response) {
        if (err.response.data.new_password) {
          setNewPasswordErr(err.response.data.new_password)
        } else if (err.response.data.current_password) {
          setCurrPasswordErr(err.response.data.current_password)
        }
      }
    }
  }

  const handleProfileUpdate = (event) => {
    event.preventDefault()
    dispatch(updateProfile(firstName, lastName))
    setProfileUpdateClicked(true)
  }

  const handleEmailUpdate = (event) => {
    event.preventDefault()
    dispatch(updateEmail(email))
    setEmailChangeClicked(true)
  }

  const renderEditProfile = () => {
    return (
      <Box>
        <Box m={5}>
          <Typography className={classes.heading}>General</Typography>
          <Typography className={classes.secondaryHeading}>General profile settings</Typography>
          <form onSubmit={handleProfileUpdate}>
            <TextField
              required
              fullWidth
              margin="normal"
              id="first-name"
              name="first-name"
              label="First Name"
              variant="outlined"
              value={firstName}
              onChange={(event) => { setFirstName(event.target.value) }}
              error={profileUpdateClicked && !!(error && error.first_name)}
              helperText={profileUpdateClicked && error && error.first_name ? error.first_name : ''}
            />
            <TextField
              required
              fullWidth
              margin="normal"
              id="last-name"
              name="last-name"
              label="Last Name"
              variant="outlined"
              value={lastName}
              onChange={(event) => { setLastName(event.target.value) }}
              error={profileUpdateClicked && !!(error && error.last_name)}
              helperText={profileUpdateClicked && error && error.last_name ? error.last_name : ''}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
                Update Profile
            </Button>
          </form>
        </Box>
        <Box m={5} className={classes.disabledSection}>
          <Typography className={classes.heading}>Username</Typography>
          <Typography className={classes.secondaryHeading}>Change username over here</Typography>
          <form>
            <TextField
              required
              disabled
              fullWidth
              margin="normal"
              label="Username"
              name="username"
              id="username"
              defaultValue={user.username}
              variant="outlined"
            />
            <Button
              type="submit"
              disabled
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
                Update Username
            </Button>
          </form>
        </Box>
        <Box m={5}>
          <Typography className={classes.heading}>Email</Typography>
          <Typography className={classes.secondaryHeading}>Your email settings</Typography>
          <form onSubmit={handleEmailUpdate}>
            <TextField
              required
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              id="email"
              variant="outlined"
              value={email}
              onChange={(event) => { setEmail(event.target.value) }}
              error={emailChangeClicked && !!(error && error.email)}
              helperText={emailChangeClicked && error && error.email ? error.email : ''}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
                Update Email
            </Button>
          </form>
        </Box>
      </Box>
    )
  }

  const renderChangePassword = () => {
    return (
      <Box>
        <Box m={5}>
          <Typography className={classes.heading}>Change Your Password</Typography>
          <Typography className={classes.secondaryHeading}>You can change your password here</Typography>
          <form onSubmit={handleChangePassword}>
            <PasswordInput
              variant="outlined"
              required
              fullWidth
              margin="normal"
              name="current-password"
              label="Current Password"
              id="current-password"
              autoComplete="current-password"
              value={currPassword}
              onChange={(event) => { setCurrPassword(event.target.value) }}
              helperText={currPasswordErr}
            />
            <PasswordInput
              variant="outlined"
              required
              fullWidth
              margin="normal"
              name="new-password"
              label="New Password"
              id="new-password"
              value={newPassword}
              onChange={(event) => { setNewPassword(event.target.value) }}
              helperText={newPasswordErr}
            />
            <Button
              startIcon={<VpnKey />}
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
                Update Password
            </Button>
          </form>
        </Box>
      </Box>
    )
  }

  const renderDangerActions = () => {
    return (
      <Box>
        <Box m={5}>
          <Typography className={classes.heading}>Delete Account</Typography>
          <Typography className={classes.secondaryHeading}>Your all data will erase</Typography>
          <Button fullWidth startIcon={<DeleteForever />} className={classes.actionButton} variant="contained" color="secondary" onClick={() => { setDeleteAccountDialog(true) }}>
              Delete Account
          </Button>
        </Box>
      </Box>
    )
  }

  const renderSettingsTab = () => {
    return (
      <Box className={classes.changePasswordContainer}>
        <Accordion expanded={expanded === 'panel1'} onChange={handleAccordionChange('panel1')}>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography className={classes.heading}>Profile</Typography>
            <Typography className={classes.secondaryHeading}>Update your profile</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              {renderEditProfile()}
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'panel2'} onChange={handleAccordionChange('panel2')}>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography className={classes.heading}>Security</Typography>
            <Typography className={classes.secondaryHeading}>Manage your security</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              {renderChangePassword()}
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'panel3'} onChange={handleAccordionChange('panel3')}>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel2bh-content"
            id="panel2bh-header"
          >
            <Typography className={classes.heading}>Danger Zone</Typography>
            <Typography className={classes.secondaryHeading}>
            Make danger things
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              {renderDangerActions()}
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    )
  }

  const renderDeleteAccountDialog = () => {
    return (
      <Dialog
        open={deleteAccountDialog}
        keepMounted
        onClose={() => { setDeleteAccountDialog(false) }}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{'Delete Your Account?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            This action cannot be undone!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setDeleteAccountDialog(false) }} color="primary">
            Close
          </Button>
          <Button onClick={onDeleteAccountPress} color="primary">
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  const renderNoteTrackingTab = () => {
    return (
      <MaterialTable
        title="Track Your Notes"
        style={materialTableStyle}
        options={{
          // padding: 'dense',
          actionsColumnIndex: -1
        }}
        columns={[
          { field: 'path', title: 'Path', render: renderTrackingPathColumn, searchable: true },
          { field: 'updated_at', title: 'Last Updated' },
          { field: 'has_password', title: 'Password', type: 'boolean' }
        ]}
        actions={[
          { icon: () => <Backup/>, onClick: onNoteTrackingBackupPress, tooltip: 'Backup' }
        ]}
        data={trackings}
        editable={{
          onRowDelete: onNoteTrackingDeletePress
        }}
      />
    )
  }

  const renderNoteBackupTab = () => {
    return (
      <MaterialTable
        title="Your Note Backups"
        style={materialTableStyle}
        columns={[
          { field: 'unique_id', title: 'Unique ID', render: renderBackupIdColumn },
          { field: 'original_path', title: 'Original URL', render: renderBackupOrginalPathColumn },
          { field: 'updated_at', title: 'Last Backup', renderBackupDate }
        ]}
        actions={[
          { icon: () => <Search/>, onClick: onBackupViewPress, tooltip: 'View' }
        ]}
        data={backups}
        options={{
          // padding: 'dense',
          actionsColumnIndex: -1
        }}
        editable={{
          onRowDelete: onBackupDeletePress
        }}
      />
    )
  }

  const renderUserProfile = () => {
    return (
      <Box>
        <h1><b>{`${capitalizeFirstLetter(user.first_name)} ${capitalizeFirstLetter(user.last_name)} `}</b>{`(@${user.username})`}</h1>
        <Divider light />
        <Box m={1} mt={3}>
          <Box>
            <b>Email</b>
            <Typography className={classes.secondaryHeading}>
              {user.email}
            </Typography>
          </Box>
          <br/>
          <Box>
            <b>Joined</b>
            <Typography className={classes.secondaryHeading}>
              {timeAgo(user.date_joined)}
            </Typography>
          </Box>
          <br/>
          <Box>
            <b>Last Login</b>
            <Typography className={classes.secondaryHeading}>
              {timeAgo(user.last_login)}
            </Typography>
          </Box>
        </Box>
      </Box>
    )
  }

  const renderTabs = () => {
    return (
      <>
        <Tabs
          value={tabIndex}
          onChange={(event, newIndex) => { setTabIndex(newIndex) }}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="Tabs"
        >
          <Tab icon={<Timeline/>} label="Note Tracking" {...a11yProps(0)} />
          <Tab icon={<Backup/>} label="Note Backups" {...a11yProps(1)} />
          <Tab icon={<Settings/>} label="Settings" {...a11yProps(2)} />
        </Tabs>
        <TabPanel value={tabIndex} index={0} dir={theme.direction}>
          {renderNoteTrackingTab()}
        </TabPanel>
        <TabPanel value={tabIndex} index={1} dir={theme.direction}>
          {renderNoteBackupTab()}
        </TabPanel>
        <TabPanel value={tabIndex} index={2} dir={theme.direction}>
          {renderSettingsTab()}
          {renderDeleteAccountDialog()}
        </TabPanel>
      </>
    )
  }

  return (
    <Box className={isPhoneOrTablet ? classes.smallRoot : classes.root}>
      <Paper variant="outlined" className={isPhoneOrTablet ? classes.hide : classes.userProfileCard}>
        {renderUserProfile()}
      </Paper>
      <Paper variant="outlined" className={isPhoneOrTablet ? classes.smallTabsCard : classes.tabsCard}>
        {renderTabs()}
      </Paper>
    </Box>
  )
}

export default withUser(Me)
