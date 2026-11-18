import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Loader2, ArrowRight } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../hooks/useProducts'
import { useCategories, categoryName } from '../hooks/useCategories'
import { useTranslation } from 'react-i18next'

export default function Catalogue() {
  const { i18n } = useTranslation()
  const [searchParams] = useSearchParams()
  const initialModule = searchParams.get('module')

  const { products, loading: productsLoading, error: productsError } = useProducts()
  const { categories, loading: categoriesLoading } = useCategories()

  const [activeCategories, setActiveCategories] = useState(initialModule ? [initialModule] : null)
  const [sort, setSort] = useState('popularite')

  useEffect(() => {
    if (!categoriesLoading && activeCategories === null) {
      setActiveCategories(categories.map((c) => c.slug))
    }
  }, [categoriesLoading, categories, activeCategories])

  useEffect(() => {
    if (initialModule) {
      setActiveCategories([initialModule])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get('module')])

  const toggleCategory = (slug) => {
    setActiveCategories((prev) =>
      (prev || []).includes(slug) ? prev.filter((c) => c !== slug) : [...(prev || []), slug]
    )
  }

  // Trier les catégories pour mettre meubles-cuisine en tête
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      if (a.slug === 'meubles-cuisine') return -1
      if (b.slug === 'meubles-cuisine') return 1
      return 0
    })
  }, [categories])

  const isKitchenOnly = useMemo(() => {
    return (
      activeCategories &&
      activeCategories.length === 1 &&
      activeCategories[0] === 'meubles-cuisine'
    )
  }, [activeCategories])

  const filtered = useMemo(() => {
    if (!activeCategories) return []
    let list = products.filter((p) => activeCategories.includes(p.category?.slug))
    if (sort === 'prix-asc') {
      list = [...list].sort((a, b) => a.price - b.price)
    } else if (sort === 'prix-desc') {
      list = [...list].sort((a, b) => b.price - a.price)
    }
    return list
  }, [products, activeCategories, sort])

  const loading = productsLoading || categoriesLoading

  return (
    <section className="bg-cream-50 py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="lg:w-64 shrink-0">
            <div className="lg:sticky lg:top-28">
              <p className="text-xs font-bold tracking-[0.25em] text-red-600 mb-4">FILTRER</p>

              <div className="mb-7">
                <p className="font-display font-semibold text-wood-950 mb-3">Catégorie</p>
                <div className="flex flex-col gap-2.5 text-sm text-wood-600">
                  {sortedCategories.map((cat) => {
                    const isKitchen = cat.slug === 'meubles-cuisine'
                    return (
                      <label
                        key={cat.slug}
                        className={`flex items-center justify-between gap-2 cursor-pointer p-1.5 rounded-sm transition ${
                          isKitchen ? 'bg-red-600/5 font-medium text-wood-950' : 'hover:bg-cream-100'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={(activeCategories || []).includes(cat.slug)}
                            onChange={() => toggleCategory(cat.slug)}
                            className="accent-red-600"
                          />
                          <span>{categoryName(cat, i18n.language)}</span>
                        </span>
                        {isKitchen && (
                          <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                            Vedette
                          </span>
                        )}
                      </label>
                    )
                  })}
                </div>
              </div>

              <div className="mb-7">
                <p className="font-display font-semibold text-wood-950 mb-3">Essence de bois</p>
                <div className="flex flex-wrap gap-2">
                  {['Iroko', 'Bibolo', 'Doussié', 'Bilinga', 'Movingui', 'Padouk'].map((wood) => (
                    <span key={wood} className="px-3 py-1.5 border border-wood-700/20 rounded-sm text-xs text-wood-600">
                      {wood}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {/* Bannière spéciale Cuisines Modernes */}
            {isKitchenOnly ? (
              <div className="mb-8 p-6 md:p-8 bg-wood-950 text-cream-50 rounded-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 border border-oak-400/20 shadow-lg">
                <div className="max-w-xl relative z-10">
                  <span className="inline-block bg-red-600 text-cream-50 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2">
                    ✦ Spécialité LenuxWood
                  </span>
                  <h2 className="font-display text-2xl md:text-3xl font-semibold text-cream-100 mb-2">
                    Cuisines Modernes &amp; Équipements sur Mesure
                  </h2>
                  <p className="text-xs md:text-sm text-cream-100/75 leading-relaxed">
                    Îlots centraux conviviaux, finitions contemporaines épurées et bois nobles traités contre l'humidité (Iroko, Teck, Acajou). Réalisation 100% sur mesure adaptée à votre espace.
                  </p>
                </div>
                <Link
                  to="/devis?module=meubles-cuisine"
                  className="btn-primary px-6 py-3 rounded-sm text-xs font-semibold inline-flex items-center gap-2 shrink-0 justify-center shadow-md text-center"
                >
                  Devis cuisine 3D gratuit <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-wood-950 text-cream-100 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-wood-800 shadow-xs">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-red-600 text-cream-50 flex items-center justify-center font-bold text-sm shrink-0">
                    ✦
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-cream-50">Vous cherchez une cuisine moderne ?</p>
                    <p className="text-xs text-wood-300">
                      Îlot central, façades épurées et essences de bois nobles locales.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveCategories(['meubles-cuisine'])}
                  className="text-xs font-semibold text-oak-400 hover:text-cream-100 transition underline sm:no-underline sm:bg-wood-850 sm:px-3 sm:py-1.5 sm:rounded-sm shrink-0"
                >
                  Filtrer les cuisines modernes →
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <p className="text-xs text-wood-500 mb-1">
                  Accueil / Catalogue {isKitchenOnly && '/ Cuisines Modernes'}
                </p>
                <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-wood-950">
                  {isKitchenOnly ? 'Nos Cuisines Modernes sur Mesure' : 'Tout le catalogue LenuxWood'}
                </h1>
                <p className="text-wood-500 text-sm mt-1.5">
                  {loading ? 'Chargement...' : `${filtered.length} produit${filtered.length > 1 ? 's' : ''} disponible${filtered.length > 1 ? 's' : ''}`}
                </p>
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border border-wood-700/20 rounded-sm px-4 py-2.5 text-sm text-wood-700 bg-white"
              >
                <option value="popularite">Trier par popularité</option>
                <option value="prix-asc">Prix croissant</option>
                <option value="prix-desc">Prix décroissant</option>
              </select>
            </div>

            {loading ? (
              <div className="flex items-center gap-2 text-wood-500 py-10">
                <Loader2 size={18} className="animate-spin" /> Chargement du catalogue...
              </div>
            ) : productsError ? (
              <p className="text-red-600">
                Impossible de charger le catalogue pour le moment. Réessayez dans un instant.
              </p>
            ) : filtered.length === 0 ? (
              <p className="text-wood-500">Aucun produit ne correspond à ces filtres.</p>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} delay={(i % 6) * 60} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
