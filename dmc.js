var dmc = (function(){ // namespace dmc

    tau = 0.005;
    walker_count = 200;
    trial_e = 0;
    itteration = 0;
    walkers = [];
    paused = false;

    function potential(x)
    {
        if (x<-0.5) return 100;
        if (x>0.5) return 100;
        return 0;
        return Math.pow(x,2);
    }

    function rand_normal(variance)
    {
        u1 = Math.random();
        u2 = Math.random();
        u = Math.sqrt(-2*Math.log(u1))*Math.sin(2*Math.PI*u2);
        return u * Math.sqrt(variance);
    }

    function num_surviving_move(pot_before, pot_after)
    {
        p = Math.exp(-tau*(pot_before+pot_after-2*trial_e)/2);

        ret = 0;
        while (p > 1)
        {
            ret += 1;
            p -= 1;
        }
        if (Math.random() < p) ++ ret;
        return ret;
    }

    return {
        init : function()
        {
            walkers = [];
            for (i=0; i<walker_count; ++i)
                walkers[i] = Math.random()*2-1;
        },

        reset : function()
        {
            this.init();
            itteration = 0;
        },

        is_paused : function() {return paused;},
        pause : function() {paused = true;},
        unpause : function() {paused = false;},

        iterate : function()
        {
            if (paused) return;

            itteration += 1;
            new_walkers = [];
            av_pot = 0;
            for (i in walkers)
            {
                pot_before = potential(walkers[i]);
                walkers[i] += rand_normal(tau);
                pot_after = potential(walkers[i]);
                n = num_surviving_move(pot_before,pot_after);
                for (j=0; j<n; ++j)
                {
                    av_pot += pot_before + pot_after;
                    new_walkers.push(walkers[i]);
                    hist.sample(walkers[i]);
                }
            }
            
            walkers = new_walkers;

            av_pot /= (2*walkers.length);
            trial_e = av_pot + Math.log(walker_count/new_walkers.length)/tau;
     
            samples = hist.get_samples();

            best_pot = 0;
            for (i in samples)
                if (i >= 10*walker_count)
                    best_pot += potential(samples[i])
            best_pot /= (samples.length - 10*walker_count);

            ui.set_data({
                population : walkers.length,
                bestE : best_pot,
                trialE : trial_e,
                itteration : itteration
            });

            hist.redraw();
        }
    };

})(); // end namespace dmc