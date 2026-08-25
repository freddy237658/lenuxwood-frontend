import { PAYMENTS } from '../../data/admin-mock'
import StatusBadge from '../../components/admin/StatusBadge'

export default function Payments() {
  const total = PAYMENTS.filter((p) => p.status === 'Confirmé').reduce((sum, p) => sum + parseInt(p.amount.replace(/\s/g, ''), 10), 0)

  return (
    <div>
      <h1 className="font-display text-2xl md:text-3xl font-semibold text-wood-950 mb-1">Paiements</h1>
      <p className="text-wood-500 text-sm mb-8">
        {PAYMENTS.length} transactions · {total.toLocaleString('fr-FR')} FCFA confirmés
      </p>

      <div className="bg-white border border-wood-700/10 rounded-sm overflow-hidden overflow-x-auto">
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
            {PAYMENTS.map((p) => (
              <tr key={p.id} className="border-t border-wood-700/10">
                <td className="px-5 py-3.5 font-medium text-wood-900">{p.id}</td>
                <td className="px-5 py-3.5 text-wood-600">{p.order}</td>
                <td className="px-5 py-3.5 text-wood-600">
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: p.method === 'Orange Money' ? '#C08A45' : '#271A11' }}
                    />
                    {p.method}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-wood-600">{p.amount} FCFA</td>
                <td className="px-5 py-3.5 text-wood-500 text-xs">{p.date}</td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={p.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
