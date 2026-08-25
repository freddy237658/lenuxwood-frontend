const ORDERS = [
  { color: '#4A2E1A', name: 'Cuisine moderne en iroko', ref: 'LW-2026-0142', date: '12 août 2026', price: '450 000', status: 'Livré', bg: '#EAF3DE', text: '#27500A' },
  { color: '#6B4426', name: 'Lit double teck massif', ref: 'LW-2026-0139', date: '28 juillet 2026', price: '320 000', status: 'En fabrication', bg: '#FAEEDA', text: '#854F0B' },
  { color: '#3E2717', name: 'Table basse suspendue', ref: 'LW-2026-0121', date: '3 juillet 2026', price: '180 000', status: 'Devis validé', bg: '#E1F5EE', text: '#085041' },
]

export default function ClientOrders() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-xl font-semibold text-wood-950">Mes commandes</h2>
          <p className="text-wood-500 text-sm mt-1">{ORDERS.length} commandes</p>
        </div>
      </div>

      <div className="space-y-4">
        {ORDERS.map((order) => (
          <div
            key={order.ref}
            className="bg-white border border-wood-700/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 card-lift"
          >
            <div className="w-16 h-16 rounded-2xl shrink-0 grain-bg" style={{ backgroundColor: order.color }} />
            <div className="flex-1">
              <p className="font-display font-semibold text-wood-950">{order.name}</p>
              <p className="text-xs text-wood-500 mt-1">Commande #{order.ref} · {order.date}</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="font-semibold text-wood-900 text-sm mb-1">{order.price} FCFA</p>
              <span
                className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: order.bg, color: order.text }}
              >
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
