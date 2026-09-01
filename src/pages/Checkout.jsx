import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../lib/format'
import api from '../lib/api'

const METHODS = [
  { id: 'orange_money', label: 'Orange Money', badge: 'OM', badgeClass: 'bg-oak-500 text-wood-950', needsPhone: true },
  { id: 'mtn_momo', label: 'MTN Mobile Money', badge: 'MTN', badgeClass: 'bg-wood-950 text-cream-100', needsPhone: true },
  { id: 'cash_on_delivery', label: 'Paiement à la livraison', badge: '₣', badgeClass: 'bg-wood-700 text-cream-100', needsPhone: false },
]

export default function Checkout() {
  const { items, totalAmount, clearCart } = useCart()
  const navigate = useNavigate()
  const [method, setMethod] = useState('orange_money')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const selectedMethod = METHODS.find((m) => m.id === method)

  const confirm = async () => {
    setError('')
    if (selectedMethod.needsPhone && phone.trim().length < 8) {
      setError('Merci de renseigner un numéro de téléphone valide.')
      return
    }
    setLoading(true)
    try {
      await api.post('/orders', {
        items: items.map((i) => ({ product_id: i.id, quantity: i.quantity })),
        payment_method: method,
      })
      clearCart()
      setSuccess(true)
    } catch {
      setError('Impossible de finaliser la commande pour le moment. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0 && !success) {
    navigate('/panier')
    return null
  }

  if (success) {
    return (
      <section className="bg-cream-50 py-24">
        <div className="max-w-lg mx-auto px-5 text-center">
          <CheckCircle2 className="mx-auto text-red-600 mb-5" size={48} />
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-wood-950 mb-3">Commande confirmée</h1>
          <p className="text-wood-600 mb-8">
            {method === 'cash_on_delivery'
              ? 'Vous payerez à la livraison. Notre équipe vous contactera pour organiser la livraison.'
              : 'Vous recevrez une invite de paiement sur votre téléphone. Une fois confirmé, votre commande passe en fabrication.'}
          </p>
          <a href="/compte" className="btn-primary inline-flex items-center px-8 py-3.5 rounded-full font-semibold">
            Voir mes commandes
          </a>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-cream-50 py-14 md:py-20">
      <div className="max-w-3xl mx-auto px-5 md:px-10">
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-wood-950 mb-8">Finaliser la commande</h1>

        <div className="bg-white border border-wood-700/10 rounded-2xl p-6 md:p-8 mb-6">
          <p className="font-display font-semibold text-lg text-wood-950 mb-4">Récapitulatif</p>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm text-wood-600 py-2 border-b border-wood-700/10">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span className="text-wood-900 font-medium">{formatPrice(item.price * item.quantity)} FCFA</span>
            </div>
          ))}
          <div className="flex justify-between text-base font-semibold text-wood-950 py-3">
            <span>Total</span>
            <span>{formatPrice(totalAmount)} FCFA</span>
          </div>
        </div>

        <div className="bg-white border border-wood-700/10 rounded-2xl p-6 md:p-8">
          <p className="font-display font-semibold text-lg text-wood-950 mb-5">Choisissez un mode de paiement</p>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {METHODS.map((m) => (
              <label
                key={m.id}
                className={`rounded-sm p-4 flex flex-col items-center gap-2 text-center cursor-pointer transition border ${
                  method === m.id ? 'border-2 border-red-600 bg-red-600/5' : 'border-wood-700/20 hover:border-red-600'
                }`}
              >
                <input type="radio" className="hidden" checked={method === m.id} onChange={() => setMethod(m.id)} />
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-xs ${m.badgeClass}`}>
                  {m.badge}
                </div>
                <p className="font-medium text-wood-950 text-sm">{m.label}</p>
              </label>
            ))}
          </div>

          {selectedMethod.needsPhone && (
            <>
              <label className="text-sm font-medium text-wood-800 mb-1.5 block">Numéro de téléphone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+237 6XX XXX XXX"
                className="w-full border border-wood-700/20 rounded-sm px-4 py-3 text-sm mb-6 focus:outline-none focus:border-red-600"
              />
            </>
          )}

          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

          <button
            onClick={confirm}
            disabled={loading}
            className="btn-primary w-full py-4 rounded-sm font-semibold disabled:opacity-60 inline-flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {selectedMethod.id === 'cash_on_delivery' ? 'Confirmer la commande' : `Payer ${formatPrice(totalAmount)} FCFA`}
          </button>
          <p className="text-xs text-wood-500 text-center mt-4">
            Transaction sécurisée. Le montant est toujours recalculé côté serveur, jamais depuis votre navigateur.
          </p>
        </div>
      </div>
    </section>
  )
}