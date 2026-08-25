import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipboardList, Clock, CheckCircle2, XCircle, Search } from 'lucide-react'
import { QUOTES as INITIAL_QUOTES } from '../../data/admin-mock'
import StatusBadge from '../../components/admin/StatusBadge'
import StatCard from '../../components/admin/StatCard'
import RowActions from '../../components/admin/RowActions'
import DetailModal from '../../components/admin/DetailModal'

const STATUS_OPTIONS = ['En attente', 'Traité', 'Refusé']

export default function Quotes() {
  const navigate = useNavigate()
  // TODO: remplacer par GET/PATCH `${VITE_API_URL}/quotes`
  const [quotes, setQuotes] = useState(INITIAL_QUOTES)
  const [filter, setFilter] = useState('Tous')
  const [query, setQuery] = useState('')
  const [viewing, setViewing] = useState(null)

  const updateStatus = (id, status) => {
    setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)))
  }

  const remove = (id) => {
    if (confirm('Supprimer cette demande de devis ?')) {
      setQuotes((prev) => prev.filter((q) => q.id !== id))
    }
  }

  const filtered = useMemo(() => {
    let list = filter === 'Tous' ? quotes : quotes.filter((q) => q.status === filter)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter((item) => item.client.toLowerCase().includes(q) || item.id.toLowerCase().includes(q) || item.module.toLowerCase().includes(q))
    }
    return list
  }, [quotes, filter, query])

  const stats = [
    { label: 'Total devis', value: quotes.length, icon: ClipboardList, tone: 'dark' },
    { label: 'En attente', value: quotes.filter((q) => q.status === 'En attente').length, icon: Clock, tone: 'red' },
    { label: 'Traités', value: quotes.filter((q) => q.status === 'Traité').length, icon: CheckCircle2, tone: 'dark' },
    { label: 'Refusés', value: quotes.filter((q) => q.status === 'Refusé').length, icon: XCircle, tone: 'dark' },
  ]

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-wood-950">Devis</h1>
          <p className="text-wood-500 text-sm mt-1">{filtered.length} demandes</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-wood-700/20 rounded-full px-4 py-2.5 text-sm bg-white"
        >
          <option>Tous</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s}>{s}</option>
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
          placeholder="Rechercher un client, une réf., un module..."
          className="w-full border border-wood-700/20 rounded-full pl-10 pr-4 py-2.5 text-sm bg-white focus:outline-none focus:border-red-600"
        />
      </div>

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
            {filtered.map((q) => (
              <tr key={q.id} className="border-t border-wood-700/10 align-top">
                <td className="px-5 py-3.5 font-medium text-wood-900">{q.id}</td>
                <td className="px-5 py-3.5">
                  <p className="text-wood-900">{q.client}</p>
                  <p className="text-xs text-wood-500">{q.phone}</p>
                </td>
                <td className="px-5 py-3.5 text-wood-600">
                  <p>{q.module}</p>
                  <p className="text-xs text-wood-400 max-w-[220px] truncate">{q.description}</p>
                </td>
                <td className="px-5 py-3.5 text-wood-600">{q.city}</td>
                <td className="px-5 py-3.5 text-wood-600">{q.budget}</td>
                <td className="px-5 py-3.5 text-wood-500 text-xs">{q.date}</td>
                <td className="px-5 py-3.5">
                  <select
                    value={q.status}
                    onChange={(e) => updateStatus(q.id, e.target.value)}
                    className="text-xs border border-wood-700/20 rounded-full px-2.5 py-1.5 bg-white"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  <div className="mt-1.5">
                    <StatusBadge status={q.status} />
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <RowActions
                    onView={() => setViewing(q)}
                    onMessage={() => navigate(`/admin/messagerie?client=${q.clientId}`)}
                    onDelete={() => remove(q.id)}
                  />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-8 text-center text-wood-400">
                  Aucun devis ne correspond à cette recherche.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {viewing && (
        <DetailModal
          title={`Devis ${viewing.id}`}
          onClose={() => setViewing(null)}
          fields={[
            { label: 'Client', value: viewing.client },
            { label: 'Téléphone', value: viewing.phone },
            { label: 'Module', value: viewing.module },
            { label: 'Description', value: viewing.description },
            { label: 'Budget indicatif', value: viewing.budget },
            { label: 'Ville', value: viewing.city },
            { label: 'Date de la demande', value: viewing.date },
            { label: 'Statut', value: viewing.status },
          ]}
          footer={
            <button
              onClick={() => navigate(`/admin/messagerie?client=${viewing.clientId}`)}
              className="btn-primary w-full justify-center py-3 rounded-full font-semibold"
            >
              Contacter {viewing.client}
            </button>
          }
        />
      )}
    </div>
  )
}
