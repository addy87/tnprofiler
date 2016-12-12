$(document).ready(main);

var myChart;
var myBarChart;

var firstRun;
var enteSelezionato;
var annoSelezionato;

var isLoading = false;


function main() {
	firstRun = true;
	$('input[type="range"]').rangeslider().on('input', function(e) {
		$(".input-group-addon.anno").text(e.target.value);
	});
	$(".input-group-addon.anno").text($('input[type="range"]').val());
	get_csv();
	canvas = $(".contenitore").not( ".empty");
	title = $(".title .inner");
	empty = $(".empty");
	canvas.hide();
	title.hide();
	empty.hide();

	etaMediaChart = creaChartBar("etaMediaResult", "Età media");
	etaMediaMaschiChart = creaChartBar("etaMediaMaschiResult", "Età media maschi");
	etaMediaFemmineChart = creaChartBar("etaMediaFemmineResult", "Età media femmine");
	maschiVsFemmineChart = creaChartBarStacked("maschiVsFemmineResult", "Rapporto maschi/femmine");

	//diplomatiChart = creaChartLine("diplomatiResult", "Indice diplomati");
	stranieriChart = creaChartLine("stranieriResult", "Residenti stranieri");

	$("#selettore input[type='submit']").attr('disabled','disabled');
	$("#selettore select").on("change", function(e) {
		if($("#selettore select").val() != "startingPoint" && !isLoading)
			$("#selettore input[type='submit']").removeAttr('disabled','disabled');
	});

	Chart.defaults.global.defaultFontFamily = 'Quicksand';
	Chart.defaults.global.defaultFontSize =  14;
	Chart.defaults.global.defaultFontColor = '#333';
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

		var comune = codEnti[i]["descriz"];
		comune = comune.replace(/\uFFFD/, "");
		$("#selettore select").append("<option value='"+codEnti[i]["comu"]+"'>"+comune+"</option>");
	}

	$("#selettore").on("submit", function(e) {
		if( $("#selettore select").val() &&  $("#selettore #anno").val() ) {
			draw($("#selettore select").val(), $("#selettore #anno").val());
			$("#selettore input[type='submit']").attr('disabled','disabled');
			enteSelezionato = $("#selettore option:selected").text();
			annoSelezionato = $("#selettore #anno").val();
		}
		e.preventDefault();
	})
}

function draw(idEnte, anno) {
	var annoMin = anno;
	var site = window.location.href;
	get_single_value(idEnte, site+"proxy.php?richiesta=eta",annoMin,etaMediaChart,"età media", "bar");
	get_single_value(idEnte, site+"proxy.php?richiesta=eta_maschi",annoMin,etaMediaMaschiChart,"età media maschi", "bar");
	get_single_value(idEnte, site+"proxy.php?richiesta=eta_femmine",annoMin,etaMediaFemmineChart,"età media femmine", "bar");

	get_double_value(idEnte, site+"proxy.php?richiesta=maschi_vs_femmine",annoMin,maschiVsFemmineChart,"percentuale maschi","percentuale femmine", true);
	
	//Informazioni sui diplomati/laureati disponibili solo in delta-T 10 anni
	//get_single_value(idEnte, site+"proxy.php?richiesta=diplomati",annoMin,diplomatiChart,"indice diplomati", "line");

	get_single_value(idEnte, site+"proxy.php?richiesta=stranieri",annoMin,stranieriChart,"residenti stranieri", "line");

	isLoading = true;
	empty.fadeOut();
	
	$(".title .inner").fadeOut(300, function() {
		$(".title .inner").html('<div class="spinner"></div>');	
		$(".title .inner").fadeIn(300);
	});
	
}




function get_single_value(idEnte, url, annoMinimo, chartID, nomeLabel, type) {
	$.get(url)
	.success(function(data) {
			


			var result = [];
			var anni = [];
			var valori = [];
			var data = data[Object.keys(data)[0]];
			


			for (var i in data) {
				if (data[i].codEnte == idEnte) {
					if(!(parseInt(data[i].anno) < annoMinimo)) {
						result.push(data[i]);
						anni.push(data[i].anno);
						valori.push(data[i].valore);
					}
					
				}
			}

			if(result.length !== 0){
				empty.fadeOut();
				if(type === "line") {
					draw_line_chart(chartID, anni, nomeLabel, valori);
				} else {
					draw_single_chart(chartID, anni, nomeLabel, valori);
				}
						
			}			
	})
	.fail(function() {
		//gestione errore super super basic
		canvas.fadeIn();
		var canvasParent = chartID.chart.canvas.id;
		$("#"+canvasParent).parent().append('<p class="bg-danger">GASP! Qualcosa è andato storto. Sorry about it!<br><b>Please, ricaricare la pagina.</b></p>');
	});
	
}

function get_double_value(idEnte, url, annoMinimo, chartID, nomeLabel, nomeLabel2, percento) {
	$.get(url)
	.success(function(data) {
			var result = [];
			var anni = [];
			var valori = [];
			var valori2 = [];
			var data = data[Object.keys(data)[0]];
			
			for (var i in data) {
				if (data[i].codEnte == idEnte) {
					if(!(parseInt(data[i].anno) < annoMinimo)) {
						result.push(data[i]);
						anni.push(data[i].anno);
						valori.push(data[i].valore);
					}
				}
			}
			

			
			if(result.length == 0){
				emptyResponse(chartID);
			} else {
				if(percento) {
					for (var i in valori) {
						valori2.push(100-valori[i]);
					}
					draw_double_chart(chartID, anni, nomeLabel, valori, nomeLabel2, valori2);
				}
				empty.fadeOut();
			}

			
	})
	.fail(function() {
		//gestione errore super super basic
		canvas.fadeIn();
		var canvasParent = chartID.chart.canvas.id;
		$("#"+canvasParent).parent().append('<p class="bg-danger">GASP! Qualcosa è andato storto. Sorry about it!<br><b>Please, ricaricare la pagina.</b></p>');
	});

}


function emptyResponse(chartID) {
	chartID.clear();
	canvas.fadeOut();
	empty.html("<h3 style='text-align:center; padding:20px 10px;'>Nessun risultato fornito per "+enteSelezionato+"<br>Prego, provare un altro comune</h3>");
	empty.fadeIn();
	console.log("empty");
}

$(document).ajaxStop(function() {
	

	if(firstRun) {
		$(".title .inner").html("<h1>Benvenuto</h1>");	
		$(".title .inner").fadeIn(600);
		firstRun = false;
	} else {
		$("#selettore input[type='submit']").removeAttr('disabled');
		$(".title .inner").fadeOut(300, function() {
			$(".title .inner").html("<h1>Dati su " + enteSelezionato + " dal " + annoSelezionato + " al 2015</h1>");	
			$(".title .inner").fadeIn(300);
		});

		isLoading = false;
	}
	

});

