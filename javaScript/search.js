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

//dados dos users (resultados)
var userName = [];
var fields = []; //top 3
var city = [];
var userURL = [];
var userField = []; //1º
var userColor = [];
var userImageMarker = []; //foto perfil user

//Passagem no inciailize
var passagem = 0;

// Geocoding
var cityPosit = {};

//mudar layout
var lineDown = 0;
var lineLeft = 0;
var newlayout = false;

//usado para fechar infowindow
var anterior;


//Campos de criação, respetiva cor, se é usado (existe nos resultados da pesquisa) e nº de users (dos resultados)
var colors = {
    field: ['Advertising', 'Animation', 'Architecture', 'UI/UX', 'Web Design', 'Art Direction', 'Branding', 'Calligraphy', 'Digital Art', 'Drawing', 'Editorial Design', 'Fashion', 'Film', 'Graphic Design', 'Illustration', 'Industrial Design', 'Interaction Design', 'Interior Design', 'Journalism', 'Motion Graphics', 'Packaging', 'Photography', 'Programming', 'Typography', 'Digital Photography'],
    color: ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B', '#f500FF', '#880E4F', '#4DB6AC', '#B388FF', '#FF8A80', '#11a069'],
    used: ['false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false'],
    users: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};


$(function () { //quando a página carregou
    $(".spinnerContainer").hide();

    $("#search").click(search); //pesquisa quando se carrega no botão

    $('input').keypress(function (ev) {
        if (ev.keyCode === 13) {
            search(); //ou quando se faz enter num input
        }
    });
});


function search() { //quando se carrega em Search ou se faz enter num dos inputs
    $("#dados").empty();

    query = $("#name").val();
    locationsInput = $("#city").val();
    fieldsInput = $("#fields").val();
    $(".spinnerContainer").show();

    getUserInfo();

    //se pesquisa não der resultados passados 3 segundos, mostra alerta
    setTimeout(function () {
        if ($(".spinnerContainer").is(":visible")) {
            alert("Erro, por favor tente outra pesquisa.");
            $(".spinnerContainer").hide();
        }
    }, 3000);
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
            success: processUserInfo
        });
    }

    //pede a primeira pagina
    userRequest(1);
}

//deteta clique no botão de mudar layout
$("#changeLayout").click(function () {
    newlayout = !newlayout;
    search();
    lineDown = 0;
    lineLeft = 0;
});


function processUserInfo(response) {

    //a cada nova pesquisa - limpas os arrays
    userName = [];
    fields = [];
    city = [];
    userURL = [];
    userField = [];
    userColor = [];

    //reposição dos valores "used" e "users" de cada field — para mostragem na legenda e no gráfico
    colors.used = ['false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false', 'false'];
    colors.users = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];


    //processa dados do utilizador (response) e guarda-os em arrays
    for (var i = 0; i < response.users.length; i++) {

        userName[i] = response.users[i].display_name;
        fields[i] = response.users[i].fields; //top 3
        city[i] = latinize(response.users[i].city);
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

        $.getJSON({
            url: 'https://maps.googleapis.com/maps/api/geocode/json',
            data: {
                sensor: false,
                address: city[i]
            },

            success: function (data, textStatus) {

                if (!(city[i] in cityPosit)) {
                    var cidadeAtual = latinize(data.results[0].address_components[0].long_name);

                    cityPosit[cidadeAtual] = {};
                    cityPosit[cidadeAtual].lat = data.results[0].geometry.location.lat;
                    cityPosit[cidadeAtual].lng = data.results[0].geometry.location.lng;

                    //ver os limites da cidade de cada user, para não desenhar fora do mapa

                    cityPosit[cidadeAtual].nordesteLimitlat = data.results[0].geometry.bounds.northeast.lat;
                    cityPosit[cidadeAtual].nordesteLimitlng = data.results[0].geometry.bounds.northeast.lng
                    cityPosit[cidadeAtual].sudoesteLimitlat = data.results[0].geometry.bounds.southwest.lat;
                    cityPosit[cidadeAtual].sudoesteLimitlng = data.results[0].geometry.bounds.southwest.lng;
                }
                initialize();
            }
        });


        passagem = 0;
        /*—————— FIM Geocoding ————————— */



        //atribui cor da borda de acordo com o field mais popular do user
        for (var k = 0; k < colors.field.length; k++) {

            if (userField[i] === colors.field[k]) {
                userColor[i] = colors.color[k];

                //para adicionar à barra de legenda e aos gráficos
                colors.used[k] = 'true';
                colors.users[k]++;
                break;

            } else { //se field do user não for nenhum com cor definida, a borda fica da cor definida abaixo
                userColor[i] = '#22ff44';
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



    //quando determinou a localização de todos os users desenha
    if (passagem == userName.length - 1) {
        console.log(passagem + " passagem");
        console.log("passagem");

        lineDown = 0;

        for (var i = 0; i < userName.length; i++) {
            latGold = Math.random() * (cityPosit[city[i]].nordesteLimitlat - cityPosit[city[i]].sudoesteLimitlat) + cityPosit[city[i]].sudoesteLimitlat;
            lngGold = Math.random() * (cityPosit[city[i]].nordesteLimitlng - cityPosit[city[i]].sudoesteLimitlng) + cityPosit[city[i]].sudoesteLimitlng;

            var cemas = cityPosit[city[i]].lat;
            var cemas1 = cityPosit[city[i]].lng;

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

                var infowindow = new google.maps.InfoWindow({});

                this.div.addEventListener("click", function (evt) {
                    evt.stopImmediatePropagation();

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

                    infowindow = new google.maps.InfoWindow({
                        content: contentString,
                        position: userposit[divNum],
                        anchor: new google.maps.Point(0, 0)
                    });

                    if (anterior)
                        anterior.close(gmap);
                    infowindow.open(gmap);

                    //dar cor a infowindow de acordo com a cor do user
                    $(".gm-style>div:first-child>div+div>div:last-child>div>div:first-child>div").css("background", userColor[divNum], 'important');
                    $("#map>div>div>div:nth-child(1)>div:nth-child(4)>div:nth-child(4)>div>div:nth-child(1)>div:nth-child(3)>div:nth-child(1)>div").css("background", userColor[divNum], 'important');
                    $("#map>div>div>div:nth-child(1)>div:nth-child(4)>div:nth-child(4)>div>div:nth-child(1)>div:nth-child(3)>div:nth-child(2)>div").css("background", userColor[divNum], 'important');

                    $("#map > div > div > div:nth-child(1) > div:nth-child(4) > div:nth-child(4) > div > div:nth-child(3)").css("font-size", "14px", 'important').css("color", "white");

                    $("#map > div > div > div:nth-child(1) > div:nth-child(4) > div:nth-child(4) > div > div:nth-child(3)").html("<b>&#x2715;<b>");
                    anterior = infowindow;
                });
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

        //adiciona info user
        div.innerHTML = '<img class = "userImage" id="us' + i + '" src="' + img + '" alt="Profile Image" style="border-color:' + userColor[i] + ';">';

        var panes = marker.getPanes();
        panes.overlayImage.appendChild(div);
        marker.div = div;
    }
}
