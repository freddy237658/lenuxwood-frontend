import { Facebook, Instagram, Linkedin } from "lucide-react";
import TikTokIcon from "./TikTokIcon";

// Liens officiels des réseaux sociaux LenuxWood
export const SOCIAL_LINKS = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/share/1FMobE1xto/",
    icon: Facebook,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/lenuxwood_cameroun?lqvp=MWp1OTFwb3BqaDhiNw==",
    icon: Instagram,
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@lenux_wood",
    icon: TikTokIcon,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/lenuxwood",
    icon: Linkedin,
  },
];

export default function SocialLinks({ className = "", variant = "light" }) {
  const dark = variant === "dark";
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {SOCIAL_LINKS.map(({ name, href, icon: Icon }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={name}
          title={name}
          className={
            dark
              ? "w-9 h-9 rounded-full border border-cream-50/20 flex items-center justify-center text-wood-300 hover:text-oak-400 hover:border-oak-400/60 transition"
              : "w-9 h-9 rounded-full border border-wood-700/15 flex items-center justify-center text-wood-500 hover:text-red-600 hover:border-red-600 transition"
          }
        >
          <Icon size={15} />
        </a>
      ))}
    </div>
  );
}
