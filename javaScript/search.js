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


var tamanho;
var gmap;


//dados dos users (resultados)
var userName = [];
var fields = []; //top 3
var city = [];
var userURL = [];
var userField = []; //1º
var userColor = [];
var userImageMarker = []; //foto perfil user


var passagem = 0;
var bom11 = [];
var bom22 = [];

var posLimNLat = [];
var posLimNLng = [];
var posLimSLat = [];
var posLimSLng = [];


// Geocoding
var cityPosit = {};


var cityPosition = {
    city: [],
    lat: [],
    lng: [],
};


//desenhar users

var limiteNordesteLat = [];
var limiteNordesteLng = [];
var limiteSudoesteLat = [];
var limiteSudoesteLng = [];

//mudar layout
var lineDown = 0;
var lineLeft = 0;
var newlayout = false;


//usado para fechar infowindow
var anterior;





//Campos de criação, respetiva cor, se é usado (existe nos resultados da pesquisa) e nº de users (dos resultados)
var colors = {
    field: ['Advertising', 'Animation', 'Architecture', 'UI/UX', 'Web Design', 'Art Direction', 'Branding', 'Calligraphy', 'Digital Art', 'Drawing', 'Editorial Design', 'Fashion', 'Film', 'Graphic Design', 'Illustration', 'Industrial Design', 'Interaction Design', 'Interior Design', 'Journalism', 'Motion Graphics', 'Packaging', 'Photography', 'Programming', 'Typography', 'Digital Photography'],
    color: ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B', '#f500FF', '#880E4F', '#4DB6AC', '#B388FF', '#FF8A80', '#1B5E20'],
    used: ['false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false'],
    users: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
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


// — — —— —— —   novos arrays fim   — — — ——— — —



$(function () { //quando a página carregou
    $(".spinnerContainer").hide();

    $("#search").click(search); //pesquisa quando se carrega no botão

    $('input').keypress(function (ev) {
        if (ev.keyCode === 13) {
            search(); //ou quando se faz enter num input
        }
    });


    console.log(latinize('ỆᶍǍᶆṔƚÉ áéíóúýčďěňřšťžů'));
});


function search() { //quando se carrega em Search ou se faz enter num dos inputs
    $("#dados").empty();

    query = $("#name").val();
    locationsInput = $("#city").val();
    fieldsInput = $("#fields").val();
    $(".spinnerContainer").show();

    getUserInfo();


}


//  —— BEHANCE API   —————————————————————————————

function getUserInfo() {

    function userRequest(pagenumber) {
        $.ajax({
            url: URL + "?q=" + query,
            dataType: "jsonp",
            data: {
                api_key: api_key,
                sort: 'followed',
                city: locationsInput,
                field: fieldsInput,
                page: pagenumber //———————————————————————————iterar para ver mais users (com for não deu)
            },
            timeout: 1500,
            success: processUserInfo,
            error: logError("a procurar utilizador")
        });
    }

    // for (var i = 1; i<3;i++){
    userRequest(1);
    //    }
}

//deteta clique no botão de mudar layout
$("#changeLayout").click(function () {
    newlayout = !newlayout;
    //console.log(".buttonLayout");
    search();
    lineDown = 0;
    lineLeft = 0;
});


function processUserInfo(response) {

    //a cada nova pesquisa - limpas os arrays
    userName = [];
    fields = []; //top 3
    city = [];
    userURL = [];
    userField = []; //1º
    userColor = [];


    //reposição dos valores "used" e "users" de cada field — para mostragem na legenda e no gráfico
    colors.used = ['false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false'];
    colors.users = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];


    //processa dados do utilizador (response) e guarda-os em arrays
    for (var i = 0; i < response.users.length; i++) {

        userName[i] = response.users[i].display_name;
        fields[i] = response.users[i].fields; //top 3
        city[i] = latinize(response.users[i].city);
      /*  if (city[i] == "Lisboa")
            city[i] = "Lisbon";
        if (city[i] == "WPT295")
            city[i] = "Lisbon";*/
        userURL[i] = response.users[i].url;

        //campo de criação mais popular de cada user - 1º do top 3
        userField[i] = response.users[i].fields[0];

        //ir buscar foto de perfil de cada utilizador
        for (var s in response.users[i].images) {
            userImageMarker[i] = response.users[i].images[s];
            break; //para guardar a 2ª imagem de cada user (tamanhos ≠s)
        }
    }


    for (var i = 0; i < userName.length; i++) {

        //https://developers.google.com/maps/documentation/javascript/geocoding

        console.log(i + "  " + city[i] + " . . . ,, city III ");


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

                /*cityPosition.city[i] = data.results[0].address_components[0].long_name;
                cityPosition.lat[i] = data.results[0].geometry.location.lat;
                cityPosition.lng[i] = data.results[0].geometry.location.lng;*/




                /*console.log(cityPosition.city[i]);
                console.log(cityPosition.lat[i]);
                console.log(cityPosition.lng[i]);
                */


                if (!(city[i] in cityPosition)) {
                    var cidadeAtual = latinize(data.results[0].address_components[0].long_name);

                    cityPosit[cidadeAtual] = {};
                    cityPosit[cidadeAtual].lat = data.results[0].geometry.location.lat;
                    cityPosit[cidadeAtual].lng = data.results[0].geometry.location.lng;

                    //ver os limites da cidade de cada user, para não desenhar fora do mapa

                    cityPosit[cidadeAtual].nordesteLimitlat = data.results[0].geometry.bounds.northeast.lat;
                    cityPosit[cidadeAtual].nordesteLimitlng = data.results[0].geometry.bounds.northeast.lng
                    cityPosit[cidadeAtual].sudoesteLimitlat = data.results[0].geometry.bounds.southwest.lat;
                    cityPosit[cidadeAtual].sudoesteLimitlng = data.results[0].geometry.bounds.southwest.lng;

                    //console.dir(cityPosit[cidadeAtual]);
                }
                //passagem++;
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

        $(".spinnerContainer").hide();
    }


    ShowLegend();

    /*—————— Chart ————————— */
    //só corre o drawChart depois dos resultados da pesquisa serem processados, para estes poderem ser usados no gráfico
    drawChart();
}



