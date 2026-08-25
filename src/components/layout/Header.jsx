import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X, ArrowRight, Search, User, LogOut, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/logo.jpg'

const LINKS = [
  { to: '/', key: 'home' },
  { to: '/catalogue', key: 'catalogue' },
  { to: '/realisations', key: 'realisations' },
  { to: '/a-propos', key: 'about' },
  { to: '/contact', key: 'contact' },
]

export default function Header() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [query, setQuery] = useState('')

  const changeLang = (lng) => i18n.changeLanguage(lng)

  const handleLogout = () => {
    logout()
    setAccountOpen(false)
    navigate('/')
  }

  const submitSearch = (e) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    navigate(`/recherche?q=${encodeURIComponent(q)}`)
    setSearchOpen(false)
    setOpen(false)
  }

  return (
    <>
      <div className="w-full bg-wood-950 text-cream-100 text-xs md:text-sm">
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-2 flex items-center justify-between">
          <p className="tracking-wide truncate">
            <span className="text-oak-400">✦</span> {t('topbar.shipping')}
          </p>
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <span className="tracking-wide">+237 6XX XXX XXX</span>
            <span className="w-px h-3 bg-wood-700" />
            <button
              onClick={() => changeLang('fr')}
              className={`tracking-wide hover:text-oak-400 transition ${i18n.language === 'fr' ? 'text-oak-400' : ''}`}
            >
              FR
            </button>
            <span className="text-wood-500">/</span>
            <button
              onClick={() => changeLang('en')}
              className={`tracking-wide hover:text-oak-400 transition ${i18n.language === 'en' ? 'text-oak-400' : ''}`}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-cream-50/95 backdrop-blur border-b border-wood-700/10">
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="LenuxWood" className="h-10 w-10 rounded-sm object-cover" />
            <div className="leading-tight">
              <p className="font-display font-semibold text-lg text-wood-950 tracking-tight">
                Lenux<span className="text-red-600">Wood</span>
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-wood-500 -mt-0.5">
                Menuiserie &amp; Ameublement
              </p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 font-medium text-sm text-wood-900">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => `nav-link ${isActive ? 'active text-red-600' : ''}`}
              >
                {t(`nav.${link.key}`)}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center">
              {searchOpen ? (
                <form onSubmit={submitSearch} className="flex items-center">
                  <input
                    autoFocus
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onBlur={() => !query && setSearchOpen(false)}
                    placeholder="Rechercher... (ex: chambre, table)"
                    className="w-56 border border-wood-700/20 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-red-600 mr-2"
                  />
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  aria-label="Rechercher"
                  className="w-10 h-10 flex items-center justify-center text-wood-700 hover:text-red-600 transition mr-1"
                >
                  <Search size={18} />
                </button>
              )}
            </div>
            <div className="hidden sm:block relative">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => setAccountOpen((v) => !v)}
                    className="w-10 h-10 rounded-full bg-wood-950 text-oak-400 flex items-center justify-center font-display font-semibold text-sm"
                  >
                    {(user?.name || 'U').charAt(0).toUpperCase()}
                  </button>
                  {accountOpen && (
                    <div className="absolute right-0 top-12 w-56 bg-white border border-wood-700/10 rounded-sm shadow-lg py-2 z-50">
                      <div className="px-4 py-2 border-b border-wood-700/10 mb-1">
                        <p className="text-sm font-medium text-wood-900 truncate">{user?.name}</p>
                        <p className="text-xs text-wood-500 truncate">{user?.email}</p>
                      </div>
                      {isAdmin ? (
                        <Link
                          to="/admin"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-wood-700 hover:bg-cream-100"
                        >
                          <LayoutDashboard size={15} /> Panel admin
                        </Link>
                      ) : (
                        <Link
                          to="/compte"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-wood-700 hover:bg-cream-100"
                        >
                          <User size={15} /> Mon compte
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-cream-100"
                      >
                        <LogOut size={15} /> Déconnexion
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to="/connexion"
                  className="w-10 h-10 flex items-center justify-center text-wood-700 hover:text-red-600 transition"
                  aria-label="Se connecter"
                >
                  <User size={18} />
                </Link>
              )}
            </div>
            <Link
              to="/devis"
              className="btn-primary hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-sm font-semibold text-sm"
            >
              {t('nav.quote')} <ArrowRight size={15} />
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden w-10 h-10 flex items-center justify-center border border-wood-700/30 rounded-sm text-wood-900"
              aria-label="Menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="lg:hidden flex flex-col gap-1 bg-cream-50 border-b border-wood-700/10 px-5 py-4 text-wood-900 font-medium">
            <form onSubmit={submitSearch} className="flex items-center mb-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher... (ex: chambre, table)"
                className="w-full border border-wood-700/20 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-red-600"
              />
              <button type="submit" aria-label="Rechercher" className="ml-2 w-10 h-10 shrink-0 flex items-center justify-center text-wood-700">
                <Search size={18} />
              </button>
            </form>
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) => `py-2 ${isActive ? 'text-red-600' : ''}`}
              >
                {t(`nav.${link.key}`)}
              </NavLink>
            ))}
            <Link to="/devis" onClick={() => setOpen(false)} className="btn-primary text-center mt-2 px-5 py-3 rounded-sm font-semibold text-sm">
              {t('nav.quote')}
            </Link>

            <div className="border-t border-wood-700/10 mt-3 pt-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to={isAdmin ? '/admin' : '/compte'}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 py-2"
                  >
                    {isAdmin ? <LayoutDashboard size={16} /> : <User size={16} />}
                    {isAdmin ? 'Panel admin' : 'Mon compte'}
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-2 py-2 text-red-600">
                    <LogOut size={16} /> Déconnexion
                  </button>
                </>
              ) : (
                <Link to="/connexion" onClick={() => setOpen(false)} className="flex items-center gap-2 py-2">
                  <User size={16} /> Se connecter
                </Link>
              )}
            </div>
          </nav>
        )}
      </header>
    </>
  )
}
