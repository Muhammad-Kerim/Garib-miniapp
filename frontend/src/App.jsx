import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import CatalogPage from './pages/CatalogPage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import FavoritesPage from './pages/FavoritesPage'
import OrderHistoryPage from './pages/OrderHistoryPage'
import SplashScreen from './components/SplashScreen'
import BottomNav from './components/BottomNav'

export default function App() {
  const [splash, setSplash] = useState(true)

  return (
    <>
      {splash && <SplashScreen onDone={() => setSplash(false)} />}
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/history" element={<OrderHistoryPage />} />
      </Routes>
      <BottomNav />
    </>
  )
}
