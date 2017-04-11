$("#startAnimation").hide();
$("#LetsStart").hide();
$("#shape").hide();
$("#shape2").hide();
$("#content").hide();
$("#descriptions").hide();


/*$("#start").hover(function () {
    console.log("foi-lhe para cima");
    $("#startAnimation").show(400);
    $("#shape").hide();

});


$("#start").mouseleave(function () {
    console.log("saiu-lhe de cima");
    $("#startAnimation").hide(400);
    $("#shape").show();
});

*/

$("#title").mouseleave(function () {
    console.log("Muito cima");
});


setInterval(function () {
    $("#title").removeClass("cenasBrutais");
    $("#LetsStart").fadeIn(2000);
    $("#shape").fadeIn(1000);
    $("#shape2").fadeIn(1000);
}, 1000);



setInterval(function () {
    $("#content").fadeIn(600);
    $("#descriptions").fadeIn(600);
}, 2000);
