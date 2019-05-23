//Dataset
var data = [
       {
            "Nome":"Charizard",
            "Salute":78,
            "Attacco":84,
            "Difesa":78,
            "Velocita":100,
            "Speciale":95
         },
       {
            "Nome":"Venusaur",
            "Salute":80,
            "Attacco":82,
            "Difesa":83,
            "Velocita":100,
            "Speciale":121
         },
       {
            "Nome":"Blastoise",
            "Salute":79,
            "Attacco":83,
            "Difesa":100,
            "Velocita":78,
            "Speciale":125
         },
       {
            "Nome":"Pidgeot",
            "Salute":83,
            "Attacco":80,
            "Difesa":75,
            "Velocita":78,
            "Speciale":100
         },
       {
            "Nome":"Nidoking",
            "Salute":81,
            "Attacco":96,
            "Difesa":77,
            "Velocita":85,
            "Speciale":80
         },
       {
            "Nome":"Nidoqueen",
            "Salute":90,
            "Attacco":86,
            "Difesa":87,
            "Velocita":76,
            "Speciale":80
         },
       {
            "Nome":"Ninetales",
            "Salute":73,
            "Attacco":76,
            "Difesa":75,
            "Velocita":100,
            "Speciale":90
         },
       {
            "Nome":"Arcanine",
            "Salute":90,
            "Attacco":110,
            "Difesa":80,
            "Velocita":90,
            "Speciale":95
         },
       {
            "Nome":"Poliwrath",
            "Salute":90,
            "Attacco":90,
            "Difesa":95,
            "Velocita":70,
            "Speciale":80
         },
       {
            "Nome":"Alakazam",
            "Salute":55,
            "Attacco":50,
            "Difesa":45,
            "Velocita":120,
            "Speciale":120
         },
       {
            "Nome":"Machamp",
            "Salute":90,
            "Attacco":130,
            "Difesa":80,
            "Velocita":55,
            "Speciale":75
         },
       {
            "Nome":"Golem",
            "Salute":80,
            "Attacco":115,
            "Difesa":130,
            "Velocita":45,
            "Speciale":60
         },
       {
            "Nome":"Gengar",
            "Salute":60,
            "Attacco":65,
            "Difesa":60,
            "Velocita":110,
            "Speciale":100
         },
       {
            "Nome":"Rhydon",
            "Salute":105,
            "Attacco":130,
            "Difesa":120,
            "Velocita":40,
            "Speciale":45
         },
       {
            "Nome":"Kanghaskhan",
            "Salute":105,
            "Attacco":125,
            "Difesa":100,
            "Velocita":100,
            "Speciale":80
         },
       {
            "Nome":"Gyarados",
            "Salute":95,
            "Attacco":155,
            "Difesa":109,
            "Velocita":80,
            "Speciale":81
         },
       {
            "Nome":"Snorlax",
            "Salute":160,
            "Attacco":110,
            "Difesa":65,
            "Velocita":90,
            "Speciale":35
         },
       {
            "Nome":"Vileplume",
            "Salute":75,
            "Attacco":80,
            "Difesa":85,
            "Velocita":50,
            "Speciale":105
         },
       {
            "Nome":"Dragonite",
            "Salute":91,
            "Attacco":134,
            "Difesa":85,
            "Velocita":80,
            "Speciale":100
         },
       {
            "Nome":"Mewtwo",
            "Salute":106,
            "Attacco":110,
            "Difesa":90,
            "Velocita":130,
            "Speciale":130
         }
];


/*  Se si voglioni caricare i dati da file json esterno, utilizzare questo comando al posto del precedente.

    var dataset = d3.json("dataset.json").then((data) => {
	return data;
	}

	Attenzione!!! I browser bloccano il caricamento dei dati da file esterni, pertanto potrebbero esserci problemi nel loading.
	In windows, andare nella cartella del progetto ed eseguire: "python -m http.server [porta]" (python deve essere installato). Quindi andare
	sul browser e digitare: localhost:porta
	*/

//Margini 
var margin = {
				top: 20,
				right: 40,
				bottom: 40,
				left: 80
			},

width = 1300 - margin.left - margin.right,  //Larghezza
height = 615 - margin.top - margin.bottom;  //Altezza

//SVG
var svg = d3.select(".viz-portfolio-delinquent-status").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Trasposizione dei dati in layers
var dataset = d3.layout.stack()(["Salute", "Attacco", "Difesa", "Velocita", "Speciale"].map(function(stat) {
return data.map(function(d) {
    return {name: d.Nome, y: +d[stat], current: stat};
  });
}));

//Settaggio x, y e colori
var x = d3.scale.ordinal()
  .domain(dataset[0].map(function(d) { return d.name; }))
  .rangeRoundBands([0, width], .4);

