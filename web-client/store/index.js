import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import rootReducer from './reducers'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth']
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const initialState = {}
const middleware = [thunk]

const configureStore = () => {
  const store = createStore(persistedReducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))
  const persistor = persistStore(store)
  return { store, persistor }
}

const { store, persistor } = configureStore()

export { store, persistor }
