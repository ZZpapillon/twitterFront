import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button, Card, Image, Alert } from 'react-bootstrap';
import '../css/Trends.css';
import { Search } from 'react-bootstrap-icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers } from '../state/getAllUsersSlice';
import { useNavigate } from 'react-router-dom';

const Trends = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allUsers = useSelector((state) => state.allUsers.users);
  const currentUserId = useSelector((state) => state.user.currentUserId);
  const [filter, setFilter] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showUsersList, setShowUsersList] = useState(false);
  const wrapperRef = useRef(null); // Ref for the wrapper to detect outside clicks
  const searchInputRef = useRef(null); // Ref for the search input
  const [isActive, setIsActive] = useState(false);
  const [showPremiumAlert, setShowPremiumAlert] = useState(false);

  const handleUserClick = (userId) => {
    setShowUsersList(false);
    navigate(`/home/profile/${userId}`);
  };
   const handlePremiumClick = (e) => {
    e.preventDefault(); // Prevent the NavLink from navigating
    setShowPremiumAlert(true);
    setTimeout(() => {
      setShowPremiumAlert(false);
    }, 4000); // Hide the alert after 4 seconds
  };

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (filter === '') {
      setFilteredUsers(allUsers.filter(user => user._id !== currentUserId));
    } else {
      const lowerCaseFilter = filter.toLowerCase();
      const filtered = allUsers.filter((user) => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        return fullName.includes(lowerCaseFilter) && user._id !== currentUserId;
      });
      setFilteredUsers(filtered);
    }
  }, [filter, allUsers, currentUserId]);

  // Detect clicks outside the component to hide the user list
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowUsersList(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleExploreToggle = () => {
      setIsActive(prevIsActive => {
        if (!prevIsActive) {
          // If not previously active, focus the input and show the list
          if (searchInputRef.current) {
            searchInputRef.current.focus();
          }
          setShowUsersList(true);
          return true;
        } else {
          // If previously active, blur the input and hide the list
          if (searchInputRef.current) {
            searchInputRef.current.blur();
          }
          setShowUsersList(false);
          return false;
        }
      });
    };

    window.addEventListener('focusSearchInput', handleExploreToggle);

    return () => {
      window.removeEventListener('focusSearchInput', handleExploreToggle);
    };
  }, []);
  

  const selectRandomUsers = (users, currentUserId, count = 3) => {
  // Filter out the current user
  const otherUsers = users.filter(user => user._id !== currentUserId);

  // Shuffle the array of other users
  const shuffled = otherUsers.sort(() => 0.5 - Math.random());

  // Get sub-array of first n elements after shuffled
  return shuffled.slice(0, count);
};

const randomUsers = useMemo(() => selectRandomUsers(allUsers, currentUserId, 3), [allUsers, currentUserId]);

  return (
    <div className="whatever" ref={wrapperRef}>
      
     <div className="sticky-input mt-2 " style={{position: 'relative'}}>
  <div className="input-icon-container mt-2">
   <Search className="search-icon" style={{ color: showUsersList ? '#0d6efd' : 'grey' }} />
  </div>
  <input 
    ref={searchInputRef}
    type="text" 
    className="form-control-search" 
    placeholder="Search for friends"  
    onFocus={() => setShowUsersList(true)}
    
    value={filter}
    onChange={(e) => setFilter(e.target.value)} />
    {showUsersList && (
      <div className='usersList' >
          {filteredUsers.map((user) => (
        <div 
          className="userOnList" 
          key={user._id} 
          onClick={() => handleUserClick(user._id)} // Use the click handler here
        >
        <Image className='ms-0 me-2' src={`https://twitternode.onrender.com${user.profilePicture}` || "https://via.placeholder.com/50"} roundedCircle  style={{width: '50px', height: '50px'}}/> {user.firstName} {user.lastName}
        </div> // Adjust based on your user object structure
          ))}
        </div>
    )}

</div>
      
      <Card className="subscribeCard " style={{ backgroundColor: 'rgb(20, 20, 20)', color: 'white', borderRadius: '15px', border: '0' }}>
        <Card.Body  >
          <Card.Title>Subsribe to Premium</Card.Title>
         
          <Card.Text>Subscribe to unlock new features and if eligible, receive a share of ads revenue.</Card.Text>
          <Button onClick={handlePremiumClick} style={{borderRadius: '15px'}}>Subscribe</Button>
          {/* Add more dummy trends as needed */}
        </Card.Body>
      </Card>
      {/* Who to follow */}
      <Card className="followCard " style={{ backgroundColor: 'rgb(20, 20, 20)', color: 'white', borderRadius: '15px', border: '0' }}>
        <Card.Body>
          <Card.Title className='mb-4'>Who to checkout:</Card.Title>
          {randomUsers.map((user) => (
            <div key={user._id} className="d-flex align-items-center  mb-3" onClick={() => handleUserClick(user._id)} style={{cursor: 'pointer'}}>
              <Image className='ms-0' src={`https://twitternode.onrender.com${user.profilePicture}` || "https://via.placeholder.com/50"} roundedCircle  style={{width: '50px', height: '50px'}}/>
              <div className="ms-3" style={{fontSize: '1.3rem'}}>{user.firstName} {user.lastName}</div>
             
            </div>
          ))}
        <Card.Footer style={{cursor: 'pointer', color: '#007bff'}} onClick={() => searchInputRef.current && searchInputRef.current.focus()}>
  Show More
</Card.Footer>
        </Card.Body>
        
      </Card>
    <Card className="cardTrends mb-1" style={{height: 'fit-content', backgroundColor: 'rgb(20, 20, 20)', color: 'white', borderRadius: '15px', border: '0' }}>
  <Card.Body>
    <Card.Title>Tweet Trends:</Card.Title>
    <div className="d-flex align-items-center mb-2">
      <div className="ms-2">1. #TechInnovation</div>
    </div>
    <div className="d-flex align-items-center mb-2">
      <div className="ms-2">2. #SustainableLiving</div>
    </div>
    <div className="d-flex align-items-center mb-2">
      <div className="ms-2">3. #GlobalHealth</div>
    </div>
    {/* You can add more trending topics as needed */}
  </Card.Body>
  
</Card>
      {showPremiumAlert && (
        <Alert variant="primary" style={{ backgroundColor: '#007bff', color: 'white', position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999 }}>
          Your premium access is on preorder!
        </Alert>
      )}
    </div>
  );
};

export default Trends;
