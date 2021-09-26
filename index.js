const express = require("express")
const mongoose = require("mongoose")
const routes = require("./routes") // new
const createServer = require('./tests/server');
const cors = require('cors');
const APP_PORT =  5000;

const MONGO_PORT = '27017';
const MONGO_HOSTNAME = '127.0.0.1';
const MONGO_DB = 'tasksDb';

mongoose
  .connect("mongodb://mongodb:27017/tasksDb", { useNewUrlParser: true,  useUnifiedTopology: true })
	.then(() => {
		const app = express();

		app.use(cors())
    	app.use(express.json());
    	app.use('/api', routes);
    
		app.listen(APP_PORT, () => {
			console.log(`Express.js server has started on port ${APP_PORT}!`);
		})
	})
	
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'CONNECTION ERROR'));
db.once('open', function() {
	console.log('Damn, connected!');

	const { networkInterfaces } = require('os');

const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === 'IPv4' && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
}

console.log('olololo', results)
})



