import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUser as fetchUser } from '../apiService';
import { updateUser as apiUpdateUser } from '../apiService'; // Renamed for clarity
import { followUser, unfollowUser } from '../apiService';
import { getAllUsers } from '../apiService';

// Async thunk for updating user data
export const updateUser = createAsyncThunk(
  'user/update',
  async (userData, thunkAPI) => {
    try {
      const response = await apiUpdateUser(userData); // Use the renamed function
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for fetching user data by ID
export const fetchUserById = createAsyncThunk(
  'user/fetchById',
  async (userId, thunkAPI) => {
    try {
      const response = await fetchUser(userId);
      return { ...response, userId };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const fetchAllUsers = createAsyncThunk(
  'user/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllUsers(); // Assuming getAllUsers is a function in your apiService
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// Async thunk for following a user
export const followUserThunk = createAsyncThunk(
  'user/follow',
  async ({ userId, followId }, { rejectWithValue }) => {
    try {
      const response = await followUser(userId, followId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for unfollowing a user
export const unfollowUserThunk = createAsyncThunk(
  'user/unfollow',
  async ({ userId, followId }, { rejectWithValue }) => {
    try {
      const response = await unfollowUser(userId, followId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUserId: null,
    currentUserInfo: null,
    users: {},
    allUsers: [],
    error: null,
    status: 'idle',
  },
  reducers: {
    setCurrentUserId(state, action) {
      state.currentUserId = action.payload;
    },
    // Other reducers...
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { userId } = action.payload;
        if (userId === state.currentUserId) {
          state.currentUserInfo = action.payload;
        } else {
          state.users[userId] = action.payload;
        }
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Inside your userSlice's extraReducers
    .addCase(fetchAllUsers.fulfilled, (state, action) => {
  // Assuming the action.payload is an array of all user objects
  // You can adjust this logic based on your actual data structure
      state.allUsers = action.payload;
   })
      .addCase(updateUser.fulfilled, (state, action) => {
        // Assuming the response includes the updated user data
        // Update currentUserInfo if the updated user is the current user
        if (action.payload.userId === state.currentUserId) {
          state.currentUserInfo = action.payload;
            state.users[action.payload.userId] = action.payload;
        }
        // Optionally, update the users object too
      
        state.status = 'succeeded';
      })
      .addCase(followUserThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(followUserThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Update your state based on the follow action
        // For example, add the followed user's ID to the current user's following list
      })
      .addCase(followUserThunk.rejected, (state, action) => {
        state.status = 'failed';
        // Optionally, handle the error in your state
      })
      .addCase(unfollowUserThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(unfollowUserThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Update your state based on the unfollow action
        // For example, remove the unfollowed user's ID from the current user's following list
      })
      .addCase(unfollowUserThunk.rejected, (state, action) => {
        state.status = 'failed';
        // Optionally, handle the error in your state
      });
  },
});

export const { setCurrentUserId } = userSlice.actions;

export default userSlice.reducer;