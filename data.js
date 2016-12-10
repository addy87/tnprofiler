$(document).ready(main);

var loading;
var myChart;
var myBarChart;


function main() {	
	get_csv();
	loading = $(".loading");
	canvas = $("canvas");
	loading.hide();
	etaMediaChart = creaChartBar("etaMediaResult", "Età media", "bar");
	etaMediaMaschiChart = creaChartBar("etaMediaMaschiResult", "Età media maschi", "bar");
	etaMediaFemmineChart = creaChartBar("etaMediaFemmineResult", "Età media femmine", "bar");
	//maschiVsFemmineChart = creaChartBar("maschiVsFemmineResult", "Rapporto maschi/femmine", "doughnut");
	canvas.hide();
}

function creaChartBar(canvasID, titoloChart, tipo) {
	var canvasResult = $("#"+canvasID);
    var chart = new Chart(canvasResult,{
	    type: tipo,
	    data: {
	        labels: [],
	        datasets: [{
	            label: [],
	            data: [],
	            borderWidth: 1,
	        }],			        
	    },
	    options: {
	    	title: {
	            display: true,
	            text: titoloChart,
	        },
	        legend: {
	        	display: false,
	        },
	        scales: {
	            yAxes: [{
	                ticks: {
	                    beginAtZero:false,
	                }
	            }]
	        },
	        responsiveAnimationDuration: 3000,
	        animateScale: true,
			maintainAspectRatio: false,
			responsive: true,
	    },
	});
	return chart;
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
		if(! (this.value =="startingPoint") ) {
			draw(this.value);
		}
	})
}

function draw(id) {

	get_eta_media(id);
	get_eta_media_maschi(id);
	get_eta_media_femmine(id);
	get_maschi_vs_femmine(id);
	loading.show();
}

function get_eta_media(id) {
	$.get("http://localhost/tnprofiler/proxy.php?richiesta=eta")
	.success(function(data) {
			var result = [];
			var anni = [];
			var valori = [];
			var data = data["Età media della popolazione"];
			
			for (var i in data) {
				if (data[i].codEnte == id) {
					if(!(parseInt(data[i].anno) < "2000")) {
						result.push(data[i]);
						anni.push(data[i].anno);
						valori.push(data[i].valore);
					}
					
				}
			}
			loading.hide();

			draw_chart(etaMediaChart, anni, "età media", valori);
			

	});
}
function get_eta_media_maschi(id) {
	$.get("http://localhost/tnprofiler/proxy.php?richiesta=eta_maschi")
	.success(function(data) {
			var result = [];
			var anni = [];
			var valori = [];
			var data = data["Età media dei maschi"];
			
			for (var i in data) {
				if (data[i].codEnte == id) {
					if(!(parseInt(data[i].anno) < "2000")) {
						result.push(data[i]);
						anni.push(data[i].anno);
						valori.push(data[i].valore);
					}
				}
			}
			loading.hide();

			draw_chart(etaMediaMaschiChart, anni, "età media maschi", valori);
			

	});
}
function get_eta_media_femmine(id) {
	$.get("http://localhost/tnprofiler/proxy.php?richiesta=eta_femmine")
	.success(function(data) {
			var result = [];
			var anni = [];
			var valori = [];
			var data = data["Età media delle femmine"];
			
			for (var i in data) {
				if (data[i].codEnte == id) {
					if(!(parseInt(data[i].anno) < "2000")) {
						result.push(data[i]);
						anni.push(data[i].anno);
						valori.push(data[i].valore);
					}
				}
			}
			loading.hide();

			draw_chart(etaMediaFemmineChart, anni, "età media femmine", valori);
			

	});
}

function get_maschi_vs_femmine(id) {
	$.get("http://localhost/tnprofiler/proxy.php?richiesta=maschi_vs_femmine")
	.success(function(data) {
			var result = [];
			var anni = [];
			var valori = [];
			var valori_delta = [];
			var colori = [];
			var colori_delta = [];
			var data = data["Incidenza della popolazione femminile sul totale della popolazione"];
			
			for (var i in data) {
				if (data[i].codEnte == id) {
					if(!(parseInt(data[i].anno) < "2000")) {
						result.push(data[i]);
						anni.push(data[i].anno);
						valori.push(data[i].valore);
						colori.push('rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')');
					}
				}
			}
			loading.hide();

			//draw_chart(maschiVsFemmineChart, anni, "Incidenza della popolazione femminile sul totale della popolazione", valori);
			for (var i in valori) {
				valori_delta.push(100-valori[i]);
				colori_delta.push('rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')');
			}

			var ano = $("#maschiVsFemmineResult");
			var maschiVsFemmineChart = new Chart(ano,{
			    type: "bar",
			    data: {
			        labels: anni,
			        datasets: [{
			            label: "femmine",
			            data: valori,
			            backgroundColor: colori,
			            borderWidth: 1,
			        },
			        {
			            label: "maschi",
			            data: valori_delta,
			            backgroundColor: colori_delta,
			            borderWidth: 1,
			        }],			        
			    },
			    options: {
        scales: {
            yAxes: [{
				stacked: true,
                ticks: {
                    beginAtZero:true
                }
            }],
            xAxes: [{
				stacked: true,
                ticks: {
                    beginAtZero:true
                }
            }]
			
        },
        responsiveAnimationDuration: 3000,
	        animateScale: true,
			maintainAspectRatio: false,
			responsive: true,
    },
			});
			
			console.log(colori);
console.log(colori_delta);
	});


}

function draw_chart(chartID, labelsArray, label, valori) {
	var colori = [];
	for(var i in valori)
		colori.push('rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')');

	chartID.data.datasets[0].label = label;
	chartID.data.datasets[0].data = valori;
	chartID.data.datasets[0].backgroundColor = colori;
	chartID.data.labels = labelsArray;
	chartID.update();
	canvas.fadeIn(400, function() {
			chartID.resize();
			chartID.resize();
	});
	
}