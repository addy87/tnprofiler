$(document).ready(main);

var myChart;
var myBarChart;
var firstRun;
var enteSelezionato;
var annoSelezionato;
var isLoading = false;

function main() {
	firstRun = true;
	canvas = $(".contenitore").not(".empty");
	title = $(".title .inner");
	empty = $(".empty");
	canvas.hide();
	title.hide();
	empty.hide();
	$(".info").hide();
	setTimeout(function() {
		$(".info").fadeIn(500);
	}, 2500);

	$("#selettore input[type='submit']").attr('disabled', 'disabled');
	$("#selettore select").on("change", function(e) {
		if ($("#selettore select").val() != "startingPoint" && !isLoading) $("#selettore input[type='submit']").removeAttr('disabled', 'disabled');
	});	

	//rangeslider
	$('input[type="range"]').rangeslider().on('input', function(e) {
		$(".input-group-addon.anno").text(e.target.value);
	});
	$(".input-group-addon.anno").text($('input[type="range"]').val());
	
	//elenco comuni
	get_csv();	

	//chart.js
	//inizializzazione charts + set default
	etaMediaChart = creaChartBar("etaMediaResult", "Età media");
	etaMediaMaschiChart = creaChartBar("etaMediaMaschiResult", "Età media maschi");
	etaMediaFemmineChart = creaChartBar("etaMediaFemmineResult", "Età media femmine");
	maschiVsFemmineChart = creaChartBarStacked("maschiVsFemmineResult", "Rapporto maschi/femmine");
	stranieriChart = creaChartLine("stranieriResult", "Residenti stranieri");
	natalitaChart = creaChartLine("natalitaResult", "Tasso di natalità");
	Chart.defaults.global.defaultFontFamily = 'Quicksand';
	Chart.defaults.global.defaultFontSize = 14;
	Chart.defaults.global.defaultFontColor = '#333';
	
	console.log("Starting....");
}

function get_csv() {
	/* OLD VERSION WITH DATASET TRENTINO
	$.get("http://dati.trentino.it/dataset/b9796d51-8c26-4fed-8249-3a3da438dd27/resource/200a2c47-2a44-4d2b-a42c-86d6adee9d4f/download/codente.csv")
		.success(function(data) {
			option_csv(data);
		})
		.fail(function() {
			$(".title").after('<div class="alert alert-danger" role="alert"><strong>Errore esterno</strong> Purtroppo la risorsa <a href="http://dati.trentino.it/dataset/b9796d51-8c26-4fed-8249-3a3da438dd27/resource/200a2c47-2a44-4d2b-a42c-86d6adee9d4f/download/codente.csv" target="_blank" title="codente.csv" class="alert-link">CodEnte.csv</a> (elencante i codici comuni) è stata eliminata da OPENdata Trentino.</div>');
		});

	*/
	$.get("/data/CodiceEntiIstat.csv")
		.success(function(data) {
			option_csv(data);
		})
		.fail(function() {
			$(".title").after('<div class="alert alert-danger" role="alert"><strong>Errore esterno</strong> Purtroppo la risorsa <a href="http://dati.trentino.it/dataset/b9796d51-8c26-4fed-8249-3a3da438dd27/resource/200a2c47-2a44-4d2b-a42c-86d6adee9d4f/download/codente.csv" target="_blank" title="codente.csv" class="alert-link">CodEnte.csv</a> (elencante i codici comuni) è stata eliminata da OPENdata Trentino.</div>');
		});
}

function option_csv(data) {
	/* OLD VERSION WITH DATASET TRENTINO
	var codEnti = $.csv.toObjects(data, {
		separator: ";"
	});
	
	for (var i in codEnti) {
		if (codEnti[i]["descriz"].toLowerCase().indexOf("disponibile") != -1 || codEnti[i]["descriz"].toLowerCase().indexOf("fuori") != -1) continue;
		var comune = codEnti[i]["descriz"];
		comune = comune.replace(/\uFFFD/, "");
		$("#selettore select").append("<option value='" + codEnti[i]["comu"] + "'>" + comune + "</option>");
	}

	*/
	var codEnti = $.csv.toObjects(data, {
		separator: ";"
	});
	for (var i in codEnti) {
		var codice = codEnti[i]["codice"];
		var comune = codEnti[i]["comune"];
		codice = codice.replace(" ", "");
		$("#selettore select").append("<option value='" + codice + "'>" + comune + "</option>");
	}
	$("#selettore").on("submit", function(e) {
		if ($("#selettore select").val() && $("#selettore #anno").val()) {
			draw($("#selettore select").val(), $("#selettore #anno").val());
			$("#selettore input[type='submit']").attr('disabled', 'disabled');
			enteSelezionato = $("#selettore option:selected").text();
			annoSelezionato = $("#selettore #anno").val();
		}
		e.preventDefault();
	})
}

