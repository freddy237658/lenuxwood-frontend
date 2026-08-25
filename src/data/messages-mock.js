/**
 * ⚠️ MESSAGERIE FACTICE (MOCK)
 * -----------------------------
 * En attendant le back-end, les conversations sont stockées ici en mémoire.
 * Une fois Laravel branché, ceci sera remplacé par :
 *   - GET  /api/conversations              -> liste des conversations de l'admin
 *   - GET  /api/conversations/:id/messages -> messages d'une conversation
 *   - POST /api/conversations/:id/messages -> envoyer un message
 *   - Diffusion en temps réel via Laravel Notifications + Echo/Pusher pour le
 *     badge "non lus" et l'arrivée instantanée des messages.
 *
 * Chaque conversation a un `id` qui correspond au `clientId` utilisé dans
 * admin-mock.js (QUOTES, ORDERS, ADMIN_USERS), pour pouvoir ouvrir la bonne
 * conversation directement depuis un bouton "message" sur ces tableaux.
 */

export const CONVERSATIONS = [
  {
    id: 'q1',
    name: 'Paul Ekwalla',
    context: 'Devis DV-0231 · Meubles cuisine',
    unread: 2,
    messages: [
      { from: 'client', text: "Bonjour, avez-vous une estimation pour ma cuisine en L ?", date: '14 août, 09:12' },
      { from: 'client', text: "Je suis disponible cette semaine pour en discuter.", date: '14 août, 09:14' },
    ],
  },
  {
    id: 'q3',
    name: 'Serge Manga',
    context: 'Devis DV-0229 · Meubles chambre',
    unread: 0,
    messages: [
      { from: 'admin', text: "Bonjour Serge, votre devis est en cours de préparation.", date: '11 août, 15:30' },
      { from: 'client', text: "Merci, dans combien de temps environ ?", date: '11 août, 16:02' },
    ],
  },
  {
    id: 'o2',
    name: 'Odette Simo',
    context: 'Commande CMD-1041 · Lit double teck massif',
    unread: 1,
    messages: [
      { from: 'client', text: "Bonjour, où en est la fabrication de mon lit ?", date: '2 août, 11:00' },
    ],
  },
  {
    id: 'o5',
    name: 'Junior Ateba',
    context: 'Commande CMD-1038 · Structure toiture 6x8m',
    unread: 0,
    messages: [
      { from: 'admin', text: "Bonjour Junior, l'équipe passe lundi pour la pose.", date: '16 juin, 08:45' },
      { from: 'client', text: "Parfait, merci pour l'info !", date: '16 juin, 09:10' },
    ],
  },
  {
    id: 'u2',
    name: 'Sarah Njoya',
    context: 'Équipe · Commercial',
    unread: 0,
    messages: [
      { from: 'admin', text: "Sarah, peux-tu rappeler le client DV-0230 ?", date: '12 août, 14:00' },
    ],
  },
]

export function findConversation(id) {
  return CONVERSATIONS.find((c) => c.id === id)
}
