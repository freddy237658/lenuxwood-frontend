import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { ArrowRight, Check, Ruler, Smartphone, Truck } from 'lucide-react'
import Button from '../components/ui/Button'
import Reveal from '../components/ui/Reveal'
import ModuleCard from '../components/ModuleCard'
import { MODULES } from '../data/modules'

const MARQUEE_KEYS = ['charpente', 'cuisine', 'salon', 'chambre', 'plafonds', 'sols', 'portes', 'armoires']

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

const GALLERY = [
  { color: '#4A2E1A', title: 'Salon contemporain', city: 'Yaoundé', big: true },
  { color: '#6B4426', title: 'Cuisine sur mesure' },
  { color: '#3E2717', title: 'Suite parentale' },
  { color: '#8A5C34', title: 'Toiture villa' },
  { color: '#7A4B26', title: 'Îlot central' },
]

const FEATURES = [
  { icon: Check, title: 'Bois sélectionné', desc: 'Essences locales choisies pour leur résistance et leur beauté naturelle.' },
  { icon: Ruler, title: 'Sur mesure', desc: 'Chaque pièce est pensée pour votre espace, vos dimensions, votre style.' },
  { icon: Smartphone, title: 'Paiement flexible', desc: 'Devis en ligne et paiement sécurisé via Orange Money ou MTN MoMo.' },
  { icon: Truck, title: 'Livraison nationale', desc: 'Présents dans les grandes villes, livrables partout au Cameroun.' },
]

export default function Home() {
  const { t } = useTranslation()

  return (
    <>
      <section className="relative bg-cream-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 md:px-10 pt-14 md:pt-20 pb-16 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-cream-200 text-wood-700 text-xs font-semibold tracking-wide mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
              {t('home.badge').toUpperCase()}
            </div>
            <h1 className="font-display text-[2.6rem] leading-[1.05] md:text-6xl md:leading-[1.03] font-semibold text-wood-950 tracking-tight">
              {t('home.title1')}
              <br />
              <span className="italic font-medium text-wood-600">{t('home.title2')}</span> {t('home.title3')}
            </h1>
            <p className="mt-6 text-wood-700 text-base md:text-lg max-w-md leading-relaxed">{t('home.subtitle')}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button to="/devis">
                {t('home.ctaQuote')} <ArrowRight size={16} />
              </Button>
              <Button to="/realisations" variant="outline">
                {t('home.ctaWork')}
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 max-w-md border-t border-wood-700/15 pt-6">
              <div>
                <p className="font-display text-3xl font-semibold text-wood-950">
                  <Counter target={500} />
                </p>
                <p className="text-xs text-wood-500 mt-1 tracking-wide">{t('home.stat1')}</p>
              </div>
              <div>
                <p className="font-display text-3xl font-semibold text-wood-950">
                  <Counter target={15} suffix="+" />
                </p>
                <p className="text-xs text-wood-500 mt-1 tracking-wide">{t('home.stat2')}</p>
              </div>
              <div>
                <p className="font-display text-3xl font-semibold text-wood-950">
                  <Counter target={10} suffix="+" />
                </p>
                <p className="text-xs text-wood-500 mt-1 tracking-wide">{t('home.stat3')}</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="relative">
              <div className="absolute -top-6 -right-6 w-24 h-24 md:w-32 md:h-32 bg-oak-500/25 rounded-full blur-2xl" />
              <div className="relative aspect-[4/5] md:aspect-[5/6] rounded-sm overflow-hidden corner-cut">
                <div className="absolute inset-0 bg-wood-800 grain-bg flex items-center justify-center">
                  <svg width="64%" height="64%" viewBox="0 0 200 200" fill="none" className="opacity-90">
                    <rect x="20" y="120" width="160" height="14" rx="2" fill="#D3A868" />
                    <rect x="30" y="60" width="30" height="74" rx="2" fill="#A97A48" />
                    <rect x="70" y="80" width="30" height="54" rx="2" fill="#8A5C34" />
                    <rect x="110" y="45" width="30" height="89" rx="2" fill="#A97A48" />
                    <rect x="150" y="95" width="20" height="39" rx="2" fill="#6B4426" />
                  </svg>
                </div>
                <div className="absolute bottom-0 right-0 w-2/3 h-1/3 bg-red-700" />
              </div>
              <div className="absolute -bottom-6 -left-4 md:-left-8 bg-cream-50 border border-wood-700/10 shadow-xl rounded-sm px-5 py-4 max-w-[220px]">
                <p className="font-display text-sm italic text-wood-700 leading-snug">
                  « Les meubles les plus solides que j'ai commandés. »
                </p>
                <p className="text-[11px] text-wood-500 mt-2 font-semibold tracking-wide">— Client, Douala</p>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="w-full bg-wood-950 py-3.5 overflow-hidden border-y border-wood-800">
          <div className="flex w-max animate-scroll-left">
            {[0, 1].map((rep) => (
              <span key={rep} className="flex items-center gap-3 pr-10 text-cream-100 font-display italic text-sm md:text-base tracking-wide" aria-hidden={rep === 1}>
                {MARQUEE_KEYS.map((key) => (
                  <span key={key} className="flex items-center gap-3">
                    <span>{t(`modules.${key}.name`)}</span>
                    <span className="text-red-500 not-italic">✦</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream-50 py-20 md:py-28">
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
            {MODULES.map((mod, i) => (
              <ModuleCard key={mod.slug} module={mod} delay={i * 60} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button to="/catalogue" variant="outline">
              {t('home.seeCatalogue')}
            </Button>
          </div>
        </div>
      </section>

      <div className="py-10 bg-cream-50 flex justify-center">
        <svg width="140" height="60" viewBox="0 0 140 60" fill="none">
          <path d="M2 30C2 15 30 2 70 2C110 2 138 15 138 30" stroke="#C08A45" strokeWidth="1" opacity="0.5" />
          <path d="M18 30C18 20 38 12 70 12C102 12 122 20 122 30" stroke="#C08A45" strokeWidth="1" opacity="0.7" />
          <path d="M34 30C34 24 48 20 70 20C92 20 106 24 106 30" stroke="#C08A45" strokeWidth="1.2" />
          <circle cx="70" cy="30" r="3" fill="#9C1F2A" />
        </svg>
      </div>

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
            {GALLERY.map((item) => (
              <div
                key={item.title}
                className={`gallery-item aspect-square rounded-sm overflow-hidden relative ${item.big ? 'col-span-2 row-span-2' : ''}`}
              >
                <div className="absolute inset-0 grain-bg" style={{ backgroundColor: item.color }} />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-wood-950/90 to-transparent">
                  <p className={`text-cream-100 font-display font-semibold ${item.big ? 'text-xl' : 'text-sm'}`}>{item.title}</p>
                  {item.city && <p className="text-oak-400 text-xs mt-1 tracking-wide">{item.city}</p>}
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

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
