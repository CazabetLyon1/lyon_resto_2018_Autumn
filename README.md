# Resto's à Lyon!

This is a web site project **Resto's à Lyon!** developed during a subject of 3rd year "LIFPROJET"  at l’Université Claude Bernard Lyon 1.  The main idea is to put into practice our team knowledge but also make us explore new technoly and tools of Web programming. We continue this project which was started by our friends Nelly BARRET and Louis LE BRUN.


# Getting Started

## Prerequisites

You need an internet connection and also Node.js framework as well as MongoDB Databese installed on your computer.

- On Ubuntu
 1. To install Node.js :
`sudo apt-get update`
`sudo apt-get install nodejs npm`
To install the needed modules in the project repository tap:
`npm install mongo`
`npm install express`
2. To Install MongoDB 
`sudo apt-get update`
`sudo apt-get install -y mongodb-org`

--------

- On Mac
1. First install [Homebrew ](https://brew.sh/)
2. Then `brew install node`
To install the needed modules in the project repository tap:
 `npm install mongo`
 `npm install express`
3. To install MongoDB `brew install mongodb`

-----

`npm install`
To start Mongo, open two Terminal tabs. 
In the first one in order to initialize Mongo tap:
-  `mongod`
In the second one to start and open it tap:
- `mongo`

THEN, to import the geoJSON fail into your MongoDB you should tap into an open Terminal tab:
`mongoimport --db NameOfDB  --collection NameOfCollection --file absolute_path_to_the_file.geojson`



 ## Built with
 - [MapBox](https://www.mapbox.com/) - API for map
 - [Google Places](https://cloud.google.com/maps-platform/places/) - API for data
 - [Bootstrap](https://getbootstrap.com/) - Web framework 
 ## Versionning 
 - [GitLab ](https://about.gitlab.com/) for versionning

## Authors

- Fall 2018:
Andrew ALBERT
François ROBERT
Rodislav IVANOV
Nguyen NGUYEN

- Spring 2018:
Nelly BARRET 
Louis LE BRUN


## License

This project is licensed under copyright.

COPYRIGHTS @ Andrew ALBERT, François ROBERT, Rodislav IVANOV, Nguyen NGUYEN, Nelly BARRET, Louis LE BRUN - LIFPROJET 2018


