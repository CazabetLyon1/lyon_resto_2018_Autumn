//######################################################################################################################
//########################## MAIN PROGRAM ##############################################################################
//######################################################################################################################


{
    // Loading bar
    var words = ["LOADING", "SUSHI", "FRIENDS", "TACOS", "RESTAURANT", "INDIAN", "ARABIAN", "LYON", "LOCAL", "FOOD", "DRINKS", "ME", "YOU"];

    window.addEventListener("load", function() {

        var randoms = window.document.getElementsByClassName("randoms");

        for (i = 0; i < randoms.length; i++)

            changeWord(randoms[i]);

    }, false);

    function changeWord(a) {

        a.style.opacity = '0.1';

        a.innerHTML = words[getRandomInt(0, words.length - 1)];

        setTimeout(function() {

            a.style.opacity = '1';

        }, 425);

        setTimeout(function() {

            changeWord(a);

        }, getRandomInt(500, 800));
    }

    function getRandomInt(min, max) {

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Get data which was sent to client by serveur NodeJS (data get from MongoDB by server.js)
    setTimeout(function(){

        fetch('/map', {method: 'GET'})

            .then(function(response) {

                if(response.ok) return response.text();

                throw new Error('Request failed.');

            })

            .then(function(data) {

                geoJsonSource = data;

                geoJsonSource = geoJsonSource.substr(1).slice(0, -1);

                geoJsonSourceParsed = JSON.parse(geoJsonSource);

                // remove loader background
                document.getElementsByClassName("loaderBackground")[0].remove();

                // initializes the map and all the event listeners on interactive elements
                init();

                document.getElementById("sidebarCollapse").style.display = "inline-block";

                document.getElementById("sidebarCollapse").classList.add("open");

                document.getElementById("sidebar").classList.add("active");

                history.pushState(null, '', '/map.html');

            })

            .catch(function(error) {

                console.log(error);

            });

    }, 2000);

    // Get filter values from map.html

    if (data == ""){

        filterHomepage = false;

    } else {

        var filterData = [];        // data for filter get from homepage

        for (var i=0;i<data.length;i++){

            var array = data[i].split(',');

            filterData.push(array);

        }

        console.log(filterData);

        filterHomepage = true;
    }


    /*// Codes below, for the loading bar synchronized with XMLttpRequest, are used in version of 2017-2018
    // Creation of a loader icon
    var loaderBackground = document.createElement("div");

    loaderBackground.classList.add("loaderBackground");

    var loaderProgressDiv = document.createElement("div");

    loaderProgressDiv.classList.add("progress");

    var loaderDiv = document.createElement("div");

    loaderDiv.classList["value"] = ["progress-bar progress-bar-striped"];

    loaderProgressDiv.appendChild(loaderDiv);

    loaderBackground.appendChild(loaderProgressDiv);

    document.body.insertBefore(loaderBackground, document.body.firstChild);

    $(".progress-bar")[0].setAttribute("role", "progressbar");

    $(".progress-bar")[0].setAttribute("aria-valuemin", "0");

    $(".progress-bar")[0].setAttribute("aria-valuemax", "100");


    // Request to load the GeoJson source file and set geoJsonSource property, removes loader and launch init()
    /*var xobj = new XMLHttpRequest();

    xobj.open('GET', 'JSON/fusionPlacesV2.geojson', true);

    xobj.onprogress = loader;

    xobj.onreadystatechange = function () {

        if (xobj.readyState === 4 && xobj.status == "200") {

            setTimeout(function () {

                document.body.removeChild(loaderBackground);

                geoJsonSource = xobj.responseText;

                init();

            }, 1000);

        }

    }

    //xobj.send(null);*/
}


/**
 * Sets attributes of the progress-bar.
 *
 * @param progress A percentage
 */
/*function loader(progress) {

    var loaded = progress.loaded;

    var total = progress.total;

    var value = Math.round((loaded * 100) / total);

    $(".progress-bar")[0].setAttribute("aria-valuenow", value);

    $(".progress-bar")[0].setAttribute("style", "width:"+value+"%;");

    $(".progress-bar")[0].innerText = value + " %";

}*/

//######################################################################################################################
//######################## GLOBAL VARIABLES ############################################################################
//######################################################################################################################

// Accent map used by accent_fold
var accentMap = {
    'á':'a', 'é':'e', 'í':'i','ó':'o','ú':'u', 'ä' : 'a', 'à' : 'a', 'è' : 'e', 'ï' : 'i', 'ô' : 'o', 'ö' : 'o', '\'' : ' ', '-' : ' '
};

var dayMap = {

    "lundi" : "Monday",

    "mardi" : "Tuesday",

    "mercredi" : "Wednesday",

    "jeudi" : "Thursday",

    "vendredi" : "Friday",

    "samedi" : "Saturday" ,

    "dimanche" : "Sunday"

};

/**
 * Returns the day in english.
 *
 * @param day A string which represents a day
 * @returns A day
 */
function day_fold(day) {

    if (!day) {

        return '';

    }

    return dayMap[day];

}

/**
 * Removes special characters of a string.
 *
 * @param s A string
 * @returns The new string without special characters
 */
function accent_fold (s) {

    if (!s) {

        return '';

    }

    var ret = '';

    for (var i = 0 ; i < s.length; i++) {

        ret += accentMap[s.charAt(i)] || s.charAt(i);

    }

    return ret;

}

var googlePlacesAPIService; // Service for API request executions

var userCoordinates  = {

    userLatitude: 45.75717800533178,

    userLongitude: 4.83480298193669

};                          // User's coordinates

var map;                    // The map generated by MapBox

var subType = [];

var SubCleaned = [];

var latVariance = 0.001764; // Latitude difference to get to an other sector // Base = 0.000882

var lngVariance = 0.002560; // Longitude difference to get to an other sector // Base = 0.001280

var geoJsonSource;          // GeoJson source of the project, get from mongodb

var geoJsonSourceParsed;        // GeoJson source after JSON.parse

var filterHomepage; // Boolean to know if there is filter for data get from homepage

var forcedDate = null;

// Initialisation of user's location with coordinates of Lyon near Bellecour
var defaultCoordinates = {

    userLatitude: 45.75717800533178,

    userLongitude: 4.83480298193669

};

// Bounds of the map for research functions
var mapGridBounds = {

    topLatitude : 45.788347,

    bottomLatitude : 45.732777,

    leftLongitude : 4.791173,

    rightLongitude : 4.871854

};

var popups = [];            // Array of all active popups

//######################################################################################################################
//########## GENERAL INITIALISATION AND MAP INITIALISATION #############################################################
//######################################################################################################################

var userPositionMarker;     // Marker associated with user's location

var style = 'basic';        // Get the current style of map

var setClusters = true;     // Choose between points or clusters or heat

var setPoints = false;      // Choose between points or clusters or heat

var setHeat = false;        // Choose between points or clusters or heat

var subtypes =[];

var icon = "homeIcon";      // Points of clusters of colored points

var overlap = true;         // For text overlap

var markersTitleColor = "#000000";

var barColor = "#C12C2C";

var restaurantColor = "#339EFA";

var barRestaurantColor = "#FFEF7C";

var iconImage = "homeIconBlack";

var legend = document.getElementById("legend");

var smallLegend = document.getElementById("smallLegend");

var pointLayer = ({

    id: "placesSymbolsP",

    type: "circle",

    source: "places2",

    paint: {

        "circle-color": [

            "match",

            ["get", "mainType"],

            "Bar", barColor,

            "Restaurant", restaurantColor,

            "Bar-restaurant", barRestaurantColor,

            "Bar-Restaurant", barRestaurantColor,

            '#000000'

        ]

    }

});

var heatLayer = ({

    "id": "heat",

    "type": "heatmap",

    "source": "places2",

    "maxzoom": 15,

    "paint": {

        // increase weight as diameter breast height increases
        "heatmap-weight": 0.8,

        // increase intensity as zoom level increases
        "heatmap-intensity": 0.9,

        // use sequential color palette to use exponentially as the weight increases
        "heatmap-color": [

            "interpolate",

            ["linear"],

            ["heatmap-density"],

            0, "rgba(0,0,255,0)",

            0.1, "rgb(65,105,225)",

            0.3, "rgb(0,255,255)",

            0.5, "rgb(0,200,255)",

            0.7, "rgb(255,191,31)",

            1, "rgb(255,68,0)",

        ],

        // increase radius as zoom increases

        "heatmap-radius": 15,

        "heatmap-opacity": {

            "default": 1,

            "stops": [

                [14, 1],

                [15, 0]

            ]

        },

    }

});

var clusterPlacesSymbols = ({

    id: "placesSymbols",

    type: "symbol",

    source: "places",

    layout: {
        "text-field": "{name}",

        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],

        "text-offset": [0, 0.6],

        "text-anchor": "top",

        "icon-image": iconImage,

        "icon-size": 0.05,

        "visibility": 'visible',

        "icon-allow-overlap": true,

        "text-allow-overlap": overlap
    },

    paint: {
        "text-halo-color": "rgba(0,0,0,1)",

        "text-color": markersTitleColor

    }

});

var clusterLayer = ({

    id: "clusters",

    type: "circle",

    source: "places",

    filter: ["has", "point_count"],

    paint: {

        "circle-color": [

            "step",

            ["get", "point_count"],

            "#339EFA",

            100,

            "#FFEF7C",

            750,

            "#C12C2C"

        ],

        "circle-radius": [

            "step",

            ["get", "point_count"],

            20,

            100,

            30,

            750,

            40
        ]
    }
});

var clusterCountLayer = ({

    id: "cluster-count",

    type: "symbol",

    source: "places",

    filter: ["has", "point_count"],

    layout: {

        "text-field": "{point_count_abbreviated}",

        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],

        "text-size": 13

    }

});

/**
 * Initializes the map and all the event listeners on interactive elements.
 */
