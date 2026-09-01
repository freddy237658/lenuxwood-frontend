import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Truck, Hammer, Search, Loader2 } from 'lucide-react'
import api from '../../lib/api'
import { formatPrice } from '../../lib/format'
import StatusBadge from '../../components/admin/StatusBadge'
import StatCard from '../../components/admin/StatCard'
import RowActions from '../../components/admin/RowActions'
import DetailModal from '../../components/admin/DetailModal'

const STATUS_OPTIONS = [
  { value: 'quote_validated', label: 'Devis validé' },
  { value: 'in_production', label: 'En fabrication' },
  { value: 'delivered', label: 'Livré' },
]

const PAYMENT_LABELS = {
  orange_money: 'Orange Money',
  mtn_momo: 'MTN Mobile Money',
  cash_on_delivery: 'Paiement à la livraison',
}

function itemsSummary(items) {
  if (!items || items.length === 0) return '—'
  if (items.length === 1) return `${items[0].product_name} × ${items[0].quantity}`
  return `${items[0].product_name} +${items.length - 1} autre${items.length > 2 ? 's' : ''}`
}

export default function Orders() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [viewing, setViewing] = useState(null)

  const load = () => {
    setLoading(true)
    api
      .get('/orders', { params: { q: query || undefined } })
      .then((res) => setOrders(res.data.data ?? []))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    const timeout = setTimeout(load, 300)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const updateStatus = async (id, status) => {
    await api.patch(`/orders/${id}`, { status })
    load()
  }

  const remove = async (id) => {
    if (!confirm('Supprimer cette commande ?')) return
    await api.delete(`/orders/${id}`)
    load()
  }

  const stats = useMemo(
    () => [
      { label: 'Total commandes', value: orders.length, icon: ShoppingCart, tone: 'dark' },
      { label: 'En fabrication', value: orders.filter((o) => o.status === 'in_production').length, icon: Hammer, tone: 'red' },
      { label: 'Livrées', value: orders.filter((o) => o.status === 'delivered').length, icon: Truck, tone: 'dark' },
    ],
    [orders]
  )

  return (
    <div>
      <h1 className="font-display text-2xl md:text-3xl font-semibold text-wood-950 mb-1">Commandes</h1>
      <p className="text-wood-500 text-sm mb-6">{orders.length} commandes</p>

      <div className="grid sm:grid-cols-3 gap-5 mb-6">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="relative max-w-sm mb-5">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-wood-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un client..."
          className="w-full border border-wood-700/20 rounded-full pl-10 pr-4 py-2.5 text-sm bg-white focus:outline-none focus:border-red-600"
        />
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-wood-500 py-10">
          <Loader2 size={18} className="animate-spin" /> Chargement...
        </div>
      ) : (
        <div className="bg-white border border-wood-700/10 rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream-100 text-left text-wood-500 text-xs uppercase tracking-wide">
                <th className="px-5 py-3 font-medium">Réf.</th>
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 font-medium">Produits</th>
                <th className="px-5 py-3 font-medium">Montant</th>
                <th className="px-5 py-3 font-medium">Paiement</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Statut</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-wood-700/10">
                  <td className="px-5 py-3.5 font-medium text-wood-900">#{o.id}</td>
                  <td className="px-5 py-3.5 text-wood-600">{o.user?.name}</td>
                  <td className="px-5 py-3.5 text-wood-600">{itemsSummary(o.items)}</td>
                  <td className="px-5 py-3.5 text-wood-600">{formatPrice(o.amount)} FCFA</td>
                  <td className="px-5 py-3.5 text-wood-600 text-xs">
                    {PAYMENT_LABELS[o.payments?.[0]?.method] || '—'}
                  </td>
                  <td className="px-5 py-3.5 text-wood-500 text-xs">{new Date(o.created_at).toLocaleDateString('fr-FR')}</td>
                  <td className="px-5 py-3.5">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className="text-xs border border-wood-700/20 rounded-full px-2.5 py-1.5 bg-white mb-1.5"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    <div>
                      <StatusBadge status={o.status_label} />
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <RowActions
                      onView={() => setViewing(o)}
                      onMessage={o.user?.id ? () => navigate(`/admin/messagerie?client=${o.user.id}`) : undefined}
                      onDelete={() => remove(o.id)}
                    />
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-wood-400">
                    Aucune commande ne correspond à cette recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {viewing && (
        <DetailModal
          title={`Commande #${viewing.id}`}
          onClose={() => setViewing(null)}
          fields={[
            { label: 'Client', value: viewing.user?.name },
            {
              label: 'Produits',
              value: (viewing.items || []).map((i) => `${i.product_name} × ${i.quantity} (${formatPrice(i.subtotal)} FCFA)`).join(' · '),
            },
            { label: 'Montant total', value: `${formatPrice(viewing.amount)} FCFA` },
            { label: 'Méthode de paiement', value: PAYMENT_LABELS[viewing.payments?.[0]?.method] || '—' },
            { label: 'Date', value: new Date(viewing.created_at).toLocaleString('fr-FR') },
            { label: 'Statut', value: viewing.status_label },
          ]}
        />
      )}
    </div>
  )
}