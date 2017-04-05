//  —— inicializações   —————————————————————————————


//Google Maps api key
var googleMapsApiKey = 'AIzaSyA2VPJOkLkP7xVjMsgQY6n7BA4yRqu3tQg';

//var api_key = 'pGGIf6rZKW1YcIXnIrDHk7fTbvjwXsht';
var api_key = 'Hr4r14bPbRdZq220clN8zGAvKvrO0TAz';

//var URL = 'https://api.behance.net/v2/users/';
var URL = 'https://api.behance.net/v2/users';


// Nome do utilizador (username, nome ou apelido), localização e campos de criação a analisar
var query;
var locations;
var fields;

//foto perfil user
var image = "";


var colors = {
    field: ['Animation', 'Graphic Design', 'Branding', 'Photography', 'Architecture', "Interaction Design", 'Drawing', 'Illustration', 'Typography', 'Packaging', 'Digital Art', 'Film', 'Design', 'UI/UX'],
    color: ['#c405cc', '#0014ff', '#ff7600', '#00ff31', '#ffff00', '#00f5ff', '#6d6d6d', '#af4d4d', '#000000', '#774501', '#e50be5', '#0b7b65', '#9d00ff', '#0076ff']
};


//  —— código   —————————————————————————————


$(function () {
    $("#load").hide();

    $("#search").click(search); //search quando se carrega no botão

    $('input').keypress(function (ev) {
        if (ev.keyCode === 13) {
            search(); //ou quando se faz enter num input
        }
    });
});

function search() {
    $("#dados").empty();
    console.log("carregou");

    query = $("#name").val();
    locations = $("#city").val();
    fields = $("#fields").val();

    console.log("QUERY == " + query);
    console.log("location == " + locations);
    console.log("fields == " + fields);

    searching();

    getUserInfo();
}

function getUserInfo() {

    //log("Obter informação de " + query + " ...");

    $.ajax({
        url: URL + "?q=" + query,
        dataType: "jsonp",
        data: {
            api_key: api_key,
            sort: 'followed',
            city: locations,
            field: fields
        },
        timeout: 1500,
        success: processUserInfo,
        error: logError("a procurar utilizador")
    });
}


function processUserInfo(response) {

    //processa dados do utilizador (response) e mostra-os
    for (var i = 0; i < response.users.length; i++) {

        var userName = response.users[i].display_name;
        var fields = response.users[i].fields;
        var city = response.users[i].city;
        var userURL = response.users[i].url;

        //get most popular field of each user
        var popularField = String(response.users[i].fields);
        popularField = popularField.split(",")[0];
        console.log("splited::" + popularField);

        //atribuite color according to field
        for (var k = 0; k < colors.field.length; k++) {
            if (popularField === String(colors.field[k])) {
                var userColor = colors.color[k];
                console.log("USERCOLOR ==  " + userColor);
            }

        }



        for (var s in response.users[i].images) {
            image = response.users[i].images[s];
            //break;
        }

        //apenas mostra as pessoas com campos de criação e com foto de perfil    

        if (popularField && String(image) !== "https://a5.behance.net/8dd1f2dd8a3d018de5e63f073e413867597ca251/img/profile/no-image-138.jpg?cb=264615658") {


            $("#dados").append("<hr>");
            $("#dados").append("<p>" + userName + "</p>");

            $("#dados").append('<img class = "userImage" id="user' + i + '" src=' + image + ' height="90" width="90" alt="Profile Image">');

            $("#dados").append("<a href=" + userURL + ">Link Behance</a>");

            $("#dados").append("<p> City: " + city + "</p>");
            $("#dados").append("<p> Fields: " + fields + "</p>");
            $("#dados").append("<p> FIELD MAIS POPULAR: " + popularField + "</p>");
            $("#dados").append("<p> COR DO FIELD: " + userColor + "</p>");

            var cor = "#0505cc";
            //$("#user"+i).css("border","4px solid #0505cc");
            $("#user" + i).css("border-weight", "4px");

            $("#user" + i).css("border-color", userColor);


        }
        console.log("IMAGEMMMM  -- " + image + " --   MErda");
        initMap();
    }
}



function log(message) {
    $("#status").append(message + "<br>");
}

function logError(actividade) {
    return function (data) {
        $("#status").append("Erro ao " + actividade + ": " + data.statusText + "<br/>");
        $("#status").append("Utilizador não existe <br/>");
        searchAgain();
    }
}

function searching() {
    //$("#procura").hide();
    $("#status").empty();

    //log("Procurando informação sobre " + query);
}

function searchAgain() {
    $("#procura").show();
    $("#load").hide();
}






//GOOGLE MAPS API   ———————————————————



var mark = ["marker1", "marker2"];


var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 40.2033145,
            lng: -8.4102573
        },
        zoom: 12,
        disableDefaultUI: true,
        //https://developers.google.com/maps/documentation/javascript/controls

        styles: [
            {
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#f5f5f5"
      }
    ]
  },
            {
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
      }
    ]
  },
            {
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#616161"
      }
    ]
  },
            {
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#f5f5f5"
      }
    ]
  },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#bdbdbd"
      }
    ]
  },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#eeeeee"
      }
    ]
  },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#757575"
      }
    ]
  },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#e5e5e5"
      }
    ]
  },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#9e9e9e"
      }
    ]
  },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#ffffff"
      }
    ]
  },
            {
                "featureType": "road.arterial",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#757575"
      }
    ]
  },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#dadada"
      }
    ]
  },
            {
                "featureType": "road.highway",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#616161"
      }
    ]
  },
            {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#9e9e9e"
      }
    ]
  },
            {
                "featureType": "transit.line",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#e5e5e5"
      }
    ]
  },
            {
                "featureType": "transit.station",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#eeeeee"
      }
    ]
  },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#c9c9c9"
      }
    ]
  },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#9e9e9e"
      }
    ]
  }
]
    });

    markers();
}


function markers() {

    var randomize = Math.random()/10;
    
    var anda = (40.2033145+randomize);
    
    var uluru = {
        lat: anda,
        lng: -8.4102573
    };


    for (var i = 0; i < 2; i++) {
        mark[i] = new google.maps.Marker({
            position: uluru,
            map: map,
            name: "nome1",
            icon: image
            
        });

    }
    
    initMap();
}



// Autocomplete search — ainda não dá

//https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete