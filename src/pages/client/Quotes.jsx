import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { CLIENT_QUOTES } from '../../data/client-mock'

const STATUS_STYLES = {
  'En attente': { bg: '#FAEEDA', text: '#854F0B' },
  'Traité': { bg: '#EAF3DE', text: '#27500A' },
  'Refusé': { bg: '#FBE3E3', text: '#8A1F1F' },
}

export default function ClientQuotes() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-xl font-semibold text-wood-950">Mes devis</h2>
          <p className="text-wood-500 text-sm mt-1">{CLIENT_QUOTES.length} demandes envoyées</p>
        </div>
        <Link to="/devis" className="btn-primary px-5 py-2.5 rounded-full font-semibold text-sm inline-flex items-center gap-2">
          <Plus size={16} /> Nouveau devis
        </Link>
      </div>

      <div className="space-y-4">
        {CLIENT_QUOTES.map((q) => {
          const style = STATUS_STYLES[q.status] || { bg: '#F1E9E2', text: '#4A2E1A' }
          return (
            <div key={q.id} className="bg-white border border-wood-700/10 rounded-2xl p-5 card-lift">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="font-display font-semibold text-wood-950">{q.module}</p>
                  <p className="text-xs text-wood-500 mt-0.5">Réf. {q.id} · {q.date}</p>
                </div>
                <span
                  className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
                  style={{ background: style.bg, color: style.text }}
                >
                  {q.status}
                </span>
              </div>
              <p className="text-sm text-wood-600 mb-2">{q.description}</p>
              <p className="text-xs text-wood-500">Budget indicatif : {q.budget} FCFA</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
