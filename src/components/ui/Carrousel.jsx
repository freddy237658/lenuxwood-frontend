import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Galerie manuelle + défilement automatique lent de droite à gauche
export default function Carrousel() {
  const IMAGES = [
    {
      src: "/images/realisations/[MC-J00169-131] MEUBLE DE CUISINE CRIARE ENSEMBLE DE 10 PIECES.jpg",
      alt: "Meuble de cuisine moderne en bois ensemble 10 pièces - Lenuxwood Douala",
    },
    {
      src: "/images/realisations/[MC-J00229-85+MC-5203] MEUBLE DE CUISINE MC-J00229-85.jpg",
      alt: "Cuisine moderne sur mesure avec îlot central à Douala - Lenuxwood",
    },
    {
      src: "/images/realisations/[MC-MP-2087] MEUBLE DE CUISINE.jpg",
      alt: "Conception et pose de cuisine contemporaine en bois noble - Cameroun",
    },
    {
      src: "/images/realisations/d12c98a3-d611-4e53-be47-baf9526f22d2.jpg",
      alt: "Agencement intérieur moderne et mobilier sur mesure - Lenuxwood Douala",
    },
    {
      src: "/images/realisations/1642501298687Tonda Menuiserie9.jpg",
      alt: "Menuiserie moderne et fabrication de placards sur mesure au Cameroun",
    },
    {
      src: "/images/realisations/hero-2.jfif",
      alt: "Aménagement intérieur et boiseries haut de gamme à Douala",
    },
    {
      src: "/images/realisations/images (7).jfif",
      alt: "Mobilier de salon moderne en bois noble Iroko - Lenuxwood",
    },
    {
      src: "/images/realisations/images (14).jfif",
      alt: "Table à manger contemporaine en bois massif - Menuiserie Douala",
    },
    {
      src: "/images/realisations/images (15).jfif",
      alt: "Meuble TV moderne et étagères suspendues en bois au Cameroun",
    },
    {
      src: "/images/realisations/images (17).jfif",
      alt: "Dressing sur mesure et armoire chambre en bois - Lenuxwood Douala",
    },
    {
      src: "/images/realisations/images (18).jfif",
      alt: "Porte intérieure moderne en bois massif Teck et Iroko",
    },
    {
      src: "/images/realisations/images (20).jfif",
      alt: "Mobilier de bureau design et agencement d'espace professionnel à Douala",
    },
    {
      src: "/images/realisations/images (22).jfif",
      alt: "Chambre à coucher contemporaine avec lit en bois massif - Lenuxwood",
    },
    {
      src: "/images/realisations/images (24).jfif",
      alt: "Meuble de salle de bain suspendu hydrofuge en bois noble",
    },
    {
      src: "/images/realisations/images (31).jfif",
      alt: "Menuiserie bois sur mesure et finitions de luxe à Douala Cameroun",
    },
  ];

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % IMAGES.length),
    [IMAGES.length],
  );
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + IMAGES.length) % IMAGES.length),
    [IMAGES.length],
  );

  // Défilement automatique lent (toutes les 4 secondes)
  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(next, 4000);
    return () => clearInterval(timerRef.current);
  }, [paused, next]);

  return (
    <section className="bg-wood-950 py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-10 mb-10">
        <p className="text-xs text-oak-400 mb-2">Galerie en mouvement</p>
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-cream-100">
          Nos réalisations en images
        </h2>
      </div>

      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Piste de défilement */}
        <div
          className="flex gap-4 transition-transform duration-700 ease-linear"
          style={{ transform: `translateX(-${current * (100 / 3)}%)` }}
        >
          {IMAGES.map((img, i) => (
            <div
              key={i}
              className="shrink-0 w-[80%] sm:w-[45%] md:w-[30%] aspect-[4/3] rounded-sm overflow-hidden"
            >
              <img
                src={encodeURI(img.src)}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Flèche gauche */}
        <button
          onClick={prev}
          aria-label="Image précédente"
          className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-cream-50/90 text-wood-900 flex items-center justify-center shadow-lg hover:bg-oak-400 hover:text-wood-950 transition"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Flèche droite */}
        <button
          onClick={next}
          aria-label="Image suivante"
          className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-cream-50/90 text-wood-900 flex items-center justify-center shadow-lg hover:bg-oak-400 hover:text-wood-950 transition"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Points de navigation */}
      <div className="flex justify-center gap-2 mt-8">
        {IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Aller à l'image ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === current
                ? "w-6 bg-oak-400"
                : "w-1.5 bg-cream-100/30 hover:bg-cream-100/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}


