const express = require("express")
const mongoose = require("mongoose")
const routes = require("./routes") // new
const createServer = require('./tests/server');
const cors = require('cors');

mongoose
  .connect("mongodb://localhost:27017/tasksDb", { useNewUrlParser: true,  useUnifiedTopology: true })
	.then(() => {
		const app = express();

		app.use(cors())
    	app.use(express.json());
    	app.use('/api', routes);
    
		app.listen(5000, () => {
			console.log("Express.js server has started!");
		})
	})