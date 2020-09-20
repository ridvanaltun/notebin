import Router from 'next/router'
import axios from 'axios'
import * as types from '../types'
import { apiClient } from '../../utils'
import { toast } from 'react-toastify'

export const login = (username, password) => async dispatch => {
  dispatch({
    type: types.LOGIN_BEGIN
  })
  try {
    const res = await axios.post(`${process.env.API_BASE_URL}/login`, { username, password })
    dispatch({
      type: types.LOGIN_SUCCESS,
      payload: res.data
    })
    Router.push('/me')
  } catch (error) {
    if (error.response) {
      dispatch({
        type: types.LOGIN_ERROR,
        payload: {
          error: error.response.data,
          errorStatus: error.response.status
        }
      })
    } else if (error.request) {
      dispatch({
        type: types.LOGIN_ERROR,
        payload: {
          error: error.request
        }
      })
    } else {
      dispatch({
        type: types.LOGIN_ERROR,
        payload: {
          error: error.message
        }
      })
    }
  }
}

export const logout = (refreshToken) => async dispatch => {
  dispatch({
    type: types.LOGOUT_BEGIN
  })
  try {
    await axios.post(`${process.env.API_BASE_URL}/logout`, { refresh: refreshToken })
    dispatch({
      type: types.LOGOUT_SUCCESS
    })
    Router.push('/login')
  } catch (error) {
    if (error.response) {
      dispatch({
        type: types.LOGOUT_ERROR,
        payload: {
          error: error.response.data,
          errorStatus: error.response.status
        }
      })
    } else if (error.request) {
      dispatch({
        type: types.LOGOUT_ERROR,
        payload: {
          error: error.request
        }
      })
    } else {
      dispatch({
        type: types.LOGOUT_ERROR,
        payload: {
          error: error.message
        }
      })
    }
  }
}

export const register = (username, password, email, firstName, lastName, emailUpdates) => async dispatch => {
  dispatch({
    type: types.LOGIN_BEGIN
  })
  try {
    const res = await axios.post(`${process.env.API_BASE_URL}/register`, {
      username,
      password,
      email,
      first_name: firstName,
      last_name: lastName,
      email_updates: emailUpdates
    })
    dispatch({
      type: types.LOGIN_SUCCESS,
      payload: res.data
    })
    Router.push('/me')
  } catch (error) {
    if (error.response) {
      dispatch({
        type: types.LOGIN_ERROR,
        payload: {
          error: error.response.data,
          errorStatus: error.response.status
        }
      })
    } else if (error.request) {
      dispatch({
        type: types.LOGIN_ERROR,
        payload: {
          error: error.request
        }
      })
    } else {
      dispatch({
        type: types.LOGIN_ERROR,
        payload: {
          error: error.message
        }
      })
    }
  }
}

export const deleteUser = () => async dispatch => {
  dispatch({
    type: types.LOGOUT_BEGIN
  })
  try {
    await apiClient({
      method: 'delete',
      url: '/me'
    })
    dispatch({
      type: types.LOGOUT_SUCCESS
    })
    Router.push('/login')
  } catch (error) {
    if (error.response) {
      dispatch({
        type: types.LOGOUT_ERROR,
        payload: {
          error: error.response.data,
          errorStatus: error.response.status
        }
      })
    } else if (error.request) {
      dispatch({
        type: types.LOGOUT_ERROR,
        payload: {
          error: error.request
        }
      })
    } else {
      dispatch({
        type: types.LOGOUT_ERROR,
        payload: {
          error: error.message
        }
      })
    }
  }
}

export const updateEmail = (newEmail) => async dispatch => {
  dispatch({
    type: types.UPDATE_PROFILE_BEGIN
  })
  try {
    const res = await apiClient({
      method: 'patch',
      url: '/me',
      data: {
        email: newEmail
      }
    })
    dispatch({
      type: types.UPDATE_PROFILE_SUCCESS,
      payload: res.data
    })
    toast.info('🚀 Your email address updated!', { autoClose: 2000 })
  } catch (error) {
    if (error.response) {
      dispatch({
        type: types.UPDATE_PROFILE_ERROR,
        payload: {
          error: error.response.data,
          errorStatus: error.response.status
        }
      })
    } else if (error.request) {
      dispatch({
        type: types.UPDATE_PROFILE_ERROR,
        payload: {
          error: error.request
        }
      })
    } else {
      dispatch({
        type: types.UPDATE_PROFILE_ERROR,
        payload: {
          error: error.message
        }
      })
    }
  }
}

export const updateProfile = (firstName, lastName) => async dispatch => {
  dispatch({
    type: types.UPDATE_PROFILE_BEGIN
  })
  try {
    const res = await apiClient({
      method: 'patch',
      url: '/me',
      data: {
        first_name: firstName,
        last_name: lastName
      }
    })
    dispatch({
      type: types.UPDATE_PROFILE_SUCCESS,
      payload: res.data
    })
    toast.info('🚀 Your profile updated!', { autoClose: 2000 })
  } catch (error) {
    if (error.response) {
      dispatch({
        type: types.UPDATE_PROFILE_ERROR,
        payload: {
          error: error.response.data,
          errorStatus: error.response.status
        }
      })
    } else if (error.request) {
      dispatch({
        type: types.UPDATE_PROFILE_ERROR,
        payload: {
          error: error.request
        }
      })
    } else {
      dispatch({
        type: types.UPDATE_PROFILE_ERROR,
        payload: {
          error: error.message
        }
      })
    }
  }
}
