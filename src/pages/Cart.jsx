import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../lib/format'
import Button from '../components/ui/Button'

const FALLBACK_COLOR = '#6B4426'

export default function Cart() {
  const { items, removeItem, updateQuantity, totalAmount } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const goToCheckout = () => {
    if (!isAuthenticated) {
      navigate('/connexion', { state: { from: { pathname: '/commande' } } })
      return
    }
    navigate('/commande')
  }

  if (items.length === 0) {
    return (
      <section className="bg-cream-50 py-24">
        <div className="max-w-2xl mx-auto px-5 text-center">
          <ShoppingBag className="mx-auto text-wood-300 mb-5" size={48} />
          <h1 className="font-display text-2xl font-semibold text-wood-950 mb-3">Votre panier est vide</h1>
          <p className="text-wood-500 mb-8">Parcourez le catalogue pour trouver votre prochain meuble.</p>
          <Button to="/catalogue">Voir le catalogue</Button>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-cream-50 py-14 md:py-20">
      <div className="max-w-4xl mx-auto px-5 md:px-10">
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-wood-950 mb-8">Votre panier</h1>

        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-wood-700/10 rounded-2xl p-5 flex flex-wrap sm:flex-nowrap items-center gap-4">
              <div className="w-16 h-16 rounded-xl shrink-0 overflow-hidden" style={{ backgroundColor: FALLBACK_COLOR }}>
                {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-[140px]">
                <Link to={`/produit/${item.slug}`} className="font-display font-semibold text-wood-950 hover:underline block">
                  {item.name}
                </Link>
                <p className="text-sm text-wood-500 mt-0.5">{formatPrice(item.price, item.price_unit)} FCFA</p>
              </div>
              <div className="flex items-center gap-2 border border-wood-700/20 rounded-full px-2 py-1 shrink-0">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-6 h-6 flex items-center justify-center text-wood-600"
                  aria-label="Diminuer la quantité"
                >
                  <Minus size={14} />
                </button>
                <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-6 h-6 flex items-center justify-center text-wood-600"
                  aria-label="Augmenter la quantité"
                >
                  <Plus size={14} />
                </button>
              </div>
              <p className="font-semibold text-wood-900 w-28 text-right shrink-0">
                {formatPrice(item.price * item.quantity)} FCFA
              </p>
              <button
                onClick={() => removeItem(item.id)}
                className="text-wood-400 hover:text-red-600 shrink-0"
                aria-label="Retirer du panier"
              >
                <Trash2 size={17} />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white border border-wood-700/10 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-wood-500">Total</p>
            <p className="font-display text-2xl font-semibold text-wood-950">{formatPrice(totalAmount)} FCFA</p>
          </div>
          <Button onClick={goToCheckout} className="justify-center">
            Passer la commande
          </Button>
        </div>
      </div>
    </section>
  )
}