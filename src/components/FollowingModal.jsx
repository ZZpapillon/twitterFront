import React, { useEffect } from 'react';
import { Modal, Button, ListGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers } from '../state/user';
import { useNavigate } from 'react-router-dom';

const FollowingModal = ({ show, onHide, accountId, handleFollowToggle }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Fetch all users from the Redux state
  const allUsers = useSelector(state => state.user.allUsers);

  // Assuming the current account's following list is stored similarly to followers
  // and 'following' contains the IDs of the users the current account is following
  const following = allUsers ? allUsers.filter(user => user.followers.includes(accountId)) : [];

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
        <Modal.Title>Following</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{backgroundColor: 'black', color: 'white', maxHeight: '500px', overflowY: 'auto'}}>
        <ListGroup style={{backgroundColor: 'black', color: 'white'}}>
          {following.map((user) => (
            <ListGroup.Item key={user._id}  onClick={() => handleNavigate(user._id)} className="d-flex justify-content-between align-items-center" style={{backgroundColor: 'black', color: 'white', cursor: 'pointer'}}>
              <div className="d-flex align-items-center">
                <img src={`https://twitternode.onrender.com${user.profilePicture}`} style={{ width: 50, height: 50, borderRadius: '50%', marginRight: '10px' }} />
                {user.firstName || "Unknown"} {user.lastName || "Unknown"}
              </div>
             
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

export default FollowingModal;