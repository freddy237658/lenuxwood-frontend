import { Link } from 'react-router-dom'
import Reveal from './ui/Reveal'

export default function ProductCard({ product, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <Link
        to={`/produit/${product.slug}`}
        className="group block bg-white border border-wood-700/10 rounded-sm overflow-hidden card-lift"
      >
        <div className="aspect-[4/3] relative overflow-hidden">
          <div className="absolute inset-0 grain-bg-light" style={{ backgroundColor: product.color }} />
          {product.tag && (
            <span className="absolute top-3 left-3 bg-cream-50 text-wood-800 text-[11px] font-semibold px-2.5 py-1 rounded-sm">
              {product.tag}
            </span>
          )}
        </div>
        <div className="p-5">
          <p className="text-[11px] uppercase tracking-wide text-wood-500 mb-1">{product.categoryLabel}</p>
          <h3 className="font-display font-semibold text-lg text-wood-950 mb-1">{product.name}</h3>
          <div className="flex items-center justify-between mt-3">
            <p className="font-semibold text-wood-900">{product.price} FCFA</p>
            <span className="text-xs text-red-600 font-semibold group-hover:underline">Voir →</span>
          </div>
        </div>
      </Link>
    </Reveal>
  )
}
