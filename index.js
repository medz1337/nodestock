const express = require('express');
const app = express();
const exphbs  = require('express-handlebars');
const path = require('path');
const request = require('request');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5000;


//Use body parser middleware
app.use(bodyParser.urlencoded({extended:false}));


//API KEY pk_155e0e90c84b4ff8a78e7b5410972aac
// create call_api function
function call_api(finishedAPI, ticker) {
	request('https://cloud.iexapis.com/stable/stock/'+ ticker +'/quote?token=pk_155e0e90c84b4ff8a78e7b5410972aac', {json: true}, (err, res, body) => {
	if (err) { return console.log(err);}
	if (res.statuscode === undefined || res.statuscode === 200 ) {
		console.log(body);
		finishedAPI(body)
		};
	});
};



// Set Handlebars middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//const otherstuff = "Hello there, this is other stuff"

// Set Handlebar index GET route
app.get('/', function (req, res) {
	if (req.body.stock_ticker === undefined) {
				res.render('hello');
	} else {
			call_api(function(doneAPI) {
				res.render('home', {
    			stock: doneAPI
    			
    		   	});
		},"fb");
	};
});

// Set Handlebar index  POST route

app.post('/', function (req, res) {
		call_api(function(doneAPI) {
			//posted_stuff = req.body.stock_ticker;
			res.render('home', {
    		stock: doneAPI,
    	});
	}, req.body.stock_ticker);
	});
//});


// create about page route
app.get('/about.html', function (req, res) {
    res.render('about');
});

// Set static folder
app.use(express.static(path.join(__dirname,'public')));


app.listen(PORT, () => console.log('Server Listening on port '+ PORT));
