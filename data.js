$(document).ready(main);

var loading;
var myChart;

function main() {	
	get_csv();
	loading = $(".loading");
	loading.hide();
	$("canvas").hide();
}

function get_csv() {
	$.get("http://dati.trentino.it/dataset/b9796d51-8c26-4fed-8249-3a3da438dd27/resource/200a2c47-2a44-4d2b-a42c-86d6adee9d4f/download/codente.csv")
	.success(function(data) {
		option_csv(data);
	});
}

function option_csv(data) {
	var codEnti = $.csv.toObjects(data, {separator: ";"});
	for (var i in codEnti) {
		if(codEnti[i]["descriz"].toLowerCase().indexOf("disponibile") != -1)
			continue;
		$("form select").append("<option value='"+codEnti[i]["comu"]+"'>"+codEnti[i]["descriz"]+"</option>");
	}

	$("form select").on("change", function() {
		if(! (this.value =="startingPoint") )
			draw(this.value);
	})
}

function draw(id) {
	$("canvas").fadeOut("slow");
	for(var i in Chart.instances) {
		Chart.instances[i].clear();
		Chart.instances[i].destroy();
	}
	get_eta_media(id);
	get_eta_media_maschi(id);
	get_eta_media_femmine(id);
	loading.show();
}

function get_eta_media(id) {
	$.get("http://localhost/tnprofiler/proxy.php?richiesta=eta")
	.success(function(data) {
			var result = [];
			var anni = [];
			var valori = [];
			var colori = [];
			var data = data["Età media della popolazione"];
			
			for (var i in data) {
				if (data[i].codEnte == id) {
					if(!(parseInt(data[i].anno) < "2000")) {
						result.push(data[i]);
						anni.push(data[i].anno);
						valori.push(data[i].valore);
						var colore = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
						colori.push(colore);
					}
					
				}
			}
			loading.hide();

			draw_chart("#etaMediaResult", anni, "età media", valori, colori, "bar");
			

	});
}
function get_eta_media_maschi(id) {
	$.get("http://localhost/tnprofiler/proxy.php?richiesta=eta_maschi")
	.success(function(data) {
			var result = [];
			var anni = [];
			var valori = [];
			var colori = [];
			var data = data["Età media dei maschi"];
			
			for (var i in data) {
				if (data[i].codEnte == id) {
					if(!(parseInt(data[i].anno) < "2000")) {
						result.push(data[i]);
						anni.push(data[i].anno);
						valori.push(data[i].valore);
						var colore = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
						colori.push(colore);
					}
				}
			}
			loading.hide();

			draw_chart("#etaMediaMaschiResult", anni, "età media maschi", valori, colori, "bar");
			

	});
}
function get_eta_media_femmine(id) {
	$.get("http://localhost/tnprofiler/proxy.php?richiesta=eta_femmine")
	.success(function(data) {
			var result = [];
			var anni = [];
			var valori = [];
			var colori = [];
			var data = data["Età media delle femmine"];
			
			for (var i in data) {
				if (data[i].codEnte == id) {
					if(!(parseInt(data[i].anno) < "2000")) {
						result.push(data[i]);
						anni.push(data[i].anno);
						valori.push(data[i].valore);
						var colore = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
						colori.push(colore);
					}
				}
			}
			loading.hide();

			draw_chart("#etaMediaFemmineResult", anni, "età media femmine", valori, colori, "bar");
			

	});
}

function draw_chart(canvasID, labelsArray, label, valori, colori, chartType) {

	var ctx = $(canvasID);

	myChart = new Chart(ctx, {
	    type: chartType,
	    data: {
	        labels: labelsArray,
	        datasets: [{
	            label: label,
	            data: valori,
	            borderWidth: 1,
	            backgroundColor: colori,
	        }],			        
	    },
	    options: {
	        scales: {
	            yAxes: [{
	                ticks: {
	                    beginAtZero:false
	                }
	            }]
	        },
	        responsiveAnimationDuration: 3000,
	        animateScale: true,
			maintainAspectRatio: false,
	    },
	});
	ctx.fadeIn(500);
}