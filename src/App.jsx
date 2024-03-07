import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './css/App.css';
import Sidebar from './components/Sidebar';
import MainFeed from './components/MainFeed';
import Trends from './components/Trends';
import { useNavigate, Outlet } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";


function App() {
   const navigate = useNavigate();

   useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    // Redirect to login if token is not found
    navigate('/');
  } else {
    try {
      // Decode token to access user information
      const decodedToken = jwtDecode(token);
      console.log('Decoded Token:', decodedToken);
      
    } catch (error) {
      // Handle invalid token (e.g., redirect to login)
      console.error('Invalid token:', error);
      navigate('/');
    }
  }
}, [navigate]);
 
  return (
    <Container fluid className='background-container'>
      <Row>
        {/* Sidebar */}
        <Col sm={3} className="sidebar p-0">
          <Sidebar />
        </Col>

        {/* Main Feed */}
        <Col sm={6} className="main-feed p-0">
          <Outlet />
        </Col>

        {/* Trends/Who to follow */}
        <Col sm={3} className="trends ps-4 pe-4">
          <Trends />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
