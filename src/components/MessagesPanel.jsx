import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Card, Button, ListGroup, Image } from 'react-bootstrap';
import '../css/Messages.css';
import { useSelector, useDispatch } from 'react-redux';
import { fetchConversations, createConversation } from '../state/conversationSlice';
import { fetchMessages,  fetchAllMessages, messageReceived , postMessage} from '../state/messageSlice';
import { socket, joinConversation, sendMessage } from '../socketService';

const MessagesPanel = ({ isVisible, onClose }) => {
  const [filter, setFilter] = useState('');
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const allUsers = useSelector((state) => state.allUsers.users);
  const currentUserId = useSelector((state) => state.user.currentUserId);
  const messages = useSelector((state) => state.messages.items);
  const lastMessageByConversation = useSelector((state) => state.messages.lastMessageByConversation);
  const messagesEndRef = useRef(null);
  const conversations = useSelector((state) => state.conversations.items);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [hideRecentMessage, setHideRecentMessage] = useState(false);
//   const [fetchedConversations, setFetchedConversations] = useState(new Set());
const scrollToBottom = () => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight - messagesEndRef.current.clientHeight;
  }
};









 useEffect(() => {
    if (isVisible) {
      dispatch(fetchConversations());
      dispatch(fetchAllMessages());
      console.log('da', messages)
    
    }
  }, [dispatch, isVisible]);

  useEffect(() => {
  if (isVisible ) {
   
    conversations.forEach(conversation => {
      dispatch(fetchMessages(conversation._id));
    });
  }
}, [isVisible, conversations, selectedConversation, dispatch]);
  




useEffect(() => {
    if (selectedConversation) {
        joinConversation(selectedConversation._id);
      dispatch(fetchMessages(selectedConversation._id));
      scrollToBottom();
    }
  }, [selectedConversation, dispatch, ]);
 

  
  

  // Filter messages for the selected conversation
   const filteredMessages = useMemo(() => {
    if (!selectedConversation) return [];
    return messages.filter(msg => msg.conversation === selectedConversation._id);
  }, [messages, selectedConversation]);

  const lastMessageMap = useMemo(() => {
    const map = {};
    messages.forEach(msg => {
      if (!map[msg.conversation] || new Date(map[msg.conversation].createdAt) < new Date(msg.createdAt)) {
        map[msg.conversation] = msg;
      }
    });
    return map;
  }, [messages]);

 
