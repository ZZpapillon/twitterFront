import React, { useEffect } from 'react';
import { Button, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { Chat, ArrowRepeat, Upload, BarChart } from 'react-bootstrap-icons'; // Import icons
import { useDispatch, useSelector } from 'react-redux';
import tweetSlice from '../state/tweetSlice';
import { useNavigate } from 'react-router-dom';
import { setCurrentTweet, likeTweet, fetchAllTweets, fetchTweetById, retweet, unretweet, deleteTweet } from '../state/tweetSlice';
import '../css/Tweet.css';

const TweetCard = ({tweet, style}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Added line to fix the issue
  const currentUserId = useSelector((state) => state.user.currentUserId);
  const isRetweeted = tweet.retweets.includes(currentUserId);
  const replies = useSelector((state) => state.tweets.replies);
  const tweets = useSelector((state) => state.tweets.tweets);
  const numberOfReplies= tweets.filter(t => t.replyTo === tweet._id).length;





  const handleDeleteTweet = async (event, tweetId) => {
    event.stopPropagation(); // Prevent triggering the tweet click event
    dispatch(deleteTweet(tweetId));
  };

    const handleRetweet = async (event) => {
      event.stopPropagation();
    if (isRetweeted) {
      await dispatch(unretweet(tweet._id));
     
    } else {
      await dispatch(retweet(tweet._id));
      dispatch(fetchTweetById(tweet._id));
      
    }
    
  };
 
  const handleTweetClick = (tweet) => {
    dispatch(setCurrentTweet(tweet));
    console.log(tweet)
    navigate(`/home/tweet/${tweet._id}`);
  };
 const handleLike = async (event) => {
    event.stopPropagation(); // Prevent the tweet click event from firing
    await dispatch(likeTweet(tweet._id )); // Dispatch the like action
    dispatch(fetchTweetById(tweet._id)); // Force re-fetch or update of the tweet to reflect like changes
    
  };
    const handleUserClick = (event) => {
   event.stopPropagation();
    navigate(`/home/profile/${tweet.author._id}`);
  };

  

  return (
 <Card onClick={() => handleTweetClick(tweet)} style={{cursor: 'pointer', backgroundColor: 'black', color: 'white', border: '0.5px solid gray', borderRadius: '0px', ...style }}>
      <Card.Body style={{ padding: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ position: 'absolute',  top: '15px' }}>
            {/* Placeholder for profile image */}
            <img
              src={tweet.author.profilePicture}
              alt="Profile"
              style={{ borderRadius: '50%', width: '48px', height: '48px' }}
            />
          </div>
         <div style={{ flex: 1, marginLeft: '58.5px' }}>
            <div style={{ display: 'flex',  gap: '0.8rem', alignItems: 'start', }}>
              <div onClick={handleUserClick} style={{  fontSize: '0.9rem', fontWeight: 'bold' }}>{tweet.author.fullName}</div>
              <div style={{ fontSize: '0.8rem', color: 'grey' }}>{new Date(tweet.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              {currentUserId === tweet.author._id && (
        <Button variant='outline-dark' onClick={(e) => handleDeleteTweet(e, tweet._id)} style={{border: 'none', color: 'white', position: 'absolute', top: '0', right: '0', height: 'fit-content', width: 'fit-content', fontSize: '0.75rem' }}>
           X
        </Button>
      )}
            </div>
            
            <div className='tweetContent' >{tweet.content}</div>
                {(tweet.imageUrl || tweet.videoUrl) && (
      <div style={{ width: '100%', height: '100%', maxHeight: '2000px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', marginTop: '1rem' }}>
        {tweet.imageUrl && (
          <img src={tweet.imageUrl} alt="Tweet Media" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        )}
        {tweet.videoUrl && (
          <video style={{ width: '100%', height: '100%', objectFit: 'cover' }} controls>
            <source src={tweet.videoUrl} type="video/mp4" /> {/* Adjust the type if necessary */}
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    )}
      
          </div>
         </div>
       <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: '0.5rem' }}>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <Chat style={{ color: 'grey', fontSize: '1.008rem' }} /> {/* 0.84rem * 1.2 */}
    {numberOfReplies > 0 && <span style={{ marginLeft: '0.5rem', fontSize: '0.756rem', alignSelf: 'center' }}>{numberOfReplies}</span>} {/* 0.63rem * 1.2 */}
  </div>
  <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleRetweet}>
    <ArrowRepeat style={{ color: isRetweeted ? 'red' : 'grey', fontSize: '1.008rem', }} /> {/* Adjusted */}
  </div>
  <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleLike}>
    <FontAwesomeIcon icon={tweet.likes.includes(currentUserId) ? fasHeart : farHeart} color={tweet.likes.includes(currentUserId) ? 'red' : 'grey'} style={{ fontSize: '1.008rem' }} />
    {tweet.likes.length > 0 && <span style={{ marginLeft: '0.5rem', fontSize: '0.756rem', alignSelf: 'center' }}>{tweet.likes.length}</span>} {/* Adjusted */}
  </div>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <Upload style={{ color: 'grey', fontSize: '1.008rem' }} /> {/* Adjusted */}
  </div>
</div>
      </Card.Body>
    </Card>
     );
};

export default TweetCard;