function init() {

    // Mapbox generation with API key authentication

    map = mapInitialisation(userCoordinates);

    // Update user's location

    getUserLocation();

    // Buttons interactions

    var goButton = document.getElementById("btn-filter");

    goButton.addEventListener("click", function(){

        filterHomepage = false;

        filterMap();

    });

    var resetButton = document.getElementById("resetFilters");

    resetButton.addEventListener("click", function (){

        filterHomepage = false;

        resetFilter();

    });


    var searchTextField = document.getElementById("search");

    searchTextField.addEventListener("input", function () {

        if (searchTextField.value.length === 0) {

            resetFilter();

        }

    });


    var searchTextButton = document.getElementById("searchIcon");

    searchTextButton.addEventListener("click", function () {

        filterHomepage = false;

        filterMap();

    });

    window.addEventListener("keyup", function (key) {

        if (key.keyCode === 27) {

            filterHomepage = false;

            searchTextField.value = "";

            resetFilter();

        }

    });

    window.addEventListener("keypress", function (key) {

        if (key.keyCode === 13) {

            filterHomepage = false;

            filterMap();

        }

    });

    // Style selection map
    var selectedStyle = "";

    var styleButtons = document.getElementsByClassName("btnStyle");

    for (var i=0;i<styleButtons.length;i++) {

        styleButtons[i].addEventListener("click", function () {

            selectedStyle = $(this).attr('id');

            changeStyle(selectedStyle);

        });

    }

    // Points or clusters choice
    var point = document.getElementById("viewPoints");

    var cluster = document.getElementById("viewClusters");

    var heat = document.getElementById("viewHeat");

    cluster.addEventListener("click", function() {

        setClusters = true;

        setHeat = false;

        setPoints = false;

        icon = "homeIcon";

        overlap = true;

        /*map.remove();

        mapInitialisation(userCoordinates);*/

        legend.style.visibility = "hidden";

        map.setLayoutProperty("placesSymbols", 'visibility', 'visible');

        map.setLayoutProperty("clusters", 'visibility', 'visible');

        map.setLayoutProperty("cluster-count", 'visibility', 'visible');

        map.setLayoutProperty("placesSymbolsP", 'visibility', 'none');

        map.setLayoutProperty("heat", 'visibility', 'none');

    });

    point.addEventListener("click", function() {

        //displayHeat();

        setClusters = false;

        setPoints = true;

        setHeat = false;

        icon = "";

        overlap = true;

        /*map.remove();

        mapInitialisation(userCoordinates);*/

        legend.style.visibility = "visible";

        map.setLayoutProperty("placesSymbols", 'visibility', 'none');

        map.setLayoutProperty("clusters", 'visibility', 'none');

        map.setLayoutProperty("cluster-count", 'visibility', 'none');

        map.setLayoutProperty("placesSymbolsP", 'visibility', 'visible');

        map.setLayoutProperty("heat", 'visibility', 'none');

        // Hide and show smallLegend and legend
        $("#closeLegend").on("click", function() {

            legend.style.visibility = "hidden";

            smallLegend.style.visibility = "visible";

        });

        $("#restore").on("click", function() {

            legend.style.visibility = "visible";

            smallLegend.style.visibility = "hidden";

        });


        var circles = [document.getElementById("legendCircleBar"), document.getElementById("legendCircleRestaurant"), document.getElementById("legendCircleBarRestaurant")];

        for (var i = 0 ; i < circles.length ; i++) {

            circles[i].style.width = "10px";

            circles[i].style.height = "10px";

            circles[i].style.borderRadius = "5px";

            circles[i].style.float = "left";

            if (i === 0) {

                circles[i].style.backgroundColor = barColor;

            } else if (i === 1) {

                circles[i].style.backgroundColor = restaurantColor;

            } else if (i === 2) {

                circles[i].style.backgroundColor = barRestaurantColor;

            }

        }
    });

    heat.addEventListener("click",function() {

        setClusters = false;

        setPoints = false;

        setHeat = true;

        icon = "";

        overlap = true;

        /*map.remove();

        mapInitialisation(userCoordinates);*/

        legend.style.visibility = "hidden";

        map.setLayoutProperty("placesSymbols", 'visibility', 'none');

        map.setLayoutProperty("clusters", 'visibility', 'none');

        map.setLayoutProperty("cluster-count", 'visibility', 'none');

        map.setLayoutProperty("placesSymbolsP", 'visibility', 'visible');

        map.setLayoutProperty("heat", 'visibility', 'visible');

    });

}

/**
 * Initializes a map with passed coordinates and set the map interactions.
 *
 * @param userCoordinates Actual coordinates of user, firstTime To know if this is the first time loading map page
 * @returns A Mapbox's map object
 */
function mapInitialisation(userCoordinates) {

    mapboxgl.accessToken = 'pk.eyJ1IjoibWFnaXJsMjMiLCJhIjoiY2pvbGVydWkyMG5ydjN1cGp1NDR6ODVsdiJ9.Xp7CrSuBHDXYc3C8NMSxDg';

    map = new mapboxgl.Map({

        container: 'map',

        center: [userCoordinates.userLongitude, userCoordinates.userLatitude],

        zoom: 15,

        style: 'mapbox://styles/mapbox/'+style+'-v9'

    });

    map.addControl(new mapboxgl.GeolocateControl({

        positionOptions: {

            enableHighAccuracy: true

        },

        trackUserLocation: true

    }), 'bottom-right');

    // Adding map controls
    map.addControl(new mapboxgl.NavigationControl({

        "showCompass" : true

    }), 'bottom-right');

    // Disable map rotation using right click + drag

    map.dragRotate.disable();

    // Disable map rotation using touch rotation gesture

    map.touchZoomRotate.disableRotation();

    // Map loaded in the beginning
    map.on('load', function (element) {

        map.addSource('places', {

            type: "geojson",

            data: geoJsonSourceParsed,

            cluster: true,

            clusterMaxZoom: 16, // Max zoom to cluster points on

            clusterRadius: 75 // Radius of each cluster when clustering points (defaults to 50)

        });

        map.addSource("places2", {

            type: "geojson",

            data: geoJsonSourceParsed,

            cluster: false,

            clusterMaxZoom: 16, // Max zoom to cluster points on

            clusterRadius: 75, // Radius of each cluster when clustering points (defaults to 50)

            //visibility: 'none'

        });

        map.loadImage('Assets/homeIconWhite.png', function (error, image) {

            map.addImage('homeIconWhite', image);

        });

        map.loadImage('Assets/homeIconBlack.png', function (error, image) {

            map.addImage('homeIconBlack', image);

        });

        // Adding display layer
        map.addLayer(clusterPlacesSymbols);

        map.addLayer(clusterLayer);

        map.addLayer(clusterCountLayer);

        map.addLayer(pointLayer);

        map.addLayer(heatLayer);

        // Set layout
        if (setClusters) {

            map.setLayoutProperty("placesSymbols", 'visibility', 'visible');

            map.setLayoutProperty("clusters", 'visibility', 'visible');

            map.setLayoutProperty("cluster-count", 'visibility', 'visible');

            map.setLayoutProperty("placesSymbolsP", 'visibility', 'none');

            map.setLayoutProperty("heat", 'visibility', 'none');
        }
        if (setPoints) {

            map.setLayoutProperty("placesSymbols", 'visibility', 'none');

            map.setLayoutProperty("clusters", 'visibility', 'none');

            map.setLayoutProperty("cluster-count", 'visibility', 'none');

            map.setLayoutProperty("placesSymbolsP", 'visibility', 'visible');

            map.setLayoutProperty("heat", 'visibility', 'none');
        }
        if (setHeat) {

            map.setLayoutProperty("placesSymbols", 'visibility', 'none');

            map.setLayoutProperty("clusters", 'visibility', 'none');

            map.setLayoutProperty("cluster-count", 'visibility', 'none');

            map.setLayoutProperty("placesSymbolsP", 'visibility', 'none');

            map.setLayoutProperty("heat", 'visibility', 'visible');
        }

        filterMap();



    });

    map.on('click', function (element) {

        var features = map.queryRenderedFeatures(element.point, {

            layers: ['placesSymbols']

        });

        if (!features.length) {

            return;

        }

        var feature = features[0];

        var geometry = JSON.parse(feature.properties.geometry);

        map.easeTo({center : [geometry.location.lng, geometry.location.lat + (2*latVariance)],
            zoom : 15});

        displayContent('info');

        if (feature.properties['place_id'] != null) {

            var popup = new mapboxgl.Popup();

            popup = createPopupForSymbol(feature);

            createInfoContentHTML(feature.properties);

            /* Close popup while closing info-content */
            var closesecondSidebar = document.getElementById("close-secondSidebar");

            closesecondSidebar.onclick = function () {
                popup.remove();
            };

            /* Close info-content while closing popup */
            var closePopup = document.getElementsByClassName("mapboxgl-popup-close-button")[0];

            closePopup.addEventListener('click',function(){

                closeSecondSidebar();
            });
        }

    });

    map.on('click', function (element) {

        var features = map.queryRenderedFeatures(element.point, {

            layers: ['placesSymbolsP']

        });

        if (!features.length) {

            return;

        }

        var feature = features[0];

        var geometry = JSON.parse(feature.properties.geometry);

        map.easeTo({center : [geometry.location.lng, geometry.location.lat + (2*latVariance)],
            zoom : 15});

        displayContent('info');

        if (feature.properties['place_id'] != null) {

            var popup = new mapboxgl.Popup();

            popup = createPopupForSymbol(feature);


            createInfoContentHTML(feature.properties);

            /* Close popup while closing info-content */
            var closesecondSidebar = document.getElementById("close-secondSidebar");

            closesecondSidebar.onclick = function () {
                popup.remove();
            };

            /* Close info-content while closing popup */
            var closePopup = document.getElementsByClassName("mapboxgl-popup-close-button")[0];

            closePopup.addEventListener('click',function(){

                closeSecondSidebar();
            });
        }

    });

    var popup = new mapboxgl.Popup();

    map.on('mouseenter', 'placesSymbols', function (element) {

        var features = map.queryRenderedFeatures(element.point, {

            layers: ['placesSymbols']

        });

        if (!features.length) {

            return;

        }

        var feature = features[0];

        // For some strange reason, a cluster is considered as a placesSymbol's feature, this test assure not.

        if (feature.properties['place_id'] != null) {

            popup = createPopupForSymbol(feature);

        }

    });

    map.on('mouseenter', 'placesSymbolsP', function (element) {

        var features = map.queryRenderedFeatures(element.point, {

            layers: ['placesSymbolsP']

        });

        if (!features.length) {

            return;

        }

        var feature = features[0];

        // For some strange reason, a cluster is considered as a placesSymbol's feature, this test assure not.

        if (feature.properties['place_id'] != null) {

            popup = createPopupForSymbol(feature);

        }

    });

    map.on('mouseleave', 'placesSymbols', function() {

        popup.remove();

    });

    map.on('mouseleave', 'placesSymbolsP', function() {

            popup.remove();

        });


    // Creation of user marker on map
    googlePlacesAPIService = new google.maps.places.PlacesService(document.createElement('div'));

    // Adding and remove direction control in map
    var mapbox_ctrl_top_right = document.getElementsByClassName("mapboxgl-ctrl-top-right")[0];

    var navigationButton = "<button type='button' id='navigationButton'><i class='material-icons' style='margin-top:2px!important;color:rgb(0,0,0)'>directions</i></button>";

    document.getElementsByClassName('mapboxgl-ctrl-group')[0].insertAdjacentHTML('beforeend', navigationButton);

    var controlDirection = new MapboxDirections({

        accessToken: mapboxgl.accessToken,

        steps: true,

        voice_instructions: true,

    });

    document.getElementById('navigationButton').onclick = function(){

        if (!mapbox_ctrl_top_right.hasChildNodes()){

            map.addControl(controlDirection, 'top-right');

            openDirectionControl();

        }
        else if (mapbox_ctrl_top_right.hasChildNodes()){

            map.removeControl(controlDirection);

            mapbox_ctrl_top_right.html = "";

        }

    };

    return map;

}

