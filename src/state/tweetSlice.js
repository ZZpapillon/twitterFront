import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as apiService from '../apiService';

// Async thunk for fetching all tweets
export const fetchAllTweets = createAsyncThunk(
  'tweets/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getAllTweets();
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for creating a tweet
export const createNewTweet = createAsyncThunk(
  'tweets/create',
  async ({ tweetData, file }, { rejectWithValue }) => {
    try {
      const response = await apiService.createTweet(tweetData, file);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const fetchTweetById = createAsyncThunk(
  'tweets/fetchById',
  async (tweetId, { rejectWithValue }) => {
    try {
      const response = await apiService.getTweetById(tweetId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for liking a tweet
export const likeTweet = createAsyncThunk(
  'tweets/like',
  async (tweetId, {  rejectWithValue }) => {
    try {
      const response = await apiService.likeTweet(tweetId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const retweet = createAsyncThunk(
  'tweets/retweet',
  async (tweetId, { rejectWithValue }) => {
    try {
      const response = await apiService.retweet(tweetId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const unretweet = createAsyncThunk(
  'tweets/unretweet',
  async (tweetId, {  rejectWithValue }) => {
    try {
     
      const response = await apiService.unretweet(tweetId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const postReply = createAsyncThunk(
  'tweets/postReply',
  async ({ tweetId, replyData, file }, { rejectWithValue }) => {
    try {
      const response = await apiService.postReply(tweetId, replyData, file);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for fetching replies
export const getReplies = createAsyncThunk(
  'tweets/getReplies',
  async (tweetId, { rejectWithValue }) => {
    try {
      const response = await apiService.getReplies(tweetId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteTweet = createAsyncThunk(
  'tweets/delete',
  async (tweetId, { rejectWithValue }) => {
    try {
      const response = await apiService.deleteTweet(tweetId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  tweets: [],
  
  currentTweet: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  replies: [],
};

const tweetsSlice = createSlice({
  name: 'tweets',
  initialState,
  reducers: {
    setCurrentTweet: (state, action) => {
      state.currentTweet = action.payload;
    },
    clearCurrentTweet: (state) => {
      state.currentTweet = null;
    },
    // Other reducers can go here
  },
  extraReducers: (builder) => {
    builder
       
      .addCase(fetchAllTweets.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllTweets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tweets = action.payload;
      })
      .addCase(fetchAllTweets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createNewTweet.fulfilled, (state, action) => {
        state.tweets.push(action.payload);
      })
      .addCase(fetchTweetById.fulfilled, (state, action) => {
  const index = state.tweets.findIndex(tweet => tweet._id === action.payload._id);
  if (index !== -1) {
    // Replace the tweet with the updated one from the action payload
    state.tweets = [
      ...state.tweets.slice(0, index),
      action.payload,
      ...state.tweets.slice(index + 1)
    ];
  } else {
    // Optionally handle the case where the tweet isn't found, such as adding it to the array
    state.tweets.push(action.payload);
  }
})
      .addCase(likeTweet.fulfilled, (state, action) => {
      const { tweetId, likes } = action.payload; // Assuming the payload includes the tweetId and the updated likes array
      const index = state.tweets.findIndex(tweet => tweet._id === tweetId);
      if (index !== -1) {
        state.tweets[index].likes = likes;
      }
    })
      // You can add more cases for other async actions here
       .addCase(retweet.fulfilled, (state, action) => {
        // Assuming action.payload contains the updated tweet
        // Find the tweet and update it
        const index = state.tweets.findIndex(tweet => tweet._id === action.payload._id);
        if (index !== -1) {
          state.tweets[index] = action.payload;
        }
      })
   .addCase(unretweet.fulfilled, (state, action) => {
  const index = state.tweets.findIndex(tweet => tweet._id === action.payload._id);
  if (index !== -1) {
    // Merge the updated data with the existing tweet data to preserve author details
    state.tweets[index] = {
      ...state.tweets[index],
      ...action.payload,
      author: state.tweets[index].author // Preserves the existing author object
    };
  }
})
// Handle postReply
      .addCase(postReply.fulfilled, (state, action) => {
        // Assuming you want to add the reply to the state, adjust as needed
        state.replies.push(action.payload);
      })
      .addCase(postReply.rejected, (state, action) => {
        // Handle error, maybe set an error state
        state.error = action.payload;
      })
      // Handle getReplies
      .addCase(getReplies.fulfilled, (state, action) => {
        // Assuming you have a replies array in your state to hold fetched replies
        state.replies = action.payload;
      })
      .addCase(getReplies.rejected, (state, action) => {
        // Handle error
        state.error = action.payload;
      })
      .addCase(deleteTweet.fulfilled, (state, action) => {
        // Remove the deleted tweet from state
        state.tweets = state.tweets.filter(tweet => tweet._id !== action.meta.arg);
      })
      
  }
});
export const { setCurrentTweet, clearCurrentTweet } = tweetsSlice.actions;
export default tweetsSlice.reducer;

