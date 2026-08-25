import { useMemo, useState } from 'react'
import { Plus, X, Package, Layers, Wallet, ImagePlus, Search } from 'lucide-react'
import { PRODUCTS as INITIAL_PRODUCTS } from '../../data/products'
import { MODULES } from '../../data/modules'
import { useTranslation } from 'react-i18next'
import StatCard from '../../components/admin/StatCard'
import RowActions from '../../components/admin/RowActions'
import DetailModal from '../../components/admin/DetailModal'

const emptyForm = {
  name: '',
  category: 'meubles-cuisine',
  price: '',
  essence: '',
  finish: '',
  dimensions: '',
  delay: '',
  warranty: '',
  stock: '',
  tag: '',
  description: '',
  image: null,
}

export default function Products() {
  const { t } = useTranslation()
  // TODO: remplacer par un state alimenté par GET/POST/PUT/DELETE `${VITE_API_URL}/products`
  const [products, setProducts] = useState(INITIAL_PRODUCTS)
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [viewing, setViewing] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const filtered = useMemo(() => {
    if (!query.trim()) return products
    const q = query.toLowerCase()
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.categoryLabel.toLowerCase().includes(q) || (p.essence || '').toLowerCase().includes(q)
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
      name: product.name,
      category: product.category,
      price: product.price,
      essence: product.essence || '',
      finish: product.finish || '',
      dimensions: product.dimensions || '',
      delay: product.delay || '',
      warranty: product.warranty || '',
      stock: product.stock || '',
      tag: product.tag || '',
      description: product.description || '',
      image: product.image || null,
    })
    setModalOpen(true)
  }

  const remove = (id) => {
    if (confirm('Supprimer ce produit ?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id))
    }
  }

  const onImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setForm((f) => ({ ...f, image: reader.result }))
    reader.readAsDataURL(file)
  }

  const submit = (e) => {
    e.preventDefault()
    const mod = MODULES.find((m) => m.slug === form.category)
    const label = mod ? t(`modules.${mod.key}.name`) : form.category

    if (editingId) {
      setProducts((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...form, categoryLabel: label } : p)))
    } else {
      const newProduct = {
        id: Date.now(),
        slug: form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        color: '#6B4426',
        categoryLabel: label,
        ...form,
      }
      setProducts((prev) => [newProduct, ...prev])
    }
    setModalOpen(false)
  }

  const stats = [
    { label: 'Produits au catalogue', value: products.length, icon: Package, tone: 'dark' },
    { label: 'Catégories actives', value: MODULES.length, icon: Layers, tone: 'dark' },
    {
      label: 'Prix moyen (indicatif)',
      value: `${Math.round(
        products.reduce((sum, p) => sum + (parseInt(String(p.price).replace(/[^\d]/g, ''), 10) || 0), 0) / (products.length || 1)
      ).toLocaleString('fr-FR')} FCFA`,
      icon: Wallet,
      tone: 'red',
    },
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
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="w-9 h-9 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                    )}
                    <span className="font-medium text-wood-900">{p.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-wood-600">{p.categoryLabel}</td>
                <td className="px-5 py-3.5 text-wood-600">{p.price} FCFA</td>
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

      {viewing && (
        <DetailModal
          title={viewing.name}
          onClose={() => setViewing(null)}
          fields={[
            { label: 'Catégorie', value: viewing.categoryLabel },
            { label: 'Prix', value: `${viewing.price} FCFA` },
            { label: 'Essence', value: viewing.essence },
            { label: 'Finition', value: viewing.finish },
            { label: 'Dimensions', value: viewing.dimensions },
            { label: 'Délai de fabrication', value: viewing.delay },
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
                    {form.image ? (
                      <img src={form.image} alt="Aperçu" className="w-full h-full object-cover" />
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
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-wood-700/20 rounded-sm px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-red-600"
                >
                  {MODULES.map((m) => (
                    <option key={m.slug} value={m.slug}>
                      {t(`modules.${m.key}.name`)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-wood-800 mb-1.5 block">Prix (FCFA)</label>
                  <input
                    required
                    type="text"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
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
                    value={form.delay}
                    onChange={(e) => setForm({ ...form, delay: e.target.value })}
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
                <button type="submit" className="btn-primary flex-1 justify-center py-3 rounded-full font-semibold">
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