/**
 * Launches a navigator's user's position watch.
 *
 * @param position Actual coordinates of user
 */
function locationUpdate(position) {

    console.log(position);

    userCoordinates.userLongitude = position.coords.longitude;

    userCoordinates.userLatitude = position.coords.latitude;

    getUserLocation();

}

/**
 * Places the user on the map and center to his position.
 */
function getUserLocation() {

    userPositionMarker = new mapboxgl.Marker().setLngLat([userCoordinates.userLongitude, userCoordinates.userLatitude]);

    var markerHeight = 50, markerRadius = 10, linearOffset = 25;

    var popupOffsets = {
        'top': [0, 0],
        'top-left': [0, 0],
        'top-right': [0, 0],
        'bottom': [0, -markerHeight],
        'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
        'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
        'left': [markerRadius, (markerHeight - markerRadius) * -1],
        'right': [-markerRadius, (markerHeight - markerRadius) * -1]
    };

    var popup = new mapboxgl.Popup({offset: popupOffsets, closeButton: false})
        .setLngLat([userCoordinates.userLongitude, userCoordinates.userLatitude])
        .setHTML("<h3 id='youAreHere' >You are here</h3>")
        .addTo(map);

    userPositionMarker.setPopup(popup);

    userPositionMarker.addTo(map);

    map.setCenter([userCoordinates.userLongitude, userCoordinates.userLatitude]);

    if (navigator.geolocation) {

        console.log("Big brother is watching you...");

        navigator.geolocation.watchPosition(setUserCoordinates, function (error) {

            window.alert("Please activate your geolocalization for a better experience ! :) ");

        });

    }

}

/**
 * Updates the userCoordinates property, and update the user's position's marker.
 *
 * @param position A position with latitude and longitude
 */
function setUserCoordinates(position) {

    console.log("Position update : " + position);

    userCoordinates.userLatitude = position.coords.latitude;

    userCoordinates.userLongitude = position.coords.longitude;

    userPositionMarker.setLngLat([userCoordinates.userLongitude, userCoordinates.userLatitude]);

}

//######################################################################################################################
//##################### DISPLAY RELATED METHODS ########################################################################
//######################################################################################################################

/**
 * Creates a popup for a place.
 *
 * @param feature A geoJson point object
 * @returns A MapBox popup
 */
function createPopupForSymbol(feature) {

    var placeInformations = feature.properties;

    var markerHeight = 20, markerRadius = 10, linearOffset = 25;

    var popupOffsets = {
        'top': [0, 0],
        'top-left': [0, 0],
        'top-right': [0, 0],
        'bottom': [0, - markerHeight],
        'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
        'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
        'left': [markerRadius, (markerHeight - markerRadius) * -1],
        'right': [-markerRadius, (markerHeight - markerRadius) * -1]
    };

    var popup = new mapboxgl.Popup({offset: popupOffsets})
        .setLngLat(feature.geometry.coordinates)
        .setHTML(createMarkerPopupHTML(placeInformations))
        .addTo(map);

    return popup;

}

/**
 * Converts an URL to a correct string.
 *
 * @param urlString An URL
 * @returns The URL without symbols from charMap
 */
function urlConverter(urlString) {

    var charMap = {

        " " : "%20",
        "\"": "%22",
        "<" : "%3C",
        ">" : "%3E",
        "#" : "%23",
        "%" : "%25",
        "|" : "%7C"

    };

    var correctString = "";

    for (var c in urlString) {

        correctString += charMap[urlString[c]] || urlString[c];

    }

    return correctString;

}

/**
 * Creates the html content of the popup.
 *
 * @param place A place's properties dictionary
 * @returns An html text for the popup
 */
function createMarkerPopupHTML(place) {

    var html = "";

    var placeName = accent_fold(place.name);

    html += "<p id='popupTitle'>" + placeName + "</p>";

    html += "<p id='popupType'>" + place.mainType + "</p>";

    if (place.rating != null) {

        html += "<p id='popupRating'>";

        var i;

        for (i = 0 ; i < Math.floor(place.rating); i++) {

            // Adding full stars
            html += "<i class=\"fa fa-star\"></i>";

        }

        for (var j = i; j < 5; j++) {

            // Adding empty stars
            html += "<i class=\"far fa-star\"></i>";

        }

        html += "</p>";

    }

    if (place.price !== "null" && place.price !== undefined) {

        html += "<p id='popupPrice'>" + place.price + "</p>";

    }

    var address = urlConverter(place['formatted-address']);

    var vicinity = place['vicinity'];

    var geometryLat = JSON.parse(place['geometry'])['location']['lat'];

    var geometryLng = JSON.parse(place['geometry'])['location']['lng'];

    var destination = "";

    if (vicinity.toLowerCase().indexOf("unnamed") !== -1) {

        destination = geometryLat.toFixed(6) + "," + geometryLng.toFixed(6);

        vicinity = "Coordinates : " + destination;

    } else {

        destination = address;

    }

    html += "<div class='card'><br>";

    html += "<p id='popupAddress'><i class='fa fa-street-view'></i><a target='_blank' href='https://www.google.com/maps/dir/?api=1&origin=" + userCoordinates.userLatitude + ',' + userCoordinates.userLongitude + "&destination=" + destination + "&travelmode=walking' style = 'color : whitesmoke; '>" + vicinity + "</a></p>";

    if (place.website != null) {

        html += "<p id='popupWebsite'><i class='fa fa-at'></i><a target='_blank' href='" + place.website + "' style = 'color : whitesmoke; '>Website</a></p>";

    } else if (place.url != null) {

        html += "<p id='popupWebsite'><i class='fa fa-at'></i><a target='_blank' href='" + place.url + "' style = 'color : whitesmoke; '>Website</a></p>";

    }

    if (place['formatted_phone_number'] != null) {

        html += "<p id='popupPhone'><i class='fa fa-phone'></i><a href=\"tel:" + place['formatted_phone_number'] + "\" style = 'color : whitesmoke; '>" + place['formatted_phone_number'] + "</a></p>";

    }

    if (place["opening_hours"] != null) {

        var days = JSON.parse(place["opening_hours"])["weekday_text"];

        if (days != null) {

            var d = new Date();

            var day = d.getDay();

            if (forcedDate != null) {

                day = forcedDate;

            }

            // In JavaScript, the first day of the week (0) means Sunday
            // getDay()			days[]
            // 0 Sunday			Monday
            // 1 Monday			Tuesday
            // 2 Tuesday		Wednesday
            // 3 Wednesday		Thursday
            // 4 Thursday		Friday
            // 5 Friday			Saturday
            // 6 Saturday		Sunday

            var str = days[day];

            if (day === 0) {

                str = days[6];

            } else {

                str = days[day - 1];

            }

            if (str !== null && str.length !== 0) {

                if (forcedDate == null) {

                    // str.indexOf(': ')+2 => starts after ': '
                    html += "<p id='popupDay'><i class='fa fa-clock-o'></i>Today: " + str.substring(str.indexOf(': ') + 2, str.length) + "</p>";

                } else {

                    // str.indexOf(': ')+2 => starts after ': '
                    html += "<p id='popupDay'><i class='fa fa-clock-o'></i>" + day_fold(str.substring(0, str.indexOf(':'))) + str.substring(str.indexOf(':'), str.length) + "</p>";

                }

            }


        }

    }

    html+= "</div>";

    /*if (place.subtypes != null && place.subtypes !== "null") {

    	var subtypesToDisplay = JSON.parse(place.subtypes);

    	for (var i = 0 ; i < subtypesToDisplay.length ; i++) {

            html += "<button type=\"button\" class='btn btn-light subtypesButton' id='subtypes" + i + "' style='margin-right: 5px; margin-top: 5px'>" + subtypesToDisplay[i].title + "</button>";

    	}

    }*/

    return html;

}

/**
 * Creates the html content to show in info-content second-sidebar
 *
 * @param place A place's properties dictionary
 * @returns An html text to append in info-content
 */
