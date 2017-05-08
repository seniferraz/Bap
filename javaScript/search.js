//  —— inicializações   —————————————————————————————


//Google Maps API key
var googleMapsApiKey = 'AIzaSyA2VPJOkLkP7xVjMsgQY6n7BA4yRqu3tQg';

//var api_key = 'pGGIf6rZKW1YcIXnIrDHk7fTbvjwXsht';
var api_key = 'Hr4r14bPbRdZq220clN8zGAvKvrO0TAz';

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



var global;


var passagem = 0;
var bom11 = [];
var bom22 = [];

var posLimNLat = [];
var posLimNLng = [];
var posLimSLat = [];
var posLimSLng = [];



//desenhar users
var userLatTeste = [];
var userLngTeste = [];

var limiteNordesteLat = [];
var limiteNordesteLng = [];
var limiteSudoesteLat = [];
var limiteSudoesteLng = [];



// Geolocation
/*var userPos = {
    x: [],
    y: []
};*/

var longteste;




//Campos de criação, respetiva cor, se é usado (existe nos resultados da pesquisa) e nº de users (dos resultados)
var colors = {
    field: ['Advertising', 'Animation', 'Architecture', 'Art Direction', 'Branding', 'Calligraphy', 'Digital Art', 'Drawing', 'Editorial Design', 'Fashion', 'Film', 'Graphic Design', 'Illustration', 'Industrial Design', 'Interaction Design', 'Interior Design', 'Journalism', 'Motion Graphics', 'Packaging', 'Photography', 'Programming', 'Typography', 'UI/UX', 'Web Design'],
    color: ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B', '#f500FF', '#880E4F', '#4DB6AC', '#B388FF', '#FF8A80'],
    used: ['false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false'],
    users: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};



// — — —— —— —    novos arrays    — — — —  — — — — — 

var usersData = [{
    name: "Algo",
    fields: [],
    city: "",
    imageURL: "",
    color: ""
}];

var fieldColor = {
    "Advertising": "#F44336",
    "Animation": "#E91E63",
    "Architecture": "#9C27B0",
    "Art Direction": "#673AB7",
    "Branding": "#3F51B5",
    "Calligraphy": "#2196F3",
    "Digital Art": "#03A9F4",
    "Drawing": "#00BCD4",
    "Editorial Design": "#009688",
    "Fashion": "#4CAF50",
    "Film": "#8BC34A",
    "Graphic Design": "#CDDC39",
    "Illustration": "#FFEB3B",
    "Industrial Design": "#FFC107",
    "Interaction Design": "#FF9800",
    "Interior Design": "#FF5722",
    "Journalism": "#795548",
    "Motion Graphics": "#9E9E9E",
    "Photography": "#607D8B",
    "Animation": "#f500FF",
    "Programming": "#880E4F",
    "Typography": "#4DB6AC",
    "UI/UX": "#B388FF",
    "Web Design": "#FF8A80",
};


var numberOfUser = {
    "Advertising": "0",
    "Animation": "0",
    "Architecture": "0",
    "Art Direction": "0",
    "Branding": "0",
    "Calligraphy": "0",
    "Digital Art": "0",
    "Drawing": "0",
    "Editorial Design": "0",
    "Fashion": "0",
    "Film": "0",
    "Graphic Design": "0",
    "Illustration": "0",
    "Industrial Design": "0",
    "Interaction Design": "0",
    "Interior Design": "0",
    "Journalism": "0",
    "Motion Graphics": "0",
    "Photography": "0",
    "Animation": "0",
    "Programming": "0",
    "Typography": "0",
    "UI/UX": "0",
    "Web Design": "0",
};


//Não sei se esta bem, o professor tinha objeto

var usedFields = [
    "Advertising", "mais", "menos"
];


//check
//console.log(usersData.name[1] + " — —  rrrr");


// — — —— —— —   novos arrays fim   — — — ——— — —


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
            field: fieldsInput,
            page: 1 //iterar para ver mais users (com for não deu)
        },
        timeout: 1500,
        success: processUserInfo,
        error: logError("a procurar utilizador")
    });
}


