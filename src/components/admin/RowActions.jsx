import { Eye, Pencil, Trash2, MessageCircle } from 'lucide-react'

function IconBtn({ icon: Icon, onClick, title, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`w-8 h-8 flex items-center justify-center rounded-full border transition ${
        danger
          ? 'border-wood-700/20 text-wood-600 hover:border-red-600 hover:text-red-600'
          : 'border-wood-700/20 text-wood-600 hover:border-wood-950 hover:text-wood-950'
      }`}
    >
      <Icon size={14} />
    </button>
  )
}

export default function RowActions({ onView, onMessage, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      {onView && <IconBtn icon={Eye} onClick={onView} title="Voir" />}
      {onMessage && <IconBtn icon={MessageCircle} onClick={onMessage} title="Envoyer un message" />}
      {onEdit && <IconBtn icon={Pencil} onClick={onEdit} title="Modifier" />}
      {onDelete && <IconBtn icon={Trash2} onClick={onDelete} title="Supprimer" danger />}
    </div>
  )
}
