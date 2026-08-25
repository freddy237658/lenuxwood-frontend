export const PRODUCTS = [
  { id: 1, slug: 'cuisine-moderne-iroko', color: '#4A2E1A', tag: 'Sur mesure', category: 'meubles-cuisine', categoryLabel: 'Meubles cuisine', name: 'Cuisine moderne en iroko', price: '450 000', essence: 'Iroko massif', finish: 'Huile mate', delay: '4 à 6 semaines', warranty: '2 ans' },
  { id: 2, slug: 'table-basse-suspendue', color: '#6B4426', tag: 'Best-seller', category: 'meubles-salon', categoryLabel: 'Meubles salon', name: 'Table basse suspendue', price: '180 000', essence: 'Teck', finish: 'Vernis satiné', delay: '2 à 3 semaines', warranty: '2 ans' },
  { id: 3, slug: 'lit-double-teck', color: '#3E2717', tag: 'Nouveau', category: 'meubles-chambre', categoryLabel: 'Meubles chambre', name: 'Lit double teck massif', price: '320 000', essence: 'Teck massif', finish: 'Huile naturelle', delay: '3 à 5 semaines', warranty: '2 ans' },
  { id: 4, slug: 'structure-toiture-6x8', color: '#8A5C34', tag: 'Sur mesure', category: 'charpente', categoryLabel: 'Charpente', name: 'Structure toiture 6x8m', price: '1 200 000', essence: 'Pin traité', finish: 'Traitement autoclave', delay: '3 à 4 semaines', warranty: '5 ans' },
  { id: 5, slug: 'porte-pleine-acajou', color: '#A97A48', tag: '', category: 'portes', categoryLabel: 'Portes', name: 'Porte pleine acajou', price: '95 000', essence: 'Acajou', finish: 'Vernis brillant', delay: '2 semaines', warranty: '2 ans' },
  { id: 6, slug: 'armoire-3-portes-wenge', color: '#7A4B26', tag: 'Nouveau', category: 'armoires', categoryLabel: 'Armoires', name: 'Armoire 3 portes wengé', price: '275 000', essence: 'Wengé', finish: 'Huile mate', delay: '3 semaines', warranty: '2 ans' },
  { id: 7, slug: 'faux-plafond-lattes', color: '#4A2E1A', tag: '', category: 'plafonds', categoryLabel: 'Plafonds', name: 'Faux-plafond lattes bois', price: '65 000 /m²', essence: 'Pin', finish: 'Lasure claire', delay: '1 à 2 semaines', warranty: '3 ans' },
  { id: 8, slug: 'parquet-massif-iroko', color: '#6B4426', tag: 'Best-seller', category: 'sols', categoryLabel: 'Sols', name: 'Parquet massif iroko', price: '42 000 /m²', essence: 'Iroko', finish: 'Vitrifié', delay: '2 semaines', warranty: '5 ans' },
  { id: 9, slug: 'bibliotheque-murale', color: '#3E2717', tag: '', category: 'meubles-salon', categoryLabel: 'Meubles salon', name: 'Bibliothèque murale', price: '210 000', essence: 'Iroko', finish: 'Huile mate', delay: '3 semaines', warranty: '2 ans' },
]

export function getProductBySlug(slug) {
  return PRODUCTS.find((p) => p.slug === slug)
}
