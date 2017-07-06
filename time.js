var Time = (function(){
	
	var _delta;
	var _then;
	var _now;
		
	function Time() {
		this._delta = 0;
		this._then = Date.now();
	}
	
	Time.prototype.update = function() {
		this._now = Date.now();
		this._delta = (this._now - this._then) / 1000; // seconds since last frame
		this._then = this._now;
	}
	
	Time.prototype.getDelta = function() {
		return this._delta;
	}

return Time;
})();