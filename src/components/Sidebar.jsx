import React, { useState , useEffect, useRef} from 'react';
import { useNavigate, NavLink as RouterNavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserById, setCurrentUserId } from '../state/user';
import { jwtDecode } from 'jwt-decode';
import { Button, Image, Navbar, Nav, Dropdown , Alert} from 'react-bootstrap';
import { House, Search, Camera, Envelope, ArrowRepeat, Heart, Chat, Hexagon, Person, ThreeDots } from 'react-bootstrap-icons'; // Import icons
import '../css/Sidebar.css'; // Make sure to import your custom CSS
import { setShowSearchInput, setActiveProfileTab } from '../state/uiSlice';
import MessagesPanel from './MessagesPanel';

const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => setExpanded(prevExpanded => !prevExpanded);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Add a class based on the expanded state
  const navbarNavClass = expanded ? "expanded" : "";
  const [showAlert, setShowAlert] = useState(false);
   const [showPremiumAlert, setShowPremiumAlert] = useState(false);
  const currentUserInfo = useSelector((state) => state.user.currentUserInfo);
  
   const currentUserId = useSelector((state) => state.user.currentUserId);
   const hasFetchedUserInfo = useRef(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showLogoutOption, setShowLogoutOption] = useState(false);
  const isSmallScreen = () => window.innerWidth <= 576;

  const handleNavItemClick = (e) => {
    if (isSmallScreen()) {
      setExpanded(false); // Collapse the sidebar on small screens
    }
    // If there's additional logic specific to certain nav items, handle it here
    // based on the event or a specific identifier
  };

   const handleProfilePictureClick = (e) => {
     e.preventDefault();
     e.stopPropagation();
     setShowLogoutOption(!showLogoutOption);
   }
  const handleMessagesClick = (e) => {
    e.preventDefault();
    setIsVisible(!isVisible);
  };
 
  const handleProfileClick = (e) => {
    e.preventDefault();
    navigate(`/home/profile/${currentUserId}`);
    dispatch(setActiveProfileTab('posts'));
  };

   const handleLikesClick = (e) => {
  e.preventDefault();
  navigate(`/home/profile/${currentUserId}`);
  dispatch(setActiveProfileTab('likes')); // Dispatch action to set active tab to 'likes'
};
const handleMediaClick = (e) => {
  e.preventDefault();
  navigate(`/home/profile/${currentUserId}`);
  dispatch(setActiveProfileTab('media')); // Dispatch action to set active tab to 'media'
};


   const handleRepliesClick = (e) => {
  e.preventDefault();
  navigate(`/home/profile/${currentUserId}`);
  dispatch(setActiveProfileTab('replies')); // Dispatch action to set active tab to 'replies'
};

  const handleRetweetsClick = (e) => {
  e.preventDefault();
  navigate(`/home/profile/${currentUserId}`);
  dispatch(setActiveProfileTab('retweets')); // Dispatch action to set active tab
};

   const handleMoreClick = (e) => {
     e.preventDefault();  
  setShowAlert(true);
  setTimeout(() => {
    setShowAlert(false);
  }, 4000); // Message will disappear after 4 seconds
};
 const handlePremiumClick = (e) => {
    e.preventDefault(); // Prevent the NavLink from navigating
    setShowPremiumAlert(true);
    setTimeout(() => {
      setShowPremiumAlert(false);
    }, 4000); // Hide the alert after 4 seconds
  };

const handleExploreClick = (e) => {
  e.preventDefault();
  // Dispatch the custom event
  window.dispatchEvent(new CustomEvent('focusSearchInput'));
};
 const handlePostClick = () => {
    // Navigate to the main feed first
    navigate('/home');

    // Dispatch the custom event after a short delay to ensure the component has mounted
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('focusPostForm'));
    }, 0); // Adjust the delay as needed, but often 0 is enough
  };



   useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const decodedToken = jwtDecode(token);
    const userIdFromToken = decodedToken.id;

    // Only proceed if we haven't fetched the user info yet
    if (!hasFetchedUserInfo.current) {
      if (userIdFromToken && userIdFromToken !== currentUserId) {
        dispatch(setCurrentUserId(userIdFromToken));
      }
      if (userIdFromToken && (!currentUserInfo || currentUserInfo.id !== userIdFromToken)) {
        dispatch(fetchUserById(userIdFromToken));
        // Mark as fetched
        hasFetchedUserInfo.current = true;
      }
    }
  }, [dispatch, currentUserId, currentUserInfo]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <>
   <Navbar expand="sm" className="sidebar-container" expanded={expanded} >
