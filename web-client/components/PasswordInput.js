import React, { useState } from 'react'

// Components
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'

// Icons
import { Visibility, VisibilityOff } from '@material-ui/icons'

// Utils
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  eye: {
    cursor: 'pointer'
  }
}))

const PasswordInput = (props) => {
  const classes = useStyles()

  // States
  const [passwordIsMasked, setPasswordIsMasked] = useState(true)

  if (passwordIsMasked) {
    return (
      <TextField
        type='password'
        {...props}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Visibility
                className={classes.eye}
                onClick={() => { setPasswordIsMasked(false) }}
              />
            </InputAdornment>
          )
        }}
      />
    )
  }

  return (
    <TextField
      type='text'
      {...props}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <VisibilityOff
              className={classes.eye}
              onClick={() => { setPasswordIsMasked(true) }}
            />
          </InputAdornment>
        )
      }}
    />
  )
}

export default PasswordInput
