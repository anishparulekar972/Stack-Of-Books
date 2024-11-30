import React, { useState } from 'react';
import './Sidebar.css'; // Include CSS for styling
import libraryLogo from "./assets/library.png"

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Toggle Button */}
      <button onClick={toggleSidebar} className="sidebar-toggle">
        <img
            src={isOpen ? libraryLogo : libraryLogo} // Change based on state
            alt={isOpen ? 'Close Sidebar' : 'Open Sidebar'}
            className="sidebar-icon" // Add any additional styling for the icon
            />
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <h2>Your Library</h2>
      </div>

      {/* Overlay */}
      {isOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </div>
  );
};

export default Sidebar;
