import React from 'react'
import PropTypes from 'prop-types'

// Components
import Box from '@material-ui/core/Box'

// Custom Components
import Typography from './Typography'

const TabPanel = props => {
  const {children, value, index, ...others} = props

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...others}>
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </Box>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
}

export default TabPanel