function createInfoContentHTML(place)   {

    /*reset before create*/

    var info = document.getElementsByClassName('info-item');

    while(info.length > 0){

        info[0].parentNode.removeChild(info[0]);

    }

    /*create html to insert in info-content*/
    var html = "";

    /*Name*/
    var placeName = accent_fold(place.name);

    html += "<div class='info-item' id='info-header'>";

    html += "<h3 id='Title'>" + placeName + "</h3>";

    /*Rating*/
    if (place.rating != null) {

        html += "<p id='Rating'>";

        var i;

        for (i = 0 ; i < Math.floor(place.rating); i++) {

            // Adding full stars
            html += "<i class=\"fa fa-star\"></i>";

        }

        for (var j = i; j < 5; j++) {

            // Adding empty stars
            html += "<i class=\"far fa-star\"></i>";

        }

        html += "</p>" ;


    }

    /*Price*/
    if (place.price !== "null" && place.price !== undefined) {

        html += "<p id='Price'>";

        var i;

        for (i = 0 ; i < place.price.length; i++) {

            // Adding full stars
            html += "<i class=\"fas fa-euro-sign\"></i>";

        }

        html += "</p>" ;

    }

    html += "</div>"

    /*Adress*/
    var address = urlConverter(place['formatted-address']);

    var vicinity = place['vicinity'];

    var geometryLat = JSON.parse(place['geometry'])['location']['lat'];

    var geometryLng = JSON.parse(place['geometry'])['location']['lng'];

    var destination = "";

    if (vicinity.toLowerCase().indexOf("unnamed") !== -1) {

        destination = geometryLat.toFixed(6) + "," + geometryLng.toFixed(6);

        vicinity = "Coordinates : " + destination;

    } else {

        destination = address;

    }

    html += "<div class='info-item'>" +
        "       <h2 id='Address'><i class='fas fa-map-marker-alt'></i> " + vicinity + "</h2>" +
        "    </div>";


    /* Website...*/
    if (place.website != null) {
        html += "<div class='info-item'>" +
            "           <h2 id='Website'><i class='fas fa-globe'></i><a target='_blank' href='" + place.website + "'> Website</a></h2>" +
            "        </div>"

    } else if (place.url != null) {
        html += "<div class='info-item'>" +
            "           <h2 id='Website'><i class='fas fa-globe'></i><a target='_blank' href='" + place.website + "'> Website</a></h2>" +
            "        </div>";
    }

    /* Phone number... */
    if (place.formatted_phone_number != null){
        html += "<div class='info-item'>" +
            "           <h2 id='Phone'><i class='fas fa-phone-square'></i><a href='tel:" + place.formatted_phone_number + "'> " + place.formatted_phone_number + "</a></h2>" +
            "    </div>";
    }

    /* Opening Time */
    if (place["opening_hours"] != null) {

        var days = JSON.parse(place["opening_hours"])["weekday_text"];

        if (days != null) {

            html += "<div class='info-item'>" +
                "       <h2 data-toggle=\"collapse\" data-target=\"#openingTime\" aria-expanded=\"false\"><i class=\"fas fa-clock\"  aria-hidden=\"true\"></i> Opening Time</h2>" +
                "       <ul class=\"collapse\" id='openingTime'>";

            for (var i = 0; i < days.length; i++) {

                html += "       <li>"+ days[i] +"</li>";

            }

            html += "   </ul>" +
                "   </div>";
        }
    }

    /*Type*/
    html += "<div class='info-item'>" +
        "       <h2 data-toggle='collapse' data-target='#Type' aria-expanded='false'><i class='fas fa-tasks'  aria-hidden='true'></i> Type</h2>" +
        "       <ul class='collapse' id='Type'>"  +
        "           <li>" + place.mainType + "</li>";

    if (place.subtypes != null && place.subtypes != "null") {

        var subtypesToDisplay = JSON.parse(place.subtypes);

        console.log(subtypesToDisplay);

        for (var i = 0 ; i < subtypesToDisplay.length ; i++) {

            if (subtypesToDisplay[i].title != undefined) {

                html += "<li>" + subtypesToDisplay[i].title + "</li>";

            } else{

                html += "<li>" + subtypesToDisplay[i][1] + "</li>";

            }
        }
    }

    html += "   </ul>" +
        "   </div>";

    /* Reviews...*/
    if (place.reviews != null) {

        if (typeof place.reviews == 'string'){

            var reviews = place.reviews.split(',{');

            html += "<div class='info-item'>" +
                "       <h2 data-toggle='collapse' data-target='#Review' aria-expanded='false'><i class='fas fa-comments'></i> Review</h2>" +
                "       <ul class='collapse' id='Review'>" +
                "           <li>" + place.reviews + "</li>" +
                "    </ul></div>";

        } else {
            var reviews = JSON.parse(place.reviews);

            html += "<div class='info-item'>" +
                "       <h2 data-toggle='collapse' data-target='#Review' aria-expanded='false'><i class='fas fa-comments'></i> Review</h2>" +
                "       <ol class='collapse' id='Review'>";
            for (var i = 0; i < reviews.length; i++) {

                html += "<li>" + reviews[i].text + "</li>";

            }

            html += "   </ol>" +
                "   </div>";
        }
    }

    /* Direction button
    html += "<div class='info-item'>" +
                "<button class=\"btn-direction\" id=\"direction\"><i class=\"fas fa-map-marker-alt\"></i>Directions</button>" +
            "</div>"

    /*Insert in info-content*/
    document.getElementById('info-content').insertAdjacentHTML('afterbegin', html);


    // Adding map control direction while address clicked
    var directionButton = document.getElementById("Address");

    var mapbox_ctrl_top_right = document.getElementsByClassName("mapboxgl-ctrl-top-right")[0];

    var controlDirection = new MapboxDirections({

        accessToken: mapboxgl.accessToken,

        steps: true,

        voice_instructions: true,

    });

    directionButton.onclick = function() {

        if (!mapbox_ctrl_top_right.hasChildNodes()) {

            map.addControl(controlDirection, 'top-right');

            openDirectionControl();

            // Set starting point as user position
            var userCoordString = "";

            userCoordString += userCoordinates.userLongitude.toString();

            userCoordString += ',' + userCoordinates.userLatitude.toString();

            controlDirection.setOrigin(userCoordString);

            // Set destination as place which is showing in info-content
            var restCoordString = geometryLng.toString() + "," + geometryLat.toString();

            controlDirection.setDestination(restCoordString);


            document.getElementById('navigationButton').onclick = function(){
                if (!mapbox_ctrl_top_right.hasChildNodes()){

                    map.addControl(controlDirection, 'top-right');

                    openDirectionControl();

                }

                else if (mapbox_ctrl_top_right.hasChildNodes()){

                    map.removeControl(controlDirection);

                    mapbox_ctrl_top_right.html = "";
                }

            };

        }

    };

}

/**
 * Zooms to the user's coordinates.
 */
function resetCamera() {

    map.zoomTo(13,{offset : [defaultCoordinates.userLongitude, defaultCoordinates.userLatitude]});

}


//######################################################################################################################
//##################### SETTINGS #######################################################################################
//######################################################################################################################

/**
 * Changes the style of the map.
 *
 * @param input A button
 */
function changeStyle(input) {

    style = input;

    if (style === "dark" || style === "satellite") {

        markersTitleColor = "#ffffff";

        iconImage = "homeIconWhite";

    } else {

        markersTitleColor = "#000000";

        iconImage = "homeIconBlack";

    }

    map.remove();

    mapInitialisation(userCoordinates);

}

//######################################################################################################################
//############ FILTER ACTIONS ON MAP ###################################################################################
//######################################################################################################################

/**
 * Prepares a filter object based on what is currently selected in the filter menu, then call filterFunction(filter).
 */
function filterMap() {

    var filter = {

        filteringSearch: false,

        searchString: [],

        filteringLocation: false,

        aroundMe: false,

        location: [],

        filteringPrices : false,

        price: [],

        filteringRating:false,

        rating: [],

        filteringMainTypes : false,

        maintypes: [],

        filteringSubTypes : false,

        subtypes: [],

        filteringTime : false,

        filteringDateTime: false,

        openingHours: null,

        openingDay: null

    };

    if (filterHomepage == true){

        //Get values to filter from filterData
        //filterData[0] => location
        //filterData[1] => price
        //filterData[2] => rating
        //filterData[3] => maintype
        //filterData[4] => subtype
        //filterData[5] => date and time
        var selected_locations = filterData[0];

        var selected_prices = filterData[1];

        var selected_ratings = filterData[2];

        var selected_main_types = filterData[3];

        var selected_sub_types = filterData[4];


        //Format Open Time
        var openTime = filterData[5];


        //Search value
        var searchString = filterData[6];

        var i;

        var j;

        /* Location */
        if (selected_locations[0] !== "" ) {

            if (selected_locations[0] === "Around me"){

                filter.aroundMe = true;

            } else {

                for (i = 0; i < selected_locations.length; i++) {

                    filter.location.push(selected_locations[i]);

                }

                filter.filteringLocation = true;

            }
        }
        /* Prices */
        if (selected_prices[0] !== "" ) {
            for (i = 0; i < selected_prices.length; i++) {

                var total = 0;

                for (j = 0; j < selected_prices[i].length; j++) {

                    if (selected_prices[i][j] === "$") total = total + 1;

                }

                filter.price.push(total);

                filter.filteringPrices = true;
            }
        }

        /* Rating */
        if (selected_ratings[0] !== "") {
            for (i = 0; i < selected_ratings.length; i++) {

                var total = 0;

                for (j = 0; j < selected_ratings[i].length; j++) {

                    if (selected_ratings[i][j] === "*") total = total + 1;

                }

                filter.rating.push(total);

                filter.filteringRating = true;
            }
        }

        /* MainType */
        if (selected_main_types[0] !== ""){
            for (i = 0; i < selected_main_types.length; i++) {

                filter.maintypes.push(selected_main_types[i]);

                filter.filteringMainTypes = true;
            }
        }

        /* SubType */
        if (selected_sub_types[0] !== ""){
            for (i = 0; i < selected_sub_types.length; i++) {

                filter.subtypes.push(selected_sub_types[i]);

                filter.filteringSubTypes = true;
            }
        }

        /* Date and time */
        if (openTime[0] !== "") {

            var str = new String(openTime);

            var split_time = str.split('  ');

            filter.openingDay = split_time[0];

            var str2 = split_time[1].split(':');

            var time = str2[0] + str2[1];

            filter.openingHours = time;
        }

        if (searchString !== null){
            filter.filteringSearch = true;
            for (i = 0; i < searchString.length; i++) {

                filter.searchString.push(searchString[i]);

            }
        }

    } else {

        var selected_main_types = $('#mainType').val();

        var selected_sub_types = $('#subType').val();

        var selected_locations = $('#location').val();

        var priceButton1 = document.getElementById("price1");

        var priceButton2 = document.getElementById("price2");

        var priceButton3 = document.getElementById("price3");

        var priceButton4 = document.getElementById("price4");

        var priceButtons = [priceButton1, priceButton2, priceButton3, priceButton4];

        var starButton1 = document.getElementById("star1");

        var starButton2 = document.getElementById("star2");

        var starButton3 = document.getElementById("star3");

        var starButton4 = document.getElementById("star4");

        var starButton5 = document.getElementById("star5");

        var starButtons = [starButton1, starButton2, starButton3, starButton4, starButton5];

        var openTime = $('#datetimepicker-secondSidebar').val();

        var searchString = $('#search').val();

        var i;

        if (selected_locations[0] !== "" ) {

            if (selected_locations[0] === "Around me") {

                filter.aroundMe = true;

            } else {

                for (i = 0; i < selected_locations.length; i++) {

                    filter.location.push(selected_locations[i]);

                    filter.filteringLocation = true;
                }
            }
        }

        for (i = 0 ; i < priceButtons.length; i++) {

            if (priceButtons[i].checked == true) {

                filter.price.push(i + 1);

                filter.filteringPrices = true;

            }

        }

        for (i = 0; i < starButtons.length; i++) {

            if (starButtons[i].checked==true) {

                filter.rating.push(i + 1);

                filter.filteringRating = true;
            }

        }

        if (selected_main_types[0] !== ""){

            for (i = 0; i < selected_main_types.length; i++) {

                filter.maintypes.push(selected_main_types[i]);

                filter.filteringMainTypes = true;
            }
        }

        if (selected_sub_types[0] !== ""){

            for (i = 0; i < selected_sub_types.length; i++) {

                filter.subtypes.push(selected_sub_types[i]);

                filter.filteringSubTypes = true;
            }
        }

        /* Date and time */

        if (openTime[0] !== undefined) {

            var str = new String(openTime);

            var split_time = str.split('  ');

            filter.openingDay = split_time[0];

            var str2 = split_time[1].split(':');

            var time = str2[0] + str2[1];

            filter.openingHours = time;

        }

        if (searchString !== null){

            filter.filteringSearch = true;

            filter.searchString.push(searchString);
        }

    }

    //console.log(filter);

    filterFunction(filter);

}

