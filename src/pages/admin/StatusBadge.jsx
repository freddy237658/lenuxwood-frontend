const STATUS_STYLES = {
  'En attente': { bg: '#FAEEDA', text: '#854F0B' },
  'Traité': { bg: '#EAF3DE', text: '#27500A' },
  'Refusé': { bg: '#FBE3E3', text: '#8A1F1F' },
  'Livré': { bg: '#EAF3DE', text: '#27500A' },
  'En fabrication': { bg: '#FAEEDA', text: '#854F0B' },
  'Devis validé': { bg: '#E1F5EE', text: '#085041' },
  'Confirmé': { bg: '#EAF3DE', text: '#27500A' },
  'Échoué': { bg: '#FBE3E3', text: '#8A1F1F' },
  'Actif': { bg: '#EAF3DE', text: '#27500A' },
  'Inactif': { bg: '#F1E9E2', text: '#6B5B4F' },
}

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