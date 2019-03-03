const   express = require('express');
const	app = express();
const	bodyParser = require('body-parser');
const	axios = require('axios');
const 	needle = require('needle');
const 	path = require('path');
const	favicon = require('serve-favicon');
const	MongoClient = require('mongodb').MongoClient;
const	url = "mongodb://localhost:27017/";

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use('/public', express.static(path.join(__dirname, 'public')))
 
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html')
})

app.post('/products', function (req, res) {
	MongoClient.connect(url, function(err, db) {
		var dbo = db.db("mydb");
	 	dbo.collection('test_products').find({}).sort( { id: 1 } ).toArray(function(err, result)  {
	 		res.send(result)
	   		db.close();
	    });
	});
});

app.post('/admin', function (req, res) {
	if (req.body.login === 'admin' && req.body.password === '1243') {
			res.sendFile(__dirname + '/admin.html')	
	}
	else {
		res.send('не верный логин или пароль')
	}
})

app.post('/change_product', function (req, res) {

		MongoClient.connect(url, function(err, db) {
		var dbo = db.db("mydb");
	var myquery = {id: req.body};
	var newvalues = { $setOnInsert: req.body };

	 	dbo.collection('test_products').update( myquery, newvalues, { upsert: true }, function(err, res) {
    		if (err) throw err;
    			console.log("1 document updated");
    		db.close();
  		});
	});
	console.log(req.body)
})

app.post('/delete_product', function (req, res) {
		MongoClient.connect(url, function(err, db) {
		var dbo = db.db("mydb");
	 	dbo.collection('test_products').remove({id: req.body.id, name: req.body.name}, function(err, res) {
    		if (err) throw err;
    			console.log("1 document updated");
    		db.close();
  		});
	});
	console.log(req.body)
})

app.post('/go_home', function (req, res) {
	console.log(req.body)
		var url = encodeURI("https://api.vk.com/api.php?oauth=1&method=messages.send&user_id=300397513&message="+"req.body.task"+"&v=5.67&access_token=e18295dcb57646dce3ab05d11d9766507573ddbc2e6cdce7c99d5de3956aafe83cea3b4f349f297610091");
	needle.get(url, function(err, resp){
	  if (!err && resp.statusCode == 200);
	  console.log();
	})
})


		var urln = encodeURI("https://api.vk.com/api.php?oauth=1&method=messages.send&user_id=300397513&message=req.body.task&v=5.67&access_token=e18295dcb57646dce3ab05d11d9766507573ddbc2e6cdce7c99d5de3956aafe83cea3b4f349f297610091");
	needle.get(urln, function(err, resp){
	  if (!err && resp.statusCode == 200);
	  console.log();
	})

app.listen(3002)
console.log('-Server started-') 