import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { documentService } from '../../services/documentService'

export const fetchDocuments = createAsyncThunk('documents/fetchDocuments', async (_, thunkAPI) => {
  try {
    const response = await documentService.getDocuments()
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const createDocument = createAsyncThunk('documents/createDocument', async (payload, thunkAPI) => {
  try {
    const response = await documentService.createDocument(payload)
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const fetchDocumentById = createAsyncThunk('documents/fetchDocumentById', async (documentId, thunkAPI) => {
  try {
    const response = await documentService.getDocument(documentId)
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const updateDocument = createAsyncThunk(
  'documents/updateDocument',
  async ({ documentId, payload }, thunkAPI) => {
    try {
      const response = await documentService.updateDocument(documentId, payload)
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const importDocument = createAsyncThunk('documents/importDocument', async (file, thunkAPI) => {
  try {
    const response = await documentService.importDocument(file)
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const shareDocument = createAsyncThunk(
  'documents/shareDocument',
  async ({ documentId, payload }, thunkAPI) => {
    try {
      const response = await documentService.shareDocument(documentId, payload)
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

function replaceInList(list, document) {
  const index = list.findIndex((item) => item.id === document.id)

  if (index === -1) {
    return [document, ...list]
  }

  const nextList = [...list]
  nextList[index] = document

  return nextList
}

const documentsSlice = createSlice({
  name: 'documents',
  initialState: {
    ownedDocuments: [],
    sharedDocuments: [],
    currentDocument: null,
    listStatus: 'idle',
    currentStatus: 'idle',
    actionStatus: 'idle',
    shareStatus: 'idle',
    error: null,
  },
  reducers: {
    clearCurrentDocument(state) {
      state.currentDocument = null
      state.currentStatus = 'idle'
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.listStatus = 'loading'
        state.error = null
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.listStatus = 'succeeded'
        state.ownedDocuments = action.payload.owned_documents
        state.sharedDocuments = action.payload.shared_documents
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.listStatus = 'failed'
        state.error = action.payload || 'Unable to load documents.'
      })
      .addCase(createDocument.pending, (state) => {
        state.actionStatus = 'loading'
        state.error = null
      })
      .addCase(createDocument.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded'
        state.currentDocument = action.payload
        state.ownedDocuments = [action.payload, ...state.ownedDocuments]
      })
      .addCase(createDocument.rejected, (state, action) => {
        state.actionStatus = 'failed'
        state.error = action.payload || 'Unable to create document.'
      })
      .addCase(fetchDocumentById.pending, (state) => {
        state.currentStatus = 'loading'
        state.error = null
      })
      .addCase(fetchDocumentById.fulfilled, (state, action) => {
        state.currentStatus = 'succeeded'
        state.currentDocument = action.payload
      })
      .addCase(fetchDocumentById.rejected, (state, action) => {
        state.currentStatus = 'failed'
        state.error = action.payload || 'Unable to load document.'
      })
      .addCase(updateDocument.pending, (state) => {
        state.actionStatus = 'loading'
      })
      .addCase(updateDocument.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded'
        state.currentDocument = action.payload
        if (action.payload.ownership_type === 'shared') {
          state.sharedDocuments = replaceInList(state.sharedDocuments, action.payload)
        } else {
          state.ownedDocuments = replaceInList(state.ownedDocuments, action.payload)
        }
      })
      .addCase(updateDocument.rejected, (state, action) => {
        state.actionStatus = 'failed'
        state.error = action.payload || 'Unable to update document.'
      })
      .addCase(importDocument.pending, (state) => {
        state.actionStatus = 'loading'
      })
      .addCase(importDocument.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded'
        state.currentDocument = action.payload
        state.ownedDocuments = [action.payload, ...state.ownedDocuments]
      })
      .addCase(importDocument.rejected, (state, action) => {
        state.actionStatus = 'failed'
        state.error = action.payload || 'Unable to import document.'
      })
      .addCase(shareDocument.pending, (state) => {
        state.shareStatus = 'loading'
      })
      .addCase(shareDocument.fulfilled, (state) => {
        state.shareStatus = 'succeeded'
      })
      .addCase(shareDocument.rejected, (state, action) => {
        state.shareStatus = 'failed'
        state.error = action.payload || 'Unable to share document.'
      })
  },
})

export const { clearCurrentDocument } = documentsSlice.actions

export default documentsSlice.reducer
