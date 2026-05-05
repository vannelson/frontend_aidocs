import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { userService } from '../../services/userService'

export const fetchShareableUsers = createAsyncThunk('users/fetchShareableUsers', async (_, thunkAPI) => {
  try {
    const response = await userService.getShareableUsers()
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShareableUsers.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchShareableUsers.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchShareableUsers.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Unable to load users.'
      })
  },
})

export default usersSlice.reducer
