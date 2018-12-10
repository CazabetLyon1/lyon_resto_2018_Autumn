console.log('Server-side code running');

const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();

var database;

// ***Replace the URL below with the URL for your database***
var url = "mongodb://localhost/";
// E.g. for option 2) above this will be:
// const url =  'mongodb://localhost:21017/databaseName';

MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if(err) {
        return console.log(err);
    }
    database = db.db("mydb");
    //var dbo = db.db("mydb");
    database.collection("barsLyon").find({}).toArray(function(err, result) {
        if (err) throw err;
        //console.log(result);

    });
    // start the express web server listening on 8080
    app.listen(8080, () => {
        console.log('listening on 8080');
    });
});


// serve the homepage
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname));
app.listen(3000);



