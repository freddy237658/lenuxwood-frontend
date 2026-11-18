import { useEffect, useMemo, useState } from 'react'
import { Mail, MailOpen, Search, Loader2 } from 'lucide-react'
import api from '../../lib/api'
import StatCard from '../../components/admin/StatCard'
import RowActions from '../../components/admin/RowActions'
import DetailModal from '../../components/admin/DetailModal'

export default function ContactMessages() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [viewing, setViewing] = useState(null)

  const load = () => {
    setLoading(true)
    api
      .get('/contacts', { params: { q: query || undefined } })
      .then((res) => setContacts(res.data.data ?? []))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    const timeout = setTimeout(load, 300)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const openMessage = async (contact) => {
    setViewing(contact)
    if (!contact.is_read) {
      const res = await api.get(`/contacts/${contact.id}`)
      setContacts((prev) => prev.map((c) => (c.id === contact.id ? res.data.data : c)))
    }
  }

  const remove = async (id) => {
    if (!confirm('Supprimer ce message ?')) return
    await api.delete(`/contacts/${id}`)
    load()
  }

  const stats = useMemo(
    () => [
      { label: 'Messages reçus', value: contacts.length, icon: Mail, tone: 'dark' },
      { label: 'Non lus', value: contacts.filter((c) => !c.is_read).length, icon: MailOpen, tone: 'red' },
    ],
    [contacts]
  )

  return (
    <div>
      <h1 className="font-display text-2xl md:text-3xl font-semibold text-wood-950 mb-1">Messages de contact</h1>
      <p className="text-wood-500 text-sm mb-6">{contacts.length} messages reçus depuis le formulaire de contact</p>

      <div className="grid sm:grid-cols-2 gap-5 mb-6 max-w-xl">
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
          placeholder="Rechercher un nom, un email..."
          className="w-full border border-wood-700/20 rounded-full pl-10 pr-4 py-2.5 text-sm bg-white focus:outline-none focus:border-red-600"
        />
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-wood-500 py-10">
          <Loader2 size={18} className="animate-spin" /> Chargement...
        </div>
      ) : (
        <div className="bg-white border border-wood-700/10 rounded-2xl overflow-x-auto touch-pan-x">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="bg-cream-100 text-left text-wood-500 text-xs uppercase tracking-wide">
                <th className="px-5 py-3 font-medium"></th>
                <th className="px-5 py-3 font-medium">Nom</th>
                <th className="px-5 py-3 font-medium">Sujet</th>
                <th className="px-5 py-3 font-medium">Contact</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.id} className={`border-t border-wood-700/10 ${!c.is_read ? 'bg-red-600/5' : ''}`}>
                  <td className="px-5 py-3.5">
                    {!c.is_read && <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-wood-900">{c.name}</td>
                  <td className="px-5 py-3.5 text-wood-600">{c.subject || '—'}</td>
                  <td className="px-5 py-3.5 text-wood-600 text-xs">
                    {c.email && <p>{c.email}</p>}
                    {c.phone && <p>{c.phone}</p>}
                  </td>
                  <td className="px-5 py-3.5 text-wood-500 text-xs">{new Date(c.created_at).toLocaleDateString('fr-FR')}</td>
                  <td className="px-5 py-3.5">
                    <RowActions onView={() => openMessage(c)} onDelete={() => remove(c.id)} />
                  </td>
                </tr>
              ))}
              {contacts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-wood-400">
                    Aucun message pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {viewing && (
        <DetailModal
          title={`Message de ${viewing.name}`}
          onClose={() => setViewing(null)}
          fields={[
            { label: 'Email', value: viewing.email },
            { label: 'Téléphone', value: viewing.phone },
            { label: 'Sujet', value: viewing.subject },
            { label: 'Message', value: viewing.message },
            { label: 'Reçu le', value: new Date(viewing.created_at).toLocaleString('fr-FR') },
          ]}
        />
      )}
    </div>
  )
}