import * as types from '../types'

const initialState = {
  title: 'Notebin',
  hideNav: false
}

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.CHANGE_APP_TITLE:
      return {
        ...state,
        title: action.payload.title
      }
    case types.HIDE_NAV:
      return {
        ...state,
        hideNav: true
      }
    case types.SHOW_NAV:
      return {
        ...state,
        hideNav: false
      }
    default:
      return state
  }
}

export default appReducer
