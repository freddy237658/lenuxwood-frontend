import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
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
                <div className="flex flex-col gap-2 text-sm text-wood-600">
                  {categories.map((cat) => (
                    <label key={cat.slug} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(activeCategories || []).includes(cat.slug)}
                        onChange={() => toggleCategory(cat.slug)}
                        className="accent-wood-950"
                      />
                      {categoryName(cat, i18n.language)}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-7">
                <p className="font-display font-semibold text-wood-950 mb-3">Essence de bois</p>
                <div className="flex flex-wrap gap-2">
                  {['Iroko', 'Acajou', 'Teck', 'Wengé'].map((wood) => (
                    <span key={wood} className="px-3 py-1.5 border border-wood-700/20 rounded-sm text-xs text-wood-600">
                      {wood}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <p className="text-xs text-wood-500 mb-2">Accueil / Catalogue</p>
                <h1 className="font-display text-3xl md:text-4xl font-semibold text-wood-950">Tout le catalogue LenuxWood</h1>
                <p className="text-wood-500 text-sm mt-2">
                  {loading ? 'Chargement...' : `${filtered.length} produits disponibles`}
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