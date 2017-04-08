$("#startAnimation").hide();

$("#start").hover(function () {
    console.log("foi-lhe para cima");
    $("#startAnimation").show(400);
    $("#shape").hide();
    
});


$("#start").mouseleave(function () {
    console.log("saiu-lhe de cima");
    $("#startAnimation").hide(400);
    $("#shape").show();
});