useEffect(() => {
  scrollToBottom();
}, [filteredMessages, selectedConversation]);

 

  const filteredUsers = allUsers.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return fullName.includes(filter.toLowerCase()) && user._id !== currentUserId;
  });

  const handleUserSelect = async (user) => {
    const existingConversation = conversations.find(c => c.participants.some(p => p._id === user._id));
    if (!existingConversation) {
      await dispatch(createConversation([currentUserId, user._id]));
      await dispatch(fetchConversations());
    } else {
      setSelectedConversation(existingConversation);
    }
    setFilter('');
  };
  const handleSelectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    await dispatch(fetchMessages(conversation._id));
  };

 const handleSendMessage = async () => {
  if (message.trim() && selectedConversation) {
   
    const messageData = {
      content: message,
      conversationId: selectedConversation._id,
      senderId: currentUserId, // Assuming you have the sender's ID available
      
    };
    sendMessage(messageData);

    setHideRecentMessage(true); // Hide the message initially
    setTimeout(() => setHideRecentMessage(false), 1000); 

   

    await dispatch(fetchMessages(selectedConversation._id));

    setMessage('');
  }
};
  const getConversationDetails = (conversation, currentUserId) => {
  // Filter out the current user
  const otherParticipants = conversation.participants.filter(participant => participant._id !== currentUserId);
  

  // Get names
  const participantNames = otherParticipants
    .map(participant => `${participant.firstName} ${participant.lastName}`)
    .join(', ');

  // Get profile pictures (assuming the first one for simplicity)
  const profilePicture = otherParticipants.length ? otherParticipants[0].profilePicture : null;

  return { participantNames, profilePicture };
};

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes}`;
  };





  const panelClasses = `messages-panel ${isVisible ? 'show' : ''}`;

  return (
    <div className={panelClasses} style={{ borderRight: '1px solid gray' }}>
      <Card className="text-white bg-black border-0">
        <Card.Header className="bg-black border-bottom border-primary">
        
        <Card.Title style={{ display: 'flex', justifyContent: 'start', marginTop: '10px', marginLeft: '4.5vw', }}>
  {selectedConversation ? <Image className='imageHeader me-2'  src={`${getConversationDetails(selectedConversation, currentUserId).profilePicture}`} style={{  width: '30px', height: '30px' }} roundedCircle /> : 'Messages'}
  <div className="mt-1">{selectedConversation ? `${getConversationDetails(selectedConversation, currentUserId).participantNames}` : '' }</div>
    <Button variant="outline-secondary" size="sm" onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px' }}>Close</Button>
     {selectedConversation && <Button variant="outline-secondary" size="sm" onClick={() => setSelectedConversation(null)} style={{ position: 'absolute', top: '15px', left: '15px' }}>Back</Button>}
</Card.Title>
        </Card.Header>
        <Card.Body style={{ padding: '0px'  }}>
          {selectedConversation ? (
            <div style={{ paddingRight: '5px' }} >
   <div>
 <div className="messages-container" ref={messagesEndRef}>
  {filteredMessages.map((msg, index) => (
    <div key={index} 
    className={`message-bubble ${msg.sender._id !== currentUserId ? 'other-user-message' : ''}`} 
          style={{ visibility: (hideRecentMessage && index === filteredMessages.length - 1) ? 'hidden' : 'visible' }}>
    <span className="message-content">{msg.content}</span>
      <span className="message-time">{formatTimestamp(msg.createdAt)}</span>
    </div>
  ))}
 
</div>

              
              <div className="d-flex align-items-center mt-2">
               <input
                 type="text"
                 placeholder="Type a message..."
                 value={message}
                 onChange={(e) => setMessage(e.target.value)}
                 onKeyPress={(e) => {
      if (e.key === 'Enter') {
        handleSendMessage();
        e.preventDefault(); // Prevent the default action to avoid form submission or newline
      }
    }}
    className="form-control sendInput me-1"
  />
                <Button variant='outline-primary' onClick={handleSendMessage}>Send</Button>
              </div>
            </div>
            </div>
          ) : (
            <>
              <input type="text" placeholder="Search for users..." value={filter} onChange={(e) => setFilter(e.target.value)} className="form-control findInput sendInput  mt-3" />
             {filter && (
  <ListGroup variant="flush" className='listUsers'>
    {filteredUsers.map(user => (
      <ListGroup.Item key={user._id} onClick={(e) => {e.preventDefault(); handleUserSelect(user);}} className="cursor-pointer" style={{ backgroundColor: 'black', color: 'white', border: 'none' }}>
       <Image className='me-2 mb-1' src={user.profilePicture} style={{ width: '30px', height: '30px' }} roundedCircle />
      {user.firstName} {user.lastName}
      </ListGroup.Item>
    ))}
  </ListGroup>
)}
                
  <div className="conversation-list">         
{conversations
    .slice() // Create a shallow copy to avoid mutating the original array
    .sort((a, b) => {
      const lastMessageA = lastMessageByConversation[a._id];
      const lastMessageB = lastMessageByConversation[b._id];

      // Check if either conversation does not have a last message
      if (!lastMessageA && lastMessageB) return -1;
      if (lastMessageA && !lastMessageB) return 1;

      // If both conversations have last messages, sort by timestamp, most recent first
      const timeA = new Date(lastMessageA?.createdAt).getTime();
      const timeB = new Date(lastMessageB?.createdAt).getTime();

      return timeB - timeA; // For descending order
    })
    .map(conversation => {
  const { participantNames, profilePicture } = getConversationDetails(conversation, currentUserId);
    //    dispatch(fetchMessages(conversation._id));
        const lastMessage = lastMessageByConversation[conversation._id];

  const displayText = lastMessage ? lastMessage.content : "Start chatting...";
  const displayTime = lastMessage ? formatTimestamp(lastMessage.createdAt) : '';

  

  return (
    
    <div key={conversation._id} onClick={() => handleSelectConversation(conversation)} className="conversation-entry cursor-pointer">
      <Image src={profilePicture} style={{ width: '50px', height: '50px' }} roundedCircle />
      <div className="conversation-info">
        <div className="participant-names">{participantNames}</div>
        <div className="last-message">{displayText}</div>
      </div>
      <div className="last-message-time">{displayTime}</div>
    </div>
   
  );
})}
</div>   
              
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default MessagesPanel;