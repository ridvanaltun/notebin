/**
 * const [value, setValue] = useLocalStorage('key', initialValue)
 */

import {useState, useEffect} from 'react'

const storage = {
  getItem(key, initialValue) {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      const unparsedValue = window.localStorage[key]
      if (typeof unparsedValue === 'undefined') {
        return initialValue
      }
      return JSON.parse(unparsedValue)
    } catch (error) {
      return initialValue
    }
  },

  setItem(key, value) {
    window.localStorage[key] = JSON.stringify(value)
  }
}

const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(storage.getItem(key, initialValue))
  }, [key, initialValue])

  const setItem = newValue => {
    setValue(newValue)
    storage.setItem(key, newValue)
  }

  return [value, setItem]
}

export default useLocalStorage
