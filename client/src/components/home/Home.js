import React from 'react';
import { Link } from 'react-router-dom';
import ROUTES from '../../routes';
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope as faMessage } from '@fortawesome/free-regular-svg-icons';

const Home = () => {
  return (
    <div className='main-page'>
      {/* Navigation Bar */}
      <nav className="navbar">
        {/* Logo */}
        <Link className="navbar-logo" to="/">
          <FontAwesomeIcon icon={faMessage} />
          <span className="logo">FriendMessanger</span>
        </Link>

        {/* Buttons */}
        <div className="navbar-buttons">
          <Link className="login-button" to={ROUTES.login()}>
            Login
          </Link>
          <Link className="signup-button" to={ROUTES.signup()}>
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="home-page-main-text">
        <h2>Welcome to FriendMessanger</h2>
        <p>
          FriendMessanger is a powerful messaging platform that allows you to stay connected with your friends and
          family. Join our community today and experience seamless communication like never before.
        </p>
        
        <h5 className="card-title">Features</h5>
        <ul className="list-unstyled">
          <li>
            <i className="fas fa-check text-success"></i> Secure end-to-end encryption
          </li>
          <li>
            <i className="fas fa-check text-success"></i> Real-time messaging
          </li>
          <li>
            <i className="fas fa-check text-success"></i> Conversations saved for later access
          </li>
        </ul>
      </div>

      {/* Footer */}
      <footer className="home-page-footer">
        <p>&copy; 2023 FriendMessanger. All rights reserved.</p>
      </footer>

    </div>
  );
};

export default Home;