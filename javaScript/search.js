//  —— inicializações   —————————————————————————————


$("#start").hover(function () {
    console.log("foi para cima");
    $("#startAnimation").show(400);
    $("body").hide();
});


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


var userName = [];
var fields = [];
var city = [];
var userURL = [];
var userField = [];
var userColor = [];


var userPos = {
    x: [],
    y: []
};


var mark = [];

//Campos de criação, respetiva cor, se é usado (existe nos resultados da pesquisa) e nº de users (dos resultados)
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



    $(".userImage").mouseover(function () {
        console.log("ANDAAAAA");
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
            field: fields,
            page: 1 //iterar para ver mais users (com for não deu)
        },
        timeout: 1500,
        success: processUserInfo,
        error: logError("a procurar utilizador")
    });
}



function processUserInfo(response) {

    for (var k = 0; k < colors.field.length; k++) {

        //reposição dos valores "used" e "users" de cada field para mostragem na legenda e no gráfico
        colors.used = ['false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false'];
        colors.users = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    }



    //processa dados do utilizador (response) e mostra-os
    for (var i = 0; i < response.users.length; i++) {

        userName[i] = response.users[i].display_name;
        fields[i] = response.users[i].fields;
        city[i] = response.users[i].city;
        userURL[i] = response.users[i].url;

        //campo de criação mais popular de cada user - [0] do split
        userField[i] = response.users[i].fields[0];

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



    }
    
    
    
    console.log(userName.length + " userName.length");
    console.log(" — — — — — — ");
    console.log(userField.length + " fields.length");
    console.log(" — — — — — — ");
    console.log(city.length + " city.length");
    console.log(" — — — — — — ");
    console.log(userURL.length + " userURL.length");
    console.log(" — — — — — — ");
    console.log(userImageMarker.length + " userImageMarker.length");


    for (var i = 0; i < userName.length; i++) {


        /*—————— Geocoding ————————— */



        //https://developers.google.com/maps/documentation/javascript/geocoding

        $.getJSON({
            url: 'https://maps.googleapis.com/maps/api/geocode/json',
            data: {
                sensor: false,
                address: city[i]
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




        //atribui cor do círculo de acordo com o field mais popular do user
        for (var k = 0; k < colors.field.length; k++) {
            console.log(userField[i] + "");
            if (userField[i] === String(colors.field[k])) {
                userColor[i] = colors.color[k];

                //para adicionar à barra de legenda

                // ——— Não pode ser aqui, só pode ser considerado true, aqueles que são mostrados

                colors.used[k] = 'true';

                colors.users[k]++;
                break;

            } else { //se field do user não for nenhum com cor definida, a borda fica da cor definida abaixo
                userColor[i] = '#22ff44';
                //console.log(userColor);
            }

        }

        console.log("USER COLOR " + userColor[i]);

        //detetar se o utilizador tem foto de perfil

        var string = String(image);
        var substring = "/img/profile/no-image";

        if (string.includes(substring))
            break;

        //apenas mostra as pessoas com campos de criação
        if ((userField[i] != "")) {

            $("#dados").append("<hr>");
            $("#dados").append("<p>" + userName[i] + "</p>");
            $("#dados").append("<p><a href=" + userURL[i] + ">Link Behance</a></p>");
            $("#dados").append('<img class = "userImage" id="user' + i + '" src=' + userImageMarker[i] + ' height="90" width="90" alt="Profile Image">');
            $("#dados").append("<p> City: " + city[i] + "</p>");
            $("#dados").append("<p> Fields: " + fields[i] + "</p>");
            $("#dados").append("<p> FIELD MAIS POPULAR: " + userField[i] + "</p>");
            $("#dados").append("<p> COR DO FIELD: " + userColor[i] + "</p>");

            //atribuir borda a foto e respetiva cor
            $("#user" + i).css("border-weight", "4px");
            $("#user" + i).css("border-color", userColor[i]);

        }

        $(".spinner").hide();
        
        
    }


    //initMap();
    ShowLegend();
    //initialize();
    /*—————— Chart ————————— */
    // Só corre o drawChart depois dos resultados da pesquisa serem processados, para estes poderem ser usados no gráfico
    drawChart();

    $("#moreinfo").show();



//    setTimeout(function () {
        initialize();
//    }, 3000);

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




var overlay;

function initialize() {


    var myLatLng = new google.maps.LatLng(52.323907, -150.109291);
    var mapOptions = {
        zoom: 8,
        center: myLatLng,
        mapTypeId: google.maps.MapTypeId.SATELLITE
    };

    var gmap = new google.maps.Map(document.getElementById('map'), mapOptions);

    function HTMLMarker(lat, lng) {
        this.lat = lat;
        this.lng = lng;
        this.pos = new google.maps.LatLng(lat, lng);
    }

    HTMLMarker.prototype = new google.maps.OverlayView();
    HTMLMarker.prototype.onRemove = function () {}

    //init your html element here



    console.log("passou");
    console.log(image + "   image url");


    for (var i = 0; i < userColor.length; i++) {

        HTMLMarker.prototype.onAdd = function () {
            div = document.createElement('DIV');
            div.style.position = 'absolute';
            div.className = userField[2] + " roundCorners";
            console.log("");
            /*div.innerHTML = '<img class = "userImage" src="' + userImageMarker[i] + '" alt="Profile Image" style="width:30px;height:30px; border-radius: 50%; border: 2px solid' + userColor[i] + '">';*/
            div.innerHTML = '<img class = "userImage" src="' + userImageMarker[i] + '" alt="Profile Image"">';

            console.log(userColor[i] + " — — — userColor[i]");
            console.log(userImageMarker[i] + " — — — userImage[i]");

            /*div.innerHTML = '<img src=' + userImageMarker[1] + ' alt="Mountain View" style="width:30px;height:30px; border-radius: 50%; border: 2px solid red">';*/

            var panes = this.getPanes();
            panes.overlayImage.appendChild(div);
            this.div = div;
        }


        HTMLMarker.prototype.draw = function () {
            var overlayProjection = this.getProjection();
            var position = overlayProjection.fromLatLngToDivPixel(this.pos);
            var panes = this.getPanes();
            this.div.style.left = position.x + 'px';
            this.div.style.top = position.y - 30 + 'px';
        }

        var randomize = ((Math.random() * 2) - 1) / 10;
        var randomize2 = ((Math.random() * 2) - 1) / 10;

        //to use it
        var htmlMarker = new HTMLMarker(52.323907 + randomize, -150.109291 + randomize2);
        htmlMarker.setMap(gmap);

    }

}



//GOOGLE MAPS API   ———————————————————




/*
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

    //zoom máximo e minimo do mapa
    map.setOptions({
        minZoom: 3,
        maxZoom: 12
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


        console.log("XXXXX   " + userPos.x[i]);
        console.log("YYYYY   " + userPos.y[i]);


        var x = (userPos.x[i] + randomize);
        var y = (userPos.y[i] + randomize2);




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


/*

        mark[i] = new google.maps.Marker({
            position: pos,
            optimized: false,
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



*/





/*

——————————————————————————————————————————————————————————————————————
——————————————————————————————————————————————————————————————————————
——————————————————————————————————————————————————————————————————————
——————————————————————————————————————————————————————————————————————
——————————————————————————————————————————————————————————————————————
——————————————————————————————————————————————————————————————————————
——————————————————————————————————————————————————————————————————————
——————————————————————————————————————————————————————————————————————


*/




/*setInterval(function () {
    $("htmlMarker").mouseover(function () {
        console.log("ANDAAAAA");
    });
}, 300);*/






// Autocomplete search — ainda não dá

//https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete
