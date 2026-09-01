import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import Reveal from '../components/ui/Reveal'
import { useRealisations } from '../hooks/useRealisations'
import { useCategories, categoryName } from '../hooks/useCategories'

export default function Realisations() {
  const { i18n } = useTranslation()
  const [filter, setFilter] = useState('tous')
  const { categories } = useCategories()
  const { realisations, loading, error } = useRealisations(filter === 'tous' ? undefined : filter)

  return (
    <section className="bg-cream-50 py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <p className="text-xs text-wood-500 mb-2">Accueil / Réalisations</p>
            <h1 className="font-display text-3xl md:text-5xl font-semibold text-wood-950">Nos réalisations</h1>
            <p className="text-wood-500 text-sm mt-2">
              {loading ? 'Chargement...' : `${realisations.length} projets livrés partout au Cameroun`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('tous')}
              className={`chip px-4 py-2 rounded-sm text-sm font-medium border border-wood-700/20 text-wood-800 ${
                filter === 'tous' ? 'active' : ''
              }`}
            >
              Tous
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setFilter(cat.slug)}
                className={`chip px-4 py-2 rounded-sm text-sm font-medium border border-wood-700/20 text-wood-800 ${
                  filter === cat.slug ? 'active' : ''
                }`}
              >
                {categoryName(cat, i18n.language)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-wood-500 py-10">
            <Loader2 size={18} className="animate-spin" /> Chargement des réalisations...
          </div>
        ) : error ? (
          <p className="text-red-600">Impossible de charger la galerie pour le moment.</p>
        ) : realisations.length === 0 ? (
          <p className="text-wood-500">Aucune réalisation dans cette catégorie pour le moment.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {realisations.map((item, i) => (
              <Reveal key={item.id} delay={(i % 6) * 60}>
                <div className="gallery-item aspect-[4/3] rounded-sm overflow-hidden relative cursor-pointer">
                  <img src={item.image_url} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-wood-950/85 to-transparent">
                    <p className="text-cream-100 font-display text-base font-semibold">{item.title}</p>
                    <p className="text-oak-400 text-xs mt-0.5 tracking-wide">{item.city}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}