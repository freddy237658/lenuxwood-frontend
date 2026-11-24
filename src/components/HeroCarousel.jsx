import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./ui/Button";

// Chaque slide possède son propre jeu d'images de fond (rotation automatique),
// son titre, son texte et ses appels à l'action.
const HERO_SLIDES = [
  {
    images: [
      "/images/site/hero-1.jpeg",
      "/images/site/hero-2.jpeg",
      "/images/site/hero-3.jpeg",
    ],
    quote: {
      text: "« Notre cuisine moderne sur mesure en Iroko est la pièce maîtresse de la maison ! »",
      author: "— Famille N., Yaoundé",
    },
  },
  {
    images: [
      "/images/site/hero-3 (2).jpeg",
      "/images/site/hero-5.jpeg",
      "/images/site/WhatsApp Image 2026-11-24 at 10.25.17.jpeg",
    ],
    quote: {
      text: "« Un îlot central en Iroko qui a transformé notre façon de vivre la cuisine. »",
      author: "— Mme T., Bonapriso, Douala",
    },
  },
  {
    images: [
      "/images/site/hero-4.jpg",
      "/images/site/hero-5.webp",
      "/images/site/hero-6.jpeg",
    ],
    quote: {
      text: "« Le veinage de l'acajou est juste sublime, on ne se lasse jamais de le regarder. »",
      author: "— Cabinet d’architecture, Douala",
    },
  },
  {
    images: [
      "/images/site/hero-6.jpeg",
      "/images/site/hero-7.jpg",
      "/images/site/WhatsApp Image 2026-11-24 at 10.25.18 (1).jpeg",
    ],
    quote: {
      text: "« Dressings et bibliothèques pensés au millimètre, tout est parfaitement aligné. »",
      author: "— Résidence privée, Bonamoussadi",
    },
  },
  {
    images: [
      "/images/site/hero-8.jpeg",
      "/images/site/hero-9.jpeg",
      "/images/site/WhatsApp Image 2026-11-24 at 10.25.18 (2).jpeg",
    ],
    quote: {
      text: "« Livraison et pose à Bafoussam impeccables, un vrai travail d'artisan. »",
      author: "— Hôtel Le Rêve, Bafoussam",
    },
  },
];

const STATS = [
  { value: "500+", key: "home.stat1" },
  { value: "15+", key: "home.stat2" },
  { value: "10+", key: "home.stat3" },
];

const AUTOPLAY_MS = 9000;
const IMAGE_ROTATION_MS = 5000;

const AUTOPLAY_ENABLED =
  new URLSearchParams(window.location.search).get("hero-autoplay") !== "0";

