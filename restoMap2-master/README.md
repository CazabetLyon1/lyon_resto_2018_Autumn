# Interactive map of Lyon

## Synopsis

This project is an interactive map of Lyon with bars and restaurants. We can filter and search establishments. We also can personalize the view.

### Prerequisites

You need an internet connection and also Node.js framework as well as MongoDB Databese installed on your computer.

You need to install MongoDB (https://docs.mongodb.com/manual/installation/) and NodeJS (https://nodejs.org/en/download/)

You can also install MongoDB Compass for a easier manage of your database in MongoDB

## Getting Started

First, you need to start MongoDB service:
   * In Linux, with the command following `sudo service mongod stop`
   * In Windows, you need to go to the directory where your MongoDB installed then type "mongod" or you can start this service in Task Manager

Then , to import the GEOJSON file into your MongoDB you should tap into an open Terminal tab:
`mongoimport --db NameOfDB  --collection NameOfCollection --file absolute_path_to_the_file.geojson`

Second, go to directory of this project then type the command below in your command terminal:
   
   `node server.js`
   
During development this can become a pain. To make this process easier install nodemon, a tool that will monitor your code for changes and automatically restart the server when necessary. To install nodemon:

  `npm install -g nodemon`

You can then run nodemon server.js to run your server and have it reloaded when you make changes. 

There is a example how NodeJS and MongoDB works (https://gist.github.com/aerrity/fd393e5511106420fba0c9602cc05d35) which, in our opinion, is simple to understand

### Running the tests

There is a debug mode for the data retrieve.

### Data
Example of place informations:
```
    {
        formatted_address       : "["Metro Cuire (C)","69300 Caluire et Cuire","France"]",
        formatted_phone_number  : "06 61 41 99 60",
        geometry                : "{"location":{"lat":45.785595167419004,"lng":4.83302194434442}}",
        mainType                : "Bar-Restaurant",
        name                    : "Pitakia",
        place_id                : "pitakia-caluire-et-cuire",
        price                   : "€",
        rating                  : 4,
        scope                   : "YELP",
        subtypes                : "[{"alias":"foodtrucks","title":"Food Trucks"},{"alias":"greek","title":"Greek"}]",
        url                     : "https://www.yelp.com/biz/pitakia-caluire-et-cuire?adjust_creative=tF3mc9kTCu1E1IXMV0XVwQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=tF3mc9kTCu1E1IXMV0XVwQ",
        vicinity                : "Metro Cuire (C)"
    }
```
### Built With

* [Mapbox](https://www.mapbox.com/) - API for map
* [Google Places](https://developers.google.com/places/) - API for data
* [Yelp](https://www.yelp.com/) - second API for data
* [Bootstrap](https://getbootstrap.com/) - Web framework
* [JsDoc](http://usejsdoc.org/) - API documentation generator for JavaScript (generate JsDoc (at the root of the project) : jsdoc js -d=doc)
* [NodeJS](http://https://nodejs.org/en) - 

### Versioning

* [Git Kraken](https://www.gitkraken.com/) for versioning.  

### Authors

* Louis LE BRUN   p1422721
* Nelly BARRET    p1507461

### License

This project is licensed under copyright.

COPYRIGHTS @ Nelly BARRET et Louis LE BRUN - LIFPROJET 2018
