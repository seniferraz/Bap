$("#LetsStart").hide();
$("#shape").hide();
$("#shape2").hide();
$("#descriptions").hide();


/* passados 1000ms título vai para o canto e o resto aparece */
setTimeout(function () {
    $("#title").removeClass("cenasBrutais");
    $("#LetsStart").fadeIn(2000);
    $("#shape").fadeIn(1000);
    $("#shape2").fadeIn(1000);
}, 1000);


/* descrição aparece passados 2000ms */
setTimeout(function () {
    $("#descriptions").fadeIn(600);
}, 2000);
