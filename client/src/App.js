import { React, useState } from 'react';
import './App.css';
import booksLogo from './assets/Stack_of_Books_Logo.png';
import Axios from 'axios';
import { ActionIcon } from '@mantine/core';
import { IconSquareXFilled, IconMenu2 } from '@tabler/icons-react';
import { Link } from 'react-router-dom';


function LoginModal({ show, onClose }) {
  if (!show) return null;

  return (
    <div id="loginModal" class="modal">
      <div class="modal-content">
        <h2>Login</h2>
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleSignup}>Sign Up</button>
      </div>
    </div>
  );
}

function App() {
  const [isbn, setIsbn] = useState("");
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [bookData, setBookdata] = useState({});
  const [errorMsg, setErrorMsg] = useState(""); // State for error message
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleInputChange = (event) => {
    setIsbn(event.target.value);
    setErrorMsg(""); // Clear error message on input change
  };

  const handleUsernameChange = (event) => {
        setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
        setPassword(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Check if ISBN is empty
    if (!isbn.trim()) {
      setErrorMsg("Please enter a valid ISBN.");
      return;
    }

    // Validation: Check if ISBN contains only numbers
    if (!/^\d+$/.test(isbn)) {
      setErrorMsg("ISBN must contain only numbers.");
      return;
    }

    try {
      // Use ISBN to search book by ISBN from openlibrary.org
      const response = await Axios.get(
        `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=data&format=json`
      );
      // Check if book with ISBN exists
      if (response.data.hasOwnProperty(`ISBN:${isbn}`)) {
        setBookdata(response.data[`ISBN:${isbn}`]);
      } else {
        setBookdata({});
      }
      setIsBookOpen(true);
    } catch (error) {
      console.error(error);
      setErrorMsg("An error occurred while fetching the book data. Please try again.");
    }
  };

  const handleLogin = async () => {
        await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            body: {username, password}
        })
          .then((response) => response.json())
          .then((result) => {
              console.log(result.message);
          })
          .catch((error) => {
              console.error(error);
          });
    };

    const handleSignup = async () => {
        await fetch('http://localhost:5000/api/signup', {
            method: 'POST',
            body: {username, password}
        })
          .then((response) => response.json())
          .then((result) => {
              console.log(result.message);
          })
          .catch((error) => {
              console.error(error);
          });
    };

  return (
    <div className="container">
      <div className="button-container">
        <button onClick={openModal}>Login</button>
      </div>
      <LoginModal show={isModalOpen} onClose={closeModal} />
      <div className="menu-container">
        <ActionIcon
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          variant="outline"
          color="green"
          aria-label="Menu"
          className="menu-icon"
        >
          <IconMenu2 style={{ width: '70%', height: '70%' }} stroke={1.5} />
        </ActionIcon>
        
        {/* Menu Items */}
        {isMenuOpen && (
          <div className="menu-items">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>Signup</Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)}>About Us</Link>
            <a href="#" onClick={() => setIsMenuOpen(false)}>Contact</a>
            <a href="#" onClick={() => setIsMenuOpen(false)}>Login</a>
          </div>
        )}
      </div>
      <h1>Stack Of Books</h1>
      {isBookOpen ? (
        <>
          {bookData ? (
            <>
              <div className="book-details">
                <h2>Book Name: {bookData.title}</h2>
                <h2>Book Author: {bookData.authors ? bookData.authors[0].name : "Not Found"}</h2>
                <h2>Book ISBN: {isbn}</h2>
              </div>
              <ActionIcon
                onClick={() => {
                  setIsBookOpen(false);
                  setBookdata({});
                }}
                variant="outline"
                color="red"
                aria-label="Settings"
                className="close-icon-left"
              >
                <IconSquareXFilled style={{ width: '70%', height: '70%' }} stroke={1.5} />
              </ActionIcon>
            </>
          ) : (
            <>
              No books found with ISBN {isbn}
            </>
          )}
        </>
      ) : (
        <>
          <img src={booksLogo} alt="Books logo" />
          <p>You can scan ISBN below to get the book information.</p>
          <div className="input-container">
            <input
              id="ISBNInput"
              type="text"
              onChange={handleInputChange}
              placeholder="Please Enter ISBN"
              value={isbn} // Bind input value
            />
          </div>
          {errorMsg && <p className="error-msg">{errorMsg}</p>} {/* Display error message */}
          <div className="button-container">
            <button onClick={(e) => handleSubmit(e)}>Scan the ISBN</button>
          </div>
        </>
      )}
