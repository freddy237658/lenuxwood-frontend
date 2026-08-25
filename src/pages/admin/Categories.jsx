import { useTranslation } from 'react-i18next'
import { Layers, Package, TrendingUp } from 'lucide-react'
import { MODULES } from '../../data/modules'
import ModuleIcon from '../../components/ui/ModuleIcon'
import { PRODUCTS } from '../../data/products'
import StatCard from '../../components/admin/StatCard'

export default function Categories() {
  const { t } = useTranslation()

  const counts = MODULES.map((mod) => PRODUCTS.filter((p) => p.category === mod.slug).length)
  const busiest = MODULES[counts.indexOf(Math.max(...counts))]

  const stats = [
    { label: 'Modules actifs', value: MODULES.length, icon: Layers, tone: 'dark' },
    { label: 'Produits classés', value: PRODUCTS.length, icon: Package, tone: 'dark' },
    { label: 'Catégorie la plus fournie', value: busiest ? t(`modules.${busiest.key}.name`) : '—', icon: TrendingUp, tone: 'red' },
  ]

  return (
    <div>
      <h1 className="font-display text-2xl md:text-3xl font-semibold text-wood-950 mb-1">Catégories</h1>
      <p className="text-wood-500 text-sm mb-6">
        Les 8 modules de LenuxWood. Le nom et la description sont gérés depuis les fichiers de traduction FR/EN
        (bientôt éditables directement ici une fois le back-office connecté à Laravel).
      </p>

      <div className="grid sm:grid-cols-3 gap-5 mb-8">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {MODULES.map((mod) => {
          const count = PRODUCTS.filter((p) => p.category === mod.slug).length
          return (
            <div key={mod.slug} className="bg-white border border-wood-700/10 rounded-2xl p-5 card-lift">
              <div className="w-11 h-11 rounded-full bg-wood-950 text-oak-400 flex items-center justify-center mb-4">
                <ModuleIcon name={mod.icon} size={24} />
              </div>
              <p className="font-display font-semibold text-wood-950 mb-1">{t(`modules.${mod.key}.name`)}</p>
              <p className="text-xs text-wood-500 mb-3 leading-relaxed">{t(`modules.${mod.key}.desc`)}</p>
              <p className="text-xs font-semibold text-red-600">{count} produit{count > 1 ? 's' : ''}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
