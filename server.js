// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var request = require('request');
var morgan = require('morgan');	
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

app.use(morgan('dev'));

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'Welcome to Jarvis Dialogflow Webhook!' });
});

// more routes for our API will happen here
router.post('/', function(req, res) {
	var data = req.body;
	var action = data["result"]["action"]
	if(action != null){
		handleAction(action,req,res);
		
	}
});

function handleAction(action,req,res){
	switch(action){
		case 'get_random_joke':
			getRandomJoke(res);
			break;
		default:
			break;
	}
}

function getRandomJoke(res){
	var options = {
		method: 'GET',
		url: 'https://icanhazdadjoke.com/',
		headers: {
			"accept": "application/json"
		}
	};
	request.get(options,function(error, response, body) { 
		if (!error && response.statusCode == 200) {
			var joke = JSON.parse(body)["joke"];
			// var outputBody = {
			// 	"speech": joke,
			// 	"displayText": joke,
			// 	"data": {},
			// 	"contextOut": [],
			// 	"source": options.url
			// }
			var outputBody = {
				"followupEvent":{
					"name": "jokes",
					"data": {
						"random": joke
					}
				}
			}
			res.json(outputBody);
		}			
	}); 
}

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api/v1', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server is listening on port ' + port);