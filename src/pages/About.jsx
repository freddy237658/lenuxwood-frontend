import { CheckCircle2, MapPin, Timer, Facebook, Linkedin, X, Loader2, ExternalLink } from 'lucide-react'
import Reveal from '../components/ui/Reveal'
import TikTokIcon from '../components/ui/TikTokIcon'
import { useTeam } from '../hooks/useTeam'
import { ATELIER_ADDRESS, MAP_EMBED_SRC, MAP_DIRECT_URL } from '../lib/location'

const VALUES = [
  { icon: CheckCircle2, title: 'Qualité sans compromis', desc: 'Chaque pièce est contrôlée avant livraison, du premier au dernier détail.' },
  { icon: MapPin, title: 'Ancrage local', desc: "Bois et savoir-faire camerounais, au service des foyers du pays." },
  { icon: Timer, title: 'Délais respectés', desc: 'Un planning clair communiqué dès la validation de votre devis.' },
]

function SocialLink({ href, icon: Icon }) {
  if (!href) return null
  return (
    <a
      href={href}
      
      target="_blank"
      rel="noopener noreferrer"
      className="w-8 h-8 rounded-full border border-wood-700/15 flex items-center justify-center text-wood-500 hover:text-red-600 hover:border-red-600 transition"
    >
      <Icon size={14} />
    </a>
  )
}

export default function About() {
  const { team, loading: teamLoading } = useTeam()

  return (
    <>
      <section className="bg-cream-50 py-16 md:py-24">
        <Reveal className="max-w-4xl mx-auto px-5 md:px-10 text-center">
          <p className="text-xs font-bold tracking-[0.25em] text-red-600 mb-4">NOTRE HISTOIRE</p>
          <h1 className="font-display text-3xl md:text-5xl font-semibold text-wood-950 leading-tight mb-6">
            Née dans un atelier, bâtie pour tout le Cameroun.
          </h1>
          <p className="text-wood-600 leading-relaxed max-w-2xl mx-auto">
            LenuxWood a commencé comme un petit atelier de menuiserie. Aujourd'hui, l'entreprise accompagne
            particuliers, architectes et entreprises dans tout le pays, avec la même exigence artisanale
            qu'au premier jour.
          </p>
        </Reveal>
      </section>

      <section className="bg-wood-950 py-16 md:py-20">
        <Reveal className="max-w-7xl mx-auto px-5 md:px-10 grid sm:grid-cols-3 gap-8 text-center">
          <div>
            <p className="font-display text-4xl font-semibold text-oak-400">15+</p>
            <p className="text-wood-400 text-sm mt-2 tracking-wide">Années d'expérience</p>
          </div>
          <div>
            <p className="font-display text-4xl font-semibold text-oak-400">500+</p>
            <p className="text-wood-400 text-sm mt-2 tracking-wide">Projets réalisés</p>
          </div>
          <div>
            <p className="font-display text-4xl font-semibold text-oak-400">10+</p>
            <p className="text-wood-400 text-sm mt-2 tracking-wide">Villes couvertes</p>
          </div>
        </Reveal>
      </section>

      <section className="bg-cream-100 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <Reveal className="text-center">
            <p className="text-xs font-bold tracking-[0.25em] text-red-600 mb-3">NOS VALEURS</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-wood-950 mb-14">
              Ce qui guide chaque pièce que nous fabriquons
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-8">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 70} className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-wood-950 text-oak-400 flex items-center justify-center">
                  <v.icon size={22} />
                </div>
                <h3 className="font-display font-semibold text-lg text-wood-950 mb-2">{v.title}</h3>
                <p className="text-sm text-wood-600 leading-relaxed max-w-xs mx-auto">{v.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <Reveal className="text-center mb-14">
            <p className="text-xs font-bold tracking-[0.25em] text-red-600 mb-3">L'ÉQUIPE</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-wood-950">
              Les mains et les visages derrière chaque pièce
            </h2>
          </Reveal>

          {teamLoading ? (
            <div className="flex items-center justify-center gap-2 text-wood-500 py-10">
              <Loader2 size={18} className="animate-spin" /> Chargement de l'équipe...
            </div>
          ) : team.length === 0 ? (
            <p className="text-center text-wood-400">L'équipe sera bientôt présentée ici.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((member, i) => (
                <Reveal key={member.id} delay={(i % 6) * 60}>
                  <div className="bg-white border border-wood-700/10 rounded-sm overflow-hidden card-lift">
                    <div className="aspect-[4/3] relative">
                      {member.photo_url ? (
                        <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 bg-wood-700 grain-bg flex items-center justify-center">
                          <span className="font-display text-3xl font-semibold text-cream-100/80">
                            {member.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <p className="font-display font-semibold text-wood-950">{member.name}</p>
                      <p className="text-xs text-wood-500 mt-0.5 mb-3">{member.role}</p>
                      <div className="flex items-center gap-2">
                        <SocialLink href={member.social?.facebook} icon={Facebook} />
                        <SocialLink href={member.social?.linkedin} icon={Linkedin} />
                        <SocialLink href={member.social?.x} icon={X} />
                        <SocialLink href={member.social?.tiktok} icon={TikTokIcon} />
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-cream-100 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <Reveal className="text-center mb-14">
            <p className="text-xs font-bold tracking-[0.25em] text-red-600 mb-3">NOS LOCAUX</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-wood-950">Où nous trouver</h2>
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-6">
            <Reveal>
              <div className="aspect-[4/3] rounded-sm overflow-hidden relative">
                <img
                  src="/images/site/atelier.jpg"
                  alt="Atelier LenuxWood"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-wood-950/90 to-transparent">
                  <p className="text-cream-100 font-display text-lg font-semibold">Atelier & showroom LenuxWood</p>
                  <p className="text-oak-400 text-xs mt-1 tracking-wide">{ATELIER_ADDRESS}</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="aspect-[4/3] rounded-sm overflow-hidden border border-wood-700/10 relative group bg-wood-950">
                <iframe
                  title="Localisation LenuxWood"
                  src={MAP_EMBED_SRC}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <a
                  href={MAP_DIRECT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 bg-wood-950/90 hover:bg-red-600 text-cream-50 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md transition flex items-center gap-1.5 backdrop-blur-xs"
                >
                  <ExternalLink size={13} /> Ouvrir Google Maps
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}