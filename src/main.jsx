import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from './App.jsx'
import Login from './Login.jsx'
import Profile from './components/Profile.jsx';
import MainFeed from './components/MainFeed.jsx';
import TweetUrl from './components/TweetUrl.jsx';
import { store } from './state/Store.js';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import './socketService.js';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
    {
    path: "home",
    element: <App />,
    children: [
      { index: true, element: <MainFeed /> }, // Default child route
      { path: "profile/:userId", element: <Profile /> },
      { path: "tweet/:tweetId", element: <TweetUrl /> },
      // Add other child routes here
    ],
  },
]);








ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)