import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, X, Users as UsersIcon, ShieldCheck, Search } from 'lucide-react'
import { ADMIN_USERS as INITIAL_USERS } from '../../data/admin-mock'
import StatusBadge from '../../components/admin/StatusBadge'
import StatCard from '../../components/admin/StatCard'
import RowActions from '../../components/admin/RowActions'
import DetailModal from '../../components/admin/DetailModal'

export default function Users() {
  const navigate = useNavigate()
  // TODO: remplacer par GET/POST/DELETE `${VITE_API_URL}/admin/users`
  const [users, setUsers] = useState(INITIAL_USERS)
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [viewing, setViewing] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', role: 'Commercial' })

  const remove = (id) => {
    if (confirm('Supprimer cet utilisateur ?')) {
      setUsers((prev) => prev.filter((u) => u.id !== id))
    }
  }

  const submit = (e) => {
    e.preventDefault()
    setUsers((prev) => [...prev, { id: Date.now(), clientId: `u${Date.now()}`, status: 'Actif', ...form }])
    setForm({ name: '', email: '', role: 'Commercial' })
    setModalOpen(false)
  }

  const filtered = useMemo(() => {
    if (!query.trim()) return users
    const q = query.toLowerCase()
    return users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
  }, [users, query])

  const stats = [
    { label: 'Comptes internes', value: users.length, icon: UsersIcon, tone: 'dark' },
    { label: 'Administrateurs', value: users.filter((u) => u.role === 'Administrateur').length, icon: ShieldCheck, tone: 'red' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-wood-950">Utilisateurs</h1>
          <p className="text-wood-500 text-sm mt-1">{users.length} comptes administrateur / commercial</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary px-5 py-2.5 rounded-full font-semibold text-sm inline-flex items-center gap-2">
          <Plus size={16} /> Ajouter un utilisateur
        </button>
      </div>

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

      <div className="bg-white border border-wood-700/10 rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-cream-100 text-left text-wood-500 text-xs uppercase tracking-wide">
              <th className="px-5 py-3 font-medium">Nom</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Rôle</th>
              <th className="px-5 py-3 font-medium">Statut</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-t border-wood-700/10">
                <td className="px-5 py-3.5 font-medium text-wood-900">{u.name}</td>
                <td className="px-5 py-3.5 text-wood-600">{u.email}</td>
                <td className="px-5 py-3.5 text-wood-600">{u.role}</td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={u.status} />
                </td>
                <td className="px-5 py-3.5">
                  <RowActions
                    onView={() => setViewing(u)}
                    onMessage={() => navigate(`/admin/messagerie?client=${u.clientId}`)}
                    onDelete={() => remove(u.id)}
                  />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-wood-400">
                  Aucun utilisateur ne correspond à cette recherche.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {viewing && (
        <DetailModal
          title={viewing.name}
          onClose={() => setViewing(null)}
          fields={[
            { label: 'Email', value: viewing.email },
            { label: 'Rôle', value: viewing.role },
            { label: 'Statut', value: viewing.status },
          ]}
          footer={
            <button
              onClick={() => navigate(`/admin/messagerie?client=${viewing.clientId}`)}
              className="btn-primary w-full justify-center py-3 rounded-full font-semibold"
            >
              Contacter {viewing.name}
            </button>
          }
        />
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-wood-950/50 flex items-center justify-center p-5">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-5 border-b border-wood-700/10">
              <p className="font-display font-semibold text-lg text-wood-950">Ajouter un utilisateur</p>
              <button onClick={() => setModalOpen(false)} className="text-wood-400 hover:text-wood-800">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={submit} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-wood-800 mb-1.5 block">Nom complet</label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-wood-700/20 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-red-600"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-wood-800 mb-1.5 block">Email</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-wood-700/20 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-red-600"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-wood-800 mb-1.5 block">Rôle</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full border border-wood-700/20 rounded-sm px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-red-600"
                >
                  <option>Administrateur</option>
                  <option>Commercial</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-outline flex-1 justify-center py-3 rounded-full font-semibold">
                  Annuler
                </button>
                <button type="submit" className="btn-primary flex-1 justify-center py-3 rounded-full font-semibold">
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
