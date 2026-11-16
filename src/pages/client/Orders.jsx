import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, PackageSearch } from 'lucide-react'
import api from '../../lib/api'
import { formatPrice } from '../../lib/format'
import StatusBadge from '../../components/admin/StatusBadge'

const PAYMENT_LABELS = {
  orange_money: 'Orange Money',
  mtn_momo: 'MTN Mobile Money',
  cash_on_delivery: 'Paiement à la livraison',
}

export default function ClientOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/me/orders')
      .then((res) => setOrders(res.data.data ?? []))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-wood-500 py-10">
        <Loader2 size={18} className="animate-spin" /> Chargement de vos commandes...
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white border border-wood-700/10 rounded-2xl p-10 text-center">
        <PackageSearch className="mx-auto text-wood-300 mb-4" size={40} />
        <p className="font-display font-semibold text-wood-950 mb-2">Aucune commande pour le moment</p>
        <p className="text-sm text-wood-500 mb-6">Parcourez le catalogue pour trouver votre prochain meuble.</p>
        <Link to="/catalogue" className="btn-primary inline-flex items-center px-6 py-3 rounded-full font-semibold">
          Voir le catalogue
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-xl font-semibold text-wood-950">Mes commandes</h2>
          <p className="text-wood-500 text-sm mt-1">{orders.length} commande{orders.length > 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white border border-wood-700/10 rounded-2xl p-5 card-lift">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
              <div>
                <p className="font-display font-semibold text-wood-950">Commande #{order.id}</p>
                <p className="text-xs text-wood-500 mt-1">
                  {new Date(order.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  {order.payments?.[0] && ` · ${PAYMENT_LABELS[order.payments[0].method] || order.payments[0].method}`}
                </p>
              </div>
              <StatusBadge status={order.status_label} />
            </div>

            <div className="space-y-2 border-t border-wood-700/10 pt-4">
              {(order.items || []).map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-wood-700">
                    {item.product_name} × {item.quantity}
                  </span>
                  <span className="text-wood-500">{formatPrice(item.subtotal)} FCFA</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-wood-700/10 pt-4 mt-4">
              <span className="text-sm font-medium text-wood-800">Total</span>
              <span className="font-display font-semibold text-wood-950">{formatPrice(order.amount)} FCFA</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}