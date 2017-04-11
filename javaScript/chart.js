$(function () {
    $("#chart_div").hide();

    $("#moreinfo").click(function () {
        console.log("click");
        if ($("#chart_div").css('display') == 'none') {
            $("#chart_div").show();
            $("#moreinfo").html("X");
        } else {
            $("#chart_div").hide();
            $("#moreinfo").html("More informations");
        }
    });
});



//———— Adaptação do código base para gráficos fornecido pelo Google Developers em "https://developers.google.com/chart/"


// Load the Visualization API and the corechart package.
google.charts.load('current', {
    'packages': ['corechart']
});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.

var fieldUsers = [];

function drawChart() {

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Field');
    data.addColumn('number', 'Users');

    for (var k = 0; k < colors.field.length; k++) {
        fieldUsers[k] = 10;
        console.log("fieldUsers " + fieldUsers);

        data.addRows([
            [colors.field[k], fieldUsers[k]],

        ]);
    }

    // Set chart options
    var options = {
        'title': 'Users by field',
        'width': 500,
        'height': 300
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}
