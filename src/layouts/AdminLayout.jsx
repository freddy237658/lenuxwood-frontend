import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  LayersIcon,
  ClipboardList,
  ShoppingCart,
  Wallet,
  Users,
  Image,
  MessageCircle,
  LogOut,
  ExternalLink,
  UserPlus,
  Mail,
  Menu,
  X,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import logo from '../assets/logo.jpg'
import { useEffect, useState } from 'react'

const NAV = [
  { to: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
  { to: '/admin/produits', label: 'Produits', icon: Package },
  { to: '/admin/equipe', label: 'Équipe', icon: UserPlus },
  { to: '/admin/messages-contact', label: 'Messages de contact', icon: Mail },
  { to: '/admin/realisations', label: 'Réalisations', icon: Image },
  { to: '/admin/categories', label: 'Catégories', icon: LayersIcon },
  { to: '/admin/devis', label: 'Devis', icon: ClipboardList },
  { to: '/admin/commandes', label: 'Commandes', icon: ShoppingCart },
  { to: '/admin/paiements', label: 'Paiements', icon: Wallet },
  { to: '/admin/messagerie', label: 'Messagerie', icon: MessageCircle },
  { to: '/admin/utilisateurs', label: 'Utilisateurs', icon: Users },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Fermer le menu mobile lors d'un changement de route
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  // Verrouiller le défilement arrière-plan lorsque le tiroir mobile est ouvert
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    api
      .get('/conversations')
      .then((res) => {
        const total = (res.data.data ?? []).reduce((sum, c) => sum + c.unread_count, 0)
        setUnreadMessages(total)
      })
      .catch(() => {})
  }, [])

  const handleLogout = async () => {
    setMobileMenuOpen(false)
    await logout()
    navigate('/')
  }

  const renderNavLinks = (onItemClick) => (
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onItemClick}
          className={({ isActive }) =>
            `flex items-center justify-between gap-3 px-4 py-2.5 rounded-full text-sm font-medium transition ${
              isActive ? 'bg-red-600 text-cream-50 shadow-xs' : 'text-wood-300 hover:bg-wood-900 hover:text-cream-100'
            }`
          }
        >
          <span className="flex items-center gap-3">
            <item.icon size={17} />
            {item.label}
          </span>
          {item.to === '/admin/messagerie' && unreadMessages > 0 && (
            <span className="w-5 h-5 rounded-full bg-oak-500 text-wood-950 text-[10px] font-bold flex items-center justify-center">
              {unreadMessages}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  )

  const renderFooterLinks = (onItemClick) => (
    <div className="px-3 py-4 border-t border-wood-800 space-y-1">
      <Link
        to="/"
        onClick={onItemClick}
        className="flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-medium text-wood-300 hover:bg-wood-900 hover:text-cream-100 transition"
      >
        <ExternalLink size={17} />
        Voir le site
      </Link>
      <button
        type="button"
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-medium text-wood-300 hover:bg-wood-900 hover:text-cream-100 transition text-left"
      >
        <LogOut size={17} />
        Déconnexion
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col lg:flex-row w-full">
      {/* Sidebar Desktop fixe */}
      <aside className="w-64 shrink-0 bg-wood-950 text-cream-100 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="flex items-center gap-2.5 px-6 py-6 border-b border-wood-800">
          <img src={logo} alt="LenuxWood" className="h-9 w-9 rounded-sm object-cover" />
          <div>
            <p className="font-display font-semibold text-sm">
              Lenux<span className="text-red-500">Wood</span>
            </p>
            <p className="text-[10px] uppercase tracking-[0.15em] text-wood-400">Administration</p>
          </div>
        </div>

        {renderNavLinks()}
        {renderFooterLinks()}
      </aside>

      {/* Arrière-plan sombre pour tiroir mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-wood-950/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Tiroir latéral Mobile (Sidebar) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-wood-950 text-cream-100 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Menu latéral mobile"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-wood-800">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="LenuxWood" className="h-9 w-9 rounded-sm object-cover" />
            <div>
              <p className="font-display font-semibold text-sm">
                Lenux<span className="text-red-500">Wood</span>
              </p>
              <p className="text-[10px] uppercase tracking-[0.15em] text-wood-400">Administration</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 rounded-lg text-wood-400 hover:text-cream-100 hover:bg-wood-900 transition"
            aria-label="Fermer le menu"
          >
            <X size={20} />
          </button>
        </div>

        {renderNavLinks(() => setMobileMenuOpen(false))}
        {renderFooterLinks(() => setMobileMenuOpen(false))}
      </aside>

      {/* Contenu principal */}
      <div className="flex-1 min-w-0 flex flex-col w-full">
        <header className="sticky top-0 z-20 bg-white border-b border-wood-700/10 px-4 sm:px-6 md:px-8 py-3.5 sm:py-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg text-wood-900 hover:bg-cream-100 active:bg-cream-200 transition focus:outline-none"
              aria-label="Ouvrir le menu de navigation"
            >
              <Menu size={22} />
            </button>
            <p className="font-display font-semibold text-wood-950 text-lg">
              Lenux<span className="text-red-600">Wood</span> <span className="text-wood-600 font-sans text-sm font-normal hidden sm:inline">| Admin</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/messagerie"
              className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-cream-100 transition"
              aria-label="Messagerie"
            >
              <MessageCircle size={18} className="text-wood-700" />
              {unreadMessages > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-600 text-cream-50 text-[9px] font-bold flex items-center justify-center">
                  {unreadMessages}
                </span>
              )}
            </Link>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-wood-900 leading-tight">{user?.name || 'Administrateur'}</p>
              <p className="text-xs text-wood-500">{user?.email}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-wood-950 text-oak-400 flex items-center justify-center font-display font-semibold text-sm">
              {(user?.name || 'A').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
