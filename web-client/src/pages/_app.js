import React, {useEffect} from 'react'
import Router from 'next/router'
import Head from 'next/head'
import PropTypes from 'prop-types'
import {ThemeProvider} from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from '../theme'

// Custom Components
import {AppBar} from '../components'

// Notification
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Loading
import NProgress from 'nprogress' // nprogress module
import 'nprogress/nprogress.css' // styles of nprogress

// Redux
import {Provider} from 'react-redux'
import {PersistGate} from 'redux-persist/integration/react'
import {createWrapper} from 'next-redux-wrapper'
import {store, persistor} from '../store'

// Utils
import {useLocalStorage} from '../utils'

// Set Progress Bar
NProgress.configure({showSpinner: false})

// Binding events.
Router.events.on('routeChangeStart', url => {
  NProgress.start()
})
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

const MyApp = props => {
  const {Component, pageProps} = props

  // States
  const [darkState, setDarkState] = useLocalStorage('darkTheme', false)

  // Remove the server-side injected CSS.
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  const toggleDarkTheme = status => {
    setDarkState(status)
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no"
          />
          <title>Notebin</title>
        </Head>
        <ThemeProvider theme={theme(darkState)}>
          <CssBaseline />
          <AppBar
            darkState={darkState}
            handleDarkThemeToggle={toggleDarkTheme}
          />
          <Component {...pageProps} />
          <ToastContainer position="bottom-right" />
        </ThemeProvider>
        <style jsx global>{`
          html,
          body,
          #__next {
            height: 100%;
          }
          a {
            text-decoration: none;
            color: darkgrey;
            font-weight: bold;
          }
          header a {
            color: white;
          }
          td a {
            color: currentcolor;
            font-weight: unset;
            text-decoration: underline;
          }
          #nprogress .bar {
            height: 6px;
          }
          #nprogress .bar {
            background: purple;
          }
        `}</style>
      </PersistGate>
    </Provider>
  )
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired
}

const wrapper = createWrapper(() => store)

export default wrapper.withRedux(MyApp)
