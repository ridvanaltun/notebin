import * as types from '../types'

const initialState = {
  loading: false,
  note: {},
  error: null,
  errorStatus: null
}

const noteReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_NOTE_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      }
    case types.FETCH_NOTE_SUCCESS:
      return {
        ...state,
        loading: false,
        note: action.payload
      }
    case types.FETCH_NOTE_ERROR:
      return {
        ...state,
        loading: false,
        note: {},
        error: action.payload.error,
        errorStatus: action.payload.errorStatus || null
      }
    case types.CREATE_NOTE_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      }
    case types.CREATE_NOTE_SUCCESS:
      return {
        ...state,
        loading: false,
        note: action.payload
      }
    case types.CREATE_NOTE_ERROR:
      return {
        ...state,
        loading: false,
        note: {},
        error: action.payload.error,
        errorStatus: action.payload.errorStatus || null
      }
    case types.CHANGE_NOTE_PASSWORD_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      }
    case types.CHANGE_NOTE_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        note: action.payload
      }
    case types.CHANGE_NOTE_PASSWORD_ERROR:
      return {
        ...state,
        loading: false,
        note: {},
        error: action.payload.error,
        errorStatus: action.payload.errorStatus || null
      }
    case types.SET_NOTE_TEXT:
      if (state.note.text) {
        const { note } = state
        note.text = action.payload
        return {
          ...state,
          note
        }
      }
      return state
    default:
      return state
  }
}

export default noteReducer