<Navbar.Toggle aria-controls="sidebar-navbar-nav" onClick={toggleExpanded} className="custom-toggler" />
      <Navbar.Collapse id="sidebar-navbar-nav" className={navbarNavClass} >
        <Nav className="flex-column links " onClick={handleNavItemClick}  >
          <Nav.Item>
            <Image src='/twitterLogo.webp' className='logo mb-3 mt-3' style={{ maxWidth: '4rem', maxHeight: '4rem', objectFit: 'contain' }} />
          </Nav.Item>
          <Nav.Link as={RouterNavLink} to='/home' className="nav-link" ><House /> Home</Nav.Link>
          <Nav.Link as={RouterNavLink} onClick={handleExploreClick} ><Search /> Explore</Nav.Link>
         
          <Nav.Link as={RouterNavLink} onClick={handleMessagesClick}><Envelope /> Messages</Nav.Link>
          <Nav.Link as={RouterNavLink} onClick={handleMediaClick}><Camera /> Media</Nav.Link>
          <Nav.Link as={RouterNavLink} onClick={handleRetweetsClick} ><ArrowRepeat /> Retweets</Nav.Link>
          <Nav.Link as={RouterNavLink} onClick={handleLikesClick} ><Heart /> Likes</Nav.Link>
          <Nav.Link as={RouterNavLink} onClick={handleRepliesClick} ><Chat /> Replies</Nav.Link>
          <Nav.Link as={RouterNavLink} onClick={handlePremiumClick} ><Hexagon /> Premium</Nav.Link>
          <Nav.Link className='profileRout' as={RouterNavLink} onClick={handleProfileClick} ><Person /> Profile</Nav.Link>
          <Nav.Link as={RouterNavLink} onClick={handleMoreClick} ><ThreeDots /> More</Nav.Link>
          <Nav.Link >
          <Button onClick={handlePostClick} variant="primary" className="sidebar-post-btn">Post</Button>
          </Nav.Link>
          
           <Nav.Link as={RouterNavLink} className='m-0'  >
            <div className="sidebar-profile" onClick={handleProfilePictureClick}>
              <div className="profile-picture">
                <Image src={currentUserInfo && currentUserInfo.profilePicture ? `https://twitternode.onrender.com${currentUserInfo.profilePicture}` : '/path/to/placeholder/image.jpg'} roundedCircle style={{width: '50px', height: '50px', objectFit: 'cover'}}/>
              </div>
              <div className="profile-info ms-3 mt-1">
                <div className="profile-name ">{currentUserInfo ? (currentUserInfo.firstName + " " + currentUserInfo.lastName) : 'Loading...'}</div>
              </div>
              <div className='ms-4 mb-2'>...</div>
              {showLogoutOption && (
                <div className="logout-option" onClick={handleLogout} style={{ cursor: 'pointer', }}>
                  Log Out
                </div>
              )}
            </div>
            
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>

    {showAlert && (
        <Alert variant="secondary" style={{backgroundColor: 'black', color: 'white', position: 'fixed', top: '20px', left: '27vw', width: 'fit-content', zIndex: 9999 }}>
          At this moment, we haven't configured more. We are working on it. Stay tuned!
        </Alert>
      )}
      {showPremiumAlert && (
        <Alert variant="primary" style={{ backgroundColor: '#007bff', color: 'white', position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999 }}>
          Your premium access is on preorder!
        </Alert>
      )}
       <MessagesPanel isVisible={isVisible} onClose={() => setIsVisible(false)} />
    </>
  );
};

export default Sidebar;