import { useState } from 'react'

const METHODS = [
  { id: 'om', label: 'Orange Money', badge: 'OM', badgeClass: 'bg-oak-500 text-wood-950' },
  { id: 'momo', label: 'MTN Mobile Money', badge: 'MTN', badgeClass: 'bg-wood-950 text-cream-100' },
]

export default function Paiement() {
  const [method, setMethod] = useState('om')

  return (
    <section className="bg-cream-50 py-14 md:py-20">
      <div className="max-w-3xl mx-auto px-5 md:px-10">
        <div className="mb-10">
          <p className="text-xs text-wood-500 mb-2">Accueil / Paiement</p>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-wood-950">Finaliser la commande</h1>
        </div>

        <div className="bg-white border border-wood-700/10 rounded-sm p-6 md:p-8 mb-6">
          <p className="font-display font-semibold text-lg text-wood-950 mb-4">Récapitulatif</p>
          <div className="flex justify-between text-sm text-wood-600 py-2 border-b border-wood-700/10">
            <span>Cuisine moderne en iroko</span>
            <span className="text-wood-900 font-medium">450 000 FCFA</span>
          </div>
          <div className="flex justify-between text-sm text-wood-600 py-2 border-b border-wood-700/10">
            <span>Acompte de réservation (30%)</span>
            <span className="text-wood-900 font-medium">135 000 FCFA</span>
          </div>
          <div className="flex justify-between text-base font-semibold text-wood-950 py-3">
            <span>Total à payer maintenant</span>
            <span>135 000 FCFA</span>
          </div>
        </div>

        <div className="bg-white border border-wood-700/10 rounded-sm p-6 md:p-8">
          <p className="font-display font-semibold text-lg text-wood-950 mb-5">Choisissez un mode de paiement</p>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {METHODS.map((m) => (
              <label
                key={m.id}
                className={`rounded-sm p-5 flex items-center gap-3 cursor-pointer transition border ${
                  method === m.id ? 'border-2 border-red-600 bg-red-600/5' : 'border-wood-700/20 hover:border-red-600'
                }`}
              >
                <input type="radio" className="hidden" checked={method === m.id} onChange={() => setMethod(m.id)} />
                <div className={`w-11 h-11 rounded-sm flex items-center justify-center font-display font-bold text-sm ${m.badgeClass}`}>
                  {m.badge}
                </div>
                <div>
                  <p className="font-semibold text-wood-950 text-sm">{m.label}</p>
                  <p className="text-xs text-wood-500">Paiement mobile sécurisé</p>
                </div>
              </label>
            ))}
          </div>

          <label className="text-sm font-medium text-wood-800 mb-1.5 block">Numéro de téléphone</label>
          <input
            type="text"
            placeholder="+237 6XX XXX XXX"
            className="w-full border border-wood-700/20 rounded-sm px-4 py-3 text-sm mb-6 focus:outline-none focus:border-red-600"
          />

          <button className="btn-primary w-full py-4 rounded-sm font-semibold">Confirmer et payer 135 000 FCFA</button>
          <p className="text-xs text-wood-500 text-center mt-4">
            Transaction chiffrée et sécurisée. Vous recevrez une confirmation par SMS.
          </p>
        </div>
      </div>
    </section>
  )
}
