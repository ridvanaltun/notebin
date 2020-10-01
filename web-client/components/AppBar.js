import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'

// Components
import Bar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import Switch from '@material-ui/core/Switch'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Divider from '@material-ui/core/Divider'

// Icons
import { AccountCircle } from '@material-ui/icons'

// Utils
import { makeStyles } from '@material-ui/core/styles'
import { useRouter } from 'next/router'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/actions/authAction'

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  formControlLabel: {
    fontSize: 'small'
  },
  divider: {
    margin: 10,
    marginLeft: 20,
    marginRight: 20
  }
}))

const AppBar = ({ handleDarkThemeToggle, darkState }) => {
  const classes = useStyles()
  const router = useRouter()
  const dispatch = useDispatch()

  // States
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  // Redux States
  const { title, hideNav } = useSelector(state => state.app)
  const { user, accessToken, refreshToken } = useSelector(state => state.auth)

  const handleUserMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfile = () => {
    setAnchorEl(null)
    router.push('/me')
  }

  const handleLogout = () => {
    setAnchorEl(null)
    dispatch(logout(refreshToken))
  }

  const renderProfile = () => {
    return (
      <>
        <Button
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleUserMenu}
          startIcon={<AccountCircle />}
          color="inherit"
        >
          {user.username}
        </Button>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          open={open}
          onClose={() => { setAnchorEl(null) }}
        >
          <MenuItem onClick={handleProfile}>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </>)
  }

  if (hideNav) {
    return null
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Bar position="sticky">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={<Switch checked={darkState} onChange={(event) => {
                handleDarkThemeToggle(event.target.checked)
              }} />}
              label={<Typography className={classes.formControlLabel}>Dark Mode</Typography>}
              labelPlacement="start"
            />
          </FormGroup>
          <Divider className={classes.divider} orientation="vertical" flexItem light />
          <Button
            color="inherit"
            onClick={() => { router.push('/') }}
            style={{ marginRight: 10 }}
          >
            Create Note
          </Button>
          {accessToken ? renderProfile()
            : <Button color="inherit" onClick={() => { router.push('/login') }}>Login</Button>}
        </Toolbar>
      </Bar>
    </>
  )
}

AppBar.propTypes = {
  darkState: PropTypes.bool.isRequired,
  handleDarkThemeToggle: PropTypes.func.isRequired
}

export default AppBar
