import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { authService } from '../../services/authService'

const AUTH_STORAGE_KEY = 'gooddocs_auth_token'

function getStoredToken() {
  if (typeof window === 'undefined') {
    return ''
  }

  const token = window.localStorage.getItem(AUTH_STORAGE_KEY)

  if (!token || token === 'undefined' || token === 'null') {
    return ''
  }

  return token
}

const storedToken = getStoredToken()

export const register = createAsyncThunk('auth/register', async (payload, thunkAPI) => {
  try {
    const response = await authService.register(payload)
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const login = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const response = await authService.login(credentials)
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async (_, thunkAPI) => {
  try {
    const response = await authService.me()
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await authService.logout()
    return true
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: storedToken || '',
    user: null,
    status: 'idle',
    initialized: !storedToken,
    error: null,
  },
  reducers: {
    clearAuth(state) {
      state.token = ''
      state.user = null
      state.initialized = true
      state.status = 'idle'
      state.error = null
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(AUTH_STORAGE_KEY)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.token = action.payload.token
        state.initialized = true
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(AUTH_STORAGE_KEY, action.payload.token)
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed'
        state.initialized = true
        state.error = action.payload || 'Unable to register.'
      })
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.token = action.payload.token
        state.initialized = true
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(AUTH_STORAGE_KEY, action.payload.token)
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.initialized = true
        state.error = action.payload || 'Unable to login.'
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload
        state.initialized = true
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = 'failed'
        state.user = null
        state.token = ''
        state.initialized = true
        state.error = action.payload || 'Unable to restore your session.'
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(AUTH_STORAGE_KEY)
        }
      })
      .addCase(logout.fulfilled, (state) => {
        state.token = ''
        state.user = null
        state.status = 'idle'
        state.initialized = true
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(AUTH_STORAGE_KEY)
        }
      })
      .addCase(logout.rejected, (state) => {
        state.token = ''
        state.user = null
        state.status = 'idle'
        state.initialized = true
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(AUTH_STORAGE_KEY)
        }
      })
  },
})

export const { clearAuth } = authSlice.actions

export default authSlice.reducer
