import { Package, ClipboardList, ShoppingCart, Wallet, TrendingUp, ArrowUpRight, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { QUOTES, ORDERS } from '../../data/admin-mock'
import { CONVERSATIONS } from '../../data/messages-mock'
import { PRODUCTS } from '../../data/products'
import StatCard from '../../components/admin/StatCard'
import StatusBadge from '../../components/admin/StatusBadge'

const STATS = [
  { label: 'Produits au catalogue', value: PRODUCTS.length, icon: Package, tone: 'dark' },
  { label: 'Devis en attente', value: QUOTES.filter((q) => q.status === 'En attente').length, icon: ClipboardList, tone: 'red' },
  { label: 'Commandes en cours', value: ORDERS.filter((o) => o.status !== 'Livré').length, icon: ShoppingCart, tone: 'dark' },
  { label: "Chiffre d'affaires (mois)", value: '2 425 000 FCFA', icon: Wallet, tone: 'dark' },
]

// Données de démo pour le mini-graphique de tendance (à remplacer par une vraie
// agrégation Laravel une fois le back-end branché : GET /api/admin/stats/revenue)
const TREND = [38, 52, 41, 66, 58, 72, 64, 80, 71, 90, 84, 96]

export default function Dashboard() {
  const unreadMessages = CONVERSATIONS.reduce((sum, c) => sum + c.unread, 0)
  const maxTrend = Math.max(...TREND)

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-wood-950 mb-1">Tableau de bord</h1>
          <p className="text-wood-500 text-sm">Vue d'ensemble de l'activité LenuxWood</p>
        </div>
        {unreadMessages > 0 && (
          <Link
            to="/admin/messagerie"
            className="inline-flex items-center gap-2 bg-red-600/10 text-red-700 text-sm font-medium px-4 py-2.5 rounded-full hover:bg-red-600/15 transition"
          >
            <MessageCircle size={16} />
            {unreadMessages} nouveau{unreadMessages > 1 ? 'x' : ''} message{unreadMessages > 1 ? 's' : ''}
          </Link>
        )}
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        {STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white border border-wood-700/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="font-display font-semibold text-wood-950">Chiffre d'affaires</p>
              <p className="text-xs text-wood-500 mt-0.5">12 dernières semaines</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-700/10 px-2.5 py-1 rounded-full">
              <TrendingUp size={13} /> +18%
            </span>
          </div>
          <div className="flex items-end gap-2 h-40">
            {TREND.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end h-full group">
                <div
                  className="w-full rounded-full bg-wood-950 group-hover:bg-red-600 transition-colors"
                  style={{ height: `${(v / maxTrend) * 100}%` }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-wood-950 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <p className="font-display font-semibold text-cream-100 mb-1">Devis à traiter</p>
            <p className="text-xs text-wood-400">Répondez rapidement pour maximiser vos conversions.</p>
          </div>
          <div className="my-6">
            <p className="font-display text-5xl font-semibold text-oak-400">
              {QUOTES.filter((q) => q.status === 'En attente').length}
            </p>
            <p className="text-xs text-wood-400 mt-1">en attente de réponse</p>
          </div>
          <Link
            to="/admin/devis"
            className="inline-flex items-center justify-center gap-2 bg-cream-50 text-wood-950 text-sm font-semibold px-4 py-3 rounded-full hover:bg-oak-300 transition"
          >
            Voir les devis <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-wood-700/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="font-display font-semibold text-wood-950">Derniers devis</p>
            <Link to="/admin/devis" className="text-xs font-semibold text-red-600 hover:underline">
              Tout voir
            </Link>
          </div>
          <div className="space-y-3">
            {QUOTES.slice(0, 4).map((q) => (
              <div key={q.id} className="flex items-center justify-between text-sm border-b border-wood-700/10 pb-3 last:border-0 last:pb-0">
                <div className="min-w-0">
                  <p className="font-medium text-wood-900 truncate">{q.client}</p>
                  <p className="text-xs text-wood-500 truncate">{q.module} · {q.city}</p>
                </div>
                <StatusBadge status={q.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-wood-700/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="font-display font-semibold text-wood-950">Dernières commandes</p>
            <Link to="/admin/commandes" className="text-xs font-semibold text-red-600 hover:underline">
              Tout voir
            </Link>
          </div>
          <div className="space-y-3">
            {ORDERS.slice(0, 4).map((o) => (
              <div key={o.id} className="flex items-center justify-between text-sm border-b border-wood-700/10 pb-3 last:border-0 last:pb-0">
                <div className="min-w-0">
                  <p className="font-medium text-wood-900 truncate">{o.product}</p>
                  <p className="text-xs text-wood-500 truncate">{o.client} · {o.amount} FCFA</p>
                </div>
                <StatusBadge status={o.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
