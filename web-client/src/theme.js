import {createMuiTheme} from '@material-ui/core/styles'
import {red, orange, deepOrange} from '@material-ui/core/colors'

const Theme = darkState => {
  const palletType = darkState ? 'dark' : 'light'
  const mainPrimaryColor = darkState ? orange[500] : '#556cd6'
  const mainSecondaryColor = darkState ? deepOrange[900] : '#19857b'
  const defaultBackgroundColor = darkState ? 'darkslategrey' : '#fff'

  return createMuiTheme({
    palette: {
      type: palletType,
      primary: {
        main: mainPrimaryColor
      },
      secondary: {
        main: mainSecondaryColor
      },
      error: {
        main: red.A400
      },
      background: {
        default: defaultBackgroundColor
      }
    }
  })
}

export default Theme