/**
 * Applies a filter to the geoJsonSource property based on the passed filter's properties.
 * If only one object is left after filtering, we fly and zoom to it in the map.
 *
 * @param filter A dictionary of filters
 */
function filterFunction(filter) {

    forcedDate = null;

    var filteredGeoJson = JSON.parse(geoJsonSource);

    var features = filteredGeoJson.features;

    if (filter.filteringSearch == true){
        var str = filter.searchString;

        if (str[0].length !== 0) {

            var total = 0;

            //var filteredGeojson = JSON.parse(geoJsonSource);

            //var features = filteredGeojson.features;

            var optionRegex = new RegExp(/!/);

            if (str[0].search(optionRegex) == -1) {

                features = features.filter(function (value) {

                    var searchName = accent_fold(str[0]).toLowerCase();

                    var valueName = accent_fold(value.properties.name).toLowerCase();

                    var valueType = accent_fold(value.properties.mainType).toLowerCase();

                    var valueAddress = accent_fold(value.properties["vicinity"]).toLowerCase();

                    var reviews = accent_fold(value.properties.reviews).toLowerCase();

                    var subtype = false;

                    if (value.properties.subtypes != null) {

                        for (var l = 0  ; l < value.properties.subtypes.length; l++) {

                            var elem = value.properties.subtypes[l];

                            if (accent_fold(elem.alias).indexOf(searchName) != -1 || accent_fold(elem.title.toLowerCase()).indexOf(searchName) != -1) {

                                subtype = true;

                                break;

                            }

                        }

                    }

                    if ((reviews.indexOf(searchName) != -1 || valueName.indexOf(searchName) != -1 || valueAddress.indexOf(searchName) != -1 || valueType.indexOf(searchName) != -1 || subtype)){

                        total = total + 1;

                        return true;
                    }

                });

            } else {

                var openRegex = new RegExp(/open/);

                if (str[0].search(openRegex) != -1) {

                    features = features.filter(function (value) {

                        var sundayRegex = new RegExp(/sunday|dimanche/);

                        var mondayRegex = new RegExp(/monday|lundi/);

                        var tuesdayRegex = new RegExp(/tuesday|mardi/);

                        var wednesdayRegex = new RegExp(/wednesday|mercredi/);

                        var thursdayRegex = new RegExp(/thursday|jeudi/);

                        var fridayRegex = new RegExp(/friday|vendredi/);

                        var saturdayRegex = new RegExp(/saturday|samedi/);

                        var regexes = [sundayRegex, mondayRegex, tuesdayRegex, wednesdayRegex, thursdayRegex, fridayRegex, saturdayRegex];

                        for (var i = 0 ; i < regexes.length ; i++) {

                            if (str[0].search(regexes[i]) != -1) {

                                if (value.properties.weekday_text != null && i < value.properties.weekday_text.length) {

                                    forcedDate = i;

                                    var openingHours = value.properties.weekday_text[i];

                                    if (openenedFilter(openingHours)){

                                        total = total + 1;

                                        return true;

                                    }

                                } else {

                                    return false;

                                }

                            }

                        }

                        return false;

                    });

                }

            }

        }

    }

    if (filter.filteringLocation == true){

        var total = 0;

        features = features.filter(function (value) {

            if (value.properties.formatted_address != null){

                for(var i = 0; i<filter.location.length; i++) {

                    if (value.properties.formatted_address.includes(filter.location[i]) != false){

                        total = total + 1;

                        return true;

                    }

                }

                return false;

            } else {

                return false;

            }

        });

        console.log("location: " + total);

    }

    if (filter.filteringPrices) {

        var total = 0;

        features = features.filter(function (value) {

            if (value.properties.price != null) {

                for (var i = 0 ; i < filter.price.length ; i++) {

                    if (value.properties.price.length == filter.price[i]) {

                        total = total + 1;

                        return true;

                    }

                }

                return false;

            } else {

                return false;

            }

        });

        console.log("price: " + total);

    }

    if (filter.filteringRating) {

        var total = 0;

        features = features.filter(function (value) {

            if (value.properties.rating != null) {

                for (var i = 0; i < filter.rating.length; i++) {

                    if (Math.floor(value.properties.rating) == filter.rating[i]) {

                        total = total + 1;

                        return true;

                    }

                }

                return false;

            } else {

                return false;

            }

        });

        console.log("rating: " + total);
    }

    if (filter.filteringMainTypes) {

        var total = 0;

        features = features.filter(function (value) {

            if (value.properties.mainType != null){

                for(var i = 0; i<filter.maintypes.length; i++) {

                    if (value.properties.mainType == filter.maintypes[i]){

                        total = total + 1;

                        return true;

                    }

                }

                return false;

            } else {

                return false;

            }

        });

        console.log("maintype: " + total);

    }

    if (filter.filteringSubTypes) {

        var total = 0;

        features = features.filter(function (value) {

            if (value.properties.subtypes != null){

                var sub = value.properties.subtypes;

                for(var i = 0; i<filter.subtypes.length; i++) {

                    for (var j=0; j<sub.length;j++) {

                        sub[j] = Object.values(sub[j]);

                        if (sub[j].includes(filter.subtypes[i]) != false) {

                            //console.log(sub[j]);

                            total = total + 1;

                            return true;

                        }
                    }

                }

                return false;

            } else {

                return false;

            }

        });

        console.log("subtype: " + total);

    }

    if (filter.aroundMe) {

        getUserLocation();

        map.flyTo({center : [userCoordinates.userLongitude, userCoordinates.userLatitude]});

        features = features.filter(function (value) {

            return (value.properties.geometry.location.lat <= userCoordinates.userLatitude + 2*latVariance
                && value.properties.geometry.location.lat >= userCoordinates.userLatitude - 2*latVariance
                && value.properties.geometry.location.lng <= userCoordinates.userLongitude + 2*lngVariance
                && value.properties.geometry.location.lng >= userCoordinates.userLongitude - 2*lngVariance);

        });

    }

    if (filter.openingHours !== null && filter.openingDay !== null) {

        var date = new Date(filter.openingDay);

        console.log(date);

        var weekday = date.getDay();

        features = features.filter(function (value) {

            if (value.properties.opening_hours != null && value.properties.opening_hours.periods != null) {

                var periods = value.properties.opening_hours.periods;

                var openings = [];

                var closings = [];

                var closingDay = [];

                // filter by day
                for (var i = 0 ; i < periods.length ; i ++) {

                    if (periods[i]["close"] != null && periods[i]["open"] != null) {

                        //if opening day match

                        if (periods[i]["open"]["day"] == weekday) {

                            //if the filter day is sunday
                            if (weekday == 6) {

                                //check if closing day is sunday or monday
                                if (periods[i]["close"]["day"] == weekday || periods[i]["close"]["day"] == 0) {

                                    openings.push(periods[i]["open"]["time"]);

                                    closings.push(periods[i]["close"]["time"]);

                                    closingDay.push(periods[i]["close"]["day"]);

                                }

                                // if the filter day is other days
                            } else {

                                //then check if closing day is the same or the next day
                                var nextday = weekday + 1;

                                if (periods[i]["close"]["day"] == weekday || periods[i]["close"]["day"] == nextday){
                                    openings.push(periods[i]["open"]["time"]);

                                    closings.push(periods[i]["close"]["time"]);



                                    closingDay.push(periods[i]["close"]["day"]);

                                }

                            }

                        }

                    }

                }

                // filter by time
                // if filter day is sunday
                if (weekday == 6) {

                    if (closingDay[0] == 0 && closingDay[1] != 0) {

                        if ( (openings[0] <= filter.openingHours || filter.openingHours <= closingDay[0]) || (openings[1] <= filter.openingHours && filter.openingHours <= closings[1]) )  {

                            return true;

                        }

                    }

                    if (closingDay[0] != 0 && closingDay[1] == 0) {

                        if ( (openings[0] <= filter.openingHours && filter.openingHours <= closingDay[0]) || (openings[1] <= filter.openingHours || filter.openingHours <= closings[1]) )  {

                            return true;

                        }

                    }


                    if (closingDay[0] != 0 && closingDay[1] != 0) {

                        if ((openings[0] <= filter.openingHours && filter.openingHours <= closings[0]) || (openings[1] <= filter.openingHours && filter.openingHours <= closings[1])) {

                            return true;

                        }

                    }

                    //if filter day is other days
                } else {

                    var nextday = weekday + 1;

                    if (closingDay[0] == nextday && closingDay[1] != nextday) {

                        if ( (openings[0] <= filter.openingHours || filter.openingHours <= closingDay[0]) || (openings[1] <= filter.openingHours && filter.openingHours <= closings[1]) )  {

                            return true;

                        }

                    }

                    if (closingDay[0] != nextday && closingDay[1] == nextday) {

                        if ( (openings[0] <= filter.openingHours && filter.openingHours <= closingDay[0]) || (openings[1] <= filter.openingHours || filter.openingHours <= closings[1]) )  {

                            return true;

                        }

                    }


                    if (closingDay[0] != nextday && closingDay[1] != nextday) {

                        if ((openings[0] <= filter.openingHours && filter.openingHours <= closings[0]) || (openings[1] <= filter.openingHours && filter.openingHours <= closings[1])) {

                            return true;

                        }

                    }

                }

            } else {

                return false;

            }

        });

    }

    /*if (filter.openingDay) {

        features = features.filter(function (value) {

            var openingHours = value.properties["opening_hours"];

            if (openingHours != null) {

                var periods = value.properties["opening_hours"]["periods"];

                if (periods != null) {

                    for (var i = 0 ; i < periods.length ; i ++) {

                        if (periods[i]["close"] != null && periods[i]["open"] != null && periods[i]["close"]["day"] == filter.openingDay && periods[i]["open"]["day"] == filter.openingDay) {

                            forcedDate = filter.openingDay;

                            return true;

                        }

                    }

                }

            }

            return false;

        });

    }*/

    filteredGeoJson.features = features;

    geoJsonSourceParsed = filteredGeoJson;

    //Update data for cluster layout
    map.getSource('places').setData(geoJsonSourceParsed);

    //Update data for heat and point layout
    map.getSource('places2').setData(geoJsonSourceParsed);

    if (filteredGeoJson.features.length == 1) {

        map.flyTo({center : filteredGeoJson.features[0].geometry.coordinates});

    } else if (!filter.aroundMe) {

        resetCamera();

    }

}

