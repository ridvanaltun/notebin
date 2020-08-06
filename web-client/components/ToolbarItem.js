import React from 'react'
import PropTypes from 'prop-types'

// Components
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'

// Utils
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  toolbarMenuItem: {
    marginRight: 5,
    marginLeft: 5
  },
  toolbarTitle: {
    fontSize: 'small',
    marginLeft: 5
  }
}))

const ToolbarItem = ({ title, icon, onClick, disabled }) => {
  const classes = useStyles()

  if (!title) {
    return (
      <Box className={classes.toolbarMenuItem}>
        <IconButton edge="start" color="inherit" aria-label="menu" disabled={disabled} onClick={onClick}>
          {icon}
        </IconButton>
      </Box>
    )
  }

  return (
    <Box className={classes.toolbarMenuItem}>
      <IconButton edge="start" color="inherit" aria-label="menu" disabled={disabled} onClick={onClick}>
        {icon}
        <Typography className={classes.toolbarTitle} variant="h6" color="inherit">
          {title}
        </Typography>
      </IconButton>
    </Box>
  )
}

ToolbarItem.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool
}

ToolbarItem.defaultProps = {
  disabled: false,
  onClick: () => {}
}

export default ToolbarItem
