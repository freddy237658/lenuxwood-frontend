import { NavLink, Outlet, Link } from 'react-router-dom'
import { ShoppingCart, ClipboardList, MessageCircle, User, LogOut, ExternalLink } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { CLIENT_CONVERSATION } from '../data/client-messages-mock'
import logo from '../assets/logo.jpg'

const NAV = [
  { to: '/compte', label: 'Mes commandes', icon: ShoppingCart, end: true },
  { to: '/compte/devis', label: 'Mes devis', icon: ClipboardList },
  { to: '/compte/messages', label: 'Messages', icon: MessageCircle },
  { to: '/compte/profil', label: 'Profil', icon: User },
]

export default function ClientLayout() {
  const { user, logout } = useAuth()
  const unread = CLIENT_CONVERSATION.messages.filter((m) => m.from === 'admin' && !m.read).length

  return (
    <section className="bg-cream-50 py-10 md:py-14">
      <div className="max-w-6xl mx-auto px-5 md:px-10">
        <div className="mb-8 flex items-center gap-3">
          <img src={logo} alt="LenuxWood" className="h-11 w-11 rounded-full object-cover" />
          <div>
            <p className="text-xs text-wood-500">Espace client</p>
            <h1 className="font-display text-2xl font-semibold text-wood-950">Bonjour, {user?.name || 'client'}</h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <nav className="bg-white border border-wood-700/10 rounded-2xl overflow-hidden text-sm">
              {NAV.map((item, i) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center justify-between gap-3 px-5 py-3.5 transition ${
                      i > 0 ? 'border-t border-wood-700/10' : ''
                    } ${isActive ? 'bg-wood-950 text-cream-100 font-medium' : 'text-wood-700 hover:bg-cream-100'}`
                  }
                >
                  <span className="flex items-center gap-3">
                    <item.icon size={16} />
                    {item.label}
                  </span>
                  {item.to === '/compte/messages' && unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-red-600 text-cream-50 text-[10px] font-bold flex items-center justify-center">
                      {unread}
                    </span>
                  )}
                </NavLink>
              ))}
              <Link
                to="/"
                className="flex items-center gap-3 px-5 py-3.5 text-wood-700 hover:bg-cream-100 border-t border-wood-700/10 transition"
              >
                <ExternalLink size={16} />
                Retour au site
              </Link>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-5 py-3.5 text-red-600 hover:bg-cream-100 border-t border-wood-700/10 transition"
              >
                <LogOut size={16} />
                Déconnexion
              </button>
            </nav>
          </aside>

          <div className="lg:col-span-3">
            <Outlet />
          </div>
        </div>
      </div>
    </section>
  )
}
