var Projectile = (function(){
	
	var _src_x;
	var _src_y;
	var _dest_x;
	var _dest_y;
	
	var _v_x;
	var _v_y;

	var _range;
	
	function Projectile(src_x, src_y, dest_x, dest_y) {

		this._src_x = src_x;
		this._src_y = src_y;
		this._dest_x = dest_x;
		this._dest_y = dest_y;
		this._range = 500;
		
		var tmp = Math.abs(dest_x - src_x) + Math.abs(dest_y - src_y);
		var sign_x = (dest_x - src_x) < 0 ? -1 : 1;
		var sign_y = (dest_y - src_y) < 0 ? -1 : 1;
		var speed = 500;
		
		this._v_x = (sign_x * (Math.abs(dest_x - src_x)/tmp)) * speed;
		this._v_y = (sign_y * (Math.abs(dest_y - src_y)/tmp)) * speed;
	}
	
	Projectile.prototype.update = function(delta, elements) {

		this._src_x += this._v_x * delta;
		this._src_y += this._v_y * delta;
		
		if (this._src_x > this._range || this._src_y > this._range
			|| this._src_x < 0 || this._src_y < 0) 
				return 1;
		
		_CTX.drawImage(PROJECTILE.IMG, this._src_x, this._src_y - 10);
		
		return this.hitCheck(elements);
	}
	
	Projectile.prototype.hitCheck = function(elements) {
	
		for(var i = 0; i < elements.length; i++) {
		
			if (elements[i].getType() == 'mob') {
				if (!elements[i]._got_hit && Math.abs(this._src_x - elements[i].getX()) < 30 && Math.abs(this._src_y - elements[i].getY()) < 45) {
					 elements[i].hit();
					 return 2;
				}
			}
		}
		
		return 0;
	}
	

return Projectile;
})();