import { CheckCircle2, MapPin, Timer, Linkedin } from 'lucide-react'
import Reveal from '../components/ui/Reveal'

const VALUES = [
  { icon: CheckCircle2, title: 'Qualité sans compromis', desc: 'Chaque pièce est contrôlée avant livraison, du premier au dernier détail.' },
  { icon: MapPin, title: 'Ancrage local', desc: "Bois et savoir-faire camerounais, au service des foyers du pays." },
  { icon: Timer, title: 'Délais respectés', desc: 'Un planning clair communiqué dès la validation de votre devis.' },
]

// TODO: remplacer `photo: null` par le chemin réel de la photo une fois reçue
// (ex: import photoMarc from '../assets/team/marc.jpg' puis photo: photoMarc)
const TEAM = [
  { name: 'Marc Lenux', role: 'Fondateur & Directeur général', color: '#4A2E1A', photo: null },
  { name: 'Ange Fotso', role: 'Associée & Directrice financière', color: '#6B4426', photo: null },
  { name: 'Paul Mbarga', role: 'Chef d\'atelier menuiserie', color: '#8A5C34', photo: null },
  { name: 'Sarah Njoya', role: 'Responsable relation client', color: '#7A4B26', photo: null },
  { name: 'Éric Talla', role: 'Chef de chantier charpente', color: '#3E2717', photo: null },
  { name: 'Diane Abena', role: 'Designer mobilier', color: '#A97A48', photo: null },
]

// TODO: remplacer par l'adresse exacte de LenuxWood
const MAP_QUERY = 'Zone industrielle, Douala, Cameroun'
const MAP_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`

export default function About() {
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

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEAM.map((member, i) => (
              <Reveal key={member.name} delay={(i % 6) * 60}>
                <div className="bg-white border border-wood-700/10 rounded-sm overflow-hidden card-lift">
                  <div className="aspect-[4/3] relative">
                    {member.photo ? (
                      <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 grain-bg flex items-center justify-center" style={{ backgroundColor: member.color }}>
                        <span className="font-display text-3xl font-semibold text-cream-100/80">
                          {member.name.split(' ').map((n) => n[0]).join('')}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex items-center justify-between">
                    <div>
                      <p className="font-display font-semibold text-wood-950">{member.name}</p>
                      <p className="text-xs text-wood-500 mt-0.5">{member.role}</p>
                    </div>
                    <Linkedin size={16} className="text-wood-400" />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
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
              {/* TODO: remplacer ce bloc par la vraie photo du bâtiment/atelier LenuxWood */}
              <div className="aspect-[4/3] rounded-sm overflow-hidden relative bg-wood-800 grain-bg">
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-wood-950/90 to-transparent">
                  <p className="text-cream-100 font-display text-lg font-semibold">Atelier & showroom LenuxWood</p>
                  <p className="text-oak-400 text-xs mt-1 tracking-wide">Zone industrielle, Douala</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="aspect-[4/3] rounded-sm overflow-hidden border border-wood-700/10">
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
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
