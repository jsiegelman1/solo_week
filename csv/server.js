var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();

var json2csv = require('./json2csv.js');

var app = express();

app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/client'));

app.get('/', (req, res, next) => {
  res.render('index', { data: '' });
});

app.post('/submit', (req, res, next) => {
  var data = JSON.parse(req.body.json);
  res.render('index', { data: json2csv(data) });
});

app.post('/upload', upload.single('jsonFile'), (req, res, next) => {
  var data = JSON.parse(req.file.buffer.toString());
  res.render('index', { data: json2csv(data) });
  res.end();
});

app.use(express.static('client'));

app.listen(3000, () => console.log('Server started on port 3000'));

/*
{
	"people": [{
			"name": "Jacob",
			"occupation": "student",
			"children": [{
					"name": "Rex",
					"occupation": "dog",
					"fur_color": "white"
				},
				{
					"name": "Milo",
					"occupation": "dog",
					"fur_color": "golden"
				}
			]
		},
		{
			"name": "Kevin",
			"occupation": "tm",
			"children": []
		}
	]
}


{
	"firstName": "Joshie",
	"lastName": "Wyattson",
	"county": "San Mateo",
	"city": "San Mateo",
	"role": "Broker",
	"sales": 1000000,
	"children": [{
			"firstName": "Beth Jr.",
			"lastName": "Johnson",
			"county": "San Mateo",
			"city": "Pacifica",
			"role": "Manager",
			"sales": 2900000,
      "test": 100,
			"children": [{
					"firstName": "Smitty",
					"lastName": "Won",
					"county": "San Mateo",
					"city": "Redwood City",
					"role": "Sales Person",
					"sales": 4800000,
					"children": []
				},
				{
					"firstName": "Allen",
					"lastName": "Price",
					"county": "San Mateo",
					"city": "Burlingame",
					"role": "Sales Person",
					"sales": 2500000,
					"children": []
				}
			]
		},
		{
			"firstName": "Beth",
			"lastName": "Johnson",
			"county": "San Francisco",
			"city": "San Francisco",
			"role": "Broker/Sales Person",
			"sales": 7500000,
			"children": []
		}
	]
}

*/