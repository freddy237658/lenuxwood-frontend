import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ModuleIcon from './ui/ModuleIcon'
import Reveal from './ui/Reveal'
import { categoryName, categoryDescription } from '../hooks/useCategories'

export default function ModuleCard({ category, delay = 0 }) {
  const { i18n } = useTranslation()

  return (
    <Reveal delay={delay}>
      <Link to={`/catalogue?module=${category.slug}`} className="block">
        <div className="group bg-white border border-wood-700/10 rounded-sm p-6 h-full card-lift cursor-pointer">
          <div className="w-11 h-11 flex items-center justify-center mb-5 text-wood-700">
            <ModuleIcon name={category.icon} />
          </div>
          <h3 className="font-display font-semibold text-lg text-wood-950 mb-1.5">
            {categoryName(category, i18n.language)}
          </h3>
          <p className="text-sm text-wood-500 leading-relaxed">
            {categoryDescription(category, i18n.language)}
          </p>
        </div>
      </Link>
    </Reveal>
  )
}