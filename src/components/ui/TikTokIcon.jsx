export default function TikTokIcon({ size = 16, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M16.5 2h-3.2v13.6c0 1.5-1.2 2.7-2.7 2.7s-2.7-1.2-2.7-2.7 1.2-2.7 2.7-2.7c.3 0 .6 0 .8.1V9.7c-.3 0-.5-.1-.8-.1-3.2 0-5.9 2.6-5.9 5.9s2.6 5.9 5.9 5.9 5.9-2.6 5.9-5.9V8.4c1.2.9 2.7 1.4 4.3 1.4V6.5c-2.4 0-4.3-1.9-4.3-4.3V2z" />
    </svg>
  )
}