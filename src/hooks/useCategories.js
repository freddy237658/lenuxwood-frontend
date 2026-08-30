import { useEffect, useState } from 'react'
import api from '../lib/api'

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    api
      .get('/categories')
      .then((res) => {
        if (active) setCategories(res.data.data ?? [])
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

  return { categories, loading, error }
}

export function categoryName(category, lang = 'fr') {
  return category?.name?.[lang] || category?.name?.fr || ''
}

export function categoryDescription(category, lang = 'fr') {
  return category?.description?.[lang] || category?.description?.fr || ''
}