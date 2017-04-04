//  —— inicializações   —————————————————————————————


//var api_key = 'pGGIf6rZKW1YcIXnIrDHk7fTbvjwXsht';
var api_key = 'Hr4r14bPbRdZq220clN8zGAvKvrO0TAz';

//var URL = 'https://api.behance.net/v2/users/';
var URL = 'https://api.behance.net/v2/users';

// Nome do utilizador, localização e campos de criação a analisar
var query;
var locations;
var fields;


var colors = {
    field: ['Animation', 'Graphic Design', 'Branding', 'Photography', 'Architecture', "Interaction Design", 'Drawing', 'Illustration', 'Typography', 'Packaging', 'Digital Art', 'Film', 'Design', 'UI/UX' ],
    color: ['#c405cc','#0014ff','#ff7600','#00ff31','#ffff00','#00f5ff' ,'#6d6d6d', '#af4d4d','#000000','#774501','#e50be5', '#0b7b65', '#9d00ff', '#0076ff' ]
};


//  —— código   —————————————————————————————


$(function () {
    $("#load").hide();
    $("#search").click(search);
});

function search() {
    console.log("carregou");

    query = $("#name").val();
    locations = $("#location").val();
    fields = $("#fields").val();

    console.log("QUERY == " + query);
    console.log("location == " + locations);
    console.log("fields == " + fields);

    searching();

    getUserInfo();
}

function getUserInfo() {

    log("Obter informação de " + query + " ...");

    $.ajax({
        url: URL + "?q=" + query,
        dataType: "jsonp",
        data: {
            api_key: api_key,
            city: locations,
            field: fields
        },
        timeout: 1500,
        success: processUserInfo,
        error: logError("a procurar utilizador")
    });
}


function processUserInfo(response) {

    //implementar: processar dados do utilizador (response) e mostrá-los
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


        var image = "";
        for (var s in response.users[i].images) {
            image = response.users[i].images[s];
            //break;
        }

        //apenas mostra as pessoas com campos de criação e com foto de perfil    

        if (popularField && String(image) !== "https://a5.behance.net/cde687cc54a23e8cd2bf9d2c2fbd8894e2d15cb0/img/profile/no-image-138.jpg?cb=264615658") {

            
            $("#dados").append("<hr>");
            $("#dados").append("<p>" + userName + "</p>");
            
            $("#dados").append("<a> href="  + userURL + "</a>");
            
            $("#dados").append('<img class = "userImage" id="user' + i + '" src=' + image + ' height="90" width="90" alt="Profile Image">');
            $("#dados").append("<p> City: " + city + "</p>");
            $("#dados").append("<p> Fields: " + fields + "</p>");
            $("#dados").append("<p> FIELD MAIS POPULAR: " + popularField + "</p>");
            $("#dados").append("<p> COR DO FIELD: " + userColor + "</p>");

            var cor = "#0505cc";
            //$("#user"+i).css("border","4px solid #0505cc");
            $("#user" + i).css("border-weight", "4px");

            $("#user" + i).css("border-color", userColor);

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
        searchAgain();
    }
}

function searching() {
    $("#procura").hide();
    $("#load").show();
    $("#status").empty();

    log("Procurando informação sobre " + query);
}

function searchAgain() {
    $("#procura").show();
    $("#load").hide();
}