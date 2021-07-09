import React from 'react'

// Components
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

// Icons
import Lock from '@material-ui/icons/Lock'

const PasswordHandling = props => {
  return (
    <Typography
      component="div"
      style={{
        display: 'flex',
        height: '80%',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={2}
        fontWeight="fontWeightMedium"
        fontSize={24}
        letterSpacing={6}>
        <Lock style={{fontSize: 200}} />
        <Box textAlign="center" m={4}>
          WAIT, PASSWORD HANDLING...
        </Box>
      </Box>
    </Typography>
  )
}

export default PasswordHandling
