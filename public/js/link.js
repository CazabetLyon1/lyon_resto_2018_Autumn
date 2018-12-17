$(document).ready(function(){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
        $('.selectpicker').selectpicker('mobile');
    }
    // if option "Around Me" checked then disable others and recto verso
    $("#locationHome").on('change', function() {
        if ($('.navbar optgroup[label="Other"] option').prop("selected")==true) {
            $('.navbar optgroup[label="Department"]').prop('disabled', true);
            $('#locationHome').selectpicker('refresh');
        }else{
            $('.navbar optgroup[label="Department"]').prop('disabled', false);
            $('#locationHome').selectpicker('refresh');
        }
        if($('.navbar optgroup[label="Department"] option').filter(":selected").length != 0){
            $('.navbar optgroup[label="Other"]').prop('disabled', true);
            $('#locationHome').selectpicker('refresh');
        }else{
            $('.navbar optgroup[label="Other"]').prop('disabled', false);
            $('#locationHome').selectpicker('refresh');
        }
    });
    // if option "Around Me" checked then disable others and recto verso
    $("#advancedLocationHome").on('change', function() {
        if ($('.modal optgroup[label="Other"] option').prop("selected")==true) {
            $('.modal optgroup[label="Department"]').prop('disabled', true);
            $('#advancedLocationHome').selectpicker('refresh');
        }else{
            $('.modal optgroup[label="Department"]').prop('disabled', false);
            $('#advancedLocationHome').selectpicker('refresh');
        }
        if($('.modal optgroup[label="Department"] option').filter(":selected").length !== 0){
            $('.modal optgroup[label="Other"]').prop('disabled', true);
            $('#advancedLocationHome').selectpicker('refresh');
        }else{
            $('.modal optgroup[label="Other"]').prop('disabled', false);
            $('#advancedLocationHome').selectpicker('refresh');
        }
    });
});

$("#example, body").vegas({
    delay: 11000,
    slides: [
        { src: "Img/sonja-punz-538560-unsplash.jpg"},
        { src: "Img/abhishek-sanwa-limbu-782224-unsplash.jpg" },
        { src: "Img/bowl-chairs-cooking-262918.jpg" },
        { src: "Img/appetizer-breakfast-cuisine-326278.jpg"},
        { src: "Img/apricot-background-berry-1028599.jpg" },
        { src: "Img/antipasti-delicious-dinner-5876.jpg" },
    ]
});

// While modal opening , refresh search
$("#advanced-modal").on("show.bs.modal", function(){
    $("#searchHome").val("");
    $("#locationHome").val('default');
    $("#priceHome").val('default');
    $("#ratingHome").val('default');
    $("#locationHome").selectpicker('refresh');
    $("#priceHome").selectpicker('refresh');
    $("#ratingHome").selectpicker('refresh');
});
// While modal closed , refresh advanced search
$("#advanced-modal").on("hidden.bs.modal", function(){
    $("#advancedSearchHome").val("");
    $("#advancedLocationHome").val('default');
    $("#advancedPriceHome").val('default');
    $("#advancedRatingHome").val('default');
    $("#advancedTypeHome").val('default');
    $("#datetimepicker").val('default');
    $("#advancedLocationHome").selectpicker('refresh');
    $("#advancedPriceHome").selectpicker('refresh');
    $("#advancedRatingHome").selectpicker('refresh');
    $("#advancedTypeHome").selectpicker('refresh');
    $("#datetimepicker").datepicker('refresh');
});



function sendData()
{
    //***Search***
    var search_input = $('#searchHome').val();
    var search_input_advanced = $('#advancedSearchHome').val();


    //***Types****
    var selected_main_types = $('#advancedMainTypeHome').val();
    var selected_sub_types = $('#advancedSubTypeHome').val();


    //***Locations****
    var selected_locations = $('#locationHome').val();
    var selected_locations_advanced = $('#advancedLocationHome').val();


    //***Prices****
    var selected_prices = $('#priceHome').val();
    var selected_prices_advanced = $('#advancedPriceHome').val();

    //***Rating****
    var selected_ratings = $('#ratingHome').val();
    var selected_ratings_advanced = $('#advancedRatingHome').val();


    //***DateTime****
    var openTime = $('#datetimepicker').val();

    if ((search_input.length == 0) && (selected_locations.length == 0) && (selected_prices.length == 0) && (selected_ratings.length == 0) && (search_input_advanced.length == 0) && (selected_main_types.length != 0) && (selected_sub_types.length == 0) && (selected_locations_advanced.length == 0) && (selected_prices_advanced.length == 0) && (selected_ratings_advanced.length == 0) && (openTime.length == 0)) {

        window.location = "./map.html";

    }
    else {

        if ((search_input_advanced.length == 0) && (selected_main_types.length == 0) && (selected_sub_types.length == 0) && (selected_locations_advanced.length == 0) && (selected_prices_advanced.length == 0) && (selected_ratings_advanced.length == 0) && (openTime.length == 0)) {
            var data = new Array();
            data[0] = selected_locations;
            data[1] = selected_prices;
            data[2] = selected_ratings;
            data[3] = "";
            data[4] = "";
            data[5] = "";
            data[6] = search_input;

            // Initialize packed or we get the word 'undefined'
            var packed = "";
            for (i = 0; (i < data.length); i++) {
                if (i > 0) {
                    packed += ",";
                }
                packed += escape(data[i]);
            }
            //console.log(data);
            //console.log(packed);
            //document.data.data.value = packed;
            //document.data.submit();
            window.location.href = "/map.html?" + packed;
        }
        if ((search_input_advanced.length != 0) || (selected_main_types.length != 0) || (selected_sub_types.length != 0) || (selected_locations_advanced.length != 0) || (selected_prices_advanced.length != 0) || (selected_ratings_advanced.length != 0) || (openTime.length != 0)) {
            var dataAdvanced = new Array();
            dataAdvanced[0] = selected_locations_advanced;
            dataAdvanced[1] = selected_prices_advanced;
            dataAdvanced[2] = selected_ratings_advanced;
            dataAdvanced[3] = selected_main_types;
            dataAdvanced[4] = selected_sub_types;
            dataAdvanced[5] = openTime;
            dataAdvanced[6] = search_input_advanced;

            // Initialize packed or we get the word 'undefined'
            var packed = "";
            for (i = 0; (i < dataAdvanced.length); i++) {
                if (i > 0) {
                    packed += ",";
                }
                packed += escape(dataAdvanced[i]);
            }
            //console.log(dataAdvanced);
            //console.log(packed);
            //document.dataAdvanced.data.value = packed;
            //document.dataAdvanced.submit();
            window.location = "/map.html?" + packed;
        }
    }
}