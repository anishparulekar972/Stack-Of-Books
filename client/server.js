const express = require('express');
const redis = require('redis');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
const PORT = 5000;

app.use(cors({
	origin: "http://localhost:3000"
}));

var allowCrossDomain = function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Contet-Type');
};

app.use(allowCrossDomain);

// Redis Client
const redisClient = redis.createClient({
	url:  `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

(async () => {
	redisClient.on('error', (err) => {
		console.log('Redis error:', err);
	});
	await redisClient.connect();
})();

// if (!redisClient.isReady) {
	// console.log('redis error');
// }


// Ensure the client is connected before making any calls
// redisClient.on('connect', () => {
    // console.log('Connected to Redis');
// });



// To parse JSON
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

const booksFilePath = path.join(__dirname, 'src/', 'books.json');


// Load books into Redis after client is connected
redisClient.on('ready', () => {
    fs.readFile(booksFilePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading books file:', err);
            return;
        }
        const books = JSON.parse(data);
        books.forEach((book) => {
            redisClient.set(`book:${book.isbn}`, JSON.stringify(book), (err) => {
                if (err) {
                    console.error(`Error setting book ${book.isbn}:`, err);
                }
            });
        });
        console.log('Books loaded into Redis');
    });
});

app.post('/api/get-book', async (req, res) => {
	try {
		const isbn = req.body.isbn;
		console.log(isbn);
		
		const response = await redisClient.get(`book:${isbn}`);
		if (response) {
			res.status(200).send(response);
		} else {
			res.status(404).send({message: 'No Book Found'})
		}
	} catch (error) {
		res.status(500).send({message: 'Internal Server Error'})
	}
	
})

// API to retrieve book by ISBN
// app.post('/api/get-book', (req, res) => {
//     const { isbn } = req.body;
//     console.log(req.body);
// 	console.log(redisClient.get());
//     redisClient.get(`book:${isbn}`, (err, bookData) => {
//         if (err) {
//             return res.status(500).json({ message: 'Error fetching book' });
//         }
// 		console.log('books: '+ bookData);
		
//         if (bookData) {
//             res.status(200).json(JSON.parse(bookData));
//         } else {
//             res.status(404).json({ message: 'Book not found' });
//         }
//     });
// });

app.post('/api/login'), async (req, res) => {
	try {
		storedPassword = await redisClient.get(req.body.name);
		passwordInput = req.body.pass;
		bcrypt.genSalt(saltRounds, function(err, salt){
			bcrypt.hash(passwordInput, salt, function(err, hash){
				if (hash == data) {
					return res.status(200).send({message: 'login'})
				} else {
					return res.status(200).send({message: 'incorrect'});
				}
			});
		});
	} catch (err) {
		//error means no user exists
		return res.status(500).send({message: 'no user exists'})
	}
}

app.post('/api/signup'), async (req, res) => {
	console.log('sign up request received');
	try {
		await redisClient.get(req.body.name);
		//if no error, user with that name already exists so a new account cannot be created
		return res.status(500).send({message: 'user already exists'})
	} catch (err) {
		//if there is an error, no user exists with that username, so make a new user in the database and store the hashed password
		passwordInput = req.body.pass;
		bcrypt.genSalt(saltRounds, async function(err, salt){
			bcrypt.hash(passwordInput, salt, async function(err, hash){
				try {
					await redisCLient.set(req.body.name, hash);
					return res.status(200).send({ message: 'Account created' });
				} catch (err) {
					return res.status(500).send({ message: 'Error logging data' });
				}
			});
		});
	}
	
}

// API to log data to Redis
app.post('/api/log', async (req, res) => {
    const { data } = req.body;
    await redisClient.set('lastData', data, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error logging data' });
        }
        res.status(200).json({ message: 'Data logged successfully' });
    });
});

app.get('/api/last-logged', async (req, res) => {
    await redisClient.get('lastData', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching data' });
        }
        res.status(200).json({ data: data || 'No data found' });
    });
});

// Close Redis client on exit
process.on('exit', () => {
    redisClient.quit();
});

app.listen(PORT, () => {
    console.log(`Express Server running on port ${PORT}`);
});

