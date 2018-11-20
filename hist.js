var hist = (function(){ // Namespace hist

    samples = [];
    last_walkers = [];
    bin_counts = [];
    const bins = 200;

    function canv()
    {
        return document.getElementById("histogram");
    }

    function init_bins()
    {
	    bin_counts = [];
	    for (var i=0; i<bins; ++i)
	    	bin_counts.push(0);
    }

    return {
        create : function(){
            elm = document.createElement("canvas");
            elm.width = 1000;
            elm.height = 500;
            elm.className = "histogram";
            elm.id = "histogram";
	    init_bins();
	    return elm;
        },

        reset : function(){
            samples = [];
	    init_bins();
            this.redraw();
        },

        sample : function(x){
            bin_width = 1/(bins-1);
            for (i=0; i<bins; ++i)
            {
                xf = i/(bins-1);
                if (Math.abs(x-xf) <= bin_width)
			bin_counts[i] += 1;
			
            }
        },

	set_last_walkers : function(walkers){
		last_walkers = walkers;
	},

        redraw : function(){
            
            c = canv();
            ctx = c.getContext("2d");
            ctx.fillStyle = "rgb(255,255,255)";
            ctx.fillRect(0,0,c.width,c.height);
            ctx.fillStyle = "rgb(0,0,0)";
            bin_pixel_width = Math.ceil(c.width/bins);

            max_y = -Infinity;
            for (i in bin_counts)
                if (bin_counts[i] > max_y)
                    max_y = bin_counts[i];

	    total_samples = 0;
            for (i in bin_counts)
            {
                x = bin_pixel_width*i;
                y = ((c.height-60) * bin_counts[i])/max_y;
		total_samples += bin_counts[i];
                ctx.fillRect(x-1,c.height-y-30,bin_pixel_width+2,y);
            }

            ctx.font = "20px Arial";
            ctx.fillText("Samples: "+total_samples,0,20);
	    ctx.fillStyle = "rgba(0,0,255,0.1)";

	    for (i in last_walkers)
	    {
	    	x = last_walkers[i]*c.width;
		ctx.fillRect(x-5,c.height-30, 30, 30);
	    }
        }
    }

})() // End namespace hist
