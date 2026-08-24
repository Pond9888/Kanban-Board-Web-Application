"use client"
import { useEffect, useRef } from 'react'
import { useBoardStore } from '@/lib/store'

export function StoreInitializer() {
  const fetchBoardData = useBoardStore((state) => state.fetchBoardData)
  const initialized = useRef(false)
  
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      fetchBoardData()
    }
  }, [fetchBoardData])

  return null
}