function processUserInfo(response) {

    //a cada nova pesquisa

    userName = [];
    fields = []; //top 3
    city = [];
    userURL = [];
    userField = []; //1º
    userColor = [];


    //reposição dos valores "used" e "users" de cada field para mostragem na legenda e no gráfico
    colors.used = ['false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false'];
    colors.users = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];


    //processa dados do utilizador (response) e mostra-os
    for (var i = 0; i < response.users.length; i++) {




        if (response.users[i].fields.length > 0) {

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
        console.log("treta da maior")


    }


    for (var i = 0; i < userName.length; i++) {



        //console.log(city[i] + " ——  ——— — — — — — — cidade atual");

        global = i;

        console.log("TAMANHO É _: " + userName.length);

        /*—————— Geocoding ————————— */

        //https://developers.google.com/maps/documentation/javascript/geocoding


        $.getJSON({
            url: 'https://maps.googleapis.com/maps/api/geocode/json',
            data: {
                sensor: false,
                address: city[i]
                //address: locationsInput
            },

            success: function (data, textStatus) {
                //console.log(textStatus, data);
                //console.log(data.results[0].geometry.location);
                userLat = data.results[0].geometry.location.lat;
                userLng = data.results[0].geometry.location.lng;


                userLatTeste[i] = data.results[0].geometry.location.lat;
                userLngTeste[i] = data.results[0].geometry.location.lng;



                //ver os limites da cidade de cada user, para não desenhar fora do mapa

                /* limiteNordesteLat[i] = data.results[0].geometry.bounds.northeast.lat;
                 limiteNordesteLng[i] = data.results[0].geometry.bounds.northeast.lng;

                 limiteSudoesteLat[i] = data.results[0].geometry.bounds.southwest.lat;
                 limiteSudoesteLng[i] = data.results[0].geometry.bounds.southwest.lng;*/


                //console.log(limiteNordesteLat + " ———— limiteNordesteLat");
                //console.log(limiteNordesteLng + " ———— limiteNordesteLng");
                //console.log(limiteSudoesteLat + " ———— limiteSudoesteLat");
                //console.log(limiteSudoesteLng + " ———— limiteSudoesteLng");


                tipodeterra = data.results[0].address_components[0].types;

                //console.log(data.results[0] + " ———— TIPO DE TERRA");

                //userPos.x[i] = userLat;
                //userPos.y[i] = userLng;

                initialize();
            },
            error: function () {
                alert("erro no geocoding");
            }
        });


        passagem = 0;
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
            //break;


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


var gmap; //mapa tem que estar definido fora do initialize para o resize funcionar

//ponto central (latitude e lonigtude) de Coimbra - ponto inicial
var coimbralat = 40.2033145;
var coimbralng = -8.4102573;

var userposit;
var contentString;
var infowindow;
var mark;

var vezesinitialize = 0;

var latCenter;
var lngCenter;

function initialize() {

    //console.log(vezesinitialize + " vezes initialize");

    //antes de ser feita uma pesquisa (quando se entra no site), o centro é Coimbra, depois é a cidade procura
    if (vezesinitialize <= 1) { // corre sempre 2 vezes no início (0 e 1)
        latCenter = coimbralat;
        lngCenter = coimbralng;
    } else {
        latCenter = userLat;
        lngCenter = userLng;
    }


    gmap = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: latCenter,
            lng: lngCenter
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

    //google.maps.event.addDomListener(window, 'load', initialize);

    //centrar no resize
    google.maps.event.addDomListener(window, "resize", function () {
        var center = gmap.getCenter();
        google.maps.event.trigger(gmap, "resize");
        gmap.setCenter(center);
    });

    //zoom máximo e minimo do mapa
    gmap.setOptions({
        minZoom: 3,
        maxZoom: 16
    });



    function HTMLMarker(lat, lng) {
        this.lat = lat;
        this.lng = lng;
        this.pos = new google.maps.LatLng(lat, lng);
    }

    HTMLMarker.prototype = new google.maps.OverlayView();
    HTMLMarker.prototype.onRemove = function () {}






    // — — — — — — — —  dados para desenhar 


    if ($("#city").val().length == 0) {
        bom11[passagem] = userLatTeste[userName.length];
        bom22[passagem] = userLngTeste[userName.length];
    }

    if ($("#city").val().length > 0) {
        bom11[passagem] = userLat;
        bom22[passagem] = userLng;

        console.log(bom22[passagem] + "BOM");
        console.log(bom11[passagem] + "BOM");
    }


    console.log("TAMANHO É  em baixo_: " + userName.length);



    //quando determinou a localização de todos os users desenha
    if (passagem == userName.length - 1) {

        /*posLimNLat[passagem] = limiteNordesteLat[12];
        posLimNLng[passagem] = limiteNordesteLng[12];
        posLimSLat[passagem] = limiteSudoesteLat[12];
        posLimSLng[passagem] = limiteSudoesteLng[12];
*/
        console.log(passagem + " passagem");
        console.log("passagem");

        for (var i = 0; i < userName.length; i++) {
            var randomize = ((Math.random() * 2) - 1) / 10;
            var randomize2 = ((Math.random() * 2) - 1) / 10;

            //latGold = Math.floor(Math.random() * 6) + 1  
            //latGold = Math.random() * (posLimNLat[i] - posLimSLat[i]) + posLimSLat[i];
            //lngGold = Math.random() * (posLimNLng[i] - posLimSLng[i]) + posLimSLng[i];


            //posições dos users = posições da cidade + valores aleatórios, para ficarem distribuídos
            userposit = {
                lat: bom11[i] + randomize,
                lng: bom22[i] + randomize2
            };

            /*userposit = {
                lat: latGold,
                lng: lngGold
            };
*/

            //temos de mudar a posição de acordo com zoom
            userposit1 = {
                lat: userLat + randomize + 0.004,
                lng: userLng + randomize2 + 0.002
            };

            HTMLMarker.prototype.draw = function () {
                var overlayProjection = this.getProjection();
                var position = overlayProjection.fromLatLngToDivPixel(this.pos);
                var panes = this.getPanes();
                this.div.style.left = position.x + 'px';
                this.div.style.top = position.y - 30 + 'px';

                //console.dir(this);

                for (var p = 0; p < userName.length; p++) {
                    //console.log("p " + p);

                    // O ouro está aqui
                    // console.log(userposit.lat + " . . " + userposit.lng + "  POS DE");

                    //console.log("userName[" + p + "]" + " " + userName[p]);


                    //infowindow
                    contentString =
                        '<div id="contentInfo">' +
                        '<p id="firstHeading"> <b>' + userName[p] + "  -  " + p + '</b></p>' +
                        '<p><b>Fields:</b>  ' + fields[p] + '</p>' +
                        '<p><b>City:</b>  ' + city[p] + '</p>' +
                        '<p><a href="' + userURL[p] + '">Go to Behance</a></p>' +
                        '</div>';

                    infowindow = new google.maps.InfoWindow({
                        content: contentString,
                        position: userposit1,
                    });


                    google.maps.event.addListener(gmap, 'zoom_changed', function () {
                        infowindow.close(gmap, this.div);
                    });


                    infowindow.addClass = "WindowClass";

                    this.div.addEventListener("mouseover", function () {
                        console.log("teste");
                        infowindow.open(gmap, this.div);
                        //passar posição no open ou no this.div
                    });

                    /*this.div.addEventListener("mouseout", function () {
                        console.log("teste");
                        infowindow.close(gmap, this.div);
                    });*/
                }
            }





            //console.log(userLat + "    ———  userLAT");


            //faz HTMLMarker na posição do user
            var htmlMarker = new HTMLMarker(userposit);
            htmlMarker.onAdd = overlay(userImageMarker[i], htmlMarker, i);
            htmlMarker.setMap(gmap);


            /*        
                    htmlMarker.info = new google.maps.InfoWindow({
                        content: "algo"
                    });

                    google.maps.event.addListener(htmlMarker, 'click', function () {
                        this.info.open(map, this);
                    });

                    htmlMarker.setMap(gmap);

            */

            /*
            //infowindow
            contentString = '<b>Name:</b> ' + userName[i] + '<br><a href="' + userURL[i] + '">Go to Behance</a>';

            infowindow = new google.maps.InfoWindow({
                content: contentString
            });
            */

            /*
            mark = new google.maps.Marker({
                    position: userposit,
                    map: gmap,
                    icon: {
                        url: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTDiu3Io_QQfJmb-jxmIsS-quJz81Xxf5oYbZUw6HMsYIh-YurN",
                        scaledSize: new google.maps.Size(10, 10)
                    }
                });

                mark.addListener('click', function () {
                    infowindow.open(gmap, mark);
                });*/

        }

    }
    vezesinitialize++;
    passagem++;
}



function overlay(img, marker, i) {

    //alterar tamanho de imagem de acordo com zoom
    google.maps.event.addListener(gmap, 'zoom_changed', function () {
        zoomLevel = gmap.getZoom();
        //console.log("ZOMMMM Level é de :   " + zoomLevel);

        if (zoomLevel <= 9) {
            $(".userImage").css("width", "10").css("height", "10");
        }

        if (zoomLevel > 9 && zoomLevel < 12) {
            $(".userImage").css("width", (zoomLevel - 8) * 10).css("height", (zoomLevel - 8) * 10);
        }

        if (zoomLevel >= 12) {
            $(".userImage").css("width", "50").css("height", "50");
        }
    });


    return function () {

        div = document.createElement('DIV');
        div.style.position = 'absolute';
        div.className = userField[i] + " roundCorners";

        //console.log("TAMNHO É " + tamanho);

        div.innerHTML = '<img class = "userImage" id="us' + i + '" src="' + img + '" alt="Profile Image" style="border-color:' + userColor[i] + ';">';


        var panes = marker.getPanes();
        panes.overlayImage.appendChild(div);
        marker.div = div;



    }
}

/*
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


// Autocomplete search — ainda não dá

//https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete
