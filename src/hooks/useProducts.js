import { useEffect, useState } from 'react'
import api from '../lib/api'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    api
      .get('/products')
      .then((res) => {
        if (active) setProducts(res.data.data ?? [])
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

  return { products, loading, error }
}

export function useProduct(slug) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) return undefined
    let active = true
    setLoading(true)

    api
      .get(`/products/${slug}`)
      .then((res) => {
        if (active) setProduct(res.data.data ?? null)
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
  }, [slug])

  return { product, loading, error }
}