function draw(idEnte, anno) {
	var annoMin = anno;

	//proxy.php per bypassare same origin policy tramite file_get_contents()
	var site = window.location.href;
	get_single_value(idEnte, site + "proxy.php?richiesta=eta", annoMin, etaMediaChart, "età media", "bar");
	get_single_value(idEnte, site + "proxy.php?richiesta=eta_maschi", annoMin, etaMediaMaschiChart, "età media maschi", "bar");
	get_single_value(idEnte, site + "proxy.php?richiesta=eta_femmine", annoMin, etaMediaFemmineChart, "età media femmine", "bar");
	get_double_value(idEnte, site + "proxy.php?richiesta=maschi_vs_femmine", annoMin, maschiVsFemmineChart, "percentuale maschi", "percentuale femmine", true);
	get_single_value(idEnte, site + "proxy.php?richiesta=stranieri", annoMin, stranieriChart, "residenti stranieri", "line");
	get_single_value(idEnte, site + "proxy.php?richiesta=natalita", annoMin, natalitaChart, "tasso di natalità", "line");
	isLoading = true;
	empty.fadeOut();
	$(".title .inner").fadeOut(300, function() {
		$(".title .inner").html('<div class="spinner"></div>');
		$(".title .inner").fadeIn(300);
	});
}

function get_single_value(idEnte, url, annoMinimo, chartID, nomeLabel, type) {
	$.get(url).success(function(data) {
		var result = [];
		var anni = [];
		var valori = [];
		var data = data[Object.keys(data)[0]];
		for (var i in data) {
			if (data[i].codEnte == idEnte) {
				if (!(parseInt(data[i].anno) < annoMinimo)) {
					result.push(data[i]);
					anni.push(data[i].anno);
					valori.push(data[i].valore);
				}
			}
		}
		if (result.length !== 0) {
			empty.fadeOut();
			if (type === "line") {
				draw_line_chart(chartID, anni, nomeLabel, valori);
			} else {
				draw_single_chart(chartID, anni, nomeLabel, valori);
			}
		}
	}).fail(function() {
		//gestione errore super super basic
		canvas.fadeIn();
		var canvasParent = chartID.chart.canvas.id;
		$("#" + canvasParent).parent().append('<p class="bg-danger">Errore esterno sito http://www.statweb.provincia.tn.it</p>');
	});
}

function get_double_value(idEnte, url, annoMinimo, chartID, nomeLabel, nomeLabel2, percento) {
	$.get(url).success(function(data) {
		var result = [];
		var anni = [];
		var valori = [];
		var valori2 = [];
		var data = data[Object.keys(data)[0]];
		for (var i in data) {
			if (data[i].codEnte == idEnte) {
				if (!(parseInt(data[i].anno) < annoMinimo)) {
					result.push(data[i]);
					anni.push(data[i].anno);
					valori.push(data[i].valore);
				}
			}
		}
		if (result.length == 0) {
			emptyResponse(chartID);
		} else {
			if (percento) {
				for (var i in valori) {
					valori2.push(100 - valori[i]);
				}
				draw_double_chart(chartID, anni, nomeLabel, valori, nomeLabel2, valori2);
			}
			empty.fadeOut();
		}
	}).fail(function() {
		//gestione errore super super basic
		canvas.fadeIn();
		var canvasParent = chartID.chart.canvas.id;
		$("#" + canvasParent).parent().append('<p class="bg-danger">Errore esterno sito http://www.statweb.provincia.tn.it</p>');
	});
}

function emptyResponse(chartID) {
	chartID.clear();
	canvas.fadeOut();
	empty.html("<h3 style='text-align:center; padding:20px 10px;'>Nessun risultato fornito per " + enteSelezionato + "<br>Prego, provare un altro comune</h3>");
	empty.fadeIn();
}
$(document).ajaxStop(function() {
	if (firstRun) {
		$(".title .inner").html("<h1>Benvenuto</h1><p>Seleziona un comune ed un anno per effettuare una ricerca.</p>");
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