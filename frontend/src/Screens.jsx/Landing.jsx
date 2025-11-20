import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";

const Landing = () => {
  return (
    <div className="landing-container">
      <nav className="navbar">
        <div className="logo">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="20" cy="20" r="20" fill="#00B382" />
            <path
              d="M26.6,13.4C24.1,10.9,20.9,10,17.5,10c-4.4,0-8.1,2.5-10,6.1l2.9,1.2c1.5-2.5,4.1-4.2,7.1-4.2c2.4,0,4.6,1.1,6.1,2.9L26.6,13.4z"
              fill="white"
            />
            <path
              d="M13.4,26.6c2.5,2.5,5.7,3.4,9.1,3.4c4.4,0,8.1-2.5,10-6.1l-2.9-1.2c-1.5,2.5-4.1,4.2-7.1,4.2c-2.4,0-4.6-1.1-6.1-2.9L13.4,26.6z"
              fill="white"
            />
          </svg>
          <span
            style={{
              marginLeft: "10px",
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            CollabSphere
          </span>
        </div>
        <div className="nav-links">
          <Link to="/login" className="nav-link">
            Log in
          </Link>
          <Link to="/register" className="nav-link get-started-btn">
            Get started
          </Link>
        </div>
      </nav>
      <main className="hero-section  mb-56">
        <h1 className="hero-title">CollabSphere</h1>
        <h2 className="hero-subtitle">
          Your Collaborative Development Platform, Supercharged with AI
        </h2>
        <p className="hero-description">
          CollabSphere helps developers connect, create projects, and work
          together seamlessly, With an integrated AI assistant in a group chat
          environment, you can streamline your workflow and bring your ideas to
          life faster than ever. It's like having a mini IDE in the cloud.
        </p>
        <div className="support-note">
          <span>Only supported on </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0L22 20H2l-2-4m16 0H4"></path>
          </svg>
        </div>
      </main>
    </div>
  );
};

export default Landing;
