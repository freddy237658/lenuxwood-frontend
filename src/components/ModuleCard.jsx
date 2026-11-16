import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ModuleIcon from './ui/ModuleIcon'
import Reveal from './ui/Reveal'
import { categoryName, categoryDescription } from '../hooks/useCategories'

export default function ModuleCard({ category, delay = 0 }) {
  const { i18n } = useTranslation()
  const isKitchen = category.slug === 'meubles-cuisine'

  return (
    <Reveal delay={delay} className="h-full">
      <Link to={`/catalogue?module=${category.slug}`} className="block h-full">
        <div
          className={`group bg-white rounded-sm p-6 h-full card-lift cursor-pointer relative transition-all flex flex-col justify-between ${
            isKitchen
              ? 'border-2 border-red-600/50 shadow-md ring-1 ring-red-600/20 bg-gradient-to-b from-white to-cream-50/70'
              : 'border border-wood-700/10'
          }`}
        >
          {isKitchen && (
            <span className="absolute -top-3 right-4 bg-red-600 text-cream-50 text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wider uppercase shadow-xs">
              ✦ Spécialité phare
            </span>
          )}
          <div>
            <div className={`w-11 h-11 flex items-center justify-center mb-5 ${isKitchen ? 'text-red-600' : 'text-wood-700'}`}>
              <ModuleIcon name={category.icon} />
            </div>
            <h3 className="font-display font-semibold text-lg text-wood-950 mb-1.5 flex items-center gap-1.5">
              {categoryName(category, i18n.language)}
              {isKitchen && <span className="text-red-600 text-xs font-sans font-bold">★</span>}
            </h3>
            <p className="text-sm text-wood-500 leading-relaxed">
              {categoryDescription(category, i18n.language)}
            </p>
          </div>
          {isKitchen && (
            <div className="mt-4 pt-3 border-t border-red-600/10">
              <span className="text-xs font-semibold text-red-600 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Découvrir les cuisines modernes →
              </span>
            </div>
          )}
        </div>
      </Link>
    </Reveal>
  )
}
