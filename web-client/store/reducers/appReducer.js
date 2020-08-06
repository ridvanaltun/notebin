import * as types from '../types'

const initialState = {
  title: 'Notebin'
}

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.CHANGE_APP_TITLE:
      return {
        ...state,
        title: action.payload.title
      }
    default:
      return state
  }
}

export default appReducer
