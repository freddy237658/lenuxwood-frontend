import { X } from 'lucide-react'

export default function DetailModal({ title, fields, onClose, footer }) {
  return (
    <div className="fixed inset-0 z-50 bg-wood-950/50 flex items-center justify-center p-5">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-wood-700/10">
          <p className="font-display font-semibold text-lg text-wood-950">{title}</p>
          <button onClick={onClose} className="text-wood-400 hover:text-wood-800">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {fields.map((f) => (
            <div key={f.label} className="border-b border-wood-700/10 pb-3 last:border-0 last:pb-0">
              <p className="text-xs text-wood-500 mb-1">{f.label}</p>
              <p className="text-sm text-wood-900">{f.value || '—'}</p>
            </div>
          ))}
        </div>
        {footer && <div className="px-6 pb-6">{footer}</div>}
      </div>
    </div>
  )
}
