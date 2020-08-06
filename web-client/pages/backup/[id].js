import React from 'react'
import PropTypes from 'prop-types'

// Utils
import { withUser } from '../../utils'

const Backup = ({ id }) => {
  return (
    <>
    </>
  )
}

Backup.getInitialProps = async (ctx) => {
  const { id } = ctx.query
  return { id }
}

Backup.propTypes = {
  id: PropTypes.string.isRequired
}

export default withUser(Backup)
