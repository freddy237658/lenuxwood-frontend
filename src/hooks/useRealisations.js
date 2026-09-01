import { useEffect, useState } from 'react'
import api from '../lib/api'

export function useRealisations(categorySlug) {
  const [realisations, setRealisations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    setLoading(true)

    api
      .get('/realisations', { params: categorySlug ? { category: categorySlug } : {} })
      .then((res) => {
        if (active) setRealisations(res.data.data ?? [])
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
  }, [categorySlug])

  return { realisations, loading, error }
}