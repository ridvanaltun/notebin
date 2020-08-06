import React from 'react'

// Components
import InputBase from '@material-ui/core/InputBase'

// Utils
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  note: {
    display: 'flex',
    backgroundColor: '#f2eecb',
    padding: 25
  }
})

const NotePaper = (props) => {
  const classes = useStyles()

  return (
    <InputBase
      autoFocus
      id="note"
      multiline
      rows={25}
      placeholder="Note"
      className={classes.note}
      {...props}
    />
  )
}

export default NotePaper
