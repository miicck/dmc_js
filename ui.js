ui = (function(){ // namespace ui

    info_panel = null;
    energy_chart = null;
    itteration = 0;

    return {
        create : function(){
            reset_button = document.createElement("button");
            reset_button.innerHTML = "Reset";
            reset_button.onclick = function()
            {
                dmc.reset();
                hist.reset();
                energy_chart.data.labels = [];
                energy_chart.data.datasets.forEach((ds)=>{
                    ds.data = [];
                });
                energy_chart.update();
            };
            document.body.appendChild(reset_button);

            pause_play = document.createElement("button");
            pause_play.innerHTML = "Pause";
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

            chart_container = document.createElement("div");
            chart_container.style.width = "50vw";
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
                            label: "Trial energy",
                            data : [],
                            yAxisID: "energy axis",
                            borderColor: "rgba(0,255,0)",
                            backgroundColor: "rgba(0,255,0,0.1)",
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

            energy_chart.data.labels.push(data.itteration);
            energy_chart.data.datasets.forEach((ds)=>{
                if (ds.label == "Best energy")
                    ds.data.push(data.bestE);
                if (ds.label == "Population")
                    ds.data.push(data.population);
                else if (ds.label == "Trial energy")
                    ds.data.push(data.trialE);
            });
            energy_chart.update();
        }
    }

})(); // end namespace ui