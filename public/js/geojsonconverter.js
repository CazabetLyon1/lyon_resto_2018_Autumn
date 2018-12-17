module.exports = geojsonconverter = (() => {
    let self = {};

    self.baseCollection = { 
        "type": "FeatureCollection",
        "features": []
    }

    let buildFeature = (jsonItem, coordinates) => {
        let feature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": coordinates
            },
            "properties": {
                "data" : jsonItem
            }
        }
        return feature;
    }

    self.convertJSON = (JSON) => {
        JSON.array.forEach(element => {
            let latitude = element.geometry.location.lat;
            let longitude = element.geometry.location.lng;
            if (latitude != null && longitude != null) {
                let newFeature = buildFeature(element, [latitude, longitude]);
                self.baseCollectio["features"].push(newFeature);
            }
        });
        return self.baseCollection;
    }

    return self;
})();