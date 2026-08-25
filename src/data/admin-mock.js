export const QUOTES = [
  { id: 'DV-0231', clientId: 'q1', client: 'Paul Ekwalla', phone: '+237 677 12 34 56', module: 'Meubles cuisine', description: 'Cuisine en L, 4m, finition claire', budget: '400 000 - 500 000', city: 'Douala', status: 'En attente', date: '2026-08-14' },
  { id: 'DV-0230', clientId: 'q2', client: 'Aïcha Bello', phone: '+237 691 22 33 44', module: 'Charpente', description: 'Toiture villa 8x10m', budget: '1 500 000+', city: 'Yaoundé', status: 'Traité', date: '2026-08-12' },
  { id: 'DV-0229', clientId: 'q3', client: 'Serge Manga', phone: '+237 655 98 76 54', module: 'Meubles chambre', description: 'Lit double + armoire assortie', budget: '500 000 - 700 000', city: 'Douala', status: 'En attente', date: '2026-08-11' },
  { id: 'DV-0228', clientId: 'q4', client: 'Ines Foka', phone: '+237 699 11 22 33', module: 'Portes', description: '3 portes intérieures acajou', budget: '250 000 - 300 000', city: 'Bafoussam', status: 'Refusé', date: '2026-08-09' },
  { id: 'DV-0227', clientId: 'q5', client: 'Thierry Nkeng', phone: '+237 670 44 55 66', module: 'Sols', description: 'Parquet salon + couloir, 45m²', budget: '1 800 000', city: 'Kribi', status: 'Traité', date: '2026-08-07' },
]

export const ORDERS = [
  { id: 'CMD-1042', clientId: 'o1', client: 'Marc Owona', product: 'Cuisine moderne en iroko', amount: '450 000', status: 'Livré', date: '2026-08-12', payment: 'Orange Money' },
  { id: 'CMD-1041', clientId: 'o2', client: 'Odette Simo', product: 'Lit double teck massif', amount: '320 000', status: 'En fabrication', date: '2026-07-28', payment: 'MTN MoMo' },
  { id: 'CMD-1040', clientId: 'o3', client: 'Blaise Fotso', product: 'Table basse suspendue', amount: '180 000', status: 'Devis validé', date: '2026-07-03', payment: 'En attente' },
  { id: 'CMD-1039', clientId: 'o4', client: 'Grace Mballa', product: 'Armoire 3 portes wengé', amount: '275 000', status: 'Livré', date: '2026-06-21', payment: 'Orange Money' },
  { id: 'CMD-1038', clientId: 'o5', client: 'Junior Ateba', product: 'Structure toiture 6x8m', amount: '1 200 000', status: 'En fabrication', date: '2026-06-15', payment: 'MTN MoMo' },
]

export const PAYMENTS = [
  { id: 'PAY-3311', order: 'CMD-1042', method: 'Orange Money', amount: '135 000', status: 'Confirmé', date: '2026-08-12' },
  { id: 'PAY-3310', order: 'CMD-1041', method: 'MTN MoMo', amount: '96 000', status: 'Confirmé', date: '2026-07-28' },
  { id: 'PAY-3309', order: 'CMD-1039', method: 'Orange Money', amount: '275 000', status: 'Confirmé', date: '2026-06-21' },
  { id: 'PAY-3308', order: 'CMD-1038', method: 'MTN MoMo', amount: '360 000', status: 'En attente', date: '2026-06-15' },
]

export const ADMIN_USERS = [
  { id: 1, clientId: 'u1', name: 'Marc Lenux', email: 'marc.admin@lenuxwood.com', role: 'Administrateur', status: 'Actif' },
  { id: 2, clientId: 'u2', name: 'Sarah Njoya', email: 'sarah@lenuxwood.com', role: 'Commercial', status: 'Actif' },
  { id: 3, clientId: 'u3', name: 'Éric Talla', email: 'eric@lenuxwood.com', role: 'Commercial', status: 'Inactif' },
]

export const STATUS_STYLES = {
  'En attente': { bg: '#FAEEDA', text: '#854F0B' },
  'Traité': { bg: '#EAF3DE', text: '#27500A' },
  'Refusé': { bg: '#FBE3E3', text: '#8A1F1F' },
  'Livré': { bg: '#EAF3DE', text: '#27500A' },
  'En fabrication': { bg: '#FAEEDA', text: '#854F0B' },
  'Devis validé': { bg: '#E1F5EE', text: '#085041' },
  'Confirmé': { bg: '#EAF3DE', text: '#27500A' },
  'Actif': { bg: '#EAF3DE', text: '#27500A' },
  'Inactif': { bg: '#F1E9E2', text: '#6B5B4F' },
}
