import { useParams, Link, Navigate } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import Reveal from '../components/ui/Reveal'
import Button from '../components/ui/Button'
import ProductCard from '../components/ProductCard'
import { getProductBySlug, PRODUCTS } from '../data/products'

export default function Product() {
  const { slug } = useParams()
  const product = getProductBySlug(slug)

  if (!product) return <Navigate to="/catalogue" replace />

  const similar = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3)

  return (
    <section className="bg-cream-50 py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <p className="text-xs text-wood-500 mb-8">
          <Link to="/" className="hover:text-wood-800">Accueil</Link> /{' '}
          <Link to="/catalogue" className="hover:text-wood-800">Catalogue</Link> /{' '}
          <span className="text-wood-800">{product.name}</span>
        </p>

        <div className="grid lg:grid-cols-2 gap-12">
          <Reveal>
            <div className="aspect-square rounded-sm overflow-hidden relative mb-4">
              <div className="absolute inset-0 grain-bg" style={{ backgroundColor: product.color }} />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[product.color, '#8A5C34', '#3E2717', '#A97A48'].map((c, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-sm grain-bg cursor-pointer ${i === 0 ? 'border-2 border-red-600' : 'opacity-70'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </Reveal>

          <Reveal delay={100}>
            <p className="text-xs font-bold tracking-[0.2em] text-red-600 mb-3">{product.categoryLabel.toUpperCase()}</p>
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-wood-950 mb-3">{product.name}</h1>
            <p className="text-2xl font-semibold text-wood-900 mb-6">
              {product.price} FCFA <span className="text-sm font-normal text-wood-500">à partir de</span>
            </p>
            <p className="text-wood-600 leading-relaxed mb-8">
              Fabrication sur mesure en {product.essence.toLowerCase()}, finition {product.finish.toLowerCase()}.
              Structure renforcée, quincaillerie premium. Chaque module est adapté aux dimensions exactes de votre pièce.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
              <div className="border-t border-wood-700/15 pt-3">
                <p className="text-wood-500 text-xs mb-1">Essence</p>
                <p className="text-wood-900 font-medium">{product.essence}</p>
              </div>
              <div className="border-t border-wood-700/15 pt-3">
                <p className="text-wood-500 text-xs mb-1">Finition</p>
                <p className="text-wood-900 font-medium">{product.finish}</p>
              </div>
              <div className="border-t border-wood-700/15 pt-3">
                <p className="text-wood-500 text-xs mb-1">Délai de fabrication</p>
                <p className="text-wood-900 font-medium">{product.delay}</p>
              </div>
              <div className="border-t border-wood-700/15 pt-3">
                <p className="text-wood-500 text-xs mb-1">Garantie</p>
                <p className="text-wood-900 font-medium">{product.warranty}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <Button to="/devis" className="flex-1 justify-center">
                Demander un devis pour ce modèle
              </Button>
              <Button variant="outline">Ajouter au panier</Button>
            </div>
            <p className="text-xs text-wood-500 flex items-center gap-2">
              <ShieldCheck size={14} /> Paiement sécurisé via Orange Money et MTN MoMo
            </p>
          </Reveal>
        </div>

        {similar.length > 0 && (
          <div className="mt-20">
            <p className="text-xs font-bold tracking-[0.25em] text-red-600 mb-3">PRODUITS SIMILAIRES</p>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-wood-950 mb-8">Vous aimerez aussi</h2>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {similar.map((p, i) => (
                <ProductCard key={p.id} product={p} delay={i * 60} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
