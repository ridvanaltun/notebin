import * as types from '../types'
import axios from 'axios'

export const fetchNote = (path) => async dispatch => {
  dispatch({
    type: types.FETCH_NOTE_BEGIN
  })
  try {
    const res = await axios.get(`${process.env.API_BASE_URL}/notes/${path}`)
    dispatch({
      type: types.FETCH_NOTE_SUCCESS,
      payload: res.data
    })
  } catch (error) {
    if (error.response) {
      dispatch({
        type: types.FETCH_NOTE_ERROR,
        payload: {
          error: error.response.data,
          errorStatus: error.response.status
        }
      })
    } else if (error.request) {
      dispatch({
        type: types.FETCH_NOTE_ERROR,
        payload: {
          error: error.request
        }
      })
    } else {
      dispatch({
        type: types.FETCH_NOTE_ERROR,
        payload: {
          error: error.message
        }
      })
    }
  }
}

export const createNote = (path = null) => async dispatch => {
  dispatch({
    type: types.CREATE_NOTE_BEGIN
  })
  try {
    const data = {}

    if (path !== null) {
      data.path = path
    }

    const res = await axios.post(`${process.env.API_BASE_URL}/notes`, data)

    dispatch({
      type: types.CREATE_NOTE_SUCCESS,
      payload: res.data
    })
  } catch (error) {
    if (error.response) {
      dispatch({
        type: types.CREATE_NOTE_ERROR,
        payload: {
          error: error.response.data,
          errorStatus: error.response.status
        }
      })
    } else if (error.request) {
      dispatch({
        type: types.CREATE_NOTE_ERROR,
        payload: {
          error: error.request
        }
      })
    } else {
      dispatch({
        type: types.CREATE_NOTE_ERROR,
        payload: {
          error: error.message
        }
      })
    }
  }
}

export const applyNotePassword = (path, password) => async dispatch => {
  dispatch({
    type: types.CHANGE_NOTE_PASSWORD_BEGIN
  })
  try {
    const res = await axios.post(`${process.env.API_BASE_URL}/notes/${path}/password`, {
      password
    })
    dispatch({
      type: types.CHANGE_NOTE_PASSWORD_BEGIN,
      payload: res.data
    })
  } catch (error) {
    if (error.response) {
      dispatch({
        type: types.CHANGE_NOTE_PASSWORD_ERROR,
        payload: {
          error: error.response.data,
          errorStatus: error.response.status
        }
      })
    } else if (error.request) {
      dispatch({
        type: types.CHANGE_NOTE_PASSWORD_ERROR,
        payload: {
          error: error.request
        }
      })
    } else {
      dispatch({
        type: types.CHANGE_NOTE_PASSWORD_ERROR,
        payload: {
          error: error.message
        }
      })
    }
  }
}

export const removeNotePassword = (path, password) => async dispatch => {
  dispatch({
    type: types.CHANGE_NOTE_PASSWORD_BEGIN
  })
  try {
    const res = await axios.delete(`${process.env.API_BASE_URL}/notes/${path}/password`, {
      password
    })
    dispatch({
      type: types.CHANGE_NOTE_PASSWORD_BEGIN,
      payload: res.data
    })
  } catch (error) {
    if (error.response) {
      dispatch({
        type: types.CHANGE_NOTE_PASSWORD_ERROR,
        payload: {
          error: error.response.data,
          errorStatus: error.response.status
        }
      })
    } else if (error.request) {
      dispatch({
        type: types.CHANGE_NOTE_PASSWORD_ERROR,
        payload: {
          error: error.request
        }
      })
    } else {
      dispatch({
        type: types.CHANGE_NOTE_PASSWORD_ERROR,
        payload: {
          error: error.message
        }
      })
    }
  }
}

export const setNoteText = (text) => async dispatch => {
  dispatch({
    type: types.SET_NOTE_TEXT,
    payload: text
  })
}
