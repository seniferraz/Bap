//  —— inicializações   —————————————————————————————

//Google Maps api key
var googleMapsApiKey = 'AIzaSyA2VPJOkLkP7xVjMsgQY6n7BA4yRqu3tQg';

var api_key = 'pGGIf6rZKW1YcIXnIrDHk7fTbvjwXsht';
//var api_key = 'Hr4r14bPbRdZq220clN8zGAvKvrO0TAz';

//URL pedido behance
var URL = 'https://api.behance.net/v2/users';


// Nome do utilizador (username, nome ou apelido), localização e campos de criação a analisar
var query;
var locations;
var fields;

//foto perfil user
var image = "";
var userImageMarker = [];


// Geocoding
var userLat;
var userLng;

var userPos = {
    x: [],
    y: []
};


var mark = [];

//Campos de criação e respetiva cor 
var colors = {
    field: ['Animation', 'Graphic Design', 'Branding', 'Photography', 'Architecture', "Interaction Design", 'Drawing', 'Illustration', 'Typography', 'Packaging', 'Digital Art', 'Film', 'Design', 'UI/UX', 'Advertising', 'Calligraphy', 'Art Direction', 'Interaction Design', 'Web Design', 'Fashion', 'Industrial Design'],
    color: ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B', '#000000', '#f500ff'],
    used: ['false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false'],
    users: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};


//  —— Behance api   —————————————————————————————

$(function () {
    $(".spinner").hide();

    $("#search").click(search); //search quando se carrega no botão

    $('input').keypress(function (ev) {
        if (ev.keyCode === 13) {
            search(); //ou quando se faz enter num input
        }
    });

});

function search() {
    $("#dados").empty();
    //console.log("carregou");

    query = $("#name").val();
    locations = $("#city").val();
    fields = $("#fields").val();

    //console.log("QUERY == " + query);
    //console.log("location == " + locations);
    //console.log("fields == " + fields);

    searching();

    getUserInfo();


}

function getUserInfo() {
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

        //var tamanho = 0;

        //ir buscar foto de perfil de cada utilizador
        for (var s in response.users[i].images) {
            image = response.users[i].images[s];
            break;
            //para guardar a segunda

            /*if (tamanho == 1) {
               break; 
            }*/
            //tamanho++;
        }


        //guarda todas as imagens dos users num array
        userImageMarker[i] = image;



        //campo de criação mais popular de cada user - [0] do split
        var popularField = String(response.users[i].fields);
        popularField = popularField.split(",")[0];
        //console.log("splited::" + popularField);

        //atribui cor do círculo de acordo com o field mais popular do user
        for (var k = 0; k < colors.field.length; k++) {
            if (popularField === String(colors.field[k])) {
                var userColor = colors.color[k];
                //para adicionar à barra de legenda
                
                // ——— Não pode ser aqui, só pode ser considerado true, aqueles que são mostrados
                
                colors.used[k] = 'true';
                
                colors.users[k]++;

                console.log("USERS de " + colors.field[k] + ": " + colors.users[k]);
                
                //console.log("USERCOLOR ==  " + userColor + ", " + popularField);
                break;
                
            } else { //se field do user não for nenhum com cor definida, a borda fica da cor definida abaixo
                userColor = '#22ff44';
                //console.log(userColor);
            }
        }



        //detetar se o utilizador tem foto de perfil

        var string = String(image);
        var substring = "/img/profile/no-image";

        if (string.includes(substring))
            break;

        //apenas mostra as pessoas com campos de criação
        if ((popularField != "")) {

            $("#dados").append("<hr>");
            $("#dados").append("<p>" + userName + "</p>");
            $("#dados").append("<p><a href=" + userURL + ">Link Behance</a></p>");
            $("#dados").append('<img class = "userImage" id="user' + i + '" src=' + image + ' height="90" width="90" alt="Profile Image">');
            $("#dados").append("<p> City: " + city + "</p>");
            $("#dados").append("<p> Fields: " + fields + "</p>");
            $("#dados").append("<p> FIELD MAIS POPULAR: " + popularField + "</p>");
            $("#dados").append("<p> COR DO FIELD: " + userColor + "</p>");

            //atribuir borda a foto e respetiva cor
            $("#user" + i).css("border-weight", "4px");
            $("#user" + i).css("border-color", userColor);



            /*—————— Geocoding ————————— */


            //https://developers.google.com/maps/documentation/javascript/geocoding

            $.getJSON({
                url: 'https://maps.googleapis.com/maps/api/geocode/json',
                data: {
                    sensor: false,
                    address: city
                },

                success: function (data, textStatus) {
                    //console.log(textStatus, data);
                    //console.log(data.results[0].geometry.location);
                    userLat = data.results[0].geometry.location.lat;
                    userLng = data.results[0].geometry.location.lng;

                    userPos.x[i] = data.results[0].geometry.location.lat;
                    userPos.y[i] = data.results[0].geometry.location.lng;

                    //console.log(userPos.x[i] + "userLat");
                    //console.log(userPos.y[i] + "userLng");
                },

                error: function () {
                    alert("error");
                }
            });


            /*—————— FIM Geocoding ————————— */




        }

        initMap();
        $(".spinner").hide();
    }


    ShowLegend();



    /*—————— Chart ————————— */
    // Só corre o drawChart depois dos resultados da pesquisa serem processados, para estes poderem ser usados no gráfico
    drawChart();

    $("#moreinfo").show();

}




