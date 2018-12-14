console.log('Server-side code running');

const express = require('express');
const Mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const app = express();
var fs = require('fs');

/*let handleRequest = (request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    fs.readFile('./index.html', null, function (error, data) {
        if (error) {
            response.writeHead(404);
            respone.write('Whoops! File not found!');
        } else {
            response.write(data);
        }
        response.end();
    });
};

http.createServer(handleRequest).listen(8000);*/

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

MongoClient.connect(url, { useNewUrlParser: true }, function(err, database) {
    if(err) {
        return console.log(err);
    }
    db = database.db("mydb");
    //var dbo = db.db("mydb");

    // start the express web server listening on 8080
    app.listen(8080, () => {
        console.log('listening on 8080');
    });
});



// serve the homepage
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/map', (req, res) => {
    console.log(req.query);

//  res.send('coucou');
    db.collection("fusionPlace").find().toArray(function(err, result) {
        if (err) return console.log(err);
        //console.log(result);
        if (result != null) {
            //console.log(typeof result[0].properties.vicinity);
            res.send(result);
        }
    });
});

app.use(express.static('public'));




