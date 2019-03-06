const   express = require('express');
const	app = express();
const	bodyParser = require('body-parser');
const	axios = require('axios');
const 	needle = require('needle');
const 	path = require('path');
const 	date = require('date-and-time');
const	favicon = require('serve-favicon');
const	MongoClient = require('mongodb').MongoClient;
const	urlm = "mongodb://localhost:27017/";

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use('/public', express.static(path.join(__dirname, 'public')))
 
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html')
})

app.post('/products', function (req, res) {
	MongoClient.connect(urlm, function(err, db) {
		var dbo = db.db("mydb");
	 	dbo.collection('test_products').find({}).sort( { id: 1 } ).toArray(function(err, result)  {
	 		//res.send(result)
	 		review_find(result)
	   		db.close();
	    });
	});
	function review_find(result) {
		MongoClient.connect(urlm, function(err, db) {
			var dbo = db.db("mydb");
		 	dbo.collection('test_reviews').find({}).sort( { date: 1 } ).toArray(function(review_err, review_result)  {
		 		res.send({review_result: review_result, product_result: result})
		   		db.close();
		    });
		});
	}
});

app.post('/review', function (req, res) {
	let now = new Date();
	console.log(req.body + date.format(now, 'YYYY MMM DD HH:mm'));

	MongoClient.connect(urlm, function(err, db) {
		var dbo = db.db("mydb");
		const review_query = {	
			review_name: req.body.review_name, 
			review_email: req.body.review_email, 
			review_text: req.body.review_text,
			review_date:  date.format(now, 'YYYY MMM DD HH:mm')
		}
	 	dbo.collection('test_reviews').insertOne( review_query, function(err, res) {
    		if (err) throw err;
    		db.close();
  		});
	});
	//res.send()
})


/*

	MongoClient.connect(urlm, function(err, db) {
		var dbo = db.db("mydb");
		const review_query = 
[{review_name: 'Миша 2019',
  review_email: '',
  review_text: 'Сотрудничеством довольны, так держать!',
  review_date: '2019 Mar 04 11:03' },

{ review_name: 'Крабы супер',
  review_email: '',
  review_text: 'Супер',
  review_date: '2019 Feb 26 14:55' },

{ review_name: 'Александр',
  review_email: '',
  review_text: '23 числа хватило на большую компанию.. до тбилисской доставил быстро, все довольны, спасибо Константин, будем брать ещё на 8 маарта..',
  review_date: '2019 Feb 24 18:38' },

{ review_name: 'Gena76',
  review_email: '',
  review_text: 'Крабами! и креветками довольные',
  review_date: '2019 Feb 23 20:14' },

{ review_name: 'qqqqqq',
  review_email: '',
  review_text: 'Икра настоящяя, на перепродаже покупают хорошо',
  review_date: '2019 Feb 03 22:59' },

{ review_name: 'Василий Вавилов',
  review_email: '',
  review_text: 'купил в кафе на пробу людям нравится. купил еще отпишусь',
  review_date: '2019 Jan 13 14:11' },

{ review_name: 'Andrey',
  review_email: '',
  review_text: 'Заказали на новый год крабов 1 пачку. Привезли, хватило на все праздники. Очень вкусные с пивом.',
  review_date: '2019 Jan 04 12:35' }]

	 	dbo.collection('test_reviews').insert( review_query, function(err, res) {
    		if (err) throw err;
    		db.close();
  		});
	});
*/

app.post('/admin', function (req, res) {
	if (req.body.login === 'admin' && req.body.password === '1243') {
			res.sendFile(__dirname + '/admin.html')	
	}
	else {
		res.send('не верный логин или пароль')
	}
})

app.post('/change_product', function (req, res) {

		MongoClient.connect(urlm, function(err, db) {
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
		MongoClient.connect(urlm, function(err, db) {
		var dbo = db.db("mydb");
	 	dbo.collection('test_products').remove({id: req.body.id, name: req.body.name}, function(err, res) {
    		if (err) throw err;
    			console.log("1 document removed");
    		db.close();
  		});
	});
	console.log(req.body)
})

app.post('/delete_review', function (req, res) {
		MongoClient.connect(urlm, function(err, db) {
		var dbo = db.db("mydb");
	 	dbo.collection('test_reviews').remove({review_text: req.body.review_text, review_name: req.body.review_name}, function(err, res) {
    		if (err) throw err;
    			console.log("1 document removed");
    		db.close();
  		});
	});
	console.log(req.body)
})



app.post('/go_home', function (req, res) {
	console.log(req.body)
	const remainder =	req.body.sum_full_price - req.body.prepayment;
	var url = encodeURI("https://api.vk.com/api.php?oauth=1&method=messages.send&user_id=300397513&message="
		+ 'ФИО \n'
		+req.body.name 
		+ '\n \nномер телефона: \n' 
		+ req.body.phone 
		+ '\n \nпочта: \n'  
		+ req.body.email 
		+ '\n \nГород: \n' 
		+ req.body.sity 
		+ '\n \nАдрес: \n'  
		+ req.body.adress 
		+ '\n \nПолная стоимость: \n' 
		+  req.body.sum_full_price 
		+ '\n \nНаличная оплата: \n' 
		+  remainder 
		+ '\n \nПредоплата: \n' 
		+  req.body.prepayment 
		+ '\n \nКомментарий: \n' 
		+  req.body.comment 
		+ '\n \n \nПодробный заказ \n'  
		+ req.body.task 

		+"&v=5.67&access_token=e18295dcb57646dce3ab05d11d9766507573ddbc2e6cdce7c99d5de3956aafe83cea3b4f349f297610091");
	needle.get(url, function(err, resp){
	  if (!err && resp.statusCode == 200);
	  console.log();
	  res.send(
	   "<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css'>"
	   	+"<style> 	body {background: #FAEBD7;font-family: 'Neucha', cursive;} </style> <h1 class='alert alert-success'> Спасибо, Ваша заявка принята, мы отправим Вам счет на оплату в ближайшее время на указанный почтовый ящик: <a class='alert-link' href='mailto:"
	  	+req.body.email +"'>"+req.body.email + 
	  	"</a> <br> <br> Если товара на складе в данный момент нет, мы оповестим Вас. <br> Вопросы по телефону: <b>+7(918)263-57-86</b></h1>")
	})
})
app.post('/question', function (req, res) {
	console.log(req.body)
	var url = encodeURI("https://api.vk.com/api.php?oauth=1&method=messages.send&user_id=300397513&message="+req.body.ask_a_question_name + '\n' + req.body.ask_a_question_email + '\n'  + req.body.ask_a_question_text +"&v=5.67&access_token=e18295dcb57646dce3ab05d11d9766507573ddbc2e6cdce7c99d5de3956aafe83cea3b4f349f297610091");
	needle.get(url, function(err, resp){
	  if (!err && resp.statusCode == 200);
	  console.log();
	  //res.send("<h1> Спасибо, Ваша заявка принята, мы свяжемся с Вами в ближайшее время. </h1>")
	})
})



app.listen(3002)
console.log('-Server started-') 