var y = d3.scale.linear()
  .domain([0, 600])
  .range([height, 0]);

var colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#e377c2"];


// Definizione e Disegno assi
var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left")
  .ticks(10)
  .tickSize(-width, 0, 0)
  .tickFormat( function(d) { return d } );

var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

svg.append("g")
  .attr("class", "y axis")
  .call(yAxis);

svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

//Funzione di supporto che fa la somma totale del punteggio di ogni statistica per ogni istanza
var sum = 0;
dataset.forEach(function(d, i){
    sum += d[i].y
});	

//Creazione di gruppi per ogni parametro e rettangoli per ogni gruppo
var groups = svg.selectAll(".value")
  .data(dataset)
  .enter().append("g")
  .attr("class", "value")
  .attr('fill', function(d, i) { 
		return colors[i];
	})
	
var rect = groups.selectAll("rect")
  .data(function(d) {
	  return d;
  })
  .enter()
  .append("rect")
  .attr("x", function(d) {
	  return x(d.name);
   })
  .attr("y", function(d) {
	  return y(d.y0 + d.y);
   })
  .attr("height", function(d) {
	  return y(d.y0) - y(d.y0 + d.y);
   })
  .attr("width", x.rangeBand())
  .on("mouseover", function() { //Effetto opacità e contorno per evidenziare un certo rettangolo
	  d3.select(this).style("opacity", 0.75);
      d3.select(this).attr("stroke","Black").attr("stroke-width",0.8);
      tooltip.style("display", null); })
  .on("mouseout", function() { //fine effetto opacità e contorno
	  d3.select(this).style("opacity", 1);
      d3.select(this).attr("stroke","pink").attr("stroke-width",0.2);
      tooltip.style("display", "none"); })
  .on("mousemove", function(d) { //Display Nome statistica, valore assoluto e percentuale rispetto al totale
      var xPosition = d3.mouse(this)[0] - 15;
      var yPosition = d3.mouse(this)[1] - 25;
      tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
      tooltip.select("text").text(d.current + ":  " + d.y  + "\n" + " (" + (Math.round((d.y/sum)*100)) + "%)");
  })
  .on("click", function(d) { //Sort del grafico
	  change(d);
  })

 //Preparazione del tooltip, inizialmente il display è nascosto
var tooltip = svg.append("g")
  .attr("class", "tooltip")
  .style("display", "none");

tooltip.append("rect")
  .attr("width", 110)
  .attr("height", 20)
  .attr("fill", "white")
  .style("opacity", 0.5);

tooltip.append("text")
  .attr("x", 54)
  .attr("dy", "1.2em")
  .style("text-anchor", "middle")
  .attr("font-size", "12px")
  .attr("font-weight", "bold");

// Disegno della Legenda
var legend = svg.selectAll(".legend")
  .data(colors)
  .enter().append("g")
  .attr("class", "legend")
  .attr("transform", function (d, i) {
				return "translate(" + i * -70 + ",283)";
   })


legend.append("rect")
  .attr("x", width - 453)
  .attr("width", 10)
  .attr("y", 295)
  .attr("height", 10)
  .style("fill", function(d, i) {
	  return colors.reverse().slice()[i];
  })

legend.append("text")
  .attr("x", width - 440)
  .attr("y", 300)
  .attr("width", 40)
  .attr("dy", ".35em")
  .style("text-anchor", "start")
  .text(function(d, i) {
    switch (i) {
      case 0: return "Speciale";
      case 1: return "Attacco";
      case 2: return "Difesa";
      case 3: return "Velocita";
	  case 4: return "Salute";
    }
  });

  
//Funzione che esegue il sort del grafico in base alla statistica seleionata in ordine decrescente  
function change(d) {
		var statistica = d.current;
        var x0 = x.domain(data.sort(this.checked ? function (a, b) {
              return a.Nome - b.Nome;  //sort nomi 
    } : function (a, b) {
              return d3.descending(a[statistica], b[statistica]); //sort statistiche
    })
         .map(function (d) {
              return d.Nome;
    }))
        .copy();

	//ricalcolo del dataset
    var groups = svg.selectAll(".value")
    .data(dataset);

    groups.selectAll("rect")
    .data(function(d) {
	  return d;
	  })

    //creazione della transizione da eseguire
    var transition = svg.transition().duration(1000);

   //riordino barre
    transition.selectAll("g.value rect")
    .attr("x", function(d) {
            return x(d.name);
        })
    .attr("y", function(d) {
            return y(d.y0 + d.y);
        })
    .attr("height", function(d) {
            return y(d.y0) - y(d.y0 + d.y);
        })
	.attr("width", x.rangeBand())
     
	//riordino nomi
    transition.select(".x.axis")
    .call(xAxis)
    .selectAll("g")
}

















