const express = require('express');
const app = express();
const portInput = 5000;
const portOutput = 8000;

app.get('/', (req, res) => {
  res.send('Hello, Brother!, Welcome to the server!');
});

app.listen(portInput, () => {
  console.log(`Server is running on http://localhost:${portOutput}`);
});
