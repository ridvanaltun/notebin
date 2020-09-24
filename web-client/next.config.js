const withPWA = require('next-pwa')

module.exports = withPWA({
  env: {
    API_BASE_URL: 'http://localhost:8000/api',
    NOTE_DEFAULT_FONT_SIZE: 18
  },
  pwa: {
    dest: 'public'
  }
})
