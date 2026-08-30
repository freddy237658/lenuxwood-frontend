import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Reveal from './ui/Reveal'
import { categoryName } from '../hooks/useCategories'
import { formatPrice } from '../lib/format'

// Couleur de repli tant qu'un produit n'a pas encore de vraie photo en base
const FALLBACK_COLOR = '#6B4426'

export default function ProductCard({ product, delay = 0 }) {
  const { i18n } = useTranslation()
  const image = product.images?.[0]?.url

  return (
    <Reveal delay={delay}>
      <Link
        to={`/produit/${product.slug}`}
        className="group block bg-white border border-wood-700/10 rounded-sm overflow-hidden card-lift"
      >
        <div className="aspect-[4/3] relative overflow-hidden">
          {image ? (
            <img src={image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 grain-bg-light" style={{ backgroundColor: FALLBACK_COLOR }} />
          )}
          {product.tag && (
            <span className="absolute top-3 left-3 bg-cream-50 text-wood-800 text-[11px] font-semibold px-2.5 py-1 rounded-sm">
              {product.tag}
            </span>
          )}
        </div>
        <div className="p-5">
          <p className="text-[11px] uppercase tracking-wide text-wood-500 mb-1">
            {product.category ? categoryName(product.category, i18n.language) : ''}
          </p>
          <h3 className="font-display font-semibold text-lg text-wood-950 mb-1">{product.name}</h3>
          <div className="flex items-center justify-between mt-3">
            <p className="font-semibold text-wood-900">
              {formatPrice(product.price, product.price_unit)} FCFA
            </p>
            <span className="text-xs text-red-600 font-semibold group-hover:underline">Voir →</span>
          </div>
        </div>
      </Link>
    </Reveal>
  )
}