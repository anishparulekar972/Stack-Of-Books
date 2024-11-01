const express = require('express');
const redis = require('redis');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

//Redis Client
const redisClient = redis.createClient({
	host: 'localhost',
	port: 6379,
});

redisClient.on('connect', () => {
	console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
	console.log('Redis error: ', err);
});

//to parse JSON
app.use(express.json());

const booksFilePath = path.join(__dirname, 'books.json');

fs.readFile(booksFilePath, 'utf-8', (err, data)=>{
	if(err){
		console.error('Error reading books file:',err);
		return;
	}
	const books = JSON.parse(data);
	books.forEach((book)=>{
		redisClient.set(`book:${book.isbn}`, JSON.stringify(book), (err)=>{
			if(err){
				console.error(`Error setting book ${book.isbn}:`,err);
			}
		});
	});
	console.log('Books loaded into Redis');
});

// API to retrieve book by ISBN
app.post('/api/get-book', (req, res) => {
	const { isbn } = req.body;
	
	redisClient.get(`book:${isbn}`, (err, bookData) => {
		if (err) {
			return res.status(500).json({ message: 'Error fetching book' });
		}
		if (bookData) {
			res.status(200).json(JSON.parse(bookData));
		} else {
			res.status(404).json({ message: 'Book not found' });
		}
	});
});




//API to log data to Redis
app.post('/api/log', (req, res) => {
	const { data } = req.body;
	redisClient.set('lastData', data, (resP, err) => {
		if (err) {
			return res.status(500).json({ message: 'Error logging data' });
		}
		res.status(200).json({ message: 'Data logged successfully', data: resP });
	});
});

app.get('api/last-logged', (req, res) => {
	redisClient.get('lastData', (err, data) => {
		if (err) {
			return res.status(500).json({ message: 'Error fetching data' });
		}
		res.status(200).json({ data: data || 'No data found' });
	});
});

app.listen(PORT, () => {
	console.log('Express Server running on port 5000');
});