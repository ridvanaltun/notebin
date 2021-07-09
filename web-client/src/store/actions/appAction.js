import * as types from '../types'

export const setTitle = newTitle => dispatch => {
  dispatch({
    type: types.CHANGE_APP_TITLE,
    payload: {
      title: newTitle
    }
  })
}

export const hideNav = () => dispatch => {
  dispatch({
    type: types.HIDE_NAV
  })
}

export const showNav = () => dispatch => {
  dispatch({
    type: types.SHOW_NAV
  })
}
