import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user';
import allUsersReducer from './getAllUsersSlice';
import tweetsReducer from './tweetSlice';
import uiReducer from './uiSlice';
import conversationReducer from './conversationSlice';
import messageReducer from './messageSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    allUsers: allUsersReducer,
    tweets: tweetsReducer,
    ui: uiReducer,
    conversations: conversationReducer,
    messages: messageReducer,
  },
});

