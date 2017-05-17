$("#LetsStart").hide();
$("#shape").hide();
$("#shape2").hide();
$("#descriptions").hide();


/*
$("#start").hover(function () {
    console.log("foi para cima");
    $("#startAnimation").show(400);
    $("#shape").hide();

});


$("#start").mouseleave(function () {
    console.log("saiu de cima");
    $("#startAnimation").hide(400);
    $("#shape").show();
});
*/

/*
$("#title").mouseleave(function () {
    console.log("Muito cima");
});
*/


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
