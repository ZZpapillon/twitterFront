import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as apiService from '../apiService';


// Async thunk for fetching messages
export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (conversationId, { rejectWithValue }) => {
    try {
      const data = await apiService.getMessages(conversationId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for sending a message via sockets
export const postMessage = createAsyncThunk(
  'messages/postMessage',
  async ({ conversationId, content, senderId }, thunkAPI) => {
    try {
      // Using a callback to handle the response from the socket emit
      // return new Promise((resolve, reject) => {
      //   sendMessage({ conversationId, content, senderId }, (response) => {
      //     if (response.success) {
      //       resolve(response.message); // Resolve with the message if successful
      //     } else {
      //       reject(thunkAPI.rejectWithValue(response.error)); // Reject with the error if not successful
      //     }
      //   });
      // });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchAllMessages = createAsyncThunk(
  'messages/fetchAllMessages',
  async ( { rejectWithValue }) => {
    try {
      const data = await apiService.getAllMessages();
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// The slice
export const messageSlice = createSlice({
  name: 'messages',
  initialState: {
    items: [],
    lastMessageByConversation: {},
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    // Reducer to manually add a message (e.g., for optimistic UI updates)
    addMessage: (state, action) => {
      // Ensure no duplicate messages
      const doesExist = state.items.some(msg => msg.id === action.payload.id);
      if (!doesExist) {
        state.items.push(action.payload);
      }
    },
     messageReceived: (state, action) => {
      // Check for duplicate messages
    const index = state.items.findIndex(msg => msg._id === action.payload._id);
    if (index === -1) {
      // If the message doesn't exist, add it to the items array
      state.items.push(action.payload);
    }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        // Assuming action.payload is an array of messages
        // Replace existing messages with the fetched ones
        const messages = action.payload;
  if (messages.length > 0) {
    const conversationId = messages[0].conversation; // Assuming each message has a 'conversation' field with the conversation ID
    const lastMessage = messages[messages.length - 1]; // Assuming the last message is the most recent
    state.lastMessageByConversation[conversationId] = lastMessage;
  }
  state.items = messages;
  state.status = 'succeeded';
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(postMessage.pending, (state) => {
        // Optionally handle pending state for sending a message
      })
      .addCase(postMessage.fulfilled, (state, action) => {
        // Add the new message if it doesn't already exist
        const doesExist = state.items.some(msg => msg.id === action.payload.id);
        if (!doesExist) {
          state.items.push(action.payload);
        }
      })
      .addCase(postMessage.rejected, (state, action) => {
        // Handle message send failure
        state.error = action.payload;
      })
       .addCase(fetchAllMessages.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(fetchAllMessages.fulfilled, (state, action) => {
      // Assuming action.payload is an array of messages
      // Replace existing messages with the fetched ones
      state.items = action.payload;
      state.status = 'succeeded';
    })
    .addCase(fetchAllMessages.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    })
  },
});

// Export the reducer's actions and reducer
export const { addMessage, messageReceived } = messageSlice.actions;
export default messageSlice.reducer;

