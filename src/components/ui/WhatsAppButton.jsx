const WHATSAPP_NUMBER = '652964884' // TODO: remplacer par le vrai numéro LenuxWood (format international sans +)
const DEFAULT_MESSAGE = "Bonjour LenuxWood, je souhaite avoir des informations sur vos produits."

export default function WhatsAppButton() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Discuter sur WhatsApp"
      className="fixed bottom-6 right-6 z-50 group"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-75" />
      <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg shadow-black/20 transition-transform duration-300 group-hover:scale-110">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12.001 2C6.478 2 2 6.477 2 12c0 1.892.526 3.66 1.438 5.168L2 22l4.963-1.404A9.945 9.945 0 0 0 12.001 22C17.524 22 22 17.523 22 12S17.524 2 12.001 2zm0 18.062a8.02 8.02 0 0 1-4.29-1.24l-.307-.183-3.13.886.9-3.05-.2-.313A8.043 8.043 0 0 1 3.938 12c0-4.444 3.618-8.062 8.063-8.062S20.063 7.556 20.063 12 16.446 20.062 12.001 20.062z"/>
        </svg>
      </span>
    </a>
  )
}
