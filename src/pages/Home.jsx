import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { ArrowRight, Check, Ruler, Smartphone, Truck, Sparkles, Layers, ShieldCheck, Compass } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Reveal from '../components/ui/Reveal'
import ModuleCard from '../components/ModuleCard'
import { useRealisations } from '../hooks/useRealisations'
import { useCategories, categoryName } from '../hooks/useCategories'

function Counter({ target, suffix = '' }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let frame
    let current = 0
    const step = Math.max(1, Math.round(target / 40))
    const tick = () => {
      current = Math.min(target, current + step)
      setValue(current)
      if (current < target) frame = requestAnimationFrame(tick)
    }
    const timeout = setTimeout(() => (frame = requestAnimationFrame(tick)), 200)
    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(frame)
    }
  }, [target])

  return (
    <span>
      {value}
      {suffix}
    </span>
  )
}

const HERO_IMAGES = ['/images/site/hero-1.jpg', '/images/site/hero-2.jpg', '/images/site/hero-3.jpeg']

function HeroBackground() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % HERO_IMAGES.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0">
      {HERO_IMAGES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
          style={{ backgroundImage: `url('${src}')`, opacity: i === index ? 1 : 0 }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-wood-950 via-wood-950/80 to-wood-950/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-wood-950 via-transparent to-wood-950/20" />
    </div>
  )
}

const FEATURES = [
  { icon: Check, title: 'Bois sélectionné', desc: 'Essences locales choisies pour leur résistance et leur beauté naturelle.' },
  { icon: Ruler, title: 'Sur mesure', desc: 'Chaque pièce est pensée pour votre espace, vos dimensions, votre style.' },
  { icon: Smartphone, title: 'Paiement flexible', desc: 'Devis en ligne et paiement sécurisé via Orange Money ou MTN MoMo.' },
  { icon: Truck, title: 'Livraison nationale', desc: 'Présents dans les grandes villes, livrables partout au Cameroun.' },
]

const KITCHEN_PILLARS = [
  {
    icon: Compass,
    title: 'Îlot central & Convivialité',
    desc: 'Espaces ouverts pensés pour partager des moments en famille, intégrant coin repas et plan de travail généreux.',
    badge: 'Ergonomie',
  },
  {
    icon: Sparkles,
    title: 'Design épuré & contemporain',
    desc: 'Lignes minimalistes, façades sans poignées ou poignées profilées, amortisseurs silencieux et tiroirs invisibles.',
    badge: 'Modernité',
  },
  {
    icon: ShieldCheck,
    title: 'Bois noble 100% hydrofuge',
    desc: 'Iroko, Teck et Acajou de premier choix, traités contre l’humidité tropicale et les projections d’eau.',
    badge: 'Durabilité',
  },
  {
    icon: Layers,
    title: 'Conception 3D sur mesure',
    desc: 'Visualisation préalable en 3D selon les dimensions exactes de votre pièce, fabrication et pose soignée.',
    badge: 'Sur mesure',
  },
]

const KITCHEN_STYLES = [
  {
    title: 'Cuisine Îlot Central & Iroko Massif',
    tag: 'Tendance 2026',
    desc: 'Alliance sublime entre bois noble d’Iroko et finitions contemporaines, rangements coulissants grande capacité.',
    price: 'À partir de 650 000 FCFA',
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80&auto=format&fit=crop',
  },
  {
    title: 'Cuisine Linéaire Noir Mat & Teck',
    tag: 'Minimaliste & Épuré',
    desc: 'Esthétique moderne raffinée, colonnes d’encastrement électroménager et crédence hydrofuge en bois traité.',
    price: 'À partir de 450 000 FCFA',
    image: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&q=80&auto=format&fit=crop',
  },
  {
    title: 'Cuisine en U avec Rangements Suspendus',
    tag: 'Espace optimisé',
    desc: 'Circulation fluide, double plan de préparation, rangements d’angle ergonomiques et finitions soignées.',
    price: 'À partir de 550 000 FCFA',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&auto=format&fit=crop',
  },
]

