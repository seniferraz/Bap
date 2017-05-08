function processUserInfo(response) {

    //......
    
    
    //processa dados do utilizador (response) e mostra-os
    for (var i = 0; i < response.users.length; i++) {

        userName[i] = response.users[i].display_name;
        
        //.....
    }


    /*—————— Geocoding ————————— */

    //https://developers.google.com/maps/documentation/javascript/geocoding

    $.getJSON({
        url: 'https://maps.googleapis.com/maps/api/geocode/json',
        data: {
            sensor: false,
            address: city[1]
        },

        success: function (data, textStatus) {
            //console.log(textStatus, data);
            //console.log(data.results[0].geometry.location);
            userLat = data.results[0].geometry.location.lat;
            userLng = data.results[0].geometry.location.lng;

            /*
            limiteNordesteLat = data.results[0].geometry.bounds.northeast.lat;
            limiteNordesteLng = data.results[0].geometry.bounds.northeast.lng;

            limiteSudoesteLat = data.results[0].geometry.bounds.southwest.lat;
            limiteSudoesteLng = data.results[0].geometry.bounds.southwest.lng;

                
            console.log(limiteNordesteLat + " ———— limiteNordesteLat");
            console.log(limiteNordesteLng + " ———— limiteNordesteLng");
            console.log(limiteSudoesteLat + " ———— limiteSudoesteLat");
            console.log(limiteSudoesteLng + " ———— limiteSudoesteLng");
            */


            tipodeterra = data.results[0].address_components[0].types;

            //console.log(data.results[0] + " ———— TIPO DE TERRA");

            //userPos.x[i] = userLat;
            //userPos.y[i] = userLng;

            //console.log(userLat + "userLat");
            //console.log(userLng+ "userLng");

            initialize();

        },
        error: function () {
            alert("error");
        }
    });


    /*—————— FIM Geocoding ————————— */


    for (var i = 0; i < userName.length; i++) {


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

            
            //........
            
            
        }

        $(".spinner").hide();

    }


    ShowLegend();

    /*—————— Chart ————————— */
    //só corre o drawChart depois dos resultados da pesquisa serem processados, para estes poderem ser usados no gráfico
    drawChart();

    $("#moreinfo").show();

}

