// Nome do utilizador a analisar
var targetUserName = $("#name").val(); //texto (val) que foi escrito na caixa de pesquisa
var targetUserName11 = $("#location").val(); 
var targetUserName12 = $("#fields").val(); 
 
// Array associativo com nome do utilizador como chave e valor de amizade como valor
var amigos = {};

//chave necessária para utilização da API
var apikey = "Hr4r14bPbRdZq220clN8zGAvKvrO0TAz";

//URL base de pedidos / pesquisas relacionadas com os utilizadores
var users_url = "https://www.behance.net/v2/users/";


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

    //ex7 - invocar a getUserFriends antes de terminar
    getUserFriends();
}


function getUserFriends() { //ex8 - invoca o endpoint necessário para obter os amigos do utilizador

    $.ajax({
        url: users_url + targetUserName + "/followers",
        dataType: "jsonp",
        data: {
            api_key: apikey,
            per_page: 20
            //sort: "views"
        },
        timeout: 1500,
        success: processUserFollowers, //resposta vai ser tratada pela processUserFollowers
        error: logError("a procurar seguidores") //em caso de erro - tratado pela logError
    });

    log("Obter amigos de " + targetUserName + " ...");

    //implementar: pedir followers e followees

}

function processUserFollowers(response) { //trata a resposta da getUserFriends()

    log("Processar seguidores de " + targetUserName + " ...");

    for (var s in response.followers) {
        amigos[s] = response.followers[s].display_name; //incializa o array amigos com os followers
        console.log("follower: " + amigos[s]);

        //acrescenta à div dados informações básicas sobre o utilizador
        $("#dados").append("<br>Seguidor " + s + ": " + amigos[s]);
    }


    //implementar: processadores os seguidores e actualizar o array associativo amigos
}


function processUserFollowees(response) {

    log("Processar seguidos por utilizador " + targetUserName + " ...");

    //para o caso da rede distinguir entre seguidos e seguidores
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

function updateTable() {

    $("#load").hide();
    $("#tabela").html("<table></table>");
    $("#tabela>table").append("<tr><th>Amigo</th><th>Compatibilidade</th></tr>");

    //implementar: ordenar amigos por compatibilidade e mostrar apenas primeiros 10

    for (nome in amigos)
        $("#tabela>table").append("<tr><td>" + nome + "</td><td>" + amigos[nome] + "</td></tr>");

    $("#tabela>table>tbody>tr>*").css("border", "1px solid");
    $("#tabela>table>tbody>tr>td:first-child").width("150px");
    $("#tabela>table>tbody>tr>td:last-child").width("60px");
}