import React from 'react'

// Components
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

const Blank = (props) => {
  return (
    <Typography component="div" style={{ display: 'flex', height: '80%', alignItems: 'center', justifyContent: 'center' }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={2}
        fontWeight="fontWeightMedium"
        fontSize={24}
        letterSpacing={6}
      >
        <img src="/images/blank.png" alt="Blank" width="25%" height="25%"></img>
        <Box textAlign="center" m={4}>
          NOTE NOT FOUNDED
        </Box>
      </Box>
    </Typography>
  )
}

export default Blank