/**
 * Filters by opening hours.
 *
 * @param filter An object filter
 */
function filterDate(filter) {

    var hour = str.substring(0, str.length - str.indexOf(':')-1);

    var minute = str.substring(str.indexOf(':')+1, str.length);


    var filteredGeojson = JSON.parse(geoJsonSource);

    var features = filteredGeojson.features;

    if (filter.filteringTypes) {

        features = filteredGeojson.features.filter(function (value) {

            var values = [hour];

            var bool = false;

            for (var i = 0 ; i < filter.types.length; i++) {

                if (filter.types[i] == true) {

                    bool = bool || value.properties.type == values[i];

                }

            }

            return bool;

        });

    }

}

/**
 * Removes all current filters by setting the original geoJsonSource.
 */
function resetFilter() {

    /* reset all filter items */
    $("#search, textarea").val("");

    $('.selectpicker').selectpicker('deselectAll');

    $('.form-check input[type=checkbox]').prop('checked',false);

    $('#datetimepicker-secondSidebar').datetimepicker( 'value', {

        minDate: null,

        maxDate: null});

    /*setting the original geoJsonSource*/
    forcedDate = null;

    // Reset geoJson source
    geoJsonSourceParsed = JSON.parse(geoJsonSource);

    map.getSource('places').setData(JSON.parse(geoJsonSource));

    map.getSource('places2').setData(JSON.parse(geoJsonSource));

}

/**
 * Resets the current filters then applies filter on the geojson looking in addresses, names, subtypes, main types.
 * If the searchString is empty, it just resets the filters
 *
 * @param searchString The input in the search bar
 */
function filterSearch(searchString) {

    //resetFilter();

    if (searchString.length !== 0) {

        var total = 0;

        var filteredGeoJson = JSON.parse(geoJsonSource);

        var features = filteredGeoJson.features;

        var optionRegex = new RegExp(/!/);

        if (searchString.search(optionRegex) == -1) {

            features = features.filter(function (value) {

                var searchName = accent_fold(searchString).toLowerCase();

                var valueName = accent_fold(value.properties.name).toLowerCase();

                var valueType = accent_fold(value.properties.mainType).toLowerCase();

                var valueAddress = accent_fold(value.properties["vicinity"]).toLowerCase();

                var reviews = accent_fold(value.properties.reviews).toLowerCase();

                var subtype = false;

                if (value.properties.subtypes != null) {

                    for (var l = 0  ; l < value.properties.subtypes.length; l++) {

                        var elem = value.properties.subtypes[l];

                        if (accent_fold(elem.alias).indexOf(searchName) != -1 || accent_fold(elem.title.toLowerCase()).indexOf(searchName) != -1) {

                            subtype = true;

                            break;

                        }

                    }

                }

                if ((reviews.indexOf(searchName) != -1 || valueName.indexOf(searchName) != -1 || valueAddress.indexOf(searchName) != -1 || valueType.indexOf(searchName) != -1 || subtype)){

                    total = total + 1;

                    return true;
                }

            });

        } else {

            var openRegex = new RegExp(/open/);

            if (searchString.search(openRegex) != -1) {

                features = features.filter(function (value) {

                    var sundayRegex = new RegExp(/sunday|dimanche/);

                    var mondayRegex = new RegExp(/monday|lundi/);

                    var tuesdayRegex = new RegExp(/tuesday|mardi/);

                    var wednesdayRegex = new RegExp(/wednesday|mercredi/);

                    var thursdayRegex = new RegExp(/thursday|jeudi/);

                    var fridayRegex = new RegExp(/friday|vendredi/);

                    var saturdayRegex = new RegExp(/saturday|samedi/);

                    var regexes = [sundayRegex, mondayRegex, tuesdayRegex, wednesdayRegex, thursdayRegex, fridayRegex, saturdayRegex];

                    for (var i = 0 ; i < regexes.length ; i++) {

                        if (searchString.search(regexes[i]) != -1) {

                            if (value.properties.weekday_text != null && i < value.properties.weekday_text.length) {

                                forcedDate = i;

                                var openingHours = value.properties.weekday_text[i];

                                if (openenedFilter(openingHours)){

                                    total = total + 1;

                                    return true;

                                }

                            } else {

                                return false;

                            }

                        }

                    }

                    return false;

                });

            }

        }

        filteredGeoJson.features = features;

        map.getSource('places').setData(filteredGeoJson);

        if (filteredGeoJson.features.length == 1) {

            map.flyTo({center : filteredGeoJson.features[0].geometry.coordinates});

        } else if (!filter.aroundMe) {

            resetCamera();

        }

    }


    /*else {

        resetFilter();

        resetCamera();

    }*/

    console.log("search: " + total);

}

//######################################################################################################################
//############### DATA RETRIEVER AND JSON'S CREATION ###################################################################
//######################################################################################################################

var fetchedBars= [];

var barsString = "";

var fetchedRestaurants = [];

var restaurantsString = "";

var fetchedBarRestaurants = [];

var barsRestaurantsString = "";

var placesRequest;          // Google places API request

var counter;                // Simple counter for tasks

/**
 * Retrieves all places ids from Google's method radarSearch, then it'll call getDetailsAfterRadar().
 * Intern radar search requests callbacks are handled with radarSquareCallBack() methods.
 *
 * @param timeInterval An interval for sending requests
 */
function fetchAllPlaceRadar(timeInterval) {

    var allPlacesId = [];

    counter = 0;

    var lngStep = lngVariance * 7;

    var latStep = latVariance * 7;

    var baseBounds = {

        north: 45.788347,

        west: 4.791173,

        south: 45.788347 - latStep,

        east: 4.791173 + lngStep

    };

    var bounds = {

        north: 45.788347,

        west: 4.791173,

        south: 45.788347 - latStep,

        east: 4.791173 + lngStep

    };

    var i = 1;

    console.log("Crawling on lyon...");

    var interval = setInterval(function () {

        if (bounds.north < mapGridBounds.bottomLatitude - latVariance) {

            console.log("All data retrieved");

            console.log(JSON.stringify(allPlacesId));

            getDetailsAfterRadar(allPlacesId, 2000);

            clearInterval(interval);

        } else {

            var sw = new google.maps.LatLng(bounds.south.toFixed(6), bounds.west.toFixed(6));

            var ne = new google.maps.LatLng(bounds.north.toFixed(6), bounds.east.toFixed(6));

            var radarBounds = new google.maps.LatLngBounds(sw, ne);

            placesRequest = {

                bounds : radarBounds,

                type : "bar"

            };

            googlePlacesAPIService.radarSearch(placesRequest, function (results, status) {

                radarSquareCallBack(results, status, allPlacesId, i);

            });

            placesRequest = {

                bounds : radarBounds,

                type : "restaurant"

            };

            googlePlacesAPIService.radarSearch(placesRequest, function (results, status) {

                radarSquareCallBack(results, status, allPlacesId, i);

            });

            // test markers

            console.log(bounds);

            var position = new mapboxgl.LngLat(bounds.west.toFixed(6), bounds.north.toFixed(6));

            new  mapboxgl.Marker().setLngLat(position).addTo(map);

            position = new mapboxgl.LngLat(bounds.west.toFixed(6), bounds.south.toFixed(6));

            new  mapboxgl.Marker().setLngLat(position).addTo(map);

            position = new mapboxgl.LngLat(bounds.east.toFixed(6), bounds.north.toFixed(6));

            new  mapboxgl.Marker().setLngLat(position).addTo(map);

            position = new mapboxgl.LngLat(bounds.east.toFixed(6), bounds.south.toFixed(6));

            new  mapboxgl.Marker().setLngLat(position).addTo(map);


            if (bounds.west > mapGridBounds.rightLongitude) {

                bounds.west = baseBounds.west;

                bounds.east = bounds.west + lngStep;

                bounds.north -= latStep;

                bounds.south -= latStep;

            } else {

                bounds.west += lngStep;

                bounds.east += lngStep;

            }

            i++;

        }

    }, timeInterval);

}

/**
 * Callback that constructs the place_ids array.
 *
 * @param results A JSON formatted response from google containing a place_id
 * @param status The request status after the call
 * @param array An array containing all place_id
 * @param i A counter used to track progress of the task
 */
function radarSquareCallBack(results, status, array, i) {

    i--;

    console.log("Fetching zones : " + i + " / 31 ... Status : " + status);

    if (status === google.maps.places.PlacesServiceStatus.OK) {

        //~ console.log(results);

        for (var i = 0 ; i < results.length ; i++) {

            array.push(results[i]["place_id"]);

        }

    }

    //~ console.log(array.toString());

}

/**
 * Calls google's getPlaceDetails then build a json string for each type based on constructed arrays by callbacks containing all data.
 *
 * @param placeIds An array full of place_id
 * @param timeInterval The time in milliseconds between two requests
 */
