import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from './apiService.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/Login.css';

const Login = () => {
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [error, setError] = useState(null);
   const navigate = useNavigate();

   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [firstName, setFirstName] = useState('');
   const [lastName, setLastName] = useState('');

  
    const handleSubmitSignIn = async (e) => {
     e.preventDefault();
     
    try {
      const token = await loginUser({ email, password });
      console.log('Login successful! Token:', token);
      navigate('/home');
    } catch (error) {
      setError(error.message);
    console.log(error);
    // Reset error after 5 seconds (5000 milliseconds)
    setTimeout(() => setError(null), 3000)
    } 
  };
  
   const handleSubmitSignUp = async (e) => {
    e.preventDefault();
   // Set loading state to true
    try {
      const token = await registerUser({ email, password, firstName, lastName });
      console.log('Registration successful! Token:', token);
      navigate('/home');
    } catch (error) {
      setError(error.message || 'Registration failed. Please try again.');
    // Reset error after 5 seconds (5000 milliseconds)
    setTimeout(() => setError(null), 3000);
    } 
  };
  
   
  const handleDemoLogin = async () => {
    
  try {
    // Perform login using demo account credentials
    const token = await loginUser({ email: 'er@gmail.com', password: '1' });
    console.log('Demo login successful! Token:', token);
    navigate('/home');
  } catch (error) {
    setError(error.message);
  } 
};
  
  
  
  
  
  
  
  
  
  
   const toggleForms = () => {
    setShowLoginForm(!showLoginForm);
    setShowSignUpForm(!showSignUpForm);
  };









  return (
    <Container fluid className=" twitterBackground" style={{ overflow: 'auto' }}>
      
      <Row className="h-100 align-items-center">
        {/* Image Column */}
        <Col md={6} className="d-flex justify-content-center">
          <img src="/twitterLogo.webp" alt="Login Visual" style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }} />
        </Col>

        {/* Form Column */}
        <Col md={6}>
          <div className="px-5">
            <h1 className="text-start mb-4 firstHeader">Happening now</h1>
            <h2 className="text-start mb-4 secondHeader">Join today.</h2>
             {showLoginForm && (
            <Form className='text-white' onSubmit={handleSubmitSignIn}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </Form.Group>

              <Form.Group className="mb-4" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>
              {error && (
  <div className="alert alert-black" style={{ border: '0.5px solid red' }}>
    {error}
  </div>
)}

              <Button variant="primary" type="submit" className="w-100">
                Log in
              </Button>
            </Form>
              )}
              {showSignUpForm && (
              
               
                <Form className='text-white' onSubmit={handleSubmitSignUp}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control required type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </Form.Group>

                  <Form.Group controlId="formBasicFirstName">
                    <Form.Label className='mt-2'>First Name</Form.Label>
                    <Form.Control required type="text" placeholder="Enter first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </Form.Group>

                  <Form.Group controlId="formBasicLastName">
                    <Form.Label className='mt-2'>Last Name</Form.Label>
                    <Form.Control  required type="text" placeholder="Enter last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword">
                    <Form.Label className='mt-2'>Password</Form.Label>
                    <Form.Control  required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </Form.Group>

                               {error && (
  <div className="alert alert-black mt-4" style={{ border: '0.5px solid red' }}>
    {error}
  </div>
)}
                  

                  <Button className='mt-3' variant="primary" type="submit">
                    Sign Up
                  </Button>
                </Form>
              )}
               <p className="mt-3 text-white questions">
             {showLoginForm ? (
    <>
      New? {' '}
      <span onClick={toggleForms} className="link text-primary" style={{ cursor: 'pointer' }}>
         Create an account
      </span>
      <br />
      <Button variant='primary' onClick={handleDemoLogin} className="demoButton mt-4">Try Demo account</Button>
    </>
  ) : (
    <>
      Already have an account?{' '}
      <span onClick={toggleForms} className="link text-primary" style={{ cursor: 'pointer' }}>
        Login here
      </span>
    </>
  )}
  </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;