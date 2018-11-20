var pot_draw = (function(){ // Namespace pot_draw

	canv = null;
	ctx  = null;
	points = [];

	function redraw()
	{
		ctx = canv.getContext("2d");
		ctx.fillStyle = "rgb(222,222,222)";
		ctx.fillRect(0,0,canv.width, canv.height);
		ctx.fillStyle = "rgb(255,0,0)";
		for (i in points)
		{
			xy = points[i];
			xp = xy.x * canv.width;
			yp = (1-xy.y) * canv.height;
			ctx.beginPath();
			ctx.arc(xp,yp,15,0,2*Math.PI);
			ctx.fill();
		}

		ctx.beginPath();
		ctx.moveTo(0,0);
		for (i in points)
		{
			xy = points[i];
			xp = xy.x * canv.width;
			yp = (1-xy.y) * canv.height;
			ctx.lineTo(xp,yp);
		}
		ctx.lineTo(canv.width,0);
		ctx.lineTo(canv.width,canv.height);
		ctx.lineTo(0,canv.height);
		ctx.closePath();
		ctx.fill();
	}

	function add_point(x,y)
	{
		points.push({x:x,y:y});
		points.sort(function(a,b){return a.x-b.x;});
		redraw();
	}

	return {

            reset : function() {
		points = [];
		redraw();
	    },
		
	    create : function() {
		canv = document.createElement("canvas");
		canv.width = 1000;
		canv.height = 500;
		canv.className = "pot_draw";
		canv.onclick = function(e)
		{
			xf = e.offsetX / canv.offsetWidth;
			yf = 1 - (e.offsetY / canv.offsetHeight);
			add_point(xf,yf);
		}

		for (x=0; x<100; x += 1)
		{
			xf = x/100;
			yf = 4*(xf-0.5)*(xf-0.5);
			add_point(xf,yf);
		}

		redraw();
		return canv;
	    },

	    potential : function(x){
	    	if ((x<=0) || (x>=1))
		{
			ret = Infinity;
			//ret = Math.pow(Math.abs(x-0.5)*2,8);
		}
		else
		{
			to_interp = [];
			to_interp.push({x:0,y:1})
			for (i in points)
				to_interp.push(points[i])
			to_interp.push({x:1,y:1})

			above_index = -1;
			for (var i=1; i<to_interp.length; ++i)
				if (x < to_interp[i].x)
				{
				    above_index = i;
				    break;
				}
			if (above_index < 0)
				throw "index oor";
			xy_2 = to_interp[above_index];
			xy_1 = to_interp[above_index-1];
			return xy_1.y + (x-xy_1.x)*(xy_2.y-xy_1.y)/(xy_2.x-xy_1.x);
		}
		if (ret < 0) ret = 0;
		if (ret > 1) ret = 1;
		return ret;
	    },
	}

})(); // End namespace pot_draw
