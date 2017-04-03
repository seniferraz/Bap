// Nome do utilizador a analisar
var targetUserName = $("#name").val(); //texto (val) que foi escrito na caixa de pesquisa
var Location = $("#location").val(); 
var fields = $("#fields").val(); 
 
// Array associativo com nome do utilizador como chave e valor de amizade como valor
var amigos = {};

//chave necessária para utilização da API
var apikey = "Hr4r14bPbRdZq220clN8zGAvKvrO0TAz";

//URL base de pedidos / pesquisas relacionadas com os utilizadores
var users_url = "https://www.behance.net/v2/users/";

//https://api.behance.net/v2/users?q=ferraz&api_key=pGGIf6rZKW1YcIXnIrDHk7fTbvjwXsht - pelo que se escreve

$(function () {
    $("#load").hide();
    $("#search").click(search);
});


function search() { //quando se carrega em 'Procurar'
    targetUserName = $("#query").val();
    searching();

    getUserInfo();
}

function getUserInfo() { //chamada no search()

    $("#load").hide();
    //ex5 - pedido AJAX - invoca um endpoint que retorna informação básica do utilizador pesquisado à API
    $.ajax({
        url: users_url + targetUserName,
        dataType: "jsonp",
        data: {
            api_key: apikey
        },
        timeout: 1500,
        success: processUserInfo, //resposta vai ser tratada pela processUserInfo
        error: logError("a procurar utilizador") //em caso de erro - tratado pela logError
    });

    log("Obter informação de " + targetUserName + " ...");


}

function processUserInfo(response) { //chamada na getUserInfo() - processa dados do utilizador (response) e mostra-os

    //ex6 - resposta ao pedido AJAX
    var display_name = response.user.display_name;
    var city = response.user.city;
    var pais = response.user.country;

    var fields = response.user.fields;
    console.log(fields);

    var image = "";
    for (var s in response.user.images) {
        image = response.user.images[s]; //devolve última foto do array de fotos de perfil (iguais, tamanhos diferentes)
        //break; //devolve a primeira (mais pequena)
    }

    console.log("nome: " + display_name);
    console.log("cidade: " + city);
    console.log("país: " + pais);
    console.log("campos: " + fields);

    console.log("imagem: " + image);

    //acrescenta à div dados informações básicas sobre o utilizador
    $("#dados").append("Nome: " + display_name);
    $("#dados").append("<br>Localização: " + city + ", " + pais);
    $("#dados").append("<br>Campos de criação: " + fields + "<br>");

    var img = $("<img></img>");
    $("#dados").append(img);
    img.attr("src", image);

}


function log(message) {
    $("#status").append(message + "<br>");
}

function logError(actividade) { //em caso de erros
    return function (data) {
        //erro no pedido AJAX
        $("#status").append("Erro " + actividade + ": " + data.statusText + "<br/>");

        //ex6 - no caso do nome do utilizador não existir
        log("Utilizador não existe");
        searchAgain();
    }
}

function searching() {
    $("#procura").hide();
    $("#load").show();
    $("#status").empty();

    log("Procurando informação sobre " + targetUserName);
}

function searchAgain() { //chamada quando utilizador procurado não existe
    $("#procura").show();
    $("#load").hide();
}
