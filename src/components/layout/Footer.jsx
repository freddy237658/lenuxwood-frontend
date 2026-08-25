import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import logo from '../../assets/logo.jpg'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-wood-950 border-t border-wood-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-5 md:px-10 grid md:grid-cols-4 gap-10 mb-12">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <img src={logo} alt="LenuxWood" className="h-9 w-9 rounded-sm object-cover" />
            <p className="font-display font-semibold text-cream-100">
              Lenux<span className="text-red-500">Wood</span>
            </p>
          </div>
          <p className="text-sm text-wood-400 leading-relaxed max-w-xs">{t('footer.tagline')}</p>
        </div>

        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-oak-400 mb-4">{t('footer.modules').toUpperCase()}</p>
          <ul className="space-y-2.5 text-sm text-wood-400">
            <li><Link to="/catalogue" className="hover:text-cream-100 transition">{t('modules.charpente.name')}</Link></li>
            <li><Link to="/catalogue" className="hover:text-cream-100 transition">{t('modules.cuisine.name')}</Link></li>
            <li><Link to="/catalogue" className="hover:text-cream-100 transition">{t('modules.salon.name')}</Link></li>
            <li><Link to="/catalogue" className="hover:text-cream-100 transition">{t('modules.chambre.name')}</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-oak-400 mb-4">{t('footer.company').toUpperCase()}</p>
          <ul className="space-y-2.5 text-sm text-wood-400">
            <li><Link to="/a-propos" className="hover:text-cream-100 transition">{t('nav.about')}</Link></li>
            <li><Link to="/realisations" className="hover:text-cream-100 transition">{t('nav.realisations')}</Link></li>
            <li><Link to="/devis" className="hover:text-cream-100 transition">{t('nav.quote')}</Link></li>
            <li><Link to="/compte" className="hover:text-cream-100 transition">Suivi de commande</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-oak-400 mb-4">{t('footer.contact').toUpperCase()}</p>
          <ul className="space-y-2.5 text-sm text-wood-400">
            <li>Douala &amp; Yaoundé, Cameroun</li>
            <li>+237 6XX XXX XXX</li>
            <li>contact@lenuxwood.com</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-5 md:px-10 pt-6 border-t border-wood-800 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-xs text-wood-500">© {new Date().getFullYear()} LenuxWood. {t('footer.rights')}</p>
        <p className="text-xs text-wood-500">Fait avec soin au Cameroun</p>
      </div>
    </footer>
  )
}
