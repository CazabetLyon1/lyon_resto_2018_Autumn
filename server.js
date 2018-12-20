console.log('Server-side code running');

const express = require('express');
const Mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const app = express();

// connect to the db and start the express server
let db;

const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return;
            }
            seen.add(value);
        }
        return value;
    };
};

// ***Replace the URL below with the URL for your database***
var url = "mongodb://localhost/";
// E.g. for option 2) above this will be:
// const url =  'mongodb://localhost:21017/databaseName';

// Connect to MongoDB and get data from right database
MongoClient.connect(url, { useNewUrlParser: true }, function(err, database) {
    if(err) {
        return console.log(err);
    }
    // Here, "mydb" is our database in MongoDB, you can change it to your database
    db = database.db("mydb");

    // start the express web server listening on 8080
    app.listen(8080, () => {
        console.log('listening on 8080');
    });
});

// serve the homepage
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// while going to map page, serveur get data from collection MongoDB and send it to client
app.get('/map', (req, res) => {
    console.log(req.query);

//  res.send('coucou');
    db.collection("newBD").find().toArray(function(err, result) {
        if (err) return console.log(err);
        //console.log(result);
        if (result != null) {
            // send data to client
            res.send(result);
        }
    });
});

app.use(express.static('public'));