function ShowLegend() { //preenche o footer com a legenda das cores dos fields

    $("#footer").empty();

    for (var k = 0; k < colors.field.length; k++) {
        if (colors.used[k] == 'true') {
            $("#footer").append('<div id="footerlegend' + k + '"></div>');
            $("#footerlegend" + k + "").append('<div class="legend" id="shape' + k + '"></div>');
            $("#footerlegend" + k + "").append('<div class="fieldsLegend">' + colors.field[k] + '</div>');
            $("#footerlegend" + k + "").css("display", "inline-block");
            $("#shape" + k + "").css("border-color", colors.color[k]);
        }
    }
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

//var userposit;

var userposit = {
    lat: [],
    lng: []
};

var contentString;
var mark;

var vezesinitialize = 0;

var latCenter;
var lngCenter;

function initialize() {

    //console.log(vezesinitialize + " vezes initialize");

    //antes de ser feita uma pesquisa (quando se entra no site), o centro é Coimbra
    if (vezesinitialize == 0) {
        latCenter = coimbralat;
        lngCenter = coimbralng;
    } else {
        //depois centra no primeiro resultado (user mais seguido)
        latCenter = cityPosit[city[0]].lat;
        lngCenter = cityPosit[city[0]].lng;
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



    //quando determinou a localização de todos os users desenha
    if (passagem == userName.length - 1) {
        /*posLimNLat[passagem] = limiteNordesteLat[12];
        posLimNLng[passagem] = limiteNordesteLng[12];
        posLimSLat[passagem] = limiteSudoesteLat[12];
        posLimSLng[passagem] = limiteSudoesteLng[12];
        */

        console.log(passagem + " passagem");
        console.log("passagem");

        lineDown = 0;

        for (var i = 0; i < userName.length; i++) {
            var randomize = ((Math.random() * 2) - 1) / 10;
            var randomize2 = ((Math.random() * 2) - 1) / 10;


            console.log(city[i] + " . .  city[i]");


            latGold = Math.random() * (cityPosit[city[i]].nordesteLimitlat - cityPosit[city[i]].sudoesteLimitlat) + cityPosit[city[i]].sudoesteLimitlat;
            lngGold = Math.random() * (cityPosit[city[i]].nordesteLimitlng - cityPosit[city[i]].sudoesteLimitlng) + cityPosit[city[i]].sudoesteLimitlng;


            for (var k = 0; k < userName.length; k++) {
                if (city[i] == cityPosition.city[k]) {
                    var latz = cityPosition.lat[k];
                    var lngz = cityPosition.lng[k];
                    break;
                }
            }


            //console.log(city[i] + "   " + i + " . .. . .. . . city");
            var cemas = cityPosit[city[i]].lat;
            var cemas1 = cityPosit[city[i]].lng;



            console.log(cemas + " LAT " + i);



            /*console.log(city[i] + " - - cidade");
            console.log(latz + " - - latz");
            console.log(lngz + " - - lngz");
*/



            //posições dos users = posições da cidade + valores aleatórios, para ficarem distribuídos
            /*userposit[i] = {
                lat: latz + randomize,
                lng: lngz + randomize2
            };*/

            if (newlayout === true) {
                if (i % 5 == 0) {
                    lineDown++;
                    lineLeft = 0;
                }

                userposit[i] = {
                    lat: cityPosit[city[i]].sudoesteLimitlat - (cityPosit[city[i]].sudoesteLimitlat - cityPosit[city[i]].nordesteLimitlat) + (lineDown * -0.03),
                    lng: cityPosit[city[i]].sudoesteLimitlng + (lineLeft * 0.04)
                };
                lineLeft++;
            } else {
                userposit[i] = {
                    lat: latGold,
                    lng: lngGold
                };
            }




            HTMLMarker.prototype.draw = function () {
                var overlayProjection = this.getProjection();
                var position = overlayProjection.fromLatLngToDivPixel(this.pos);
                var panes = this.getPanes();
                this.div.style.left = position.x - 12 + 'px';
                this.div.style.top = position.y + 'px';

                //console.dir(this);

                //////for (var p = 0; p < userName.length; p++) {

                var infowindow = new google.maps.InfoWindow({
                    /*  content: "oi",
                      position: {
                          lat: 0,
                          lng: 0
                      }*/
                });


                this.div.addEventListener("click", function (evt) {
                    evt.stopImmediatePropagation();
                    //para fechar a aberta




                    //console.log(anterior + " ANT");


                    console.dir(this);
                    var divNum = this.id;
                    console.log(divNum + " id é este .... .. . . . . . ");

                    //infowindow
                    contentString =
                        '<div id="contentInfo">' +
                        '<p id="firstHeading"> <b>' + userName[divNum] + '</b></p>' +
                        '<p><b>Fields:</b>  ' + fields[divNum] + '</p>' +
                        '<p><b>City:</b>  ' + city[divNum] + '</p>' +
                        '<p><a target="_blank" href="' + userURL[divNum] + ' ">Go to Behance</a></p>' +
                        '</div>';

                    console.log("divNum " + divNum);

                    //console.log(userposit[i] + " userposit[i]");
                    infowindow = new google.maps.InfoWindow({
                        content: contentString,
                        //temos de mudar a posição de acordo com zoom
                        position: userposit[divNum],
                        anchor: new google.maps.Point(0, 0)
                    });


                    //passar posição no open ou no this.div
                    if (anterior)
                        anterior.close(gmap);
                    infowindow.open(gmap);
                    console.log(this.div + " THIS ");

                    //dar cor a infowindow de acordo com a cor do user
                    $(".gm-style>div:first-child>div+div>div:last-child>div>div:first-child>div").css("background", userColor[divNum], 'important');
                    $("#map>div>div>div:nth-child(1)>div:nth-child(4)>div:nth-child(4)>div>div:nth-child(1)>div:nth-child(3)>div:nth-child(1)>div").css("background", userColor[divNum], 'important');
                    $("#map>div>div>div:nth-child(1)>div:nth-child(4)>div:nth-child(4)>div>div:nth-child(1)>div:nth-child(3)>div:nth-child(2)>div").css("background", userColor[divNum], 'important');

                    $("#map > div > div > div:nth-child(1) > div:nth-child(4) > div:nth-child(4) > div > div:nth-child(3)").css("font-size", "14px", 'important').css("color", "white");

                    $("#map > div > div > div:nth-child(1) > div:nth-child(4) > div:nth-child(4) > div > div:nth-child(3)").html("<b>&#x2715;<b>");
                    anterior = infowindow;
                });



                //fecha windowinfo quando se faz zoom
                google.maps.event.addListener(gmap, 'zoom_changed', function () {
                    //infowindow.close(gmap, this.div);
                });

                /*this.div.addEventListener("mouseout", function () {
                    console.log("out");
                    infowindow.close(gmap, this.div);
                });*/

                ////// }
            }

            //faz HTMLMarker na posição do user
            var htmlMarker = new HTMLMarker(userposit[i]);
            htmlMarker.onAdd = overlay(userImageMarker[i], htmlMarker, i);
            htmlMarker.setMap(gmap);
        }
    }
    $("#moreinfo").show();
    vezesinitialize++;
    passagem++;
}



function overlay(img, marker, i) {

    //alterar tamanho de imagem de acordo com zoom
    google.maps.event.addListener(gmap, 'zoom_changed', function () {
        zoomLevel = gmap.getZoom();
        console.log("ZOMMMM Level é de :   " + zoomLevel);


        //zoom é de 3 a 16

        // muda tamanho posição do user de acordo com zoom
        if (zoomLevel == 8) {
            $(".userImage").css("margin-top", "-35px").css("margin-left", "5px");
        }

        if (zoomLevel == 9) {
            $(".userImage").css("margin-top", "-35px").css("margin-left", "5px");
        }

        if (zoomLevel == 10) {
            $(".userImage").css("margin-top", "-20px").css("margin-left", "0px").css("margin-top", "1px");
        }

        if (zoomLevel == 11) {
            $(".userImage").css("margin-top", "-40px").css("margin-left", "-4px").css("margin-top", "1px");
        }

        if (zoomLevel == 12) {
            $(".userImage").css("margin-top", "-40px").css("margin-left", "-15px").css("margin-top", "1px");
        }

        /* if (zoomLevel == 13) {
            $(".userImage").css("margin-top", "-40px").css("margin-left", "-15px").css("margin-top", "1px");
        }
        
        if (zoomLevel == 14) {
            $(".userImage").css("margin-top", "-40px").css("margin-left", "-15px").css("margin-top", "1px");
        }
*/

        // muda tamanho do user de acordo com zoom
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
        div.id = i;

        //console.log("TAMNHO É " + tamanho);

        div.innerHTML = '<img class = "userImage" id="us' + i + '" src="' + img + '" alt="Profile Image" style="border-color:' + userColor[i] + ';">';


        var panes = marker.getPanes();
        panes.overlayImage.appendChild(div);
        marker.div = div;

    }
}
