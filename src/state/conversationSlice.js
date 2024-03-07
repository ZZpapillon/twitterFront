import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as apiService from '../apiService';

// Existing fetchConversations thunk
export const fetchConversations = createAsyncThunk(
  'conversations/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiService.getConversations();
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// New createConversation thunk
export const createConversation = createAsyncThunk(
  'conversations/createConversation',
  async (participants, { rejectWithValue }) => {
    try {
      const data = await apiService.startConversation(participants);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const conversationSlice = createSlice({
  name: 'conversations',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Handling createConversation
      .addCase(createConversation.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Assuming the backend returns the newly created conversation
        // Add the new conversation to the state
        state.items.push(action.payload);
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default conversationSlice.reducer;