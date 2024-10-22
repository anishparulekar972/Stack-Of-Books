const express = require('express');
const redis = require('redis');

const app = express();
const PORT = 5000;

//Redis Client
const redisClient = redis.createClient({
	'localhost',
	6379
});

redisClient.on('connect', () => {
	console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
	console.log('Redis error: ', err);
});

//to parse JSON
app.use(express.json());

//API to log data to Redis
app.post('/api/log', (req, res) => {
	const { data } = req.body;
	redisClient.set('lastData', data, (err) => {
		if (err) {
			return res.status(500).json({ message: 'Error logging data' });
		}
		res.status(200).json({ message: 'Data logged successfully' });
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