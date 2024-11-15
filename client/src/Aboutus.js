// src/About.js
import React from 'react';
import './About.css';
import { useNavigate } from 'react-router-dom';
import aaronPhoto from './assets/aaron.jpg';
import justinPhoto from './assets/justin.jpg';
import anishPhoto from './assets/anish.jpg';

function About() {
    const navigate = useNavigate();
  const teamMembers = [
    { name: "Aaron Johnson", role: "Frontend & Backend developer", photo: aaronPhoto },
    { name: "Justin Garnick", role: "Frontend & Backend developer", photo: justinPhoto },
    { name: "Anish Parulekar", role: "Frontend & Backend developer", photo: anishPhoto },
  ];

  return (
    <div className="about-container">
        <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
        </button>
      <h1>Meet Our Team</h1>
      <div className="team-grid">
        {teamMembers.map((member, index) => (
          <div key={index} className="team-member">
            <img src={member.photo} alt={`${member.name}'s photo`} className="member-photo" />
            <h2>{member.name}</h2>
            <p>{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default About;
