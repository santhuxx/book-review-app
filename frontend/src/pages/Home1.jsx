import React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import "../css/Home1.css"; 

const Home1 = () => {
  return (
    <div className="homepage-container">
      <div className="homepage-content">
        <h1 className="homepage-title">Welcome to Book Review Application</h1>
        <div className="homepage-section">
          <h2 className="homepage-subtitle">New here?</h2>
          <p className="homepage-text">Sign up to get started!</p>
          <Link to="/Signup">
            <Button type="primary" shape="round" className="homepage-button">
              Sign Up
            </Button>
          </Link>
        </div>
        <div className="homepage-section">
          <h2 className="homepage-subtitle">Already have an account?</h2>
          <p className="homepage-text">Sign in to access your account.</p>
          <Link to="/Signin">
            <Button type="primary" shape="round" className="homepage-button">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home1;
