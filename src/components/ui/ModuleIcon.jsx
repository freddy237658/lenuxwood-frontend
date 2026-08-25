const PATHS = {
  truss: (
    <>
      <path d="M16 5L4 24H28L16 5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M16 5V24M9.5 15H22.5" stroke="currentColor" strokeWidth="1.6" />
    </>
  ),
  kitchen: (
    <>
      <rect x="5" y="10" width="22" height="16" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 17H27" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="22" cy="13.5" r="1" fill="currentColor" />
      <path d="M10 6V10M22 6V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  sofa: (
    <>
      <path d="M7 16V24H25V16" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M5 16C5 13.8 6.6 12 9 12H23C25.4 12 27 13.8 27 16V19H5V16Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M7 19V24M25 19V24" stroke="currentColor" strokeWidth="1.6" />
    </>
  ),
  bed: (
    <>
      <path d="M4 26V14C4 12.9 4.9 12 6 12H26C27.1 12 28 12.9 28 14V26" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M4 22H28" stroke="currentColor" strokeWidth="1.6" />
      <rect x="6" y="14" width="8" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <path d="M4 26V29M28 26V29" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  ceiling: (
    <>
      <path d="M4 8H28V12H4V8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8 12V24M14.6 12V24M21.3 12V24" stroke="currentColor" strokeWidth="1.4" />
    </>
  ),
  floor: (
    <>
      <rect x="4" y="6" width="24" height="7" rx="0.8" stroke="currentColor" strokeWidth="1.5" />
      <rect x="4" y="13.5" width="24" height="7" rx="0.8" stroke="currentColor" strokeWidth="1.5" />
      <rect x="4" y="21" width="24" height="6" rx="0.8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M15 6V13M19 13.5V20.5" stroke="currentColor" strokeWidth="1.2" />
    </>
  ),
  door: (
    <>
      <rect x="9" y="4" width="14" height="24" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="19.5" cy="16" r="1.1" fill="currentColor" />
    </>
  ),
  wardrobe: (
    <>
      <rect x="6" y="4" width="20" height="24" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16 4V28" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="13.5" cy="16" r="0.9" fill="currentColor" />
      <circle cx="18.5" cy="16" r="0.9" fill="currentColor" />
    </>
  ),
}

export default function ModuleIcon({ name, size = 32, className = '' }) {
  const path = PATHS[name]
  if (!path) return null
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      {path}
    </svg>
  )
}
