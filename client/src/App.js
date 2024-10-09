import React from 'react';
import './App.css';

function App() {
  return (
    <div className="container">
      <h1>Hello there!!</h1>
      <div className="input-container">
        <input type="text" placeholder="Please Enter ISBN" />
      </div>
      <div className="button-container">
        <button>Scan ISBN</button>
      </div>
    </div>
  );
}

export default App;
