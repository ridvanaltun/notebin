const withPWA = require('next-pwa')

module.exports = withPWA({
  env: {
    API_BASE_URL: 'http://localhost:8000/api',
    NOTE_DEFAULT_FONT_SIZE: 18
  },
  pwa: {
    // more at https://github.com/shadowwalker/next-pwa#configuration
    disable: process.env.NODE_ENV === 'development', // whether to disable pwa feature as a whole
    // register: true,
    // scope: '/app', // string - url scope for pwa, default /
    // sw: 'service-worker.js', // service worker script file name, default to /sw.js
    dest: 'public'
  }
})
