                              
const   MongoClient = require('mongodb').MongoClient;
const   url = "mongodb://localhost:27017/";

                MongoClient.connect(url, function(err, db) {
                var dbo = db.db("mydb");

                dbo.collection('test_products').insert({  id: 0,
  photo: ' https://png.pngtree.com/svg/20170811/crab_766.png',
  name: ' Наименование ',
  kg_in_pack: ' Килограмм в упаковке ',
  count: ' Количество заказанных упаковок ',
  price: ' Цена за килограмм ',
  sum_price: ' Всего к оплате за товар ',
  kg: ' Всего вес товара ',
  description: '' }, function(err, res) {
                if (err) throw err;
                        console.log("1 document updated");
                db.close();
                });
        });




