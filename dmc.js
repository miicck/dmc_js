var dmc = (function(){ // namespace dmc

    tau = 0.001;
    walker_count = 200;
    trial_e = 0;
    itteration = 0;

    walkers = [];
    potentials = [];
    kinetics   = [];

    paused = true;

    function potential(x)
    {
    	return 1000*pot_draw.potential(x);
    }

    function kinetic(x)
    {
    	const EPS = 0.01;
    	ret = 0.5 * x * (potential(x+EPS) - potential(x-EPS))/(2*EPS);
	if (isNaN(ret) || (!isFinite(ret)))
		return 0;
	return ret;
    }

    function rand_normal(variance)
    {
        u1 = Math.random();
        u2 = Math.random();
        return Math.sqrt(-2*variance*Math.log(u1))*Math.sin(2*Math.PI*u2);
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
            for (var i=0; i<walker_count; ++i)
	    {
	    	x = Math.random();
                walkers.push(x);
		hist.sample(x);
	    }
        },

        reset : function()
        {
            this.init();
            itteration = 0;
	    trialE = 0;
        },

        is_paused : function() {return paused;},
        pause : function() {paused = true;},
        unpause : function() {paused = false;},

	set_target_pop : function(tp) {
		walker_count = tp;
	},

        iterate : function()
        {
            if (paused)
		return;
            itteration += 1;

            new_walkers = [];
            av_pot = 0;
	    av_kin = 0;
	    for (var i=0; i<walkers.length; ++i)
            {
                pot_before = potential(walkers[i]);
		dx = rand_normal(tau);
		w_before = walkers[i];
                walkers[i] += dx;
		if (isNaN(walkers[i]))
			throw "is nan after move";
                pot_after = potential(walkers[i]);
		kin_after = kinetic(walkers[i]);
                var n = num_surviving_move(pot_before,pot_after);
                for (var j=0; j<n; ++j)
                {
                    av_pot += pot_after;
		    av_kin += kin_after;
                    new_walkers.push(walkers[i]);
                    hist.sample(walkers[i]);
                }
            }
            
            walkers = new_walkers;
	    av_pos = 0;
	    for (i in walkers)
	    	av_pos += walkers[i]
	    av_pos /= walkers.length;

            av_pot /= walkers.length;
	    av_kin /= walkers.length;

	    potentials.push(av_pot);
	    kinetics.push(av_kin);

            trial_e = av_pot + Math.log(walker_count/new_walkers.length)/tau;
     
            best_pot = 0;
	    best_kin = 0;
	    count = 0;
            for (i in potentials)
                if (i > 20)
		{
                    best_pot += potentials[i];
		    best_kin += kinetics[i];
		    count += 1;
		}
            best_pot /= count;
	    best_kin /= count;

            ui.set_data({
                population : walkers.length,
                bestE : best_pot+best_kin,
                trialE : trial_e,
		potential : av_pot,
		kinetic: av_kin,
                itteration : itteration
            });

	    hist.set_last_walkers(walkers);
            hist.redraw();
        }
    };

})(); // end namespace dmc
