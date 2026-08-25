import { useState } from 'react'
import Reveal from '../components/ui/Reveal'

const CATEGORIES = [
  { slug: 'tous', label: 'Tous' },
  { slug: 'cuisine', label: 'Cuisine' },
  { slug: 'salon', label: 'Salon' },
  { slug: 'chambre', label: 'Chambre' },
  { slug: 'charpente', label: 'Charpente' },
]

const GALLERY = [
  { cat: 'cuisine', color: '#4A2E1A', title: 'Cuisine sur mesure', city: 'Douala' },
  { cat: 'salon', color: '#6B4426', title: 'Salon contemporain', city: 'Yaoundé' },
  { cat: 'chambre', color: '#3E2717', title: 'Suite parentale', city: 'Douala' },
  { cat: 'charpente', color: '#8A5C34', title: 'Toiture villa', city: 'Bafoussam' },
  { cat: 'cuisine', color: '#A97A48', title: 'Îlot central', city: 'Yaoundé' },
  { cat: 'salon', color: '#7A4B26', title: 'Bibliothèque murale', city: 'Douala' },
  { cat: 'chambre', color: '#4A2E1A', title: 'Dressing complet', city: 'Kribi' },
  { cat: 'charpente', color: '#6B4426', title: 'Charpente atelier', city: 'Yaoundé' },
  { cat: 'cuisine', color: '#3E2717', title: 'Cuisine ouverte', city: 'Douala' },
]

export default function Realisations() {
  const [filter, setFilter] = useState('tous')
  const items = filter === 'tous' ? GALLERY : GALLERY.filter((g) => g.cat === filter)

  return (
    <section className="bg-cream-50 py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <p className="text-xs text-wood-500 mb-2">Accueil / Réalisations</p>
            <h1 className="font-display text-3xl md:text-5xl font-semibold text-wood-950">Nos réalisations</h1>
            <p className="text-wood-500 text-sm mt-2">{GALLERY.length} projets livrés partout au Cameroun</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.slug}
                onClick={() => setFilter(c.slug)}
                className={`chip px-4 py-2 rounded-sm text-sm font-medium border border-wood-700/20 text-wood-800 ${
                  filter === c.slug ? 'active' : ''
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={(i % 6) * 60}>
              <div className="gallery-item aspect-[4/3] rounded-sm overflow-hidden relative cursor-pointer">
                <div className="absolute inset-0 grain-bg" style={{ backgroundColor: item.color }} />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-wood-950/85 to-transparent">
                  <p className="text-cream-100 font-display text-base font-semibold">{item.title}</p>
                  <p className="text-oak-400 text-xs mt-0.5 tracking-wide">{item.city}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
