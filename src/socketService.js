import io from 'socket.io-client';
import { store } from './state/Store';
import { messageReceived } from './state/messageSlice';

// Initialize the socket connection to the server
// Replace 'http://localhost:3000' with your server's URL
const socket = io('https://twitternode.onrender.com');

// Log when connected to the server
socket.on('connect', () => {
  console.log('Connected to the server via Socket.IO');
});

// Function to join a conversation
function joinConversation(conversationId) {
  console.log('Joining conversation:', conversationId);
  socket.emit('joinConversation', conversationId);
}

// Function to send a message
function sendMessage(messageData) {
  console.log('Sending message:', messageData);
  // Emit the message with all required data
  socket.emit('sendMessage', messageData);
}

// Listen for new messages and dispatch them to the Redux store
socket.on('newMessage', (message) => {
  console.log('New message received:', message);
  store.dispatch(messageReceived(message));
});

export { joinConversation,sendMessage,  socket };