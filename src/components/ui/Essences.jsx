import Reveal from "./Reveal";

// Essences de bois utilisées par LenuxWood
const ESSENCES = [
  {
    name: "Bibolo",
    desc: "Bois rougeâtre, tendre et facile à travailler, idéal pour les meubles de prestige et les finitions chaleureuses.",
    img: "/images/essences/acajou.jpg",
    tone: "#7a3b2e",
  },
  {
    name: "Bilinga",
    desc: "Bois dense et imputrescible, reconnu pour sa durabilité exceptionnelle et son grain doré élégant.",
    img: "/images/essences/teck.jpg",
    tone: "#9a6b35",
  },
  {
    name: "Padouk",
    desc: "Bois dense et imputrescible, reconnu pour sa durabilité exceptionnelle et son grain doré élégant.",
    img: "/images/essences/teck.jpg",
    tone: "#9a6b35",
  },
  {
    name: "Iroko",
    desc: "Bois dur d'Afrique de l'Ouest, résistant aux insectes et à l'humidité, parfait pour cuisines et extérieurs.",
    img: "/images/essences/iroko.jpg",
    tone: "#8a6a3f",
  },
  {
    name: "Movingui",
    desc: "Bois dur d'Afrique de l'Ouest, résistant aux insectes et à l'humidité, parfait pour cuisines et extérieurs.",
    img: "/images/essences/iroko.jpg",
    tone: "#8a6a3f",
  },
  {
    name: "Doussie",
    desc: "Bois dur d'Afrique de l'Ouest, résistant aux insectes et à l'humidité, parfait pour cuisines et extérieurs.",
    img: "/images/essences/iroko.jpg",
    tone: "#8a6a3f",
  },
];

// Teintes et finitions disponibles dans le catalogue LenuxWood
const TEINTES = [
  { name: "Chêne naturel", hex: "#c9a06c" },
  { name: "Noyer moyen", hex: "#8a5a2b" },
  { name: "Acajou foncé", hex: "#5e2f1f" },
  { name: "Wengé", hex: "#3a2a22" },
  { name: "Blanc mat", hex: "#efeae2" },
  { name: "Gris anthracite", hex: "#4a4a48" },
];

export default function Essences() {
  return (
    <section className="bg-cream-100 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <Reveal>
          <p className="text-xs text-wood-500 mb-2">Nos essences & teintes</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-wood-950 mb-3">
            Des essences de bois sélectionnées avec soin
          </h2>
          <p className="text-wood-500 text-sm max-w-2xl mb-12">
            LenuxWood travaille uniquement des essences nobles, séchées et
            traitées, disponibles dans une large palette de teintes pour
            s'accorder à votre intérieur.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Liste des essences */}
          <div className="space-y-4">
            {ESSENCES.map((e, i) => (
              <Reveal key={e.name} delay={i * 100}>
                <div className="group flex items-center gap-4 bg-cream-50 border border-wood-700/10 rounded-sm p-4 hover:border-oak-400/50 transition">
                  <div
                    className="w-16 h-16 md:w-20 md:h-20 rounded-sm overflow-hidden shrink-0"
                    style={{ backgroundColor: e.tone }}
                  >
                    <img
                      src={e.img}
                      alt={e.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-wood-900">
                      {e.name}
                    </h3>
                    <p className="text-wood-500 text-sm mt-1">{e.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Image d'illustration catalogue couleurs */}
          <Reveal delay={150}>
            <div className="relative">
              <div className="rounded-sm overflow-hidden shadow-lg">
                <img
                  src="/images/catalogues/catalogue-couleurs.jpeg"
                  alt="Catalogue des couleurs d'essences LenuxWood"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -left-5 bg-wood-950 text-cream-100 rounded-sm px-5 py-4 shadow-xl">
                <p className="font-display text-2xl font-semibold">15+</p>
                <p className="text-oak-400 text-xs tracking-wide">
                  teintes disponibles
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Palette des teintes */}
        <Reveal delay={100}>
          <div className="mt-20">
            <h3 className="font-display text-xl md:text-2xl font-semibold text-wood-950 mb-2">
              Nos teintes d'essences
            </h3>
            <p className="text-wood-500 text-sm mb-6">
              Chaque essence peut être finie dans l'une de nos teintes
              signature.
            </p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {TEINTES.map((t) => (
                <div key={t.name} className="text-center">
                  <div
                    className="aspect-square rounded-sm border border-wood-700/10 shadow-sm hover:scale-105 transition"
                    style={{ backgroundColor: t.hex }}
                  />
                  <p className="text-wood-700 text-xs mt-2">{t.name}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
