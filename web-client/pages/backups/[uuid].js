import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

// Custom Components
import { NotePaper, Blank, BackupHandling } from '../../components'

// Redux
import { useDispatch } from 'react-redux'
import { setTitle } from '../../store/actions/appAction'

// Utils
import { apiClient } from '../../utils'

const Backup = ({ uuid }) => {
  const dispatch = useDispatch()

  // States
  const [backup, setBackup] = useState(null)
  const [notFounded, setNotFounded] = useState(false)
  const [loading, setLoading] = useState(true)

  // Change App Title
  useEffect(() => { dispatch(setTitle('Backup')) }, [])

  // Fetch Backup
  useEffect(() => {
    async function fetchBackup () {
      try {
        const res = await apiClient({
          method: 'get',
          url: `/backups/${uuid}`
        })
        setBackup(res.data)
      } catch (error) {
        if (error.response && error.response.status === 404) setNotFounded(true)
      } finally {
        setLoading(false)
      }
    }
    fetchBackup()
  }, [])

  if (loading) return <BackupHandling/>

  if (notFounded) return <Blank/>

  return (
    <>
      <NotePaper value={backup.text} readOnly={true} placeholder="THIS NOTE IS EMPTY" />
    </>
  )
}

Backup.getInitialProps = async (ctx) => {
  const { uuid } = ctx.query

  return { uuid }
}

Backup.propTypes = {
  uuid: PropTypes.string
}

export default Backup
