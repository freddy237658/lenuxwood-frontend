// TODO: remplacer par la conversation réelle de l'utilisateur connecté,
// alimentée par les mêmes endpoints que src/data/messages-mock.js côté admin.
export const CLIENT_CONVERSATION = {
  context: 'Support LenuxWood',
  messages: [
    { from: 'admin', text: 'Bonjour ! Comment pouvons-nous vous aider aujourd\'hui ?', date: '14 août, 09:20', read: true },
    { from: 'client', text: 'Bonjour, je voulais savoir où en est mon devis DV-0231.', date: '14 août, 09:25', read: true },
    { from: 'admin', text: 'Il est en cours de traitement, vous aurez une réponse sous 48h.', date: '14 août, 10:03', read: false },
  ],
}
