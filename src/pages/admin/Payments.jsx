import { useEffect, useMemo, useState } from 'react'
import { Wallet, CheckCircle2, Clock, Loader2 } from 'lucide-react'
import api from '../../lib/api'
import { formatPrice } from '../../lib/format'
import StatusBadge from '../../components/admin/StatusBadge'
import StatCard from '../../components/admin/StatCard'

export default function Payments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/payments')
      .then((res) => setPayments(res.data.data ?? []))
      .finally(() => setLoading(false))
  }, [])

  const stats = useMemo(() => {
    const confirmed = payments.filter((p) => p.status === 'confirmed')
    return [
      { label: 'Transactions', value: payments.length, icon: Wallet, tone: 'dark' },
      { label: 'Confirmés', value: confirmed.length, icon: CheckCircle2, tone: 'dark' },
      {
        label: 'Montant confirmé',
        value: `${formatPrice(confirmed.reduce((sum, p) => sum + Number(p.amount), 0))} FCFA`,
        icon: Clock,
        tone: 'red',
      },
    ]
  }, [payments])

  return (
    <div>
      <h1 className="font-display text-2xl md:text-3xl font-semibold text-wood-950 mb-1">Paiements</h1>
      <p className="text-wood-500 text-sm mb-6">{payments.length} transactions</p>

      <div className="grid sm:grid-cols-3 gap-5 mb-6">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
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
                <th className="px-5 py-3 font-medium">Réf. paiement</th>
                <th className="px-5 py-3 font-medium">Commande</th>
                <th className="px-5 py-3 font-medium">Méthode</th>
                <th className="px-5 py-3 font-medium">Montant</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-t border-wood-700/10">
                  <td className="px-5 py-3.5 font-medium text-wood-900 text-xs">{p.transaction_ref?.slice(0, 8)}</td>
                  <td className="px-5 py-3.5 text-wood-600">#{p.order_id}</td>
                  <td className="px-5 py-3.5 text-wood-600">
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: p.method === 'orange_money' ? '#C08A45' : p.method === 'mtn_momo' ? '#271A11' : '#8A5C34' }}
                      />
                      {p.method_label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-wood-600">{formatPrice(p.amount)} FCFA</td>
                  <td className="px-5 py-3.5 text-wood-500 text-xs">{new Date(p.created_at).toLocaleDateString('fr-FR')}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={p.status_label} />
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-wood-400">
                    Aucune transaction pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}