function getDetailsAfterRadar(placeIds, timeInterval) {

    var i = 1;

    var interval = setInterval(function () {

        if (i % 100 === 0) {

            console.log("Bars : ");
            console.log(fetchedBars);
            console.log("Bar Restaurants : ");
            console.log(fetchedBarRestaurants);
            console.log("Restaurants : ");
            console.log(fetchedRestaurants);
            console.log("Total : ");
            console.log(fetchedBarRestaurants.length + fetchedBars.length + fetchedRestaurants.length);

        }

        if (i >= placeIds.length) {

            clearInterval(interval);

            for (var j = 0 ; j < fetchedBars.length ; j ++) {

                barsString += JSON.stringify(fetchedBars[j]);

                if (j !== fetchedBars.length - 1) {

                    barsString += ",";

                }

            }

            for (j = 0 ; j < fetchedRestaurants.length ; j ++) {

                restaurantsString += JSON.stringify(fetchedRestaurants[j]);

                if (j !== fetchedRestaurants.length - 1) {

                    restaurantsString += ",";

                }

            }

            for (j = 0 ; j < fetchedBarRestaurants.length ; j ++) {

                barsRestaurantsString += JSON.stringify(fetchedBarRestaurants[j]);

                if (j !== fetchedBarRestaurants.length - 1) {

                    barsRestaurantsString += ",";

                }

            }

            console.log("All details retrieved");

        } else {

            var detailsRequest = {

                placeId : placeIds[i]

            };

            googlePlacesAPIService.getDetails(detailsRequest, function (results, status) {

                if (status === "OVER_QUERY_LIMIT") {

                    console.log("State " + i + ", interruption");

                    clearInterval(interval);

                    for (var j = 0 ; j < fetchedBars.length ; j ++) {

                        barsString += JSON.stringify(fetchedBars[j]);

                        if (j !== fetchedBars.length - 1) {

                            barsString += ",";

                        }

                    }

                    for (j = 0 ; j < fetchedRestaurants.length ; j ++) {

                        restaurantsString += JSON.stringify(fetchedRestaurants[j]);

                        if (j !== fetchedRestaurants.length - 1) {

                            restaurantsString += ",";

                        }

                    }

                    for (j = 0 ; j < fetchedBarRestaurants.length ; j ++) {

                        barsRestaurantsString += JSON.stringify(fetchedBarRestaurants[j]);

                        if (j !== fetchedBarRestaurants.length - 1) {

                            barsRestaurantsString += ",";

                        }

                    }

                } else {

                    getDetailsCallback(results, status, fetchedBars, fetchedRestaurants, fetchedBarRestaurants, i, placeIds.length);

                }

            });

            i++;

        }

    }, timeInterval);

}

/**
 * Callback of google's getDetails methods, fills arrays of bars, restaurants and bar-restaurants.
 *
 * @param result A JSON formatted response from google containing a place_id
 * @param status The request status after the call
 * @param bars An array containing all bars
 * @param restaurants An array containing all restaurants
 * @param barRestaurants An array containing all barRestaurants
 * @param state A counter used to track progress of the task
 * @param progression The total of requests to proceed
 */
function getDetailsCallback(result, status, bars, restaurants, barRestaurants, state , progression) {

    state --;

    console.log("Progression : " + state + " / " + progression + " ... Status : " + status);

    if (status === google.maps.places.PlacesServiceStatus.OK) {

        //~ console.log("callback");

        var actualPlace = result;

        var isBar = checkIfPlaceIsBar(actualPlace);

        var isRestaurant = checkIfPlaceIsRestaurant(actualPlace);

        if (isBar && isRestaurant) {

            actualPlace.mainType = "Bar-restaurant";

            barRestaurants.push(actualPlace);

        } else if (isBar) {

            actualPlace.mainType = "Bar";

            bars.push(actualPlace);

        } else if (isRestaurant) {

            actualPlace.mainType = "Restaurant";

            restaurants.push(actualPlace);

        }

    }

}

/**
 * Verifies if passed place's types contains "bar".
 *
 * @param place A place retrieved with google's getDetails method
 */
function checkIfPlaceIsBar(place) {

    for (var i = 0 ; i < place.types.length ; i++)
    {

        if (place.types[i] === "bar") {

            return true;

        }

    }

    return false;

}

/**
 * Verifies if passed place's types contains "restaurant".
 *
 * @param place A place retrieved with google's getDetails method
 */
function checkIfPlaceIsRestaurant(place) {

    for (var i = 0 ; i < place.types.length ; i++)
    {

        if (place.types[i] === "restaurant") {

            return true;

        }

    }

    return false;

}

//######################################################################################################################
//############ JSON FILES LOADER AND GEOJSON GENERATION ################################################################
//######################################################################################################################

var loadedBarsString = "";

var loadedRestaurantsString = "";

var loadedBarsRestaurantsString = "";

var loadedYELPString = "";

var numberOfJSONLoadingCallbacks = 0;

/**
 * Loads all locally stored JSONs.
 */
function loadAllJSON() {

    loadBarsJSON();

    loadRestaurantsJSON();

    loadBarsRestaurantsJSON();

    loadYelpJSON();

}

/**
 * Loads locally stored bars.json.
 */
function loadBarsJSON() {

    console.log("Retrieiving Bars JSON...")

    var xobj = new XMLHttpRequest();

    xobj.overrideMimeType("application/json");

    xobj.open('GET', 'JSON/bars.json', true);

    xobj.onreadystatechange = function () {

        if (xobj.readyState === 4 && xobj.status == "200") {

            loadedBarsString = xobj.responseText;

            console.log("Success.");

            callbackLoadingJSON();

        }

    };

    xobj.send(null);

}

/**
 * Loads locally stored restaurants.json.
 */
function loadRestaurantsJSON() {

    console.log("Retreiving Restaurants JSON...")

    var xobj = new XMLHttpRequest();

    xobj.open('GET', 'JSON/restaurants.json', true);

    xobj.onreadystatechange = function () {

        if (xobj.readyState === 4 && xobj.status == "200") {

            loadedRestaurantsString = xobj.responseText;

            console.log("Success.");

            callbackLoadingJSON();

        }

    };

    xobj.send(null);

}

/**
 * Loads locally stored barsRestaurants.json.
 */
function loadBarsRestaurantsJSON() {

    console.log("Retreiving Bar-Restaurants JSON...")

    var xobj = new XMLHttpRequest();

    xobj.open('GET', 'JSON/barsRestaurants.json', true);

    xobj.onreadystatechange = function () {

        if (xobj.readyState === 4 && xobj.status == "200") {

            loadedBarsRestaurantsString = xobj.responseText;

            console.log("Success.");

            callbackLoadingJSON();

        }

    };

    xobj.send(null);

}

/**
 * Loads locally stored jsonBusinessYELP.json.
 */
function loadYelpJSON() {

    console.log("Retreiving Yelp JSON...")

    var xobj = new XMLHttpRequest();

    xobj.open('GET', 'JSON/jsonBusinessYELP.json', true);

    xobj.onreadystatechange = function () {

        if (xobj.readyState === 4 && xobj.status == "200") {

            var yelpJSON = JSON.parse(xobj.responseText);

            for (var i = 0 ; i < yelpJSON.length ; i++) {

                if (yelpJSON[i]['display_phone'] != null) {

                    yelpJSON[i]['display_phone'] = yelpJSON[i]['display_phone'].replace('+33 ', '0');

                }

            }

            loadedYELPString = JSON.stringify(yelpJSON);

            console.log("Success.");

            callbackLoadingJSON();

        }

    };

    xobj.send(null);

}

/**
 * Callback of loading JSON methods, when all.
 */
function callbackLoadingJSON() {

    numberOfJSONLoadingCallbacks++;

    if (numberOfJSONLoadingCallbacks === 4) {

        generateGeoJSON();

    }

}

/**
 * Parses all retrieved JSON strings files then starts to build the geojson string and cleans it.
 */
function generateGeoJSON() {

    console.log("Generating geojson with google data...");

    var parsedBars = JSON.parse(loadedBarsString);

    var parsedRestaurants = JSON.parse(loadedRestaurantsString);

    var parsedBarRestaurants = JSON.parse(loadedBarsRestaurantsString);

    var geoJSONString = "{\"type\" : \"FeatureCollection\", \"features\":[";

    var geoJSONItem = {

        "type": "Feature",

        "geometry": {

            "type": "Point",

            "coordinates": [null, null]

        },

        "properties": {

            "formatted_address": null,

            "formatted_phone_number": null,

            "geometry": {

                "location": {

                    "lat": null,

                    "lng": null

                }

            },

            "place_id": null,

            "name": null,

            "scope": "GOOGLE",

            "vicinity": null,

        }

    };

    for (var i = 0 ; i < parsedBars.length; i++) {

        geoJSONItem.geometry.coordinates = [parsedBars[i].geometry.location.lng, parsedBars[i].geometry.location.lat];

        geoJSONItem.geometry.name = parsedBars[i].name;

        geoJSONItem.properties.formatted_address = parsedBars[i].formatted_address;

        geoJSONItem.properties.formatted_phone_number = parsedBars[i].formatted_phone_number;

        geoJSONItem.properties.geometry.location.lat = parsedBars[i].geometry.location.lat;

        geoJSONItem.properties.geometry.location.lng = parsedBars[i].geometry.location.lng;

        geoJSONItem.properties.place_id = parsedBars[i].place_id;

        geoJSONItem.properties.name = parsedBars[i].name;

        geoJSONItem.properties.vicinity = parsedBars[i].vicinity;

        geoJSONItem.properties.mainType = parsedBars[i].mainType;

        if (parsedBars[i].rating != null) {

            geoJSONItem.properties.rating = parsedBars[i].rating;

        }

        if (parsedBars[i].reviews != null) {

            var reviews = parsedBars[i].reviews;

            var text = "";

            for (var j = 0 ; j < reviews.length ; j++) {

                text += reviews[j]['text'];

            }

            geoJSONItem.properties.reviews = text;


        }

        if (parsedBars[i].opening_hours != null) {

            geoJSONItem.properties.opening_hours = parsedBars[i].opening_hours;

        }

        if (parsedBars[i].url != null) {

            geoJSONItem.properties.url = parsedBars[i].url;

        }

        if (parsedBars[i].website != null) {

            geoJSONItem.properties.website = parsedBars[i].website;

        }

        geoJSONString += JSON.stringify(geoJSONItem);

        if (i < parsedBars.length - 1) {

            geoJSONString += ',';

        }
    }

    geoJSONString += ',';

    for (var i = 0 ; i < parsedBarRestaurants.length; i++) {

        geoJSONItem.geometry.coordinates = [parsedBarRestaurants[i].geometry.location.lng, parsedBarRestaurants[i].geometry.location.lat];

        geoJSONItem.geometry.name = parsedBarRestaurants[i]["name"];

        geoJSONItem.properties.formatted_address = parsedBarRestaurants[i].formatted_address;

        geoJSONItem.properties.formatted_phone_number = parsedBarRestaurants[i].formatted_phone_number;

        geoJSONItem.properties.geometry.location.lat = parsedBarRestaurants[i].geometry.location.lat;

        geoJSONItem.properties.geometry.location.lng = parsedBarRestaurants[i].geometry.location.lng;

        geoJSONItem.properties.place_id = parsedBarRestaurants[i].place_id;

        geoJSONItem.properties.name = parsedBarRestaurants[i].name;

        geoJSONItem.properties.vicinity = parsedBarRestaurants[i].vicinity;

        geoJSONItem.properties.mainType = parsedBarRestaurants[i].mainType;

        if (parsedBarRestaurants[i].rating != null) {

            geoJSONItem.properties.rating = parsedBarRestaurants[i].rating;

        }

        if (parsedBarRestaurants[i].reviews != null) {

            var reviews = parsedBarRestaurants[i].reviews;

            var text = "";

            for (var j = 0 ; j < reviews.length ; j++) {

                text += reviews[j]['text'];

            }

            geoJSONItem.properties.reviews = text;


        }

        if (parsedBarRestaurants[i].opening_hours != null) {

            geoJSONItem.properties.opening_hours = parsedBarRestaurants[i].opening_hours;

        }

        if (parsedBarRestaurants[i].url != null) {

            geoJSONItem.properties.url = parsedBarRestaurants[i].url;

        }

        if (parsedBarRestaurants[i].website != null) {

            geoJSONItem.properties.website = parsedBarRestaurants[i].website;

        }

        geoJSONString += JSON.stringify(geoJSONItem);

        if (i < parsedBarRestaurants.length - 1) {

            geoJSONString += ',';

        }

    }

    geoJSONString += ',';

    for (var i = 0 ; i < parsedRestaurants.length; i++) {

        geoJSONItem.geometry.coordinates = [parsedRestaurants[i].geometry.location.lng, parsedRestaurants[i].geometry.location.lat];

        geoJSONItem.geometry.name = parsedRestaurants[i]["name"];

        geoJSONItem.properties.formatted_address = parsedRestaurants[i].formatted_address;

        geoJSONItem.properties.formatted_phone_number = parsedRestaurants[i].formatted_phone_number;

        geoJSONItem.properties.geometry.location.lat = parsedRestaurants[i].geometry.location.lat;

        geoJSONItem.properties.geometry.location.lng = parsedRestaurants[i].geometry.location.lng;

        geoJSONItem.properties.place_id = parsedRestaurants[i].place_id;

        geoJSONItem.properties.name = parsedRestaurants[i].name;

        geoJSONItem.properties.vicinity = parsedRestaurants[i].vicinity;

        geoJSONItem.properties.mainType = parsedRestaurants[i].mainType;

        if (parsedRestaurants[i].rating != null) {

            geoJSONItem.properties.rating = parsedRestaurants[i].rating;

        }

        if (parsedRestaurants[i].reviews != null) {

            var reviews = parsedRestaurants[i].reviews;

            var text = "";

            for (var j = 0 ; j < reviews.length ; j++) {

                text += reviews[j]['text'];

            }

            geoJSONItem.properties.reviews = text;


        }

        if (parsedRestaurants[i].opening_hours != null) {

            geoJSONItem.properties.opening_hours = parsedRestaurants[i].opening_hours;

        }

        if (parsedRestaurants[i].url != null) {

            geoJSONItem.properties.url = parsedRestaurants[i].url;

        }

        if (parsedRestaurants[i].website != null) {

            geoJSONItem.properties.website = parsedRestaurants[i].website;

        }

        geoJSONString += JSON.stringify(geoJSONItem);

        if (i < parsedRestaurants.length - 1) {

            geoJSONString += ',';

        }

    }

    geoJSONString += ']}';

    console.log("Success.");

    //DEBUG DISPLAY
    //console.log(geoJSONString);

    cleanGeoJSON(geoJSONString);

}

