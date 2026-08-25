import { Link } from 'react-router-dom'

const BASE = 'inline-flex items-center gap-2 px-6 py-3 rounded-sm font-semibold transition'

const VARIANTS = {
  primary: 'btn-primary',
  outline: 'btn-outline',
}

export default function Button({ to, href, variant = 'primary', className = '', children, ...props }) {
  const classes = `${BASE} ${VARIANTS[variant] || VARIANTS.primary} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
