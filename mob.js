var Mob = (function(){
	
	var _spawnLag;
	var _spawnDelay;
	var _mobMinOfMaxSpeed;
	var _mobMinMaxStartPoint;
		
	function Mob() {
		this._spawnLag = 0.0;
		this._spawnDelay = 1.0;
		this._mobMinOfMaxSpeed = 50;
		this._mobMinMaxStartPoint = [-1, 501];
	}
	
	Mob.prototype.elements_sort = function(elements) {
		for(var i = 1; i < elements.length; i++) {
			var j = i;
			
			while(j > 0 && elements[j].getY() < elements[j-1].getY()) {
				
				var tmp = elements[j];
				elements[j] = elements[j-1];
				elements[j-1] = tmp;
				j--;
			}
		}
		
		return elements;
	}

	Mob.prototype.spawner = function(elements, delta) {
		if (elements.length > MOB.MAX_SPAWN) return elements;
				
		this._spawnLag += delta;
		if (this._spawnLag >= this._spawnDelay) {
			this._spawnLag = 0.0;
			
			this._spawnDelay = Math.max(this._spawnDelay -= 0.01, 0.5);
			this._mobMinOfMaxSpeed = Math.min(this._mobMinOfMaxSpeed+=0.5, 180);
			
			var coor = [this._mobMinMaxStartPoint[Math.floor((Math.random() * 2))], Math.floor((Math.random() * 500))];
			var tmpSpeed =  Math.floor((Math.random() * ((Math.random() * 200) + this._mobMinOfMaxSpeed)) + 50);
			
			if(Math.floor((Math.random() * 2)) == 1) {
				elements.push(new Monster(coor[0], coor[1], tmpSpeed));
				//elements.push(new Monster(coor[0], coor[1], 50));
			} else {
				elements.push(new Monster(coor[1], coor[0], tmpSpeed));
				//elements.push(new Monster(coor[1], coor[0], 50));
			}					
		}
		
		return elements;
	}

return Mob;
})();