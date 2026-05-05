import { apiClient } from './apiClient'

export const documentService = {
  getDocuments() {
    return apiClient.get('/documents')
  },
  createDocument(payload) {
    return apiClient.post('/documents', payload)
  },
  getDocument(documentId) {
    return apiClient.get(`/documents/${documentId}`)
  },
  updateDocument(documentId, payload) {
    return apiClient.put(`/documents/${documentId}`, payload)
  },
  importDocument(file) {
    const formData = new FormData()
    formData.append('file', file)

    return apiClient.post('/documents/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  shareDocument(documentId, payload) {
    return apiClient.post(`/documents/${documentId}/share`, payload)
  },
}
