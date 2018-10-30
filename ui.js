var ui = (function(){ // namespace ui

    info_panel = null;
    energy_chart = null;
    itteration = 0;

    return {
    	create_controls : function() {
            reset_button = document.createElement("button");
            reset_button.innerHTML = "Reset";
            reset_button.onclick = function()
            {
                hist.reset();
                dmc.reset();
                energy_chart.data.labels = [];
                energy_chart.data.datasets.forEach((ds)=>{
                    ds.data = [];
                });
                energy_chart.update();
		pot_draw.reset();
            };
            document.body.appendChild(reset_button);

            pause_play = document.createElement("button");
            pause_play.innerHTML = "Play";
            pause_play.onclick = function()
            {
                if (dmc.is_paused())
                {
                    dmc.unpause();
                    this.innerHTML = "Pause";
                }
                else
                {
                    dmc.pause();
                    this.innerHTML = "Play";
                }
            };
            document.body.appendChild(pause_play);

	    step = document.createElement("button");
	    step.innerHTML = "Step";
	    step.onclick = function()
	    {
	    	dmc.unpause();
		dmc.iterate();
		dmc.pause();
		pause_play.innerHTML = "Play";
	    };
	    document.body.appendChild(step);

	    target_population = document.createElement("input");
	    target_population.type = "number";
	    target_population.onchange = function()
	    {
	    	dmc.set_target_pop(target_population.value);
	    };
	    target_population.value = 100;
	    document.body.appendChild(target_population);

	    info_panel = document.createElement("div");
	    info_panel.innerHTML = "Best energy: 0.5 <BR> Population: 200";
	    document.body.appendChild(info_panel);
	},

        create_chart : function(){

            chart_container = document.createElement("div");
	    chart_container.className = "chart_container";
            document.body.append(chart_container);
            elm = document.createElement("canvas");
            chart_container.appendChild(elm);
            ctx = elm.getContext('2d');
            energy_chart = new Chart(ctx, {
                type: 'line',            
                data: {
                    labels : [],
                    datasets : [
                        {
                            label: "Best energy",
                            data : [],
                            yAxisID: "energy axis",
                            borderColor: "rgba(255,0,0)",
                            backgroundColor: "rgba(255,0,0,0.1)",
                        },
                        {
                            label: "Population",
                            data : [],
                            yAxisID: 'population axis',
                        },
			{
			    label: "Potential energy",
			    data : [],
			    yAxisID: "energy axis",
                            borderColor: "rgba(0,255,0)",
                            backgroundColor: "rgba(0,255,0,0.1)",
			},
			{
			    label: "Kinetic energy",
			    data : [],
			    yAxisID: "energy axis",
                            borderColor: "rgba(0,0,255)",
                            backgroundColor: "rgba(0,0,255,0.1)",
			}
                    ]
                },
                options: {
                    scales:
                    {
                        yAxes: [
                            {
                                type:"linear",
                                id: "energy axis",
                            },
                            {
                                type: "linear",
                                id : "population axis",
                            }
                        ]
                    }
                }
            });
            energy_chart.update();
        },

        set_data : function(data){

	    info_panel.innerHTML = "Population: "+data.population;
	    info_panel.innerHTML += "<br>Best energy: "+data.bestE
	    info_panel.innerHTML += "<br>Potential: "+data.potential;
	    info_panel.innerHTML += "<br>Kinetic: "+data.kinetic;

            energy_chart.data.labels.push(data.itteration);
            energy_chart.data.datasets.forEach((ds)=>{
                if (ds.label == "Best energy")
			if (data.bestE != 0)
			    ds.data.push(data.bestE);
                if (ds.label == "Population")
                    ds.data.push(data.population);
                else if (ds.label == "Trial energy")
                    ds.data.push(data.trialE);
		else if (ds.label == "Kinetic energy")
		    ds.data.push(data.kinetic);
		else if (ds.label == "Potential energy")
		    ds.data.push(data.potential);
            });
            energy_chart.update();
        }
    }

})(); // end namespace ui
