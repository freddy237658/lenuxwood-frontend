/**
 * Utilitaire d'optimisation et de compression d'images côté client.
 * Réduit automatiquement la résolution et compresse l'image avant l'upload vers le serveur,
 * évitant ainsi de charger des fichiers lourds (plusieurs Mo) qui ralentissent le site.
 */

export function formatBytes(bytes) {
  if (!bytes || bytes <= 0) return '0 Ko'
  const kb = bytes / 1024
  if (kb < 1024) return `${Math.round(kb)} Ko`
  return `${(kb / 1024).toFixed(1)} Mo`
}

/**
 * Compresse et redimensionne une image.
 *
 * @param {File} file - Fichier image issu de l'input
 * @param {Object} options - Options
 * @param {number} options.maxWidth - Largeur max (défaut 1600px)
 * @param {number} options.maxHeight - Hauteur max (défaut 1600px)
 * @param {number} options.quality - Qualité de compression JPEG (0.1 à 1.0, défaut 0.82)
 * @param {string} options.outputType - Type MIME de sortie (défaut 'image/jpeg')
 * @returns {Promise<{ file: File, previewUrl: string, originalSize: number, compressedSize: number, savedPercent: number }>}
 */
export async function optimizeImage(file, options = {}) {
  const {
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 0.82,
    outputType = 'image/jpeg',
  } = options

  // Si pas de fichier ou format non géré (SVG, GIF animé), renvoyer tel quel
  if (
    !file ||
    !file.type.startsWith('image/') ||
    file.type === 'image/svg+xml' ||
    file.type === 'image/gif'
  ) {
    return {
      file,
      previewUrl: file ? URL.createObjectURL(file) : null,
      originalSize: file?.size || 0,
      compressedSize: file?.size || 0,
      savedPercent: 0,
    }
  }

  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()

      img.onload = () => {
        let width = img.naturalWidth || img.width
        let height = img.naturalHeight || img.height

        // Calcul des dimensions proportionnelles
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')

        // Pour les JPEG, fond blanc si transparence d'un PNG source
        if (outputType === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF'
          ctx.fillRect(0, 0, width, height)
        }

        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve({
                file,
                previewUrl: URL.createObjectURL(file),
                originalSize: file.size,
                compressedSize: file.size,
                savedPercent: 0,
              })
              return
            }

            // Si l'image est déjà ultra-légère et que la compression l'alourdit, garder l'original
            if (blob.size >= file.size && width === img.naturalWidth) {
              resolve({
                file,
                previewUrl: URL.createObjectURL(file),
                originalSize: file.size,
                compressedSize: file.size,
                savedPercent: 0,
              })
              return
            }

            const cleanName = file.name.replace(/\.[^/.]+$/, '') + '.jpg'
            const optimizedFile = new File([blob], cleanName, {
              type: outputType,
              lastModified: Date.now(),
            })

            const savedPercent = Math.max(0, Math.round((1 - blob.size / file.size) * 100))

            resolve({
              file: optimizedFile,
              previewUrl: URL.createObjectURL(blob),
              originalSize: file.size,
              compressedSize: blob.size,
              savedPercent,
            })
          },
          outputType,
          quality
        )
      }

      img.onerror = () => {
        resolve({
          file,
          previewUrl: URL.createObjectURL(file),
          originalSize: file.size,
          compressedSize: file.size,
          savedPercent: 0,
        })
      }

      img.src = e.target.result
    }

    reader.onerror = () => {
      resolve({
        file,
        previewUrl: URL.createObjectURL(file),
        originalSize: file.size,
        compressedSize: file.size,
        savedPercent: 0,
      })
    }

    reader.readAsDataURL(file)
  })
}
