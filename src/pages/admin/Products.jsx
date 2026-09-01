import { useEffect, useMemo, useState } from 'react'
import { Plus, X, Package, Layers, Wallet, ImagePlus, Search, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import { useCategories, categoryName } from '../../hooks/useCategories'
import { formatPrice } from '../../lib/format'
import StatCard from '../../components/admin/StatCard'
import RowActions from '../../components/admin/RowActions'
import DetailModal from '../../components/admin/DetailModal'

const emptyForm = {
  category_id: '',
  name: '',
  price: '',
  price_unit: '',
  essence: '',
  finish: '',
  dimensions: '',
  manufacturing_delay: '',
  warranty: '',
  stock: '',
  tag: '',
  description: '',
  imageFile: null,
  imagePreview: null,
}

export default function Products() {
  const { i18n } = useTranslation()
  const { categories } = useCategories()

  const [products, setProducts] = useState([])
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
      .get('/products')
      .then((res) => setProducts(res.data.data ?? []))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const filtered = useMemo(() => {
    if (!query.trim()) return products
    const q = query.toLowerCase()
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.category?.name?.fr || '').toLowerCase().includes(q) ||
        (p.essence || '').toLowerCase().includes(q)
    )
  }, [products, query])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (product) => {
    setEditingId(product.id)
    setForm({
      category_id: String(product.category?.id || ''),
      name: product.name,
      price: product.price,
      price_unit: product.price_unit || '',
      essence: product.essence || '',
      finish: product.finish || '',
      dimensions: product.dimensions || '',
      manufacturing_delay: product.manufacturing_delay || '',
      warranty: product.warranty || '',
      stock: product.stock || '',
      tag: product.tag || '',
      description: product.description || '',
      imageFile: null,
      imagePreview: product.images?.[0]?.url || null,
    })
    setModalOpen(true)
  }

  const remove = async (id) => {
    if (!confirm('Supprimer ce produit ?')) return
    await api.delete(`/products/${id}`)
    load()
  }

  const onImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setForm((f) => ({ ...f, imageFile: file, imagePreview: URL.createObjectURL(file) }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)

    const formData = new FormData()
    formData.append('category_id', form.category_id)
    formData.append('name', form.name)
    formData.append('price', form.price)
    if (form.price_unit) formData.append('price_unit', form.price_unit)
    if (form.essence) formData.append('essence', form.essence)
    if (form.finish) formData.append('finish', form.finish)
    if (form.dimensions) formData.append('dimensions', form.dimensions)
    if (form.manufacturing_delay) formData.append('manufacturing_delay', form.manufacturing_delay)
    if (form.warranty) formData.append('warranty', form.warranty)
    if (form.stock) formData.append('stock', form.stock)
    if (form.tag) formData.append('tag', form.tag)
    if (form.description) formData.append('description', form.description)
    if (form.imageFile) formData.append('image', form.imageFile)

    try {
      if (editingId) {
        await api.post(`/products/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      } else {
        await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      }
      setModalOpen(false)
      load()
    } finally {
      setSaving(false)
    }
  }

  const avgPrice = products.length
    ? Math.round(products.reduce((sum, p) => sum + Number(p.price), 0) / products.length)
    : 0

  const stats = [
    { label: 'Produits au catalogue', value: products.length, icon: Package, tone: 'dark' },
    { label: 'Catégories actives', value: categories.length, icon: Layers, tone: 'dark' },
    { label: 'Prix moyen (indicatif)', value: `${formatPrice(avgPrice)} FCFA`, icon: Wallet, tone: 'red' },
  ]

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-wood-950">Produits</h1>
          <p className="text-wood-500 text-sm mt-1">{products.length} produits au catalogue</p>
        </div>
        <button onClick={openCreate} className="btn-primary px-5 py-2.5 rounded-full font-semibold text-sm inline-flex items-center gap-2">
          <Plus size={16} /> Ajouter un produit
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-5 mb-6">
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
          placeholder="Rechercher un produit..."
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
                <th className="px-5 py-3 font-medium">Produit</th>
                <th className="px-5 py-3 font-medium">Catégorie</th>
                <th className="px-5 py-3 font-medium">Prix</th>
                <th className="px-5 py-3 font-medium">Essence</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-wood-700/10">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {p.images?.[0]?.url ? (
                        <img src={p.images[0].url} alt={p.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-9 h-9 rounded-full shrink-0 bg-wood-700" />
                      )}
                      <span className="font-medium text-wood-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-wood-600">{p.category ? categoryName(p.category, i18n.language) : ''}</td>
                  <td className="px-5 py-3.5 text-wood-600">{formatPrice(p.price, p.price_unit)} FCFA</td>
                  <td className="px-5 py-3.5 text-wood-600">{p.essence}</td>
                  <td className="px-5 py-3.5">
                    <RowActions onView={() => setViewing(p)} onEdit={() => openEdit(p)} onDelete={() => remove(p.id)} />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-wood-400">
                    Aucun produit ne correspond à cette recherche.
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
            { label: 'Catégorie', value: viewing.category ? categoryName(viewing.category, i18n.language) : '' },
            { label: 'Prix', value: `${formatPrice(viewing.price, viewing.price_unit)} FCFA` },
            { label: 'Essence', value: viewing.essence },
            { label: 'Finition', value: viewing.finish },
            { label: 'Dimensions', value: viewing.dimensions },
            { label: 'Délai de fabrication', value: viewing.manufacturing_delay },
            { label: 'Garantie', value: viewing.warranty },
            { label: 'Stock', value: viewing.stock },
            { label: 'Description', value: viewing.description },
          ]}
        />
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-wood-950/50 flex items-center justify-center p-5">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-wood-700/10">
              <p className="font-display font-semibold text-lg text-wood-950">
                {editingId ? 'Modifier le produit' : 'Ajouter un produit'}
              </p>
              <button onClick={() => setModalOpen(false)} className="text-wood-400 hover:text-wood-800">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={submit} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-wood-800 mb-1.5 block">Image du produit</label>
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
                    <p>JPG ou PNG, idéalement carrée</p>
                  </div>
                  <input type="file" accept="image/*" onChange={onImageChange} className="hidden" />
                </label>
              </div>

              <div>
                <label className="text-sm font-medium text-wood-800 mb-1.5 block">Nom du produit</label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-wood-700/20 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-wood-800 mb-1.5 block">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Description détaillée du produit..."
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-wood-800 mb-1.5 block">Prix (FCFA)</label>
                  <input
                    required
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full border border-wood-700/20 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-wood-800 mb-1.5 block">Unité (optionnel)</label>
                  <input
                    type="text"
                    value={form.price_unit}
                    onChange={(e) => setForm({ ...form, price_unit: e.target.value })}
                    placeholder="Ex: /m²"
                    className="w-full border border-wood-700/20 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-wood-800 mb-1.5 block">Stock disponible</label>
                  <input
                    type="text"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    placeholder="Ex: 12 unités / sur commande"
                    className="w-full border border-wood-700/20 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-wood-800 mb-1.5 block">Essence</label>
                  <input
                    type="text"
                    value={form.essence}
                    onChange={(e) => setForm({ ...form, essence: e.target.value })}
                    className="w-full border border-wood-700/20 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-wood-800 mb-1.5 block">Finition</label>
                  <input
                    type="text"
                    value={form.finish}
                    onChange={(e) => setForm({ ...form, finish: e.target.value })}
                    className="w-full border border-wood-700/20 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-wood-800 mb-1.5 block">Dimensions</label>
                  <input
                    type="text"
                    value={form.dimensions}
                    onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
                    placeholder="Ex: 240 x 60 x 90 cm"
                    className="w-full border border-wood-700/20 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-wood-800 mb-1.5 block">Délai de fabrication</label>
                  <input
                    type="text"
                    value={form.manufacturing_delay}
                    onChange={(e) => setForm({ ...form, manufacturing_delay: e.target.value })}
                    className="w-full border border-wood-700/20 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-wood-800 mb-1.5 block">Garantie</label>
                  <input
                    type="text"
                    value={form.warranty}
                    onChange={(e) => setForm({ ...form, warranty: e.target.value })}
                    placeholder="Ex: 2 ans"
                    className="w-full border border-wood-700/20 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-wood-800 mb-1.5 block">Étiquette (optionnel)</label>
                  <input
                    type="text"
                    value={form.tag}
                    onChange={(e) => setForm({ ...form, tag: e.target.value })}
                    placeholder="Ex: Nouveau, Best-seller"
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