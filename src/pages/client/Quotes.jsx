import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, Plus, ClipboardList } from 'lucide-react'
import api from '../../lib/api'
import StatusBadge from '../../components/admin/StatusBadge'

export default function ClientQuotes() {
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/me/quotes')
      .then((res) => setQuotes(res.data.data ?? []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-xl font-semibold text-wood-950">Mes devis</h2>
          <p className="text-wood-500 text-sm mt-1">{loading ? 'Chargement...' : `${quotes.length} demande${quotes.length > 1 ? 's' : ''} envoyée${quotes.length > 1 ? 's' : ''}`}</p>
        </div>
        <Link to="/devis" className="btn-primary px-5 py-2.5 rounded-full font-semibold text-sm inline-flex items-center gap-2">
          <Plus size={16} /> Nouveau devis
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-wood-500 py-10">
          <Loader2 size={18} className="animate-spin" /> Chargement de vos devis...
        </div>
      ) : quotes.length === 0 ? (
        <div className="bg-white border border-wood-700/10 rounded-2xl p-10 text-center">
          <ClipboardList className="mx-auto text-wood-300 mb-4" size={40} />
          <p className="font-display font-semibold text-wood-950 mb-2">Aucun devis pour le moment</p>
          <p className="text-sm text-wood-500 mb-6">Décrivez votre projet, notre équipe vous répond sous 48h.</p>
          <Link to="/devis" className="btn-primary inline-flex items-center px-6 py-3 rounded-full font-semibold">
            Demander un devis
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {quotes.map((q) => (
            <div key={q.id} className="bg-white border border-wood-700/10 rounded-2xl p-5 card-lift">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="font-display font-semibold text-wood-950">{q.category?.name?.fr}</p>
                  <p className="text-xs text-wood-500 mt-0.5">
                    Réf. #{q.id} · {new Date(q.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <StatusBadge status={q.status_label} />
              </div>
              <p className="text-sm text-wood-600 mb-2">{q.description}</p>
              {q.budget && <p className="text-xs text-wood-500">Budget indicatif : {q.budget} FCFA</p>}
              
              {q.attachment_url && (
                <a
                  href={q.attachment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-xs font-semibold text-red-600 hover:underline mt-2"
                >
                  Voir la pièce jointe
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}