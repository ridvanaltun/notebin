// Intercept and refresh expired tokens for multiple requests (same implementation but with some abstractions)
//
// HOW TO USE:
// import applyAppTokenRefreshInterceptor from 'axios.refresh_token.2.js';
// import axios from 'axios';
// ...
// applyAppTokenRefreshInterceptor(axios); // register the interceptor with all axios instance
// ...
// - Alternatively:
// const apiClient = axios.create({baseUrl: 'example.com/api'});
// applyAppTokenRefreshInterceptor(apiClient); // register the interceptor with one specific axios instance
// ...
// - With custom options:
// applyAppTokenRefreshInterceptor(apiClient, {
//      shouldIntercept: (error) => {
//          return error.response.data.errorCode === 'EXPIRED_ACCESS_TOKEN';
//      }
// ); // register the interceptor with one specific axios instance
//
// PS: If refresh token invalid, client logouts automatically

import axios from 'axios'
import {toast} from 'react-toastify'

// Redux
import {store} from '../store'
import * as types from '../store/types'
import {logout} from '../store/actions/authAction'

const shouldIntercept = error => {
  try {
    return error.response.status === 401
  } catch (e) {
    return false
  }
}

const setTokenData = (tokenData = {}, axiosClient) => {
  store.dispatch({
    type: types.REFRESH_TOKEN,
    payload: {
      accessToken: tokenData.accessToken
    }
  })
}

const handleTokenRefresh = () => {
  const {refreshToken} = store.getState().auth
  return new Promise((resolve, reject) => {
    axios
      .post(`${process.env.API_BASE_URL}/token/refresh`, {
        refresh: refreshToken
      })
      .then(({data}) => {
        const tokenData = {
          accessToken: data.access
        }
        resolve(tokenData)
      })
      .catch(err => {
        // @todo: refresh token invalid, go to login page
        reject(err)
      })
  })
}

const handleUnvalidRefreshToken = () => {
  // logout when refresh token expired or unvalid
  const {refreshToken} = store.getState().auth
  toast.error('🚀 Session expired! Login again!', {autoClose: false})
  store.dispatch(logout(refreshToken))
}

const attachTokenToRequest = (request, token) => {
  request.headers.Authorization = 'Bearer ' + token
}

const applyAppTokenRefreshInterceptor = (axiosClient, customOptions = {}) => {
  let isRefreshing = false
  let failedQueue = []

  const options = {
    attachTokenToRequest,
    handleTokenRefresh,
    handleUnvalidRefreshToken,
    setTokenData,
    shouldIntercept,
    ...customOptions
  }

  const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error)
      } else {
        prom.resolve(token)
      }
    })

    failedQueue = []
  }

  const interceptor = error => {
    if (!options.shouldIntercept(error)) {
      return Promise.reject(error)
    }

    if (error.config._retry || error.config._queued) {
      return Promise.reject(error)
    }

    const originalRequest = error.config
    if (isRefreshing) {
      return new Promise(function (resolve, reject) {
        failedQueue.push({resolve, reject})
      })
        .then(token => {
          originalRequest._queued = true
          options.attachTokenToRequest(originalRequest, token)
          return axiosClient.request(originalRequest)
          // eslint-disable-next-line handle-callback-err
        })
        .catch(err => {
          // Ignore refresh token request's "err" and return actual "error" for the original request
          return Promise.reject(error)
        })
    }

    originalRequest._retry = true
    isRefreshing = true
    return new Promise((resolve, reject) => {
      options.handleTokenRefresh
        .call(options.handleTokenRefresh)
        .then(tokenData => {
          options.setTokenData(tokenData, axiosClient)
          options.attachTokenToRequest(originalRequest, tokenData.accessToken)
          processQueue(null, tokenData.accessToken)
          resolve(axiosClient.request(originalRequest))
        })
        .catch(err => {
          processQueue(err, null)
          options.handleUnvalidRefreshToken()
          reject(err)
        })
        .finally(() => {
          isRefreshing = false
        })
    })
  }

  axiosClient.interceptors.response.use(undefined, interceptor)
}

// moved out from apiClient because in every request
// ... these object create again which causes memory leak
const client = axios.create({
  baseURL: process.env.API_BASE_URL
})

// register the interceptor with one specific axios instance
applyAppTokenRefreshInterceptor(client)

const apiClient = async (requestSettings, bindToken = true) => {
  // bind token
  const {accessToken} = store.getState().auth
  if (bindToken && accessToken) {
    client.defaults.headers.common.Authorization = `Bearer ${accessToken}`
  }

  return await client(requestSettings)
}

export default apiClient
