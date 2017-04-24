//  —— inicializações   —————————————————————————————


//Google Maps API key
var googleMapsApiKey = 'AIzaSyA2VPJOkLkP7xVjMsgQY6n7BA4yRqu3tQg';

var api_key = 'pGGIf6rZKW1YcIXnIrDHk7fTbvjwXsht';
//var api_key = 'Hr4r14bPbRdZq220clN8zGAvKvrO0TAz';

//URL pedido Behance
var URL = 'https://api.behance.net/v2/users';


// Nome do utilizador (username, nome ou apelido), localização e campos de criação a analisar
var query;
var locationsInput;
var fieldsInput;

//foto perfil user
var userImageMarker = [];


var tamanho;
var gmap;

// Geocoding
var userLat;
var userLng;


var userName = [];
var fields = []; //top 3
var city = [];
var userURL = [];
var userField = []; //1º
var userColor = [];


var userPos = {
    x: [],
    y: []
};


//Campos de criação, respetiva cor, se é usado (existe nos resultados da pesquisa) e nº de users (dos resultados)
var colors = {
    field: ['Animation', 'Graphic Design', 'Branding', 'Photography', 'Architecture', "Interaction Design", 'Drawing', 'Illustration', 'Typography', 'Packaging', 'Digital Art', 'Film', 'Design', 'UI/UX', 'Advertising', 'Calligraphy', 'Art Direction', 'Interaction Design', 'Web Design', 'Fashion', 'Industrial Design'],
    color: ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B', '#000000', '#f500ff'],
    used: ['false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false'],
    users: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};


/*

var cor = [];
cor["Animation"] = "#F44336";
cor["GraphicDesign"] = "#E91E63";
cor["Branding"] = "#9C27B0";

console.log(cor.Animation + "rrrr");

*/


$(function () { //quando a página carregou
    $(".spinner").hide();

    $("#search").click(search); //pesquisa quando se carrega no botão

    $('input').keypress(function (ev) {
        if (ev.keyCode === 13) {
            search(); //ou quando se faz enter num input
        }
    });


    $(".userImage").mouseover(function () {
        console.log("ANDAAAAA");
    });

});


function search() { //quando se carrega em Search ou se faz enter num dos inputs
    $("#dados").empty();

    query = $("#name").val();
    locationsInput = $("#city").val();
    fieldsInput = $("#fields").val();

    $(".spinner").show();

    getUserInfo();

}


//  —— BEHANCE API   —————————————————————————————


function getUserInfo() {

    $.ajax({
        url: URL + "?q=" + query,
        dataType: "jsonp",
        data: {
            api_key: api_key,
            sort: 'followed',
            city: locationsInput,
            field: fields,
            page: 1 //iterar para ver mais users (com for não deu)
        },
        timeout: 1500,
        success: processUserInfo,
        error: logError("a procurar utilizador")
    });
}


function processUserInfo(response) {

    //a cada nova pesquisa

    //reposição dos valores "used" e "users" de cada field para mostragem na legenda e no gráfico
    colors.used = ['false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false'];
    colors.users = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];


    //processa dados do utilizador (response) e mostra-os
    for (var i = 0; i < response.users.length; i++) {

        userName[i] = response.users[i].display_name;
        fields[i] = response.users[i].fields; //top 3
        city[i] = response.users[i].city;
        userURL[i] = response.users[i].url;

        //campo de criação mais popular de cada user - 1º do top 3
        userField[i] = response.users[i].fields[0];


        //ir buscar foto de perfil de cada utilizador
        for (var s in response.users[i].images) {
            userImageMarker[i] = response.users[i].images[s];
            break;
            //para guardar a segunda imagem de cada user (tamanhos ≠s)
        }
    }


    for (var i = 0; i < userName.length; i++) {


        /*—————— Geocoding ————————— */

        //https://developers.google.com/maps/documentation/javascript/geocoding

        /*        $.getJSON({
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
        */


        /*—————— FIM Geocoding ————————— */



        //atribui cor da borda de acordo com o field mais popular do user
        for (var k = 0; k < colors.field.length; k++) {

            if (userField[i] === colors.field[k]) {
                userColor[i] = colors.color[k];

                //para adicionar à barra de legenda e aos gráficos

                // ——— Não pode ser aqui, só pode ser considerado true, aqueles que são mostrados

                colors.used[k] = 'true';

                colors.users[k]++;
                break;

            } else { //se field do user não for nenhum com cor definida, a borda fica da cor definida abaixo
                userColor[i] = '#22ff44';
                //console.log(userColor);
            }

        }


        //detetar se o utilizador tem foto de perfil
        var string = userImageMarker[i];
        var substring = "/img/profile/no-image";



        //------------------REVER - NÃO FUNCIONA PARA NÃO MOSTRAR NO MAPA -----------------------------------!!!!    
        if (string.includes(substring))
            break;


        if ((userField[i] != "")) { //apenas mostra as pessoas com campos de criação definido

            $("#dados").append("<hr>");
            $("#dados").append("<p>" + userName[i] + "</p>");
            $("#dados").append("<p><a href=" + userURL[i] + ">Link Behance</a></p>");

            $("#dados").append('<img class = "userImage" id="users' + i + '" src=' + userImageMarker[i] + ' height="90" width="90" alt="Profile Image">');
            $("#users" + i).css("border-color", userColor[i]); //atribuir borda da respetiva cor à foto do user

            $("#dados").append("<p> City: " + city[i] + "</p>");
            $("#dados").append("<p> Fields: " + fields[i] + "</p>");
            $("#dados").append("<p> FIELD MAIS POPULAR: " + userField[i] + "</p>");
            $("#dados").append("<p> COR DO FIELD: " + userColor[i] + "</p>");

        }

        $(".spinner").hide();

    }


    ShowLegend();

    /*—————— Chart ————————— */
    //só corre o drawChart depois dos resultados da pesquisa serem processados, para estes poderem ser usados no gráfico
    drawChart();

    $("#moreinfo").show();

    initialize();

}


