import { combineReducers } from 'redux'

// Reducers
import appReducer from './appReducer'
import authReducer from './authReducer'

export default combineReducers({
  app: appReducer,
  auth: authReducer
})
