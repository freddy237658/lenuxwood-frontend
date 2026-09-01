import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminLayout from './layouts/AdminLayout'
import ClientLayout from './layouts/ClientLayout'

import { useEffect } from 'react'
import api from './lib/api'

import Home from './pages/Home'
import Catalogue from './pages/Catalogue'
import Product from './pages/Product'
import Realisations from './pages/Realisations'
import Search from './pages/Search'
import Devis from './pages/Devis'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import About from './pages/About'
import Contact from './pages/Contact'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'

import Dashboard from './pages/admin/Dashboard'
import AdminMessages from './pages/admin/Messages'
import AdminProducts from './pages/admin/Products'
import AdminCategories from './pages/admin/Categories'
import AdminQuotes from './pages/admin/Quotes'
import AdminOrders from './pages/admin/Orders'
import AdminPayments from './pages/admin/Payments'
import AdminUsers from './pages/admin/Users'
import AdminRealisations from './pages/admin/Realisations'


import ClientOrders from './pages/client/Orders'
import ClientQuotes from './pages/client/Quotes'
import ClientMessages from './pages/client/Messages'
import ClientProfile from './pages/client/Profile'

export default function App() {
  useEffect(() => {
    if (!sessionStorage.getItem('lenuxwood_visit_tracked')) {
      api.post('/track-visit', { path: window.location.pathname }).catch(() => {})
      sessionStorage.setItem('lenuxwood_visit_tracked', '1')
    }
  }, [])

  return (
    <Routes>
      {/* Site public */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/catalogue" element={<Catalogue />} />        <Route path="/produit/:slug" element={<Product />} />
        <Route path="/realisations" element={<Realisations />} />
        <Route path="/recherche" element={<Search />} />
            <Route path="/devis" element={<Devis />} />
        <Route path="/panier" element={<Cart />} />
        <Route
          path="/commande"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route path="/a-propos" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Authentification (pages plein écran, sans header/footer du site) */}
      <Route path="/connexion" element={<Login />} />
      <Route path="/inscription" element={<Register />} />
      <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />

      {/* Espace client (protégé) */}
      <Route
        path="/compte"
        element={
          <ProtectedRoute>
            <ClientLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ClientOrders />} />
        <Route path="devis" element={<ClientQuotes />} />
        <Route path="messages" element={<ClientMessages />} />
        <Route path="profil" element={<ClientProfile />} />
      </Route>

      {/* Panel administrateur (protégé, réservé au rôle admin) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="produits" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
         <Route path="realisations" element={<AdminRealisations />} />
        <Route path="devis" element={<AdminQuotes />} />
        <Route path="commandes" element={<AdminOrders />} />
        <Route path="paiements" element={<AdminPayments />} />
        <Route path="messagerie" element={<AdminMessages />} />
        <Route path="utilisateurs" element={<AdminUsers />} />
      </Route>
    </Routes>
  )
}
