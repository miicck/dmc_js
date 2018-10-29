var hist = (function(){ // Namespace hist

    samples = [];
    bins = 200;

    function canv()
    {
        return document.getElementById("histogram");
    }

    return {
        create : function(){
            elm = document.createElement("canvas");
            elm.width = 1000;
            elm.height = 500;
            elm.className = "histogram";
            elm.id = "histogram";
            document.body.append(elm);
        },

        reset : function(){
            samples = [];
            this.redraw();
        },

        sample : function(x){
            samples.push(x);
        },

        get_samples : function(){
            return samples;
        },

        redraw : function(){
            
            min = Infinity;
            max = -Infinity;
            for (i in samples)
            {
                if (samples[i] < min)
                    min = samples[i];
                if (samples[i] > max)
                    max = samples[i];
            }

            c = canv();
            bin_width = (max-min)/(bins-1);
            xs = [];
            ys = [];

            for (i=0; i<bins; ++i)
            {
                xf = i/(bins-1);
                x  = xf * max + (1-xf)*min;
                xp = c.width * xf;
                y = 0;
                for (j in samples)
                    if (Math.abs(samples[j]-x) <= bin_width)
                        ++ y;
                xs.push(xp);
                ys.push(y);
            }

            max_y = -Infinity;
            for (i in ys)
                if (ys[i] > max_y)
                    max_y = ys[i];
            
            ctx = c.getContext("2d");
            ctx.fillStyle = "rgb(255,255,255)";
            ctx.fillRect(0,0,c.width,c.height);
            ctx.fillStyle = "rgb(0,0,0)";
            bin_pixel_width = Math.ceil(c.width/bins);

            for (i in xs)
            {
                x = xs[i];
                y = ((c.height-30) * ys[i])/max_y;
                ctx.fillRect(x-1,c.height-y,bin_pixel_width+2,y);
            }

            ctx.font = "20px Arial";
            ctx.fillText("Samples: "+samples.length,0,20);
        }
    }

})() // End namespace hist