//preenche o footer legenda com as cores do array colors
function ShowLegend() {

    $("#footer").empty();

    //preenche o footer legenda com as cores do array colors
    for (var k = 0; k < colors.field.length; k++) {
        if (colors.used[k] == 'true') {
            /*$("#footer").append('<span class="shapes" id="shape' + k + '"></span>');*/
            $("#footer").append('<div class="legend" id="shape' + k + '"></div>');
            $("#footer").append('<div class="fieldsLegend">' + colors.field[k] + '</div>');
            // $("#footer").append("<p>" + colors.field[k] + "</p>");
            $("#shape" + k + "").css("border-color", colors.color[k]);
        }
        /*$("#shape" + k + "").css("border-color", colors.color[k]);*/

        /*        $("#shape" + k + "").hover(function(){
                $(this).css("border-color", "black");
                }, function(){
                $(this).css("border-color", colors.color[k]);
            });*/
    }
}




function log(message) {
    $("#status").append(message + "<br>");
}

function logError(actividade) {
    return function (data) {
        $("#status").append("Erro ao " + actividade + ": " + data.statusText + "<br/>");
        $("#status").append("Utilizador não existe <br/>");
    }
}

function searching() {
    //$("#status").empty();
    $(".spinner").show();
}



//GOOGLE MAPS API   ———————————————————

var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 40.2033145,
            lng: -8.4102573
        },
        zoom: 10,
        disableDefaultUI: true,
        //draggableCursor: 'grab',
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

    //centrar no resize
    google.maps.event.addDomListener(window, 'load', initMap);
    google.maps.event.addDomListener(window, "resize", function () {
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
    });
}


function markers() {

    //cria o numero de marcadores de acordo com o numero de users a mostrar
    for (var k = 0; k < userImageMarker.length; k++) {
        mark[k] = "marker" + k;
    }

    for (var i = 0; i < mark.length; i++) {

        var randomize = ((Math.random() * 2) - 1) / 10;
        var randomize2 = ((Math.random() * 2) - 1) / 10;


        if (userPos.x[i] == undefined)
            userPos.x[i] = 40.2033145;

        if (userPos.y[i] == undefined)
            userPos.y[i] = -8.4102573;


        var x = (userPos.x[i] + randomize);
        var y = (userPos.y[i] + randomize2);


        //console.log("XXXXX   " + userPos.x[i]);
        //console.log("YYYYY   " + userPos.y[i]);

        var pos = {
            lat: x,
            lng: y
        };

        //console.log("userImageMarker:::::  " + userImageMarker[i]);


        /* google.maps.event.addListener(map, 'zoom_changed', function () {
                 var zoomLevel = map.getZoom();
                 tamanho = map.getZoom();
                 console.log("ZOMMMM é de :   " + zoomLevel);
                 //this is where you will do your icon height and width change.
                 // scaledSize: new google.maps.Size(tamanho, tamanho);
                });*/


        mark[i] = new google.maps.Marker({
            position: pos,
            optimized: true,
            fillColor: "#0000FF",
            map: map,
            name: "marker" + i,
            scaledSize: new google.maps.Size(50, 50), // scaled size
            animation: google.maps.Animation.DROP,
            icon: {
                url: userImageMarker[i],
                scaledSize: new google.maps.Size(50, 50)
            }
        });
    }
}







// Autocomplete search — ainda não dá

//https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete
