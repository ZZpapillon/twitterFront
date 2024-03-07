import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser, fetchUserById } from '../state/user';

const ProfileUpdateModal = ({ show, onHide }) => {
  const [backgroundPicture, setBackgroundPicture] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
    const currentUserId = useSelector((state) => state.user.currentUserId);
    const currentUserInfo = useSelector((state) => state.user.currentUserInfo);

  const dispatch = useDispatch();

  useEffect(() => {
    // Check if currentUserInfo is not null or undefined
    if (currentUserInfo) {
      // Set the form fields with the existing user information
      setFirstName(currentUserInfo.firstName || '');
      setLastName(currentUserInfo.lastName || '');
      setBio(currentUserInfo.bio || '');
     
    }
  }, [currentUserInfo]);

  const handleBackgroundPictureChange = (e) => {
    setBackgroundPicture(e.target.files[0]);
  };

  const handleProfilePictureChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

   const handleSubmit = async (event) => {
    event.preventDefault();
    // Construct the userData object from state/form fields
    const userData = {
      userId: currentUserId, // Make sure you have the current user's ID
      firstName,
      lastName,
      bio,
      profilePicture,
      backgroundPicture,
    };
    console.log(userData)
   const resultAction   = await dispatch(updateUser(userData));
    if (updateUser.fulfilled.match(resultAction)) {
    // Assuming the user ID is part of the userData or you have it stored elsewhere
    dispatch(fetchUserById(currentUserId));
    }
    console.log("Hejjj")
    onHide(); // Close the modal
  };

  return (
    <Modal show={show}  onHide={onHide} backdrop="static" keyboard={false} centered>
      <Modal.Header  style={{ backgroundColor: 'black', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Modal.Title>Edit Profile</Modal.Title>
        
        <Button variant="primary" onClick={handleSubmit}>
          Save 
        </Button>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: 'black', color: 'white' }}>
        <Form className="editUserForm" >
          <Form.Group controlId="formFileBackground" className="mb-3">
            <Form.Label className="fileInputLabel">Background Picture</Form.Label>
            <Form.Control  className="fileInput" type="file" onChange={handleBackgroundPictureChange} />
          </Form.Group>
          <Form.Group controlId="formFileProfile" className="mb-3">
            <Form.Label className="fileInputLabel">Profile Picture</Form.Label>
            <Form.Control  className="fileInput" type="file" onChange={handleProfilePictureChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>First Name</Form.Label>
            <Form.Control type="text" placeholder="Enter first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Last Name</Form.Label>
            <Form.Control type="text" placeholder="Enter last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Bio</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} />
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ProfileUpdateModal;