function ShowLegend() { //preenche o footer com a legenda das cores dos fields

    $("#footer").empty();

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


//  —— GOOGLE MAPS API   ———————————————————


var overlay;
var gmap; //mapa tem que estar definido fora do initialize para o resize funcionar

//ponto central (latitude e lonigtude) de Coimbra - ponto inicial
var coimbralat = 40.2033145;
var coimbralng = -8.4102573;


function initialize() {

    gmap = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: coimbralat,
            lng: coimbralng
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

    //centrar no resize
    google.maps.event.addDomListener(window, 'load', initialize);
    google.maps.event.addDomListener(window, "resize", function () {
        var center = gmap.getCenter();
        google.maps.event.trigger(gmap, "resize");
        gmap.setCenter(center);
    });





    //zoom máximo e minimo do mapa
    gmap.setOptions({
        minZoom: 3,
        maxZoom: 12
    });



    function HTMLMarker(lat, lng) {
        this.lat = lat;
        this.lng = lng;
        this.pos = new google.maps.LatLng(lat, lng);
    }

    HTMLMarker.prototype = new google.maps.OverlayView();
    HTMLMarker.prototype.onRemove = function () {}


    for (var i = 0; i < userName.length; i++) {

        HTMLMarker.prototype.draw = function () {
            var overlayProjection = this.getProjection();
            var position = overlayProjection.fromLatLngToDivPixel(this.pos);
            var panes = this.getPanes();
            this.div.style.left = position.x + 'px';
            this.div.style.top = position.y - 30 + 'px';
        }

        var randomize = ((Math.random() * 2) - 1) / 10;
        var randomize2 = ((Math.random() * 2) - 1) / 10;

        var htmlMarker = new HTMLMarker(coimbralat + randomize, coimbralng + randomize2);
        htmlMarker.onAdd = overlay(userImageMarker[i], htmlMarker, i);


        htmlMarker.info = new google.maps.InfoWindow({
            content: "algo"
        });



        google.maps.event.addListener(htmlMarker, 'click', function () {
            this.info.open(map, this);
        });


        htmlMarker.setMap(gmap);
    }






}






function overlay(img, marker, i) {

    google.maps.event.addListener(gmap, 'zoom_changed', function () {
        zoomLevel = gmap.getZoom();
        tamanho = gmap.getZoom();
        console.log("ZOMMMM Level é de :   " + zoomLevel);


        tamanha = Math.pow(zoomLevel, 2);
        console.log("    TAMANHA       —— " + tamanha);


        if (zoomLevel <= 9) {
            $(".userImage").css("width", "10");
            $(".userImage").css("height", "10");
        }
        if (zoomLevel == 10) {
            $(".userImage").css("width", "20");
            $(".userImage").css("height", "20");
        }

        if (zoomLevel == 11) {
            $(".userImage").css("width", "30");
            $(".userImage").css("height", "30");
        }

        if (zoomLevel >= 12) {
            $(".userImage").css("width", "50");
            $(".userImage").css("height", "50");
        }
    });


    return function () {

        div = document.createElement('DIV');
        div.style.position = 'absolute';
        div.className = userField[i] + " roundCorners";

        console.log("TAMNHO É " + tamanho);

        div.innerHTML = '<img class = "userImage" id="us' + i + '" src="' + img + '" alt="Profile Image" style="border-color:' + userColor[i] + ';">';


        var panes = marker.getPanes();
        panes.overlayImage.appendChild(div);
        marker.div = div;



    }
}

setInterval(function () {
    $(".userImage").mouseover(function () {
        //$(".userImage").css("width", zoomLevel);
        console.log("tá");
    });
}, 300);

setInterval(function () {
    $(".userImage").mouseout(function () {
        //$(".userImage").css("border-color", "pink");
        console.log("tá");
    });
}, 300);








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



// Autocomplete search — ainda não dá

//https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete
