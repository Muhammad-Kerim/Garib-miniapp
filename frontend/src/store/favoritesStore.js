import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favorites: [],

      toggleFavorite: (product) => {
        const favorites = get().favorites
        const exists = favorites.some(f => f.id === product.id)
        if (exists) {
          set({ favorites: favorites.filter(f => f.id !== product.id) })
        } else {
          set({ favorites: [...favorites, product] })
        }
      },

      isFavorite: (id) => get().favorites.some(f => f.id === id),
    }),
    { name: 'garib-favorites' }
  )
)
