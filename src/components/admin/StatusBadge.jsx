import { STATUS_STYLES } from '../../data/admin-mock'

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || { bg: '#F1E9E2', text: '#4A2E1A' }
  return (
    <span
      className="inline-block text-xs font-semibold px-2.5 py-1 rounded-sm whitespace-nowrap"
      style={{ background: style.bg, color: style.text }}
    >
      {status}
    </span>
  )
}
