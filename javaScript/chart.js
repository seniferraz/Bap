$(function () {
    $("#moreinfo").hide();
    $("#chart").hide();

    $("#moreinfo").click(function () {
        console.log("click");
        if ($("#chart").css('display') == 'none') {
            $("#chart").show();
            $("#moreinfo").html("&#x2715;");
        } else {
            $("#chart").hide();
            $("#moreinfo").html("More informations");
        }
    });
});


/*—————— Adaptação do código base para gráficos fornecido pelo Google Developers em "https://developers.google.com/chart/"  ————— */


// Load the Visualization API and the corechart package.
google.charts.load('current', {
    'packages': ['corechart']
});

// Set a callback to run when the Google Visualization API is loaded.
//google.charts.setOnLoadCallback(drawChart);   ———   neste caso feito no search.js para usar dados dos resultados da pesquisa




// Callback that creates and populates a data table, instantiates the bar chart, passes in the data and draws it.
function drawChart() {


    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Field');
    data.addColumn('number', 'Users');

    for (var k = 0; k < colors.field.length; k++) {
        if (colors.used[k] == 'true') {

            data.addRows([
            [colors.field[k], colors.users[k]],

        ]);
        }
    }

    // Set chart options
    var options = {
        'title': 'Users by field',
        'width': 500,
        'height': 300,
        colors: ["#00BCD4"]
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.BarChart(document.getElementById('chart'));
    chart.draw(data, options);
}
