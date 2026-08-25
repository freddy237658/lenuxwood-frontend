import { useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Search as SearchIcon } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import ModuleIcon from '../components/ui/ModuleIcon'
import { PRODUCTS } from '../data/products'
import { MODULES } from '../data/modules'

function normalize(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // retire les accents pour une recherche plus tolérante
}

export default function Search() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)

  const q = normalize(searchParams.get('q') || '')

  const matchedModules = useMemo(() => {
    if (!q) return []
    return MODULES.filter((mod) => {
      const name = normalize(t(`modules.${mod.key}.name`))
      return normalize(mod.slug).includes(q) || normalize(mod.key).includes(q) || name.includes(q)
    })
  }, [q, t])

  const matchedProducts = useMemo(() => {
    if (!q) return []
    return PRODUCTS.filter((p) => {
      return (
        normalize(p.name).includes(q) ||
        normalize(p.categoryLabel).includes(q) ||
        normalize(p.category).includes(q) ||
        normalize(p.essence).includes(q)
      )
    })
  }, [q])

  const onSubmit = (e) => {
    e.preventDefault()
    setSearchParams(query.trim() ? { q: query.trim() } : {})
  }

  const hasResults = matchedModules.length > 0 || matchedProducts.length > 0

  return (
    <section className="bg-cream-50 py-14 md:py-20">
      <div className="max-w-6xl mx-auto px-5 md:px-10">
        <p className="text-xs text-wood-500 mb-2">Accueil / Recherche</p>
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-wood-950 mb-8">Rechercher</h1>

        <form onSubmit={onSubmit} className="flex items-center gap-3 mb-12 max-w-xl">
          <div className="relative flex-1">
            <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-wood-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex: chambre, cuisine, table, porte..."
              className="w-full border border-wood-700/20 rounded-sm pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-red-600"
            />
          </div>
          <button type="submit" className="btn-primary px-6 py-3.5 rounded-sm font-semibold text-sm">
            Rechercher
          </button>
        </form>

        {!q && (
          <p className="text-wood-500">Saisissez un mot-clé pour trouver un module, une catégorie ou un produit.</p>
        )}

        {q && !hasResults && (
          <p className="text-wood-500">
            Aucun résultat pour « {searchParams.get('q')} ». Essayez un autre mot-clé (ex: cuisine, salon, porte...).
          </p>
        )}

        {matchedModules.length > 0 && (
          <div className="mb-12">
            <p className="text-xs font-bold tracking-[0.2em] text-red-600 mb-4">MODULES CORRESPONDANTS</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {matchedModules.map((mod) => (
                <Link
                  key={mod.slug}
                  to={`/catalogue?module=${mod.slug}`}
                  className="bg-white border border-wood-700/10 rounded-sm p-5 flex items-center gap-3 card-lift"
                >
                  <div className="w-9 h-9 flex items-center justify-center text-wood-700 shrink-0">
                    <ModuleIcon name={mod.icon} size={26} />
                  </div>
                  <span className="text-sm font-medium text-wood-900">{t(`modules.${mod.key}.name`)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {matchedProducts.length > 0 && (
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-red-600 mb-4">
              {matchedProducts.length} PRODUIT{matchedProducts.length > 1 ? 'S' : ''} TROUVÉ{matchedProducts.length > 1 ? 'S' : ''}
            </p>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {matchedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} delay={(i % 6) * 60} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
