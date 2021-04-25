import { createUploadUrl } from '../clients/backend-client'
import { uploadFile } from '../clients/s3-client'
import store from '../store'


export async function uploadImage(file, progressCallback) {
  const contentType = file.type
  const response = await createUploadUrl(contentType)
  await uploadFile(response.data.url, contentType, file, progressCallback)
  return response.data.id
}

export async function fetchImageUrl(imageId, size) {

  await store.dispatch('images/fetchImageUrl', { imageId, size })
  const image = store.state.images.cachedImages.find(img => img.imageId === imageId && img.size === size)

  if (image) {
    return image.url
  }

  throw new Error('image not found', imageId, size) // TODO check how to use in Promise.catch
}
