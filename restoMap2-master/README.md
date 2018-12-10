# Interactive map of Lyon

## Synopsis

This project is an interactive map of Lyon with bars and restaurants. We can filter and search establishments. We also can personalize the view.

## Getting Started

### Prerequisites

You need an Internet connection.

### Installing

You don't need to install anything !

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


### Versioning

* [Git Kraken](https://www.gitkraken.com/) for versioning.  

### Authors

* Louis LE BRUN   p1422721
* Nelly BARRET    p1507461

### License

This project is licensed under copyright.

COPYRIGHTS @ Nelly BARRET et Louis LE BRUN - LIFPROJET 2018
