import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, X, Users as UsersIcon, ShieldCheck, Search, Loader2, Copy, Check } from 'lucide-react'
import api from '../../lib/api'
import StatusBadge from '../../components/admin/StatusBadge'
import StatCard from '../../components/admin/StatCard'
import RowActions from '../../components/admin/RowActions'
import DetailModal from '../../components/admin/DetailModal'

export default function Users() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [viewing, setViewing] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', role: 'commercial' })
  const [createdCredentials, setCreatedCredentials] = useState(null)
  const [copied, setCopied] = useState(false)

  const load = () => {
    setLoading(true)
    api
      .get('/admin/users', { params: { q: query || undefined } })
      .then((res) => setUsers(res.data ?? []))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    const timeout = setTimeout(load, 300)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const remove = async (id) => {
    if (!confirm('Supprimer cet utilisateur ?')) return
    await api.delete(`/admin/users/${id}`)
    load()
  }

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await api.post('/admin/users', form)
      setCreatedCredentials(res.data)
      setForm({ name: '', email: '', role: 'commercial' })
      load()
    } finally {
      setSaving(false)
    }
  }

  const copyPassword = () => {
    if (!createdCredentials) return
    navigator.clipboard.writeText(createdCredentials.temporary_password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const closeModal = () => {
    setModalOpen(false)
    setCreatedCredentials(null)
  }

 const roleLabel = (role) => {
  if (role === 'admin') return 'Administrateur';
  if (role === 'commercial') return 'Commercial';
  if (role === 'client') return 'Client';
  return role;
};


  const stats = useMemo(
    () => [
      { label: 'Comptes internes', value: users.length, icon: UsersIcon, tone: 'dark' },
      { label: 'Administrateurs', value: users.filter((u) => u.role === 'admin').length, icon: ShieldCheck, tone: 'red' },
    ],
    [users]
  )

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

      {loading ? (
        <div className="flex items-center gap-2 text-wood-500 py-10">
          <Loader2 size={18} className="animate-spin" /> Chargement...
        </div>
      ) : (
        <div className="bg-white border border-wood-700/10 rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream-100 text-left text-wood-500 text-xs uppercase tracking-wide">
                <th className="px-5 py-3 font-medium">Nom</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Phone</th>
                <th className="px-5 py-3 font-medium">Rôle</th>
                <th className="px-5 py-3 font-medium">Statut</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-wood-700/10">
                  <td className="px-5 py-3.5 font-medium text-wood-900">{u.name}</td>
                  <td className="px-5 py-3.5 text-wood-600">{u.email}</td>
                  <td className="px-5 py-3.5 text-wood-600">{u.phone}</td>
                  <td className="px-5 py-3.5 text-wood-600">{roleLabel(u.role)}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={u.is_active ? 'Actif' : 'Inactif'} />
                  </td>
                  <td className="px-5 py-3.5">
                    <RowActions
                      onView={() => setViewing(u)}
                      onMessage={() => navigate(`/admin/messagerie?client=${u.id}`)}
                      onDelete={() => remove(u.id)}
                    />
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-wood-400">
                    Aucun utilisateur ne correspond à cette recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {viewing && (
        <DetailModal
          title={viewing.name}
          onClose={() => setViewing(null)}
          fields={[
            { label: 'Email', value: viewing.email },
            { label: 'Rôle', value: roleLabel(viewing.role) },
            { label: 'Statut', value: viewing.is_active ? 'Actif' : 'Inactif' },
          ]}
        />
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-wood-950/50 flex items-center justify-center p-5">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-5 border-b border-wood-700/10">
              <p className="font-display font-semibold text-lg text-wood-950">Ajouter un utilisateur</p>
              <button onClick={closeModal} className="text-wood-400 hover:text-wood-800">
                <X size={20} />
              </button>
            </div>

            {createdCredentials ? (
              <div className="p-6">
                <p className="text-sm text-wood-700 mb-4">
                  Compte créé pour <strong>{createdCredentials.user.name}</strong>. Communique ce mot de passe temporaire
                  à la personne concernée — il ne sera plus affiché ensuite.
                </p>
                <div className="flex items-center gap-2 bg-cream-100 rounded-sm px-4 py-3 mb-4">
                  <code className="flex-1 text-sm font-mono text-wood-900">{createdCredentials.temporary_password}</code>
                  <button onClick={copyPassword} className="text-wood-600 hover:text-red-600">
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                <button onClick={closeModal} className="btn-primary w-full justify-center py-3 rounded-full font-semibold">
                  Terminé
                </button>
              </div>
            ) : (
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
                    <option value="admin">Administrateur</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={closeModal} className="btn-outline flex-1 justify-center py-3 rounded-full font-semibold">
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary flex-1 justify-center py-3 rounded-full font-semibold disabled:opacity-60 inline-flex items-center gap-2"
                  >
                    {saving && <Loader2 size={15} className="animate-spin" />}
                    Ajouter
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}