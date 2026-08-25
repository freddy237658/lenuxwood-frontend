import { NavLink, Outlet, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  LayersIcon,
  ClipboardList,
  ShoppingCart,
  Wallet,
  Users,
  MessageCircle,
  LogOut,
  ExternalLink,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { CONVERSATIONS } from '../data/messages-mock'
import logo from '../assets/logo.jpg'

const NAV = [
  { to: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
  { to: '/admin/produits', label: 'Produits', icon: Package },
  { to: '/admin/categories', label: 'Catégories', icon: LayersIcon },
  { to: '/admin/devis', label: 'Devis', icon: ClipboardList },
  { to: '/admin/commandes', label: 'Commandes', icon: ShoppingCart },
  { to: '/admin/paiements', label: 'Paiements', icon: Wallet },
  { to: '/admin/messagerie', label: 'Messagerie', icon: MessageCircle },
  { to: '/admin/utilisateurs', label: 'Utilisateurs', icon: Users },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const unreadMessages = CONVERSATIONS.reduce((sum, c) => sum + c.unread, 0)

  return (
    <div className="min-h-screen bg-cream-100 flex">
      <aside className="w-64 shrink-0 bg-wood-950 text-cream-100 hidden lg:flex flex-col">
        <div className="flex items-center gap-2.5 px-6 py-6 border-b border-wood-800">
          <img src={logo} alt="LenuxWood" className="h-9 w-9 rounded-sm object-cover" />
          <div>
            <p className="font-display font-semibold text-sm">
              Lenux<span className="text-red-500">Wood</span>
            </p>
            <p className="text-[10px] uppercase tracking-[0.15em] text-wood-400">Administration</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center justify-between gap-3 px-4 py-2.5 rounded-full text-sm font-medium transition ${
                  isActive ? 'bg-red-600 text-cream-50' : 'text-wood-300 hover:bg-wood-900 hover:text-cream-100'
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

        <div className="px-3 py-4 border-t border-wood-800 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-medium text-wood-300 hover:bg-wood-900 hover:text-cream-100 transition"
          >
            <ExternalLink size={17} />
            Voir le site
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-medium text-wood-300 hover:bg-wood-900 hover:text-cream-100 transition"
          >
            <LogOut size={17} />
            Déconnexion
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="bg-white border-b border-wood-700/10 px-5 md:px-8 py-4 flex items-center justify-between">
          <p className="font-display font-semibold text-wood-950 text-lg lg:hidden">
            Lenux<span className="text-red-600">Wood</span> Admin
          </p>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <Link to="/admin/messagerie" className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-cream-100 transition">
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

        <main className="p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
