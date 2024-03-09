import React, { useState, useEffect,useRef } from 'react';
import { Button, InputGroup, FormControl, Card, Image, Tabs, Tab } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImage } from '@fortawesome/free-solid-svg-icons';
import '../css/MainFeed.css';
import TweetCard from './Tweet';
import { useDispatch, useSelector } from 'react-redux';
import { createNewTweet, fetchAllTweets,  } from '../state/tweetSlice';
import { fetchUserById } from '../state/user';
const MainFeed = () => {
  const [tweetContent, setTweetContent] = useState('');
  const [key, setKey] = useState('forYou');
  const dispatch = useDispatch();
  const currentUserId = useSelector((state) => state.user.currentUserId);
  const currentUserInfo = useSelector((state) => state.user.currentUserInfo);
  const tweets = useSelector((state) => state.tweets.tweets);
  const status = useSelector((state) => state.tweets.status);
  const tweetInputRef = useRef(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isImage, setIsImage] = useState(false);


   useEffect(() => {
    // Fetch user info when the component mounts
    dispatch(fetchUserById(currentUserId));
  }, [dispatch, currentUserId]);

  useEffect(() => {
    if (key === 'following') {
      // Fetch user info again when "Following" tab is selected
      dispatch(fetchUserById(currentUserId));
    }
  }, [key, dispatch, currentUserId]);
 
const handleFileInputChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setSelectedFile(file); // Store the file in state

  const isImageFile = file.type.startsWith('image/');
    setIsImage(isImageFile); 

  const fileUrl = URL.createObjectURL(file);
    setImagePreviewUrl(fileUrl);
};
const clearImagePreview = () => {
  setImagePreviewUrl(null); // Clear the image preview URL state
  
    setSelectedFile(null);
  // Reset the file input
  document.getElementById('file-input').value = '';
};

  useEffect(() => {
    const focusPostForm = () => {
      if (tweetInputRef.current) {
        tweetInputRef.current.focus();
      }
    };

    window.addEventListener('focusPostForm', focusPostForm);

    return () => {
      window.removeEventListener('focusPostForm', focusPostForm);
    };
  }, []);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAllTweets());
      
    }
  }, [status, dispatch]);
  
 const handleSubmit = (e) => {
  e.preventDefault();
  if (!tweetContent.trim() && !selectedFile) return; // Ensure there's content or a file before proceeding

  // Prepare the tweet data
  const tweetData = {
    content: tweetContent.trim(),
    authorId: currentUserId,
  };

  // Dispatch the action with both tweetData and the file
  dispatch(createNewTweet({ tweetData, file: selectedFile }));

  // Reset the state to clear the form and selected file
  setTweetContent('');
  setSelectedFile(null);
  setImagePreviewUrl(null);
  setIsImage(false);
  document.getElementById('file-input').value = ''; // Reset the file input
};


    
  return (
    <>
    <div className='sticky-div d-flex justify-content-center'>
        <Tabs defaultActiveKey="forYou" className="mainfeed-tabs" fill onSelect={(k) => setKey(k)}  >
          <Tab eventKey="forYou" title="For You" className="mx-2">
            {/* Content for "For You" tab */}
          </Tab>
          <Tab eventKey="following" title="Following"  className="mx-2">
            {/* Content for "Following" tab */}
          </Tab>
        </Tabs>
      </div>
     <div className='content-container'>
      <div className='post-container' style={{borderBottom: '0.5px solid grey', position: 'relative'}}>

  
       
        
      <div className="input-row">
        <Image src={currentUserInfo && currentUserInfo.profilePicture ? currentUserInfo.profilePicture : '/path/to/placeholder/image.jpg'} roundedCircle  style={{width: '50px', height: '50px', objectFit: 'cover'}}/>
        <FormControl
          as="textarea"
          ref={tweetInputRef}
          placeholder="What's happening?"
          aria-label="What's happening?"
          style={{resize: 'none'}}
          value={tweetContent} // Bind the textarea value to the tweetContent state
          onChange={(e) => setTweetContent(e.target.value)}
        />
        
      </div>
       <div style={{ position: 'absolute', bottom: '30px', left: '6.2vw' }}>
         <label htmlFor="file-input" >
          <FontAwesomeIcon icon={faFileImage} style={{ cursor: 'pointer', color: '#007bff' }} />
        </label>
        <input id="file-input" type="file" accept="image/*,video/*" style={{ display: 'none' }} onChange={handleFileInputChange}  />
        </div>
      {imagePreviewUrl && (
  <div style={{ position: 'relative', marginLeft: '70px', marginTop: '20px', width: '150px', height: '150px' }}>
    {isImage ? (
      <img src={imagePreviewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    ) : (
      <video style={{ width: '100%', height: '100%', objectFit: 'cover' }} controls>
        <source src={imagePreviewUrl} type="video/mp4" /> {/* Assuming the video is in mp4 format; adjust if necessary */}
        Your browser does not support the video tag.
      </video>
    )}
    <button onClick={clearImagePreview} style={{ position: 'absolute', top: '0', right: '0', cursor: 'pointer', background: 'red', color: 'white', border: 'none', borderRadius: '50%', padding: '0 5px' }}>
      X
    </button>
  </div>
)}
      <div className="button-row">
        
        <Button onClick={handleSubmit} variant="primary" id="button-tweet" disabled={!tweetContent.trim() && !imagePreviewUrl}>
         Post
        </Button>
       
      </div>
    </div>
      <div className="feed">
        {key === 'forYou' && (
    <>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'succeeded' &&
        tweets
          .filter(tweet => !tweet.replyTo)
          .slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((tweet) => <TweetCard key={tweet._id} tweet={tweet} />)}
      {status === 'failed' && <p>Failed to load tweets.</p>}
    </>
  )}
  {key === 'following' && (
          <>
            {/* Implement logic to display tweets for "Following" tab */}
            {status === 'loading' && <p>Loading...</p>}
            {status === 'succeeded' &&
              
              tweets
                .filter(tweet => currentUserInfo?.following?.includes(tweet.author._id)) // Placeholder condition
                .filter(tweet => !tweet.replyTo)
                .slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((tweet) => <TweetCard key={tweet._id} tweet={tweet} />)}
            {status === 'failed' && <p>Failed to load tweets.</p>}
          </>
        )}
      </div>
      </div>
    </>
  );
};

export default MainFeed;