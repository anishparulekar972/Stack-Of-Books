import { React, useState } from 'react';
import './App.css';
import booksLogo from './assets/Stack_of_Books_Logo.png';
import Axios from 'axios';
import { ActionIcon } from '@mantine/core';
import { IconSquareXFilled, IconMenu2 } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

function App() {
  const [isbn, setIsbn] = useState("");
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [bookData, setBookdata] = useState({});
  const [errorMsg, setErrorMsg] = useState(""); // State for error message
  const [successMsg, setSuccessMsg] = useState(""); // State for success message
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleInputChange = (event) => {
    const value = event.target.value;
    
    // Only allow digits and 'X' at the end
    if (value === '' || /^\d+X?$/.test(value)) {
      setIsbn(value);
      setErrorMsg(""); // Clear error message on valid input
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(""); // Clear any previous error messages
    setSuccessMsg(""); // Clear any previous success messages

    // Validation: Check if ISBN is empty
    if (!isbn.trim()) {
      setErrorMsg("Please enter a valid ISBN.");
      return;
    }

    // Validation: Check if ISBN contains only numbers and possibly 'X' at the end
    if (!/^\d+X?$/.test(isbn)) {
      setErrorMsg("ISBN must contain only numbers with optional 'X' at the end.");
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

  const addToLibrary = async () => {
    try {
      // For now, using a hardcoded userId. In a real app, this would come from authentication
      const userId = "user1";
      const response = await Axios.post('http://localhost:5000/api/library/add', {
        userId,
        book: {
          isbn,
          title: bookData.title,
          author: bookData.authors ? bookData.authors[0].name : "Unknown"
        }
      });
      
      setSuccessMsg("Book added to your library successfully!");
      setTimeout(() => setSuccessMsg(""), 3000); // Clear success message after 3 seconds
      
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Failed to add book to library");
      setTimeout(() => setErrorMsg(""), 3000); // Clear error message after 3 seconds
    }
  };

  return (
    <div className="container">
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
                <button 
                  onClick={addToLibrary}
                  className="add-to-library-btn"
                >
                  Add to Library
                </button>
                {successMsg && <div className="success-message">{successMsg}</div>}
                {errorMsg && <div className="error-message">{errorMsg}</div>}
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

      <footer className="footer">
        <ul>
          <li><a href="/">Our Group</a></li>
          <Link to="/about">About us</Link>
        </ul>
        <p>&copy; 2024 Stack Of Books</p>
      </footer>
    </div>
  );
}

export default App;
