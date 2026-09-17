import { useCallback, useEffect, useRef, useState } from 'react'
import { cachedFetch, getPageCache, setPageCache } from '../utils/pageCache'

const useCachedResource = (key, fetcher, { enabled = true } = {}) => {
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher
  const keyRef = useRef(key)
  keyRef.current = key

  const cached = enabled ? getPageCache(key) : undefined
  const [data, setData] = useState(cached)
  const [loading, setLoading] = useState(enabled && cached === undefined)
  const [error, setError] = useState(false)

  const load = useCallback(
    async (force = false) => {
      if (!enabled || !key) return undefined
      const requestKey = key

      if (!force) {
        const existing = getPageCache(requestKey)
        if (existing !== undefined) {
          if (keyRef.current === requestKey) {
            setData(existing)
            setLoading(false)
            setError(false)
          }
          return existing
        }
      } else if (keyRef.current === requestKey) {
        setLoading(true)
      }

      if (keyRef.current === requestKey) {
        setError(false)
      }
      try {
        const result = await cachedFetch(requestKey, () => fetcherRef.current(), { force })
        if (keyRef.current === requestKey) {
          setData(result)
        }
        return result
      } catch (err) {
        if (keyRef.current === requestKey) {
          setError(true)
        }
        throw err
      } finally {
        if (keyRef.current === requestKey) {
          setLoading(false)
        }
      }
    },
    [enabled, key]
  )

  useEffect(() => {
    if (!enabled || !key) {
      setLoading(false)
      return undefined
    }

    let cancelled = false
    const existing = getPageCache(key)
    setData(existing)
    setError(false)

    if (existing !== undefined) {
      setLoading(false)
      return undefined
    }

    setLoading(true)
    load(false).catch(() => {
      if (!cancelled) setError(true)
    })

    return () => {
      cancelled = true
    }
  }, [enabled, key, load])

  const setCached = useCallback(
    (value) => {
      const next = typeof value === 'function' ? value(getPageCache(key)) : value
      setPageCache(key, next)
      setData(next)
    },
    [key]
  )

  return {
    data,
    loading,
    error,
    reload: () => load(true).catch(() => undefined),
    setCached,
  }
}

export default useCachedResource
