export function formatPrice(price, unit) {
  const formatted = Number(price).toLocaleString('fr-FR')
  return unit ? `${formatted} ${unit}` : formatted
}