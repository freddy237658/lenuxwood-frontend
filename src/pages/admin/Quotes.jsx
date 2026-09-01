import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipboardList, Clock, CheckCircle2, XCircle, Search, Loader2 } from 'lucide-react'
import api from '../../lib/api'
import StatusBadge from '../../components/admin/StatusBadge'
import StatCard from '../../components/admin/StatCard'
import RowActions from '../../components/admin/RowActions'
import DetailModal from '../../components/admin/DetailModal'

const STATUS_OPTIONS = [
  { value: 'pending', label: 'En attente' },
  { value: 'processed', label: 'Traité' },
  { value: 'refused', label: 'Refusé' },
]

export default function Quotes() {
  const navigate = useNavigate()
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('Tous')
  const [query, setQuery] = useState('')
  const [viewing, setViewing] = useState(null)

  const load = () => {
    setLoading(true)
    api
      .get('/quotes', { params: { status: filter, q: query || undefined } })
      .then((res) => setQuotes(res.data.data ?? []))
      .finally(() => setLoading(false))
  }

  useEffect(load, [filter])
  useEffect(() => {
    const timeout = setTimeout(load, 300)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const updateStatus = async (id, status) => {
    await api.patch(`/quotes/${id}`, { status })
    load()
  }

  const remove = async (id) => {
    if (!confirm('Supprimer cette demande de devis ?')) return
    await api.delete(`/quotes/${id}`)
    load()
  }

  const stats = useMemo(() => {
    return [
      { label: 'Total devis', value: quotes.length, icon: ClipboardList, tone: 'dark' },
      { label: 'En attente', value: quotes.filter((q) => q.status === 'pending').length, icon: Clock, tone: 'red' },
      { label: 'Traités', value: quotes.filter((q) => q.status === 'processed').length, icon: CheckCircle2, tone: 'dark' },
      { label: 'Refusés', value: quotes.filter((q) => q.status === 'refused').length, icon: XCircle, tone: 'dark' },
    ]
  }, [quotes])

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-wood-950">Devis</h1>
          <p className="text-wood-500 text-sm mt-1">{quotes.length} demandes</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-wood-700/20 rounded-full px-4 py-2.5 text-sm bg-white"
        >
          <option value="Tous">Tous</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="relative max-w-sm mb-5">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-wood-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un client, une ville..."
          className="w-full border border-wood-700/20 rounded-full pl-10 pr-4 py-2.5 text-sm bg-white focus:outline-none focus:border-red-600"
        />
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-wood-500 py-10">
          <Loader2 size={18} className="animate-spin" /> Chargement...
        </div>
      ) : (
        <div className="bg-white border border-wood-700/10 rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream-100 text-left text-wood-500 text-xs uppercase tracking-wide">
                <th className="px-5 py-3 font-medium">Réf.</th>
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 font-medium">Module</th>
                <th className="px-5 py-3 font-medium">Ville</th>
                <th className="px-5 py-3 font-medium">Budget</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Statut</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((q) => (
                <tr key={q.id} className="border-t border-wood-700/10 align-top">
                  <td className="px-5 py-3.5 font-medium text-wood-900">#{q.id}</td>
                  <td className="px-5 py-3.5">
                    <p className="text-wood-900">{q.name}</p>
                    <p className="text-xs text-wood-500">{q.phone}</p>
                  </td>
                  <td className="px-5 py-3.5 text-wood-600">
                    <p>{q.category?.name?.fr}</p>
                    <p className="text-xs text-wood-400 max-w-[220px] truncate">{q.description}</p>
                  </td>
                  <td className="px-5 py-3.5 text-wood-600">{q.city}</td>
                  <td className="px-5 py-3.5 text-wood-600">{q.budget}</td>
                  <td className="px-5 py-3.5 text-wood-500 text-xs">{new Date(q.created_at).toLocaleDateString('fr-FR')}</td>
                  <td className="px-5 py-3.5">
                    <select
                      value={q.status}
                      onChange={(e) => updateStatus(q.id, e.target.value)}
                      className="text-xs border border-wood-700/20 rounded-full px-2.5 py-1.5 bg-white"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    <div className="mt-1.5">
                      <StatusBadge status={q.status_label} />
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <RowActions
                      onView={() => setViewing(q)}
                      onMessage={q.user_id ? () => navigate(`/admin/messagerie?client=${q.user_id}`) : undefined}
                      onDelete={() => remove(q.id)}
                    />
                  </td>
                </tr>
              ))}
              {quotes.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-wood-400">
                    Aucun devis ne correspond à cette recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
{viewing && (
        <DetailModal
          title={`Devis #${viewing.id}`}
          onClose={() => setViewing(null)}
          fields={[
            { label: 'Client', value: viewing.name },
            { label: 'Téléphone', value: viewing.phone },
            { label: 'Email', value: viewing.email },
            { label: 'Module', value: viewing.category?.name?.fr },
            { label: 'Description', value: viewing.description },
            { label: 'Dimensions', value: viewing.dimensions },
            { label: 'Budget indicatif', value: viewing.budget },
            { label: 'Ville', value: viewing.city },
            {
              label: 'Date de la demande',
              value: new Date(viewing.created_at).toLocaleString('fr-FR'),
            },
            { label: 'Statut', value: viewing.status_label },
          ]}
          footer={
            viewing.attachment_url ? (
              <a
                href={viewing.attachment_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline w-full justify-center py-3 rounded-full font-semibold inline-flex"
              >
                Voir la pièce jointe
              </a>
            ) : null
          }
        />
      )}
    </div>
  )
}
