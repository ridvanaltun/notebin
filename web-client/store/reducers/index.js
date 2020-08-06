import { combineReducers } from 'redux'

// Reducers
import appReducer from './appReducer'
import authReducer from './authReducer'
import noteReducer from './noteReducer'

export default combineReducers({
  app: appReducer,
  auth: authReducer,
  note: noteReducer
})
