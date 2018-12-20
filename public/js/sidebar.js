/* Open/close first sidebar*/
$(document).ready(function () {

    $("#sidebar").mCustomScrollbar({

        theme: "minimal"

    });

    $('#sidebarCollapse').on('click', function () {

        $('#sidebar').toggleClass('active');

        $('#sidebarCollapse').toggleClass('open');

        $('.collapse.in').toggleClass('in');

        $('#closeDirection').toggleClass('close');

    });

});

/* Second sidebar for informations */

$(document).ready(function () {

    $('#info').on('click', function () {

        /* button unclicked */
        if(!$('#info').hasClass('open')){

            displayContent('info');

        }

        else{

            closeSecondSidebar();
        }

    });

});

/* Second sidebar for filter */
$(document).ready(function () {

    $('#filter').on('click', function () {

       /* button unclicked */

        if (!$('#filter').hasClass('open')) {

            displayContent('filter');

        }

        else{

            closeSecondSidebar();

        }

    });

});

/* Second sidebar for settings */
$(document).ready(function () {

    $('#setting').on('click', function () {

        /* button unclicked */
        if(!$('#setting').hasClass('open')) {

            displayContent('setting');

        }

        else{

            closeSecondSidebar();

        }

    });

});

/* Second sidebar for showing contacts */
$(document).ready(function () {

    $('#contact').on('click', function () {

        /* button unclicked */
        if(!$('#contact').hasClass('open')) {

            displayContent('contact');

        }

        else{

            closeSecondSidebar();

        }

    });

});

/* Undisplay button open/close first sidebar while second one opening */
$(document).ready(function () {

    $('#sidebar li').on('click', function () {

        if ($('#second-sidebar').hasClass('active')) {

            $('#sidebarCollapse').addClass('close');
        }

        else {

            $('#sidebarCollapse').removeClass('close');

        }

    });

});

/* Close second sidebar on clicking button */
$(document).ready(function () {

    $('#close-secondSidebar').on('click', function () {

        closeSecondSidebar();

    });

});

/* Insert legend in map While changing for viewpoints */
$(document).ready(function () {

    $('#viewPoints').on('click', function () {

        $('#legend').appendTo('#map');

        $('#smallLegend').appendTo('#map');

    });

});

// if option "Around Me" checked then disable others and recto verso
$(document).ready(function () {

    $("#location").on('change', function() {

        if ($('optgroup[label="Other"] option').prop("selected")==true) {

            $('optgroup[label="Department"]').prop('disabled', true);

            $('#location').selectpicker('refresh');

        }else{

            $('optgroup[label="Department"]').prop('disabled', false);

            $('#location').selectpicker('refresh');

        }

        if($('optgroup[label="Department"] option').filter(":selected").length != 0){

            $('optgroup[label="Other"]').prop('disabled', true);

            $('#location').selectpicker('refresh');

        }else{

            $('optgroup[label="Other"]').prop('disabled', false);

            $('#location').selectpicker('refresh');

        }

    });

});



/**********************************************************************************************************************/
/*******************************************************FUNCTIONS******************************************************/
/**********************************************************************************************************************/
function closeSecondSidebar(){

    $('#second-sidebar').removeClass('active');

    $('#map').removeClass('active');

    $('.mapboxgl-ctrl-bottom-right').removeClass('active');

    $('.mapboxgl-ctrl-top-right').removeClass('active');

    $('#info').removeClass('open');

    $('#filter').removeClass('open');

    $('#setting').removeClass('open');

    $('#contact').removeClass('open');

    $('#info-content').removeClass('open');

    $('#filter-content').removeClass('open');

    $('#setting-content').removeClass('open');

    $('#contact-content').removeClass('open');

    $('#sidebarCollapse').removeClass('close');

};

/* Open direction control in map */
function openDirectionControl() {

    closeSecondSidebar();

};

/* Display content */
function displayContent(thisContent){

    var button = "#" + thisContent;

    var content = "#" + thisContent + "-content";

    if($('#second-sidebar').hasClass('active')){

        /*remove open from all li*/
        $('#info').removeClass('open');

        $('#filter').removeClass('open');

        $('#setting').removeClass('open');

        $('#contact').removeClass('open');

        /*close all contents*/
        $('#info-content').removeClass('open');

        $('#filter-content').removeClass('open');

        $('#setting-content').removeClass('open');

        $('#contact-content').removeClass('open');

        /*modify position of mapbox controls*/
        $('.mapboxgl-ctrl-bottom-right').addClass('active');

        $('.mapboxgl-ctrl-top-right').addClass('active');

        /*display content*/
        $(button).addClass('open');

        $(content).addClass('open');

    }

    /* second sidebar closed*/
    else {

        /* Redimension map while second sidebar is opening */
        $('#map').addClass('active');

        /*first sidebar closed*/
        if(!$('#sidebar').hasClass('active')){

            if (!$('#sidebarCollapse').hasClass('open')) {

                $('#sidebarCollapse').addClass('open');

                $('#sidebarCollapse').addClass('close');

            }

            else {

                $('#sidebarCollapse').addClass('close');

            }

            $('#sidebar').addClass('active');

        }

        /*add active for second sidebar*/
        $('#second-sidebar').addClass('active');

        /*remove open from all li*/
        $('#info').removeClass('open');

        $('#filter').removeClass('open');

        $('#setting').removeClass('open');

        $('#contact').removeClass('open');

        /*close all contents*/
        $('#filter-content').removeClass('open');

        $('#setting-content').removeClass('open');

        $('#contact-content').removeClass('open');

        /*modify position of mapbox controls*/
        $('.mapboxgl-ctrl-bottom-right').addClass('active');

        $('.mapboxgl-ctrl-top-right').addClass('active');

        /*display content*/
        $(button).addClass('open');

        /*content fade in when second sidebar already finish opening*/
        setTimeout(function(){ $(content).addClass('open'); }, 500);

    }

}


/* Display heatmap checkbox while points checked */
function displayHeat(){

    if($('#viewPoints').is(":checked")) {

        $('#heatMap').addClass('active');

    }
    else {

        $('#heatMap').removeClass('active');

    }
    
};