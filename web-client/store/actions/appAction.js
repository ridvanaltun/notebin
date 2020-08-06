import * as types from '../types'

export const setTitle = (newTitle) => dispatch => {
  dispatch({
    type: types.CHANGE_APP_TITLE,
    payload: {
      title: newTitle
    }
  })
}
