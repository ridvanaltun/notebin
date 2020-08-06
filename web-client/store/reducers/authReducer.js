import * as types from '../types'

const initialState = {
  loading: false,
  user: {},
  accessToken: null,
  refreshToken: null,
  error: null,
  errorStatus: null
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.LOGIN_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
        errorStatus: null
      }
    case types.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        accessToken: action.payload.token.access,
        refreshToken: action.payload.token.refresh
      }
    case types.LOGIN_ERROR:
      return {
        ...state,
        loading: false,
        user: {},
        accessToken: null,
        refreshToken: null,
        error: action.payload.error,
        errorStatus: action.payload.errorStatus || null
      }
    case types.LOGOUT_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
        errorStatus: null
      }
    case types.LOGOUT_SUCCESS:
      return {
        ...state,
        loading: false,
        user: {},
        accessToken: null,
        refreshToken: null
      }
    case types.LOGOUT_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        errorStatus: action.payload.errorStatus || null
      }
    case types.UPDATE_PROFILE_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
        errorStatus: null
      }
    case types.UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload
      }
    case types.UPDATE_PROFILE_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        errorStatus: action.payload.errorStatus || null
      }
    case types.REFRESH_TOKEN:
      return {
        ...state,
        accessToken: action.payload.accessToken
      }
    default:
      return state
  }
}

export default authReducer
