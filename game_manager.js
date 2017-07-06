var Game = (function(){
	
	var _obj;
	var _time;
	
	var _elements;
	var _projectiles;
	var _loots;
	
	var _char;
	var _mob;
	
	var _score;
	
	function Game() {
		_obj = this;
		_obj.initControls();
	}
	
	Game.prototype.init = function() {
		_time = new Time();
		_mob = new Mob();
		_char  = new Character(CANVAS.WIDTH / 2, CANVAS.HEIGHT / 2);
		
		_elements = [];
		_projectiles = [];
		_loots = [];
		
		_elements = [_char];
		_score = 0;
	}
	
	Game.prototype.initControls = function() {
		_CANVAS.addEventListener('mousedown', function(evt) {
			evt.preventDefault();
			var rect = _CANVAS.getBoundingClientRect();
			var x = evt.clientX - rect.left;
			var y = evt.clientY - rect.top;
				
			if(evt.button === 0){
				if(_char.attack(x, y)){
				
					var projectile  = new Projectile(_char.getX(), _char.getY(), x, y);
					_projectiles.push(projectile);
				}
			}
			else if(evt.button === 2){
			}
			
			return false;
		}, false);

		window.onkeydown = function (event) {
			if (event.keyCode == 87)
				_char._movement[0] = 1;
			if (event.keyCode == 83)
				_char._movement[1] = 1;
			if (event.keyCode == 65)
				_char._movement[2] = 1;
			if (event.keyCode == 68)
				_char._movement[3] = 1;
			
		};
		
		window.onkeyup = function (event) {
			if (event.keyCode == 87)
				_char._movement[0] = 0;
			if (event.keyCode == 83)
				_char._movement[1] = 0;
			if (event.keyCode == 65)
				_char._movement[2] = 0;
			if (event.keyCode == 68)
				_char._movement[3] = 0;
		};
	}
	
	Game.prototype.start = function() {
		(function render() {
			
			_CTX.clearRect(0,0,CANVAS.WIDTH,CANVAS.HEIGHT);
			_CTX.drawImage(CANVAS.BG, 0, 0, CANVAS.WIDTH,CANVAS.HEIGHT); 
			
			_time.update();
			
			//sort and spawn mob including character for z index display
			_elements = _mob.elements_sort(_mob.spawner(_elements, _time.getDelta()));
			
			//reset game if dead
			if(_char._health <= 0) _obj.reset();
			
			//remove dead mob
			for(var i = 0; _elements[i]; ++i) {
				if(!_obj.updateElement(_elements[i])) {
					_loots.push(new Item(ITM.MP_DROP.IMG, _elements[i]._x, _elements[i]._y, ITM.MP_DROP.W, ITM.MP_DROP.H, ITM.MP_DROP.TYPE));
					_elements.splice(i,1);					
				}
			}
			
			//projectile collision detect
			for(var i = 0; _projectiles[i]; ++i) {
				var res = _projectiles[i].update(_time.getDelta(), _elements);
				if(res > 0) {
					if (res == 2) _score++;
					_projectiles.splice(i, 1);
				}
			}
			
			// loots
			for(var i = 0; _loots[i]; ++i) {
				if (!_loots[i].update(_time.getDelta(), _char)) {
					_loots.splice(i,1);
				}
			}
			
			_HUD.drawHP(_char._health, _time.getDelta());
			_HUD.drawMP(_char._mana, _time.getDelta());

			//draw score
			_CTX.drawImage(HUD.STAR, 225, 10, 50, 50);
			_CTX.font="20px Georgia";
			_CTX.textAlign="center"; 
			_CTX.fillStyle = "#af0237";
			_CTX.fillText(_score, 250, 41);

			window.requestAnimationFrame(render);
		})();
	}
	
	Game.prototype.updateElement = function(element) {
		switch(element.getType()) {
			case 'char':
				return element.update(_char._movement, _time.getDelta());
			case 'mob':
				return element.update(_char, _time.getDelta());
		}
	}
	
	Game.prototype.reset = function() {
		var score = _score;
		
		/*FB.api('/me/_SCOREs', 'post', { score: score }, function(response) {
			console.log(response.error);
			if( response.error ) {
			 console.error('send_SCORE failed', score, response);
			} else {
			 console.log('score posted to Facebook', score, response);
			}
		});*/
		
		_obj.init();
	}

return Game;
})();