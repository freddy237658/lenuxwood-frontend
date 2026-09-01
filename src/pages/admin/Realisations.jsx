import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, X, Image as ImageIcon, Star, Search, Loader2, ImagePlus } from 'lucide-react'
import api from '../../lib/api'
import { useCategories, categoryName } from '../../hooks/useCategories'
import StatCard from '../../components/admin/StatCard'
import RowActions from '../../components/admin/RowActions'
import DetailModal from '../../components/admin/DetailModal'

const emptyForm = {
  category_id: '',
  title: '',
  city: '',
  is_featured: false,
  imageFile: null,
  imagePreview: null,
}

export default function Realisations() {
  const { i18n } = useTranslation()
  const { categories } = useCategories()

  const [realisations, setRealisations] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [viewing, setViewing] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const load = () => {
    setLoading(true)
    api
      .get('/realisations')
      .then((res) => setRealisations(res.data.data ?? []))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const filtered = useMemo(() => {
    if (!query.trim()) return realisations
    const q = query.toLowerCase()
    return realisations.filter(
      (r) => r.title.toLowerCase().includes(q) || (r.city || '').toLowerCase().includes(q)
    )
  }, [realisations, query])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (r) => {
    setEditingId(r.id)
    setForm({
      category_id: String(r.category?.id || ''),
      title: r.title,
      city: r.city || '',
      is_featured: r.is_featured,
      imageFile: null,
      imagePreview: r.image_url,
    })
    setModalOpen(true)
  }

  const onImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setForm((f) => ({ ...f, imageFile: file, imagePreview: URL.createObjectURL(file) }))
  }

  const remove = async (id) => {
    if (!confirm('Supprimer cette réalisation ?')) return
    await api.delete(`/realisations/${id}`)
    load()
  }

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)

    const formData = new FormData()
    formData.append('category_id', form.category_id)
    formData.append('title', form.title)
    formData.append('city', form.city)
    formData.append('is_featured', form.is_featured ? '1' : '0')
    if (form.imageFile) formData.append('image', form.imageFile)

    try {
      if (editingId) {
        await api.post(`/realisations/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      } else {
        await api.post('/realisations', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      }
      setModalOpen(false)
      load()
    } finally {
      setSaving(false)
    }
  }

  const stats = [
    { label: 'Réalisations publiées', value: realisations.length, icon: ImageIcon, tone: 'dark' },
    { label: 'Mises en avant', value: realisations.filter((r) => r.is_featured).length, icon: Star, tone: 'red' },
  ]

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-wood-950">Réalisations</h1>
          <p className="text-wood-500 text-sm mt-1">{realisations.length} projets dans la galerie</p>
        </div>
        <button onClick={openCreate} className="btn-primary px-5 py-2.5 rounded-full font-semibold text-sm inline-flex items-center gap-2">
          <Plus size={16} /> Ajouter une réalisation
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
          placeholder="Rechercher un titre, une ville..."
          className="w-full border border-wood-700/20 rounded-full pl-10 pr-4 py-2.5 text-sm bg-white focus:outline-none focus:border-red-600"
        />
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-wood-500 py-10">
          <Loader2 size={18} className="animate-spin" /> Chargement...
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((r) => (
            <div key={r.id} className="bg-white border border-wood-700/10 rounded-2xl overflow-hidden card-lift">
              <div className="aspect-[4/3] relative">
                <img src={r.image_url} alt={r.title} className="w-full h-full object-cover" />
                {r.is_featured && (
                  <span className="absolute top-3 left-3 bg-oak-500 text-wood-950 text-[11px] font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                    <Star size={11} /> À la une
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="text-[11px] uppercase tracking-wide text-wood-500 mb-1">
                  {r.category ? categoryName(r.category, i18n.language) : ''}
                </p>
                <p className="font-display font-semibold text-wood-950 mb-2">{r.title}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-wood-500">{r.city}</p>
                  <RowActions onView={() => setViewing(r)} onEdit={() => openEdit(r)} onDelete={() => remove(r.id)} />
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-center text-wood-400 py-10">Aucune réalisation ne correspond à cette recherche.</p>
          )}
        </div>
      )}

      {viewing && (
        <DetailModal
          title={viewing.title}
          onClose={() => setViewing(null)}
          fields={[
            { label: 'Catégorie', value: viewing.category ? categoryName(viewing.category, i18n.language) : '' },
            { label: 'Ville', value: viewing.city },
            { label: 'Mise en avant', value: viewing.is_featured ? 'Oui' : 'Non' },
          ]}
        />
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-wood-950/50 flex items-center justify-center p-5">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-wood-700/10">
              <p className="font-display font-semibold text-lg text-wood-950">
                {editingId ? 'Modifier la réalisation' : 'Ajouter une réalisation'}
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
                    {form.imagePreview ? (
                      <img src={form.imagePreview} alt="Aperçu" className="w-full h-full object-cover" />
                    ) : (
                      <ImagePlus size={22} className="text-wood-400" />
                    )}
                  </div>
                  <div className="text-xs text-wood-500">
                    <p className="font-medium text-wood-700 mb-0.5">Cliquez pour choisir une image</p>
                    <p>JPG ou PNG, idéalement au format 4:3</p>
                  </div>
                  <input type="file" accept="image/*" onChange={onImageChange} className="hidden" required={!editingId} />
                </label>
              </div>

              <div>
                <label className="text-sm font-medium text-wood-800 mb-1.5 block">Titre du projet</label>
                <input
                  required
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-wood-700/20 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-wood-800 mb-1.5 block">Catégorie</label>
                <select
                  required
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="w-full border border-wood-700/20 rounded-sm px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-red-600"
                >
                  <option value="">Choisir...</option>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.id}>
                      {categoryName(c, i18n.language)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-wood-800 mb-1.5 block">Ville</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="Douala, Yaoundé..."
                  className="w-full border border-wood-700/20 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-red-600"
                />
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                  className="accent-red-600"
                />
                <span className="text-sm text-wood-800">Mettre en avant sur la page d'accueil</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-outline flex-1 justify-center py-3 rounded-full font-semibold">
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
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