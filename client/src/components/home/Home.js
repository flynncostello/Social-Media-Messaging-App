import React from 'react';
import { Link } from 'react-router-dom';
import ROUTES from '../../routes';
import './Home.css';

const Home = () => {
  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          {/* Logo */}
          <Link className="navbar-brand" to="/">
            <span className="logo">FriendMessanger</span>
          </Link>

          {/* Buttons */}
          <div className="ml-auto">
            <Link className="btn btn-outline-light mr-2" to={ROUTES.login()}>
              Login
            </Link>
            <Link className="btn btn-outline-light" to={ROUTES.signup()}>
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container my-5">
        <div className="row">
          <div className="col-md-8">
            <h2>Welcome to FriendMessanger</h2>
            <p>
              FriendMessanger is a powerful messaging platform that allows you to stay connected with your friends and
              family. Join our community today and experience seamless communication like never before.
            </p>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Featured Features</h5>
                <ul className="list-unstyled">
                  <li>
                    <i className="fas fa-check text-success"></i> Secure end-to-end encryption
                  </li>
                  <li>
                    <i className="fas fa-check text-success"></i> Group chat functionality
                  </li>
                  <li>
                    <i className="fas fa-check text-success"></i> File sharing
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white py-3">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <p>&copy; 2023 FriendMessanger. All rights reserved.</p>
            </div>
            <div className="col-md-6 text-md-right">
              <ul className="list-inline">
                <li className="list-inline-item">
                  <a href="#" className="text-white">
                    Privacy Policy
                  </a>
                </li>
                <li className="list-inline-item">
                  <a href="#" className="text-white">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;