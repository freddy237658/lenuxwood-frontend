import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Truck, Hammer, Search } from 'lucide-react'
import { ORDERS as INITIAL_ORDERS } from '../../data/admin-mock'
import StatusBadge from '../../components/admin/StatusBadge'
import StatCard from '../../components/admin/StatCard'
import RowActions from '../../components/admin/RowActions'
import DetailModal from '../../components/admin/DetailModal'

const STATUS_OPTIONS = ['Devis validé', 'En fabrication', 'Livré']

export default function Orders() {
  const navigate = useNavigate()
  // TODO: remplacer par GET/PATCH `${VITE_API_URL}/orders`
  const [orders, setOrders] = useState(INITIAL_ORDERS)
  const [query, setQuery] = useState('')
  const [viewing, setViewing] = useState(null)

  const updateStatus = (id, status) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
  }

  const remove = (id) => {
    if (confirm('Supprimer cette commande ?')) {
      setOrders((prev) => prev.filter((o) => o.id !== id))
    }
  }

  const filtered = useMemo(() => {
    if (!query.trim()) return orders
    const q = query.toLowerCase()
    return orders.filter((o) => o.client.toLowerCase().includes(q) || o.product.toLowerCase().includes(q) || o.id.toLowerCase().includes(q))
  }, [orders, query])

  const stats = [
    { label: 'Total commandes', value: orders.length, icon: ShoppingCart, tone: 'dark' },
    { label: 'En fabrication', value: orders.filter((o) => o.status === 'En fabrication').length, icon: Hammer, tone: 'red' },
    { label: 'Livrées', value: orders.filter((o) => o.status === 'Livré').length, icon: Truck, tone: 'dark' },
  ]

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
          placeholder="Rechercher un client, un produit, une réf..."
          className="w-full border border-wood-700/20 rounded-full pl-10 pr-4 py-2.5 text-sm bg-white focus:outline-none focus:border-red-600"
        />
      </div>

      <div className="bg-white border border-wood-700/10 rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-cream-100 text-left text-wood-500 text-xs uppercase tracking-wide">
              <th className="px-5 py-3 font-medium">Réf.</th>
              <th className="px-5 py-3 font-medium">Client</th>
              <th className="px-5 py-3 font-medium">Produit</th>
              <th className="px-5 py-3 font-medium">Montant</th>
              <th className="px-5 py-3 font-medium">Paiement</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Statut</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-t border-wood-700/10">
                <td className="px-5 py-3.5 font-medium text-wood-900">{o.id}</td>
                <td className="px-5 py-3.5 text-wood-600">{o.client}</td>
                <td className="px-5 py-3.5 text-wood-600">{o.product}</td>
                <td className="px-5 py-3.5 text-wood-600">{o.amount} FCFA</td>
                <td className="px-5 py-3.5 text-wood-600">{o.payment}</td>
                <td className="px-5 py-3.5 text-wood-500 text-xs">{o.date}</td>
                <td className="px-5 py-3.5">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="text-xs border border-wood-700/20 rounded-full px-2.5 py-1.5 bg-white mb-1.5"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  <div>
                    <StatusBadge status={o.status} />
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <RowActions
                    onView={() => setViewing(o)}
                    onMessage={() => navigate(`/admin/messagerie?client=${o.clientId}`)}
                    onDelete={() => remove(o.id)}
                  />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-8 text-center text-wood-400">
                  Aucune commande ne correspond à cette recherche.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {viewing && (
        <DetailModal
          title={`Commande ${viewing.id}`}
          onClose={() => setViewing(null)}
          fields={[
            { label: 'Client', value: viewing.client },
            { label: 'Produit', value: viewing.product },
            { label: 'Montant', value: `${viewing.amount} FCFA` },
            { label: 'Méthode de paiement', value: viewing.payment },
            { label: 'Date', value: viewing.date },
            { label: 'Statut', value: viewing.status },
          ]}
          footer={
            <button
              onClick={() => navigate(`/admin/messagerie?client=${viewing.clientId}`)}
              className="btn-primary w-full justify-center py-3 rounded-full font-semibold"
            >
              Contacter {viewing.client}
            </button>
          }
        />
      )}
    </div>
  )
}
