import { useTranslation } from 'react-i18next'
import { Layers, Package, TrendingUp, Loader2 } from 'lucide-react'
import { useCategories, categoryName, categoryDescription } from '../../hooks/useCategories'
import { useProducts } from '../../hooks/useProducts'
import ModuleIcon from '../../components/ui/ModuleIcon'
import StatCard from '../../components/admin/StatCard'

export default function Categories() {
  const { i18n } = useTranslation()
  const { categories, loading: categoriesLoading } = useCategories()
  const { products, loading: productsLoading } = useProducts()

  const loading = categoriesLoading || productsLoading

  const counts = categories.map((cat) => products.filter((p) => p.category?.slug === cat.slug).length)
  const busiestIndex = counts.length ? counts.indexOf(Math.max(...counts)) : -1
  const busiest = busiestIndex >= 0 ? categories[busiestIndex] : null

  const stats = [
    { label: 'Modules actifs', value: categories.length, icon: Layers, tone: 'dark' },
    { label: 'Produits classés', value: products.length, icon: Package, tone: 'dark' },
    { label: 'Catégorie la plus fournie', value: busiest ? categoryName(busiest, i18n.language) : '—', icon: TrendingUp, tone: 'red' },
  ]

  return (
    <div>
      <h1 className="font-display text-2xl md:text-3xl font-semibold text-wood-950 mb-1">Catégories</h1>
      <p className="text-wood-500 text-sm mb-6">
        Les 8 modules de LenuxWood, gérés en base de données (nom et description bilingues).
      </p>

      <div className="grid sm:grid-cols-3 gap-5 mb-8">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-wood-500 py-10">
          <Loader2 size={18} className="animate-spin" /> Chargement...
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const count = products.filter((p) => p.category?.slug === cat.slug).length
            return (
              <div key={cat.slug} className="bg-white border border-wood-700/10 rounded-2xl p-5 card-lift">
                <div className="w-11 h-11 rounded-full bg-wood-950 text-oak-400 flex items-center justify-center mb-4">
                  <ModuleIcon name={cat.icon} size={24} />
                </div>
                <p className="font-display font-semibold text-wood-950 mb-1">{categoryName(cat, i18n.language)}</p>
                <p className="text-xs text-wood-500 mb-3 leading-relaxed">{categoryDescription(cat, i18n.language)}</p>
                <p className="text-xs font-semibold text-red-600">
                  {count} produit{count > 1 ? 's' : ''}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}