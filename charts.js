function creaChartBar(canvasID, titoloChart) {
	var canvasResult = $("#"+canvasID);
    var chart = new Chart(canvasResult,{
	    type: "bar",
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
	                },

	            }],
	        },
	        responsiveAnimationDuration: 3000,
	        animateScale: true,
			maintainAspectRatio: false,
			responsive: true,
	    },
	});
	return chart;
}

function draw_single_chart(chartID, labelsArray, label, valori) {
	var colori = [];
	var rainbow = new Rainbow();

	rainbow.setNumberRange(0, (valori.length*6));
	rainbow.setSpectrum('FF0000', 'FFFF00', '00FF00', '00FFFF', '0000FF', 'FF00FF');
	var j = Math.floor(Math.random() * (valori.length*5));
	for(var i in valori) {
		var index = parseInt(i*2)+parseInt(j);
		colori.push("#"+rainbow.colourAt(index));
	}

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

function creaChartBarStacked(canvasID, titoloChart) {
	var canvasResult = $("#"+canvasID);
    var chart = new Chart(canvasResult,{
    	type: "bar",
	    data: {
	        labels: [],
	        datasets: [{
	            label: "",
	            data: [],
	            backgroundColor: [],
	            borderWidth: 1,
	        },
	        {
	            label: "",
	            data: [],
	            backgroundColor: [],
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
	return chart;
}

function draw_double_chart(chartID, labelsArray, label, valori, label2, valori2) {
	var colori = [];
	var colori2 = [];
	
	var rainbow = new Rainbow();
	var rainbow2 = new Rainbow();

	rainbow.setNumberRange(0, (valori.length*7));
	rainbow.setSpectrum('FF0000', 'FFFF00', '00FF00', '00FFFF', '0000FF', 'FF00FF');

	rainbow2.setNumberRange(0, (valori2.length*7));
	rainbow2.setSpectrum('FF0000', 'FFFF00', '00FF00', '00FFFF', '0000FF', 'FF00FF');

	var j = Math.floor(Math.random() * (valori.length*5));
	var x = Math.floor(Math.random() * (valori2.length*5));
	
	for(var i in valori) {
		var index = parseInt(i*2)+parseInt(j);
		var index2 = parseInt(i*2)+parseInt(x);
		colori.push("#"+rainbow.colourAt(index));
		colori2.push("#"+rainbow2.colourAt(index2));
	}



	chartID.data.datasets[0].label = label;
	chartID.data.datasets[0].data = valori;
	chartID.data.datasets[0].backgroundColor = colori;

	chartID.data.datasets[1].label = label2;
	chartID.data.datasets[1].data = valori2;
	chartID.data.datasets[1].backgroundColor = colori2;

	chartID.data.labels = labelsArray;
	chartID.update();
	canvas.fadeIn(400, function() {
			chartID.resize();
			chartID.resize();
	});
}