export default function Home() {
  const { t, i18n } = useTranslation()
  const { categories } = useCategories()
  const { realisations, loading: realisationsLoading } = useRealisations()
  const featured = realisations.slice(0, 5)
  const showRealisations = realisationsLoading || featured.length > 0

  // Mettre les meubles de cuisine en première position dans les modules
  const sortedCategories = [...categories].sort((a, b) => {
    if (a.slug === 'meubles-cuisine') return -1
    if (b.slug === 'meubles-cuisine') return 1
    return 0
  })

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-wood-950 overflow-hidden">
        <HeroBackground />

        <div className="max-w-7xl mx-auto px-5 md:px-10 pt-20 md:pt-28 pb-20 relative z-10">
          <Reveal className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream-50/10 backdrop-blur-sm border border-cream-50/20 text-cream-100 text-xs font-semibold tracking-wide mb-6">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>MENUISERIE MODERNE &amp; MEUBLES SUR MESURE · DOUALA</span>
            </div>
            <h1 className="font-display text-[2.6rem] leading-[1.05] md:text-6xl md:leading-[1.03] font-semibold text-cream-50 tracking-tight">
              {t('home.title1')}
              <br />
              <span className="italic font-medium text-oak-300">{t('home.title2')}</span> {t('home.title3')}
            </h1>
            <p className="mt-6 text-cream-100/80 text-base md:text-lg max-w-md leading-relaxed">{t('home.subtitle')}</p>
            
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button to="/devis">
                {t('home.ctaQuote')} <ArrowRight size={16} />
              </Button>
              <Button
                to="/catalogue?module=meubles-cuisine"
                className="!bg-oak-400 !text-wood-950 hover:!bg-oak-300 font-semibold"
              >
                Cuisines Modernes ✦
              </Button>
              <Button
                to="/realisations"
                variant="outline"
                className="!border-cream-50/40 !text-cream-50 hover:!bg-cream-50 hover:!text-wood-950"
              >
                {t('home.ctaWork')}
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 max-w-md border-t border-cream-50/15 pt-6">
              <div>
                <p className="font-display text-3xl font-semibold text-cream-50">
                  <Counter target={500} />
                </p>
                <p className="text-xs text-cream-100/60 mt-1 tracking-wide">{t('home.stat1')}</p>
              </div>
              <div>
                <p className="font-display text-3xl font-semibold text-cream-50">
                  <Counter target={15} suffix="+" />
                </p>
                <p className="text-xs text-cream-100/60 mt-1 tracking-wide">{t('home.stat2')}</p>
              </div>
              <div>
                <p className="font-display text-3xl font-semibold text-cream-50">
                  <Counter target={10} suffix="+" />
                </p>
                <p className="text-xs text-cream-100/60 mt-1 tracking-wide">{t('home.stat3')}</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={150} className="hidden lg:block absolute right-10 xl:right-20 bottom-4 max-w-[240px]">
            <div className="bg-cream-50 border border-wood-700/10 shadow-2xl rounded-sm px-5 py-4">
              <p className="font-display text-sm italic text-wood-700 leading-snug">
                « Notre cuisine moderne sur mesure en Iroko est la pièce maîtresse de la maison ! »
              </p>
              <p className="text-[11px] text-wood-500 mt-2 font-semibold tracking-wide">— Famille N., Yaoundé</p>
            </div>
          </Reveal>
        </div>

        {/* Ticker défilant */}
        <div className="w-full bg-wood-950/90 backdrop-blur-sm py-3.5 overflow-hidden border-t border-cream-50/10 relative z-10">
          <div className="flex w-max animate-scroll-left">
            {[0, 1].map((rep) => (
              <span
                key={rep}
                className="flex items-center gap-3 pr-10 text-cream-100 font-display italic text-sm md:text-base tracking-wide"
                aria-hidden={rep === 1}
              >
                {sortedCategories.map((cat) => (
                  <span key={cat.slug} className="flex items-center gap-3">
                    <span className={cat.slug === 'meubles-cuisine' ? 'text-oak-300 font-semibold' : ''}>
                      {categoryName(cat, i18n.language)}
                    </span>
                    <span className="text-red-500 not-italic">✦</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Modules de menuiserie (Cuisines en 1ère position) */}
      <section className="bg-cream-50 py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <p className="text-xs font-bold tracking-[0.25em] text-red-600 mb-3">{t('home.modulesEyebrow').toUpperCase()}</p>
              <h2 className="font-display text-4xl md:text-5xl font-semibold text-wood-950 max-w-xl leading-tight">
                {t('home.modulesTitle')}
              </h2>
            </div>
            <p className="text-wood-600 max-w-sm leading-relaxed">{t('home.modulesSubtitle')}</p>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {sortedCategories.map((cat, i) => (
              <ModuleCard key={cat.slug} category={cat} delay={i * 60} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button to="/catalogue" variant="outline">
              {t('home.seeCatalogue')}
            </Button>
          </div>
        </div>
      </section>

      {/* SECTION MAJEURE DÉDIÉE : Cuisines Modernes sur Mesure */}
      <section className="bg-wood-950 text-cream-100 py-20 md:py-28 relative overflow-hidden border-t border-wood-800">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-oak-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-5 md:px-10 relative z-10">
          <Reveal className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-semibold tracking-wider uppercase mb-4">
                <span>✦</span> Notre spécialité phare
              </div>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-cream-50 leading-tight">
                L’élégance de la <span className="italic text-oak-400">cuisine moderne</span>, façonnée sur mesure.
              </h2>
            </div>
            <div className="max-w-md">
              <p className="text-wood-300 text-sm md:text-base leading-relaxed mb-6">
                Plus qu’un lieu de préparation, la cuisine est le cœur vibrant de votre maison. Nous créons des agencements contemporains haut de gamme alliant le cachet du bois noble camerounais et les fonctionnalités modernes.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button to="/catalogue?module=meubles-cuisine">
                  Explorer nos cuisines <ArrowRight size={15} />
                </Button>
                <Button
                  to="/devis?module=meubles-cuisine"
                  variant="outline"
                  className="!border-oak-400/50 !text-oak-300 hover:!bg-oak-400 hover:!text-wood-950"
                >
                  Devis cuisine 3D
                </Button>
              </div>
            </div>
          </Reveal>

          {/* 4 piliers d'excellence */}
          <Reveal delay={100} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {KITCHEN_PILLARS.map((p) => (
              <div
                key={p.title}
                className="bg-wood-900/60 border border-wood-800 rounded-sm p-6 hover:border-red-600/50 transition-colors"
              >
                <span className="text-[10px] font-bold tracking-widest uppercase text-oak-400 mb-2 block">
                  {p.badge}
                </span>
                <div className="w-8 h-8 rounded-full bg-wood-800 flex items-center justify-center text-oak-400 mb-3">
                  <p.icon size={16} />
                </div>
                <h3 className="font-display font-semibold text-lg text-cream-100 mb-2">{p.title}</h3>
                <p className="text-xs text-wood-300 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </Reveal>

          {/* Modèles vedettes */}
          <div className="grid md:grid-cols-3 gap-6">
            {KITCHEN_STYLES.map((style, i) => (
              <Reveal key={style.title} delay={150 + i * 80}>
                <div className="bg-wood-900/90 border border-wood-700/30 rounded-sm overflow-hidden flex flex-col justify-between h-full hover:border-oak-400/50 transition-all card-lift">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={style.image}
                      alt={`${style.title} - Cuisine moderne sur mesure à Douala Lenuxwood`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-red-600/20 text-red-400 border border-red-600/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {style.tag}
                      </span>
                      <span className="text-xs font-semibold text-oak-400">{style.price}</span>
                    </div>
                    <h4 className="font-display font-semibold text-xl text-cream-50 mb-3">{style.title}</h4>
                    <p className="text-xs text-wood-300 leading-relaxed mb-6">{style.desc}</p>
                  </div></div>
                  <div className="pt-4 border-t border-wood-800 flex items-center justify-between">
                    <span className="text-xs text-wood-400">100% sur mesure</span>
                    <Link
                      to="/devis?module=meubles-cuisine"
                      className="text-xs font-semibold text-oak-400 hover:text-cream-100 transition inline-flex items-center gap-1"
                    >
                      Configurer ce modèle →
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Séparateur élégant */}
      <div className="py-8 bg-cream-50 flex justify-center">
        <svg width="140" height="60" viewBox="0 0 140 60" fill="none">
          <path d="M2 30C2 15 30 2 70 2C110 2 138 15 138 30" stroke="#C08A45" strokeWidth="1" opacity="0.5" />
          <path d="M18 30C18 20 38 12 70 12C102 12 122 20 122 30" stroke="#C08A45" strokeWidth="1" opacity="0.7" />
          <path d="M34 30C34 24 48 20 70 20C92 20 106 24 106 30" stroke="#C08A45" strokeWidth="1.2" />
          <circle cx="70" cy="30" r="3" fill="#9C1F2A" />
        </svg>
      </div>

      {/* Galerie de réalisations */}
      {showRealisations && (
        <section className="bg-wood-950 py-20 md:py-28 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-red-700/10 wedge-clip" />
          <div className="max-w-7xl mx-auto px-5 md:px-10 relative z-10">
            <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div>
                <p className="text-xs font-bold tracking-[0.25em] text-oak-400 mb-3">{t('home.workEyebrow').toUpperCase()}</p>
                <h2 className="font-display text-4xl md:text-5xl font-semibold text-cream-100 max-w-xl leading-tight">
                  {t('home.workTitle')}
                </h2>
              </div>
              <Button to="/realisations" variant="outline" className="!border-oak-500 !text-cream-100">
                {t('home.seeAllWork')}
              </Button>
            </Reveal>

            <Reveal delay={100} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featured.map((item, i) => (
                <div
                  key={item.id}
                  className={`gallery-item aspect-square rounded-sm overflow-hidden relative ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
                >
                  <img
                    src={item.image_url}
                    alt={`${item.title}${item.city ? ` à ${item.city}` : ''} - Projet de menuiserie Lenuxwood Douala`}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-wood-950/90 to-transparent">
                    <p className={`text-cream-100 font-display font-semibold ${i === 0 ? 'text-xl' : 'text-sm'}`}>{item.title}</p>
                    {item.city && <p className="text-oak-400 text-xs mt-1 tracking-wide">{item.city}</p>}
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {/* Pourquoi LenuxWood */}
      <section className="bg-cream-100 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 md:px-10 grid lg:grid-cols-4 gap-8">
          <Reveal className="lg:col-span-1">
            <p className="text-xs font-bold tracking-[0.25em] text-red-600 mb-3">{t('home.whyEyebrow').toUpperCase()}</p>
            <h2 className="font-display text-3xl font-semibold text-wood-950 leading-tight">{t('home.whyTitle')}</h2>
          </Reveal>
          <div className="lg:col-span-3 grid sm:grid-cols-2 gap-8">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 70} className="flex gap-4">
                <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-wood-950 text-oak-400">
                  <f.icon size={18} />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg text-wood-950 mb-1">{f.title}</h3>
                  <p className="text-sm text-wood-600 leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Bandeau d'appel à l'action */}
      <section className="relative bg-wood-950 py-20 md:py-24 overflow-hidden">
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-red-700/20 rounded-full blur-3xl" />
        <Reveal className="max-w-4xl mx-auto px-5 md:px-10 text-center relative z-10">
          <p className="text-xs font-bold tracking-[0.25em] text-oak-400 mb-4">{t('home.ctaBandEyebrow').toUpperCase()}</p>
          <h2 className="font-display text-3xl md:text-5xl font-semibold text-cream-100 leading-tight mb-6">
            {t('home.ctaBandTitle1')} <span className="italic text-oak-400">{t('home.ctaBandTitle2')}</span>
          </h2>
          <p className="text-wood-400 max-w-xl mx-auto mb-8 leading-relaxed">{t('home.ctaBandSubtitle')}</p>
          <Button to="/devis" className="text-base px-8 py-4">
            {t('home.ctaBandButton')} <ArrowRight size={16} />
          </Button>
        </Reveal>
      </section>
    </>
  )
}
