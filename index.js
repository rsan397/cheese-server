var express = require('express');
const PORT = process.env.PORT || 5000;
const app = express();
var bodyParser = require('body-parser');
const { Pool, Client} = require('pg');
const creds = require('./config.js');
var router = express.Router();
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res){
	res.send("app home page");
})

const pool = new Pool({
	user: creds.PG_USER,
	password: creds.PG_PASSWORD,
	host: creds.PG_HOST,
	port: creds.PG_PORT,
	database: creds.PG_DATABASE
})

app.get('/cheese', function(req, res, next){
	pool.query('SELECT * FROM cheeselist', function(err, result){
		if(err){
			return console.error('error running query', err)
		}
		res.send(result)
	})
})

app.get('/cheese/:text', function(req, res, next){
	//search description, brand, wherepurchased
	var searchValue = ['%' + req.params.text + '%']
	var searchString = "SELECT * FROM cheeselist WHERE description LIKE $1"
	pool.query(searchString, searchValue, function(err, result){
		if(err){
			return console.error('error running query', err)
		}
		res.send(result)
	})
})
// define the home page route
// router.get('/', function (req, res) {
//   res.send('App home page')
// });
// // define the query route
// router.get('/cheese', function (req, res) {
//   res.send('getting full table')
// });

// router.get('/cheese/:text', function (req, res) {
//   res.send('getting search result')
// });

// const pool = new Pool({
// 	user: "rebeccasanders",
//     password: "",
//     host: "localhost",
//     port: 5432,
//     database: "rebeccasanders"
// });

// var corsOptions = {
//   origin: true,
//   optionsSuccessStatus: 200
// }



app.listen(PORT, () => console.log(`Listening on ${ PORT }`));


