import React, { useEffect } from 'react';
import { Modal, Button, ListGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers } from '../state/user';
import { useNavigate } from 'react-router-dom';

const FollowersModal = ({ show, onHide, accountId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Fetch all users from the Redux state
  const allUsers = useSelector(state => state.user.allUsers);

  // Filter to get followers of the specific account
  const followers = allUsers ? allUsers.filter(user => user.following.includes(accountId)) : [];

  // Fetch all users when the component mounts or the modal is shown
  useEffect(() => {
    if (show) {
      dispatch(fetchAllUsers());
    }
  }, [dispatch, show]);
  const handleNavigate = (userId) => {
        onHide(); // Close modal
    navigate(`/home/profile/${userId}`);

  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton style={{backgroundColor: 'black', color: 'white'}}>
        <Modal.Title>Followers</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{backgroundColor: 'black', color: 'white', maxHeight: '500px', overflowY: 'auto'}}>
        <ListGroup style={{backgroundColor: 'black', color: 'white'}}>
          {followers.map((follower) => (
            <ListGroup.Item key={follower._id} style={{backgroundColor: 'black', color: 'white', cursor: 'pointer'}} onClick={() => handleNavigate(follower._id)}>
              <img  src={`https://twitternode.onrender.com${follower.profilePicture}`}  style={{ width: 50, height: 50, borderRadius: '50%', marginRight: '10px' }} />
              {follower.firstName || "Unknown"} {follower.lastName || "Unknown"}
              
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer style={{backgroundColor: 'black', color: 'white'}}>
        <Button variant="primary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FollowersModal;