function SlideBackground({ images, active }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) return undefined;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, IMAGE_ROTATION_MS);
    return () => clearInterval(interval);
  }, [active, images.length]);

  const current = index % images.length;

  return (
    // Les slides inactifs restent montés (préchargement) mais doivent être
    // totalement transparents et non cliquables, sinon leur image opaque
    // recouvre celle du slide actif : on ne voyait alors qu'une seule image.
    <div
      aria-hidden={!active}
      className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
      style={{
        opacity: active ? 1 : 0,
        zIndex: active ? 1 : 0,
        pointerEvents: "none",
      }}
    >
      {images.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-[1400ms] ease-in-out"
          style={{
            backgroundImage: `url('${src}')`,
            opacity: i === current ? 1 : 0,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-wood-950 via-wood-950/80 to-wood-950/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-wood-950 via-transparent to-wood-950/20" />
    </div>
  );
}

export default function HeroCarousel({ ticker }) {
  const { t } = useTranslation();
  const slides = t("home.heroSlides", { returnObjects: true });
  const list = Array.isArray(slides) ? slides : [];
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback(
    (index) => {
      if (!list.length) return;
      setActive((index + list.length) % list.length);
    },
    [list.length],
  );

  const next = useCallback(() => goTo(active + 1), [goTo, active]);
  const prev = useCallback(() => goTo(active - 1), [goTo, active]);

  useEffect(() => {
    if (!AUTOPLAY_ENABLED || paused || list.length < 2) return undefined;
    const timer = setTimeout(next, AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [next, paused, list.length]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const slide = list[active] || {};
  const quote = HERO_SLIDES[active]?.quote;

  return (
    <section
      className="relative bg-wood-950 overflow-hidden"
      aria-roledescription="carrousel"
      aria-label="À la une"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Fonds de tous les slides (préchargés, seul l'actif est visible) */}
      {HERO_SLIDES.map((s, i) => (
        <SlideBackground key={i} images={s.images} active={i === active} />
      ))}

      <div className="max-w-7xl mx-auto px-5 md:px-10 pt-16 md:pt-24 pb-12 relative z-10">
        {list.length > 0 && (
          <div
            key={active}
            role="group"
            aria-roledescription="slide"
            aria-label={`${active + 1} / ${list.length}`}
            className="max-w-2xl animate-[heroIn_0.7s_cubic-bezier(0.2,0.7,0.2,1)_both] motion-reduce:animate-none"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream-50/10 backdrop-blur-sm border border-cream-50/20 text-cream-100 text-xs font-semibold tracking-wide mb-6">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="uppercase">{slide.badge}</span>
            </div>

            <h1 className="font-display text-[2.3rem] leading-[1.05] md:text-6xl md:leading-[1.03] font-semibold text-cream-50 tracking-tight">
              {slide.title1}
              <br />
              <span className="italic font-medium text-oak-300">
                {slide.titleAccent}
              </span>{" "}
              {slide.title2}
            </h1>

            <p className="mt-6 text-cream-100/80 text-base md:text-lg max-w-md leading-relaxed">
              {slide.subtitle}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button to={slide.primaryTo}>
                {slide.primaryCta} <ArrowRight size={16} />
              </Button>
              <Button
                to={slide.secondaryTo}
                variant="outline"
                className="!border-cream-50/40 !text-cream-50 hover:!bg-cream-50 hover:!text-wood-950"
              >
                {slide.secondaryCta}
              </Button>
            </div>
          </div>
        )}

        {/* Chiffres clés */}
        <div className="mt-10 md:mt-12 pt-6 border-t border-cream-50/15 grid grid-cols-3 gap-4 max-w-lg">
          {STATS.map((s) => (
            <div key={s.key}>
              <p className="font-display text-3xl md:text-4xl font-semibold text-oak-300">
                {s.value}
              </p>
              <p className="text-cream-100/70 text-xs md:text-sm mt-1 tracking-wide">
                {t(s.key)}
       </p>
            </div>
          ))}
        </div>

        {quote && (
        <div className="hidden lg:block absolute right-10 bottom-12 max-w-[240px]">
            <div className="bg-cream-50 border border-wood-700/10 shadow-2xl rounded-sm px-5 py-4">
              <p className="font-display text-sm italic text-wood-700 leading-snug">
                {quote.text}
              </p>
              <p className="text-[11px] text-wood-500 mt-2 font-semibold tracking-wide">
                {quote.author}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Indicateurs de slide */}
      {list.length > 1 && (
        <div className="relative z-20 flex items-center justify-center gap-2.5 pb-8">
          <button
            type="button"
            onClick={prev}
            aria-label="Slide précédent"
            className="mr-2 w-10 h-10 flex items-center justify-center rounded-full bg-cream-50/10 hover:bg-cream-50/25 border border-cream-50/25 text-cream-50 backdrop-blur-sm transition"
          >
            <ChevronLeft size={20} />
          </button>
          {list.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Aller au slide ${i + 1}`}
              aria-current={i === active}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === active
                  ? "w-10 bg-oak-400"
                  : "w-5 bg-cream-50/30 hover:bg-cream-50/60"
              }`}
            />
          ))}
          <button
            type="button"
            onClick={next}
            aria-label="Slide suivant"
            className="ml-2 w-10 h-10 flex items-center justify-center rounded-full bg-cream-50/10 hover:bg-cream-50/25 border border-cream-50/25 text-cream-50 backdrop-blur-sm transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {ticker}
    </section>
  );
}
