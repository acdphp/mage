var Item = (function(){
	
	var _img;
	var _x;
	var _y;
	var _w;
	var _h;
	var _type;
	
	function Item(img, x, y, w, h, type) {
		this._img = img;
		this._x = x;
		this._y = y;
		this._w = w;
		this._h = h;
		this._type = type;
	}
	
	Item.prototype.update = function(delta, character) {
		_CTX.drawImage(this._img, this._x, this._y, this._w, this._h);
		return this.hitCheck(character);
	}
	
	Item.prototype.hitCheck = function(character) {
		if (Math.abs(character._x - this._x) < this._w &&
			
			Math.abs(character._y - this._y) < this._h) {
			if (this._type == "mana") {
				
				character.addMP(5);
				return false;
			}
		}
		
		return true;		
	}

return Item;
})();