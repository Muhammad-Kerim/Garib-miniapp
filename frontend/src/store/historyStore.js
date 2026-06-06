import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useHistoryStore = create(
  persist(
    (set, get) => ({
      orders: [],

      addOrder: (order) => {
        set({ orders: [{ ...order, date: new Date().toISOString(), id: Date.now() }, ...get().orders] })
      },
    }),
    { name: 'garib-history' }
  )
)