/**
 * Cleans the passed geoJSONString from doublons then launches the yelp fusion procedure.
 *
 * @param geoJSONString A geojson string
 */
function cleanGeoJSON(geoJSONString) {

    console.log("Cleaning geojson from doublons...");

    var geoPlacesJSON = JSON.parse(geoJSONString)["features"];

    //~ console.log(geoPlacesJSON);

    var newPlaces = [];

    var ids = [];

    var doublons = 0;

    for (var i in geoPlacesJSON) {

        if (ids.indexOf(geoPlacesJSON[i].properties.place_id) === -1) {

            newPlaces.push(geoPlacesJSON[i]);

            ids.push(geoPlacesJSON[i].properties.place_id);

        } else {

            doublons++;

        }

    }

    var newGeoJSON = {

        type : "FeatureCollection",

        features : newPlaces

    };

    console.log("Found "+ doublons + " doublons.");

    console.log("Success.");

    fusionYelpGoogle(newGeoJSON);

}

/**
 * Adds Yelp data to Google geojson's object presents in both google and yelp, then launches addYELPElements().
 *
 * @param baseGeoJSON A geojson string
 */
function fusionYelpGoogle(baseGeoJSON) {

    console.log("Starting yelp-google fusion...");

    console.log("Merging existing google elements with similar yelp elements...");

    var time = 50;

    var yelpJSON = JSON.parse(loadedYELPString);

    var i = 0;

    var geojsonBase = baseGeoJSON;

    console.log(yelpJSON.length);

    var interval = setInterval(function () {

        console.log("Progression : " + i + " / " + yelpJSON.length);

        if (i >= yelpJSON.length) {

            i = 0;

            console.log("Success.");

            addYELPElements(geojsonBase, yelpJSON);

            clearInterval(interval);

        } else {

            for (var j = 0 ; j < geojsonBase.features.length ; j++) {

                var yelpFormattedPhone = yelpJSON[i]['display_phone'];

                var yelpFormattedAddress = accent_fold(yelpJSON[i].location.address1.toLowerCase());


                var feature = geojsonBase.features[j].properties;


                var featureFormattedPhone = feature['formatted_phone_number'];

                var featureFormattedAddress = accent_fold(feature["formatted_address"].toLowerCase());

                if (featureFormattedPhone == yelpFormattedPhone
                    || featureFormattedAddress.indexOf(yelpFormattedAddress) != -1) {

                    if (yelpJSON[i].categories != null) {

                        feature.subtypes = yelpJSON[i].categories;

                    }

                    if (yelpJSON[i].phone.length != 0 && featureFormattedPhone == null) {

                        feature["formatted_phone_number"] = yelpFormattedPhone;

                    }

                    if (yelpJSON[i].price != null) {

                        feature.price = yelpJSON[i].price;

                    }

                    if (yelpJSON[i].url != null && feature.url == null) {

                        feature.website = yelpJSON[i].url;

                    }

                    yelpJSON.splice(i, 1);

                    break;

                }

            }

        }

        i++;

    }, time);

}

/**
 * Adds Yelp data to Google geojson's object not present in google, then launches cleanPositionDoublons().
 *
 * @param geoJsonBase A Google geojson string
 * @param yelpJSON A Yelp JSON
 */
function addYELPElements(geoJsonBase, yelpJSON) {

    console.log("Adding new yelp elements to google database...");



    for (var indice = 0 ; indice < yelpJSON.length; indice++) {

        var add = true;

        var addedObject = {

            "type": "Feature",

            "geometry": {

                "type": "Point",

                "coordinates": [yelpJSON[indice].coordinates.longitude, yelpJSON[indice].coordinates.latitude],

                "name": yelpJSON[indice].name

            },

            "properties": {

                "formatted_address": yelpJSON[indice].location['display_address'],

                "formatted_phone_number": null,

                "geometry": {

                    "location": {

                        "lat": yelpJSON[indice].coordinates.latitude,

                        "lng": yelpJSON[indice].coordinates.longitude

                    }

                },

                "place_id": yelpJSON[indice].id,

                "name": yelpJSON[indice].name,

                "rating": yelpJSON[indice].rating,

                "scope": "YELP",

                "vicinity": yelpJSON[indice].location['display_address'][0],

                "mainType": "Bar-Restaurant"

            }

        };

        if (yelpJSON[indice]['display_phone'] != null) {

            addedObject.properties['formatted_phone_number'] = yelpJSON[indice]['display_phone'];

        }

        if (yelpJSON[indice].price != null) {

            addedObject.properties.price = yelpJSON[indice].price;

        }

        if (yelpJSON[indice].categories != null) {

            subType.push(yelpJSON[indice].categories);

            addedObject.properties.subtypes = yelpJSON[indice].categories;

            for (var j = 0 ; j < yelpJSON[indice].categories.length ; j++) {

                if (yelpJSON[indice].categories[j].alias.indexOf('bars') != -1) {

                    addedObject.mainType = "Bar";

                    break;

                } else if (yelpJSON[indice].categories[j].alias.indexOf('restaurants') != -1) {

                    addedObject.mainType = "Restaurant";

                    break;

                }

            }

        }

        if (yelpJSON[indice].url != null) {

            addedObject.properties.url = yelpJSON[indice].url;

        }

        geoJsonBase.features.push(addedObject);

    }

    console.log("Success.");

    //console.log(JSON.stringify(geoJsonBase));

    cleanPositionDoublons(geoJsonBase);

}

/**
 * Cleans geojson to prevent from object's position duplicates, then set the geoJsonSource gobal variable.
 *
 * @param geoJSONSourceBase A geojson string
 */
function cleanPositionDoublons(geoJSONSourceBase) {

    console.log("Cleaning positions doublons...");

    var geoJSONParsed = geoJSONSourceBase;

    var features = geoJSONParsed.features;

    for (var i = 0 ; i < features.length - 1; i++) {

        console.log("Progression... " + i + " / " + features.length);

        for (var j = i + 1; j < features.length; j++) {

            if (features[i].properties.latitude == features[j].properties.latitude && features[i].properties.longitude == features[j].properties.longitude) {

                if (features[i].properties["formatted_phone_number"] == features[j].properties["formatted_phone_number"]) {

                    features.splice(j, 1);

                } else {

                    features[i].properties.geometry.location.lat += 0.000010;

                    features[i].properties.geometry.location.lng += 0.000010;

                    features[i].geometry.coordinates[0] = features[i].properties.geometry.location.lng;

                    features[i].geometry.coordinates[1] = features[i].properties.geometry.location.lat;

                    j = features.length;

                }

            }

        }

    }

    console.log("Success.");

    geoJsonSource = JSON.stringify(geoJSONParsed);

}

function download(textBlock) {

    let newWindow = window.open("about:blank", "", "_blank");

    if (newWindow) {

        newWindow.document.write(textBlock);

    }
}



//#####################################################################################################################################
//#### COPYRIGHTS @ Andrew ALBERT & François ROBERT & Rodislav IVANOV & Nguyen NGUYEN & Nelly BARRET & Louis LE BRUN - LIFPROJET 2018##
//#####################################################################################################################################
