import React, {useEffect, useState} from 'react'

// Custom Components
import {NotePaper, Blank, BackupHandling} from '../../components'

// Redux
import {useDispatch} from 'react-redux'
import {setTitle} from '../../store/actions/appAction'

// Utils
import {useRouter} from 'next/router'
import {apiClient, withUser} from '../../utils'

const Backup = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  // States
  const {uuid} = router.query
  const [backup, setBackup] = useState(null)
  const [notFounded, setNotFounded] = useState(false)
  const [loading, setLoading] = useState(true)

  // Change App Title
  useEffect(() => {
    dispatch(setTitle('Backup'))
  }, [])

  // Fetch Backup
  useEffect(() => {
    async function fetchBackup() {
      try {
        const res = await apiClient({
          method: 'get',
          url: `/backups/${uuid}`
        })
        setBackup(res.data)
      } catch (error) {
        // request correct but note not found or the backup not belong to the user
        if (error.response && error.response.status === 404) setNotFounded(true)

        // bad request like uuid not valid
        if (error.response && error.response.status === 400) setNotFounded(true)
      } finally {
        setLoading(false)
      }
    }
    if (uuid) fetchBackup()
  }, [uuid])

  if (loading) return <BackupHandling />

  if (notFounded) return <Blank />

  return (
    <>
      <NotePaper
        value={backup.text}
        readOnly={true}
        placeholder="THIS NOTE IS EMPTY"
      />
    </>
  )
}

export default withUser(Backup)
