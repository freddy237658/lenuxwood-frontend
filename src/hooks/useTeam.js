import { useEffect, useState } from 'react'
import api from '../lib/api'

export function useTeam() {
  const [team, setTeam] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    api
      .get('/team')
      .then((res) => {
        if (active) setTeam(res.data.data ?? [])
      })
      .catch((err) => {
        if (active) setError(err)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return { team, loading, error }
}