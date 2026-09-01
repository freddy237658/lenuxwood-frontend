import { useEffect, useState } from 'react'
import { Package, ClipboardList, ShoppingCart, Wallet, TrendingUp, ArrowUpRight, Loader2, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../../lib/api'
import { formatPrice } from '../../lib/format'
import StatCard from '../../components/admin/StatCard'
import StatusBadge from '../../components/admin/StatusBadge'

const QUOTE_STATUS_LABELS = { pending: 'En attente', processed: 'Traité', refused: 'Refusé' }
const ORDER_STATUS_LABELS = { quote_validated: 'Devis validé', in_production: 'En fabrication', delivered: 'Livré' }

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/admin/stats')
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-wood-500 py-10">
        <Loader2 size={18} className="animate-spin" /> Chargement du tableau de bord...
      </div>
    )
  }

  if (!stats) {
    return <p className="text-red-600">Impossible de charger les statistiques pour le moment.</p>
  }

  const cards = [
    { label: 'Produits au catalogue', value: stats.products_count, icon: Package, tone: 'dark' },
    { label: 'Devis en attente', value: stats.pending_quotes_count, icon: ClipboardList, tone: 'red' },
    { label: 'Commandes en cours', value: stats.orders_in_progress_count, icon: ShoppingCart, tone: 'dark' },
    { label: "Chiffre d'affaires (mois)", value: `${formatPrice(stats.month_revenue)} FCFA`, icon: Wallet, tone: 'dark' },
    { label: 'Visiteurs ce mois-ci', value: stats.visits_this_month, icon: Users, tone: 'red' },
  ]

  const trend = stats.weekly_revenue_trend || []
  const maxTrend = Math.max(...trend, 1)

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-wood-950 mb-1">Tableau de bord</h1>
        <p className="text-wood-500 text-sm">Vue d'ensemble de l'activité LenuxWood</p>
      </div>

      
      <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-5 mb-6">
        {cards.map((c) => (
          <StatCard key={c.label} {...c} />
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
              <TrendingUp size={13} /> Paiements confirmés
            </span>
          </div>
          <div className="flex items-end gap-2 h-40">
            {trend.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end h-full group">
                <div
                  className="w-full rounded-full bg-wood-950 group-hover:bg-red-600 transition-colors"
                  style={{ height: `${(v / maxTrend) * 100}%`, minHeight: v > 0 ? '4px' : '0' }}
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
            <p className="font-display text-5xl font-semibold text-oak-400">{stats.pending_quotes_count}</p>
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
            {(stats.latest_quotes || []).map((q) => (
              <div key={q.id} className="flex items-center justify-between text-sm border-b border-wood-700/10 pb-3 last:border-0 last:pb-0">
                <div className="min-w-0">
                  <p className="font-medium text-wood-900 truncate">{q.name}</p>
                  <p className="text-xs text-wood-500 truncate">
                    {q.category} · {q.city}
                  </p>
                </div>
                <StatusBadge status={QUOTE_STATUS_LABELS[q.status] || q.status} />
              </div>
            ))}
            {(stats.latest_quotes || []).length === 0 && <p className="text-sm text-wood-400">Aucun devis pour le moment.</p>}
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
            {(stats.latest_orders || []).map((o) => (
              <div key={o.id} className="flex items-center justify-between text-sm border-b border-wood-700/10 pb-3 last:border-0 last:pb-0">
                <div className="min-w-0">
                  <p className="font-medium text-wood-900 truncate">{o.product}</p>
                  <p className="text-xs text-wood-500 truncate">
                    {o.client} · {formatPrice(o.amount)} FCFA
                  </p>
                </div>
                <StatusBadge status={ORDER_STATUS_LABELS[o.status] || o.status} />
              </div>
            ))}
            {(stats.latest_orders || []).length === 0 && <p className="text-sm text-wood-400">Aucune commande pour le moment.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}