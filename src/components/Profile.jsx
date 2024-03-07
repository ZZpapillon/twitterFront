import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Image, Button, Tabs, Tab, Card } from 'react-bootstrap';
import { ArrowLeft, } from 'react-bootstrap-icons';
import TweetCard from './Tweet';
import '../css/Profile.css';
import { useSelector,useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchUserById, followUserThunk, unfollowUserThunk } from '../state/user';
import ProfileUpdateModal from './ProfileUpdateModal';
import { fetchAllTweets } from '../state/tweetSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import FollowersModal from './FollowersModal';
import FollowingModal from './FollowingModal';
import { setActiveProfileTab } from '../state/uiSlice';


const Profile = () => {
   const location = useLocation();
   
   const [userLikes, setUserLikes] = useState([]);
   const [userRetweets, setUserRetweets] = useState([]);
   const [groupedReplies, setGroupedReplies] = useState({});
      const navigate = useNavigate();
      const { userId } = useParams(); // Get userId from URL
      const dispatch = useDispatch();
      const currentUserInfo = useSelector((state) => state.user.currentUserInfo);
      const currentUserId = useSelector((state) => state.user.currentUserId);
      const users = useSelector((state) => state.user.users);
      const tweets = useSelector((state) => state.tweets.tweets);
      const [isFollowing, setIsFollowing] = useState(false);
    
      const status = useSelector((state) => state.tweets.status);
      const [showProfileUpdateModal, setShowProfileUpdateModal] = useState(false);

      const [showFollowersModal, setShowFollowersModal] = useState(false);
      const [showFollowingModal, setShowFollowingModal] = useState(false);

      
     const activeTab = useSelector((state) => state.ui.activeProfileTab); 
    useEffect(() => {
    dispatch(setActiveProfileTab(activeTab));
  }, [activeTab, dispatch]);

  const handleSelect = (k) => {
    console.log("Switching to tab:", k);
    
    dispatch(setActiveProfileTab(k)); // Update Redux state
 
  };


const handleFollowToggle = (userId) => {
    console.log("Toggling follow status for user:", userId);
    // Here you would dispatch an action to follow/unfollow the user
    // and then fetch the updated profile info to reflect the change.
  };
   // Check if the current user is already following the profile user
 useEffect(() => {
  // Ensure currentUserInfo is not null before accessing its properties
  if (currentUserInfo) {
    const isUserFollowing = currentUserInfo.following.includes(userId);
    setIsFollowing(isUserFollowing);
  } else {
    // Handle the case where currentUserInfo is null
    // For example, you might want to set isFollowing to false or perform some other action
    setIsFollowing(false);
  }
}, [currentUserInfo, userId]);

  // Handle follow/unfollow actions
  const handleFollowClick = async () => {
    if (isFollowing) {
      await dispatch(unfollowUserThunk({ userId: currentUserId, followId: userId }));
    } else {
      await dispatch(followUserThunk({ userId: currentUserId, followId: userId }));
    }
    setIsFollowing(!isFollowing); // Optimistically update the follow status
    dispatch(fetchUserById(userId));
  };









      useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAllTweets());
    }
  }, [status, dispatch]);

  useEffect(() => {
    // Filter tweets retweeted by the current profile's user
    const retweets = tweets.filter(tweet => tweet.retweets.includes(userId));
    setUserRetweets(retweets);
    const likedTweets = tweets.filter(tweet => tweet.likes.includes(userId));
    setUserLikes(likedTweets);
  }, [tweets, userId]);
  
    const userTweets = tweets.filter(tweet => tweet.author._id === userId);


  useEffect(() => {
    if (userId && !users[userId] && userId !== currentUserId) {
      console.log('Profile: Fetching user by ID', userId);
      dispatch(fetchUserById(userId));
    }
  }, [userId, currentUserId, users, dispatch, navigate]);

   useEffect(() => {
    // Assuming fetchUserById is an action that fetches user data and updates the global state
    dispatch(fetchUserById(userId));
  }, [userId, dispatch, location]); 

  const profileInfo = userId === currentUserId ? currentUserInfo : users[userId];



  return (
    <>
      <Row className='profile-header text-white pt-3 pb-0 dflex justify-content-start align-items-start'>
        <Col  className="d-flex justify-content-center align-items-start ms-3">
           <ArrowLeft className='arrow' size={28} onClick={() => navigate(-1)} style={{cursor: 'pointer'}} />
           <Col className='ms-3'>
          <h5 className="mb-0">{profileInfo ? (profileInfo.firstName + " " + profileInfo.lastName) : 'Loading...'}</h5>
          <p style={{fontSize: 'smaller', color: 'gray'}}>{userTweets.filter(tweet => !tweet.replyTo).length} posts</p>
        </Col>
        </Col>
        
      </Row>
      <div className='profile-container'>
    <Image src={profileInfo && profileInfo.backgroundPicture ? `https://twitternode.onrender.com${profileInfo.backgroundPicture}` : "https://via.placeholder.com/100"} style={{height: '200px', width: '100%'}} alt="Background" fluid />
      
      

     
      <Row className="align-items-center" style={{height: 'fit-content', backgroundColor: '#000', padding: '0px 0', margin: '0 0 0 0' }}>
        <Col className='ps-5' style={{margin: '-80px 0 0 -5px'}}>
          <Image src={profileInfo && profileInfo.profilePicture ? `https://twitternode.onrender.com${profileInfo.profilePicture}` : "https://via.placeholder.com/150"} roundedCircle style={{ height: '150px', width: '150px', border: '3px solid black' }} />
       
          <h4 className='mt-2 mb-3 text-white'>{profileInfo ? (profileInfo.firstName + " " + profileInfo.lastName) : 'Loading...'}</h4>
          <div className='text-white mt-3' style={{ whiteSpace: 'pre-wrap' }}>{profileInfo ? profileInfo.bio : 'Loading...'}</div>
          <p className=' mt-4' style={{color: '#6c757d'}}>Joined {currentUserInfo ? (new Date(currentUserInfo.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })) : 'Loading...'}</p>
          <Row className='mb-3'>
        
    <div className='rowFollowers'>
  <span
    onClick={() => setShowFollowingModal(true)}
    style={{ color: '#6c757d', cursor: 'pointer', marginRight: '10px' }}
  >
    <span style={{ color: 'white', marginRight: '2px' }}>{profileInfo?.following?.length || 0}</span> Following
  </span>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <span
    onClick={() => setShowFollowersModal(true)}
    style={{ color: '#6c757d', cursor: 'pointer' }}
  >
    <span style={{ color: 'white', marginRight: '2px' }}>{profileInfo?.followers?.length || 0}</span> Followers
  </span>
