import { useEffect, useMemo, useState } from 'react'
import { Plus, X, UserPlus, Search, Loader2, ImagePlus, Users, Image, Share2, Briefcase } from 'lucide-react'
import api from '../../lib/api'
import StatCard from '../../components/admin/StatCard'
import RowActions from '../../components/admin/RowActions'
import DetailModal from '../../components/admin/DetailModal'
import { optimizeImage, formatBytes } from '../../lib/imageOptimizer'

const emptyForm = {
  name: '',
  role: '',
  display_order: '',
  facebook_url: '',
  tiktok_url: '',
  linkedin_url: '',
  x_url: '',
  photoFile: null,
  photoPreview: null,
  optimizationInfo: null,
}

export default function Team() {
  const [team, setTeam] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [optimizing, setOptimizing] = useState(false)
  const [viewing, setViewing] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const load = () => {
    setLoading(true)
    api
      .get('/team')
      .then((res) => setTeam(res.data.data ?? []))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const filtered = useMemo(() => {
    if (!query.trim()) return team
    const q = query.toLowerCase()
    return team.filter((m) => m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q))
  }, [team, query])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (member) => {
    setEditingId(member.id)
    setForm({
      name: member.name,
      role: member.role,
      display_order: member.display_order ?? '',
      facebook_url: member.social?.facebook || '',
      tiktok_url: member.social?.tiktok || '',
      linkedin_url: member.social?.linkedin || '',
      x_url: member.social?.x || '',
      photoFile: null,
      photoPreview: member.photo_url,
      optimizationInfo: null,
    })
    setModalOpen(true)
  }

  const remove = async (id) => {
    if (!confirm('Supprimer ce membre ?')) return
    await api.delete(`/team/${id}`)
    load()
  }

  const onPhotoChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setOptimizing(true)
    try {
      const res = await optimizeImage(file, { maxWidth: 1000, maxHeight: 1000, quality: 0.82 })
      setForm((f) => ({
        ...f,
        photoFile: res.file,
        photoPreview: res.previewUrl,
        optimizationInfo: res,
      }))
    } finally {
      setOptimizing(false)
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)

    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('role', form.role)
    if (form.display_order !== '') formData.append('display_order', form.display_order)
    if (form.facebook_url) formData.append('facebook_url', form.facebook_url)
    if (form.tiktok_url) formData.append('tiktok_url', form.tiktok_url)
    if (form.linkedin_url) formData.append('linkedin_url', form.linkedin_url)
    if (form.x_url) formData.append('x_url', form.x_url)
    if (form.photoFile) formData.append('photo', form.photoFile)

    try {
      if (editingId) {
        await api.post(`/team/${editingId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      } else {
        await api.post('/team', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      }
      setModalOpen(false)
      load()
    } finally {
      setSaving(false)
    }
  }

  const withPhotoCount = useMemo(() => team.filter((m) => Boolean(m.photo_url)).length, [team])

  const withSocialCount = useMemo(() => {
    return team.filter((m) => {
      const s = m.social || {}
      return Boolean(s.facebook || s.tiktok || s.linkedin || s.x)
    }).length
  }, [team])

  const rolesCount = useMemo(() => {
    return new Set(team.map((m) => m.role?.trim().toLowerCase()).filter(Boolean)).size
  }, [team])

  const stats = [
    {
      label: "Total membres",
      value: team.length,
      icon: Users,
      tone: 'dark',
    },
    {
      label: 'Profils avec photo',
      value: `${withPhotoCount} / ${team.length}`,
      icon: Image,
      tone: withPhotoCount === team.length && team.length > 0 ? 'dark' : 'red',
    },
    {
      label: 'Réseaux connectés',
      value: `${withSocialCount} membre${withSocialCount > 1 ? 's' : ''}`,
      icon: Share2,
      tone: 'dark',
    },
    {
      label: 'Pôles & Rôles actifs',
      value: `${rolesCount} métier${rolesCount > 1 ? 's' : ''}`,
      icon: Briefcase,
      tone: 'red',
    },
  ]

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-wood-950">Équipe</h1>
          <p className="text-wood-500 text-sm mt-1">Membres et artisans présentés sur la page À propos du site</p>
        </div>
        <button onClick={openCreate} className="btn-primary px-5 py-2.5 rounded-full font-semibold text-sm inline-flex items-center gap-2">
          <Plus size={16} /> Ajouter un membre
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
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
          placeholder="Rechercher un nom, un rôle..."
          className="w-full border border-wood-700/20 rounded-full pl-10 pr-4 py-2.5 text-sm bg-white focus:outline-none focus:border-red-600"
        />
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-wood-500 py-10">
          <Loader2 size={18} className="animate-spin" /> Chargement...
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((m) => (
            <div key={m.id} className="bg-white border border-wood-700/10 rounded-2xl overflow-hidden card-lift">
              <div className="aspect-[4/3] relative">
                {m.photo_url ? (
                  <img src={m.photo_url} alt={m.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-wood-900 flex items-center justify-center text-oak-400 font-display text-3xl font-semibold select-none">
                    {m.name ? m.name.charAt(0).toUpperCase() : '?'}
                  </div>
                )}
                {m.display_order !== null && m.display_order !== undefined && m.display_order !== '' && (
                  <span className="absolute top-3 left-3 bg-wood-950/80 backdrop-blur-xs text-oak-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-wood-700/30">
                    Ordre : {m.display_order}
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="font-display font-semibold text-wood-950">{m.name}</p>
                <p className="text-xs text-wood-500 mb-3">{m.role}</p>
                <div className="flex items-center justify-end">
                  <RowActions onView={() => setViewing(m)} onEdit={() => openEdit(m)} onDelete={() => remove(m.id)} />
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-center text-wood-400 py-10">Aucun membre ne correspond à cette recherche.</p>
          )}
        </div>
      )}

      {viewing && (
        <DetailModal
          title={viewing.name}
          onClose={() => setViewing(null)}
          fields={[
            { label: 'Rôle', value: viewing.role },
            { label: 'Ordre d\u2019affichage', value: viewing.display_order },
            { label: 'Facebook', value: viewing.social?.facebook },
            { label: 'TikTok', value: viewing.social?.tiktok },
            { label: 'LinkedIn', value: viewing.social?.linkedin },
            { label: 'X (Twitter)', value: viewing.social?.x },
          ]}
        />
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-wood-950/50 flex items-center justify-center p-5">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-wood-700/10">
              <p className="font-display font-semibold text-lg text-wood-950">
                {editingId ? 'Modifier le membre' : 'Ajouter un membre'}
              </p>
              <button onClick={() => setModalOpen(false)} className="text-wood-400 hover:text-wood-800">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={submit} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-wood-800 mb-1.5 block">Photo</label>
                <label className="flex items-center gap-4 cursor-pointer">
                  <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-wood-700/25 flex items-center justify-center overflow-hidden shrink-0 hover:border-red-600 transition">
                    {form.photoPreview ? (
                      <img src={form.photoPreview} alt="Aperçu" className="w-full h-full object-cover" />
                    ) : (
                      <ImagePlus size={22} className="text-wood-400" />
                    )}
                  </div>
                  <div className="text-xs text-wood-500">
                    <p className="font-medium text-wood-700 mb-0.5">Cliquez pour choisir une photo</p>
                    <p>JPG ou PNG, format portrait ou carré</p>
                    {optimizing && (
                      <p className="text-red-600 font-medium mt-1 flex items-center gap-1">
                        <Loader2 size={12} className="animate-spin" /> Compression & optimisation...
                      </p>
                    )}
                    {form.optimizationInfo && form.optimizationInfo.savedPercent > 0 && !optimizing && (
                      <p className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-medium mt-1.5 inline-block">
                        ✓ Optimisée : {formatBytes(form.optimizationInfo.originalSize)} → {formatBytes(form.optimizationInfo.compressedSize)} (-{form.optimizationInfo.savedPercent}%)
                      </p>
                    )}
                  </div>
                  <input type="file" accept="image/*" onChange={onPhotoChange} className="hidden" />
                </label>
              </div>

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
                <label className="text-sm font-medium text-wood-800 mb-1.5 block">Rôle</label>
                <input
                  required
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="Ex: Chef d'atelier menuiserie"
                  className="w-full border border-wood-700/20 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-wood-800 mb-1.5 block">Ordre d'affichage (optionnel)</label>
                <input
                  type="number"
                  value={form.display_order}
                  onChange={(e) => setForm({ ...form, display_order: e.target.value })}
                  placeholder="0 = premier affiché"
                  className="w-full border border-wood-700/20 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-red-600"
                />
              </div>

              <p className="text-xs font-semibold text-wood-500 uppercase tracking-wide pt-2">Réseaux sociaux (optionnel)</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-wood-800 mb-1.5 block">Facebook</label>
                  <input
                    type="url"
                    value={form.facebook_url}
                    onChange={(e) => setForm({ ...form, facebook_url: e.target.value })}
                    placeholder="https://facebook.com/..."
                    className="w-full border border-wood-700/20 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-wood-800 mb-1.5 block">TikTok</label>
                  <input
                    type="url"
                    value={form.tiktok_url}
                    onChange={(e) => setForm({ ...form, tiktok_url: e.target.value })}
                    placeholder="https://tiktok.com/@..."
                    className="w-full border border-wood-700/20 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-wood-800 mb-1.5 block">LinkedIn</label>
                  <input
                    type="url"
                    value={form.linkedin_url}
                    onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full border border-wood-700/20 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-wood-800 mb-1.5 block">X (Twitter)</label>
                  <input
                    type="url"
                    value={form.x_url}
                    onChange={(e) => setForm({ ...form, x_url: e.target.value })}
                    placeholder="https://x.com/..."
                    className="w-full border border-wood-700/20 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-outline flex-1 justify-center py-3 rounded-full font-semibold">
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving || optimizing}
                  className="btn-primary flex-1 justify-center py-3 rounded-full font-semibold disabled:opacity-60 inline-flex items-center gap-2"
                >
                  {saving && <Loader2 size={15} className="animate-spin" />}
                  {editingId ? 'Enregistrer' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}