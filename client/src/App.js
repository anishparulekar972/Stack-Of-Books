import React from 'react';
import './App.css';
import booksLogo from './assets/Stack_of_Books_Logo.png';

function App() {
  return (
    <div className="container">
      <h1>Stack Of Books</h1>
      <img src={booksLogo} alt="Books logo" />
      <p>You can scan ISBN below to get the book information.</p>
      <div className="input-container">
        <input type="text" placeholder="Please Enter ISBN" />
      </div>
      <div className="button-container">
        <button>Scan ISBN</button>
      </div>
      <footer className="footer">
        <ul>
          <li><a href="/">Our Group</a></li>
          <li><a href="/">About us</a></li>
          <div className="connect">
            <h3>CONNECT</h3>
            <ul className="social-icons">
              <li><a href="/"><i className="fab fa-facebook-f"></i></a></li>
              <li><a href="/"><i className="fab fa-twitter"></i></a></li>
              <li><a href="/"><i className="fab fa-instagram"></i></a></li>
              <li><a href="/"><i className="fab fa-linkedin-in"></i></a></li>
            </ul>
          </div>
        </ul>
        <p>&copy; 2024 Stack Of Books</p>
      </footer>
    </div>
  );
}

export default App;
