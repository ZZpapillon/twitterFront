import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, FormControl, Button, Image } from 'react-bootstrap';
import { ArrowLeft, Upload } from 'react-bootstrap-icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTweetById, getReplies, postReply, fetchAllTweets, likeTweet, } from '../state/tweetSlice';
import TweetCard from './Tweet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImage } from '@fortawesome/free-solid-svg-icons';



const TweetUrl = () => {
  const { tweetId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [replyContent, setReplyContent] = useState('');
  const currentUserInfo = useSelector((state) => state.user.currentUserInfo);
  const tweet = useSelector(state => state.tweets.tweets.find(tweet => tweet._id === tweetId));
  const replies = useSelector(state => state.tweets.replies) || [];
  const rawTweets = useSelector(state => state.tweets.tweets) || [];
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [isImage, setIsImage] = useState(false);

   const tweets = useMemo(() => rawTweets, [JSON.stringify(rawTweets)]);


useEffect(() => {
  const fetchData = async () => {
    // Example of checking before dispatching
   

      dispatch(fetchAllTweets());
  dispatch(fetchTweetById(tweetId));
  dispatch(getReplies(tweetId));
        
  }

  fetchData();
}, [tweetId, refreshKey, tweets,  dispatch])
   
   
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file); // Store the file in state

    const isImageFile = file.type.startsWith('image/');
    setIsImage(isImageFile); // Update state based on file type

    const fileUrl = URL.createObjectURL(file);
    setImagePreviewUrl(fileUrl); // Set the image preview URL
  };

  const clearImagePreview = () => {
    setImagePreviewUrl(null); // Clear the image preview URL state
    setSelectedFile(null); // Clear the selected file state
    setIsImage(false); // Reset the isImage state
    if (document.getElementById('file-input-reply')) {
      document.getElementById('file-input-reply').value = ''; // Reset the file input if it exists
    }
  };

 

   
 
  


  const handleReplyChange = (e) => {
    setReplyContent(e.target.value);
  };

  const postReplyHandler = async () => {
    console.log('Before posting reply:', replies);
    if (!replyContent.trim()) return;
    await dispatch(postReply({ tweetId, replyData: { content: replyContent }, file: selectedFile }));
    setReplyContent('');
    await dispatch(getReplies(tweetId)); // Refresh replies
    setRefreshKey(prevKey => prevKey + 1); // Increment refreshKey to force re-render
      setSelectedFile(null);
  setImagePreviewUrl(null);
  if (document.getElementById('file-input-reply')) {
      document.getElementById('file-input-reply').value = ''; // Reset the file input if it exists
    }
};

  if (!tweet) {
    return <p>Loading tweet...</p>;
  }
  

  return (
   <>
    <Row className='profile-header text-white p-3' style={{borderBottom: '0.5px solid gray'}}>
      <Col  className="d-flex justify-content-start align-items-start">
        <ArrowLeft size={28} onClick={() => navigate(-1)} style={{cursor: 'pointer'}} />
         <Col >
        <h5 className="mb-0 ms-3 ">Post</h5>
      </Col>
      </Col>
     
    </Row>
    <div className='tweetUrl-container'>
      <TweetCard tweet={tweet} />
    
    
    <div className='post-container' style={{height: 'fit-content' , borderBottom: '0.5px solid gray', position: 'relative'}}>
      <div className="input-row">
        <Image className='mb-3' src={`https://twitternode.onrender.com${currentUserInfo.profilePicture}`} roundedCircle  style={{width: '50px', height: '50px', objectFit: 'cover'}}/>
        <FormControl
          as="textarea"
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          placeholder="Post your reply"
          aria-label="Post your reply"
          style={{resize: 'none'}}
        />
      </div>

      <div style={{ position: 'absolute', bottom: '30px', left: '6.2vw' }}>
        <label htmlFor="file-input-reply">
          <FontAwesomeIcon icon={faFileImage} style={{ cursor: 'pointer', color: '#007bff' }} />
        </label>
        <input id="file-input-reply" type="file" accept="image/*,video/*" style={{ display: 'none' }} onChange={handleFileInputChange} />
      </div>

      {imagePreviewUrl && (
        <div style={{ position: 'relative', left: '70px', bottom: '30px', width: '150px', height: '150px' }}>
          {isImage ? (
            <img src={imagePreviewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <video style={{ width: '100%', height: '100%', objectFit: 'cover' }} controls>
              <source src={imagePreviewUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          <button onClick={clearImagePreview} style={{ position: 'absolute', top: '0', right: '0', cursor: 'pointer', background: 'red', color: 'white', border: 'none', borderRadius: '50%', padding: '0 5px' }}>
            X
          </button>
        </div>
      )}
      <div className="button-row" style={{position: 'relative', bottom: '40px', right: '0'}}>
        <Button variant="primary" onClick={postReplyHandler} disabled={!replyContent.trim() && !imagePreviewUrl} style={{borderRadius: '20px'}}>
          Post
        </Button>
      </div>
    </div>
    <div key={refreshKey} className="replies-container">
      {replies.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((reply, index) => (
        reply.author && reply.author.fullName ? (
          <TweetCard key={reply._id} tweet={reply} />
        ) : (
          <div key={`loading-${index}`}>Loading...</div>
        )
      ))}
    </div>
    </div>
  </>
  );
};

export default TweetUrl;