</div>
 <FollowersModal
        show={showFollowersModal}
        onHide={() => setShowFollowersModal(false)}
        followers={profileInfo?.followers || []}
        accountId={profileInfo?._id}
         
      />
       <FollowingModal
        show={showFollowingModal}
        onHide={() => setShowFollowingModal(false)}
        following={profileInfo?.following || []}
        accountId={profileInfo?._id}
        handleFollowToggle={handleFollowToggle}
       
      />
         </Row>
        </Col>
        <Col>
         {/* Conditionally render the Edit Profile button */}
      {currentUserId && (!userId || userId === currentUserId) && (
          <Button onClick={() => setShowProfileUpdateModal(true)} variant="outline-primary" style={{ position: 'relative', right: '-8vw', top: '-60px' }}>Edit Profile</Button>
            
      )}
      {currentUserId && currentUserId !== userId && (
        <Button
          onClick={handleFollowClick}
          variant="outline-primary"
          style={{ position: 'relative', right: '-8vw', top: '-60px' }}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </Button>
      )}

    </Col>
     <ProfileUpdateModal show={showProfileUpdateModal} onHide={() => setShowProfileUpdateModal(false)} />

      <Tabs activeKey={activeTab} className="profile-tabs justify-content-center" fill onSelect={handleSelect}>
        <Tab eventKey="posts" title="Posts"  className="tab-selected">
        </Tab>
        <Tab eventKey="replies" title="Replies"  className="tab-selected">
        </Tab>
        <Tab eventKey="media" title="Media" className="tab-selected">
        </Tab>
        <Tab eventKey="retweets" title="Retweets"  className="tab-selected">
        </Tab>
        <Tab eventKey="likes" title="Likes"  className="tab-selected">
        </Tab>
      </Tabs>
      </Row>

      {/* Follow stats */}
      
       <div className="feed">
      {status === 'loading' && <p>Loading...</p>}
      {status === 'succeeded' && activeTab === 'posts' &&
        userTweets
        .filter(tweet => !tweet.replyTo)
          .slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((tweet) => <TweetCard key={tweet._id} tweet={tweet} />)
          }
         {status === 'succeeded' && activeTab === 'retweets' &&
          userRetweets
            .slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((tweet) => <TweetCard key={tweet._id} tweet={tweet} />)
        }
        {status === 'succeeded' && activeTab === 'media' &&
          userTweets
            .filter(tweet => tweet.imageUrl || tweet.videoUrl)
            .slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((tweet) => <TweetCard key={tweet._id} tweet={tweet} />)
        }
        {status === 'succeeded' && activeTab === 'likes' &&
          userLikes
            .slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((tweet) => <TweetCard key={tweet._id} tweet={tweet} />)
        }
   {status === 'succeeded' && activeTab === 'replies' &&
  userTweets
    .filter(tweet => tweet.replyTo).map((reply, index) => {
      // Find the original tweet that this reply is replying to
      const originalTweet = tweets.find(t => t._id === reply.replyTo);
      return (
        <div key={`reply-group-${index}`} style={{borderTop: '0.5px solid #007bff', borderBottom: '0.5px solid #007bff'}}>
          {originalTweet && (
            
              
              <TweetCard key={originalTweet._id} tweet={originalTweet} style={{border: 'none'}} className="originalTweet" />
            
          )}
          
         <TweetCard key={reply._id} tweet={reply} className="replyTweet" style={{border: 'none'}} />
        </div>
      );
    })}
  


      {status === 'failed' && <p>Failed to load tweets.</p>}
    </div>
      {/* Placeholder for content */}
      </div>
    </>
  );
};

export default Profile;