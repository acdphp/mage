var Character = (function(){
	var _x;
	var _y;
	var _speed;
	var _framex;
	var _width;
	var _height;
	
	var _last_y_movement;
	var _last_x_movement;
	
	var _attacking;
	var _attack_speed;
	
	var _got_hit;
	var _hit_walk_anim_speed;
	
	var _health;
	var _mana;
	
	var _emoting;
	var _emotion;
	var _emote_lag;
	
	var _movement;
		
	function Character(x, y) {
	
		this._x = x;
		this._y = y;
		this._speed = 100;
		this._framex = 0;
		
		this._width = 72;
		this._height = 115;
		
		this._last_y_movement = 0; //front
		this._last_x_movement = 0; //left
		
		this._attacking = 0;
		this._attack_speed = 10;
		
		this._got_hit = 0;
		this._hit_walk_anim_speed = 10;
		
		this._health = CHAR.MAX_HP;
		this._mana = CHAR.MAX_MP;
		
		this._emoting = 0;
		this._emotion = null;
		this._emote_lag = 0;
		
		this._movement = [0,0,0,0];
	}
	
	Character.prototype.setPos = function(x, y) {
		this._x = x;
		this._y = y;
	}
	
	Character.prototype.update = function(movement, delta) {
		var movement_y = 0;
		var movement_x = 0;
		var sprite_x = 0;
		var sprite_y = 0;
		
		if (this._attacking) {
			var axy = this.attacking_anim(delta);
			sprite_x = axy[0];
			sprite_y = axy[1];
		} else {
			if (this._got_hit) {
				var axy = this.hit_anim(delta);
				sprite_x = axy[0];
				sprite_y = axy[1];
			} else {
				movement_y = ((movement[1] - movement[0]) * this._speed) * delta;
				movement_x = ((movement[3] - movement[2]) * this._speed) * delta;
				
				sprite_x = this.getFrameX(movement_y, movement_x, delta);
				sprite_y = this.getSpriteStaryY(movement_y, movement_x);
			}
		}
		
		this._y += movement_y;
		this._x += movement_x;
		
		_CTX.drawImage(
			CHAR.IMG,                  // image object
			sprite_x,  					   // sprite start x pos
			sprite_y,      				   // sprite start y pos 
			this._width,            	   // sprite clip-width
			this._height,                  // sprite clip-height
			this._x - 35,                  // canvas x pos
			this._y - 55,                  // canvas y pos
			this._width,                   // image (tile) display width 
			this._height                   // image (tile) display height
		);
		
		this.emote(delta);
		
		return true;
	}
	
	Character.prototype.getX = function() {
		return this._x;
	}
	
	Character.prototype.getY = function() {
		return this._y;
	}
	
	Character.prototype.getFrameX = function(movement_y, movement_x, delta) {
		var slices = 0;
		var frontback = 0;
		var flip = 0;
		
		if (movement_x > 0) {
			this._last_x_movement = 1;
		} else if (movement_x < 0){
			this._last_x_movement = 0;
		}
		
		if (this._last_x_movement == 1) flip = 721;
		
		if(movement_y == 0 && movement_x == 0) { // still, no movement
		 slices = 5;
		 if (this._last_y_movement == 1) frontback = 360;
		} else { // walking
		 slices = 8; 
		}
		
		this._framex = (this._framex + 10 * delta) % slices;
		return flip + frontback + Math.floor(this._framex) * this._width;
	}
	
	Character.prototype.getSpriteStaryY = function(movement_y, movement_x) {
		if (movement_y > 0) { //front
			this._last_y_movement = 0;
			return 115;
		}
		else if (movement_y < 0) { //back
			this._last_y_movement = 1;
			return 230;
		}
		else if (movement_y == 0 && movement_x != 0)
			if (this._last_y_movement == 0)
				return 115;
			else 
				return 230;
		else
			return 0;
	}
	
	Character.prototype.attack = function(x, y) {
		if (this._attacking == 0) { //enable to disable rapid fire
		//if (true) {
			if (this._mana <= 0) {
				this._emotion = 'nomana';
				this._emoting = 1;
				return false;
			}
			
			this._attacking = 1; //set 1 to disable walking while firing
			this._framex = 0;
			this._mana -= 1;
			
			if (this._x > x)
				this._last_x_movement = 0;
			else 
				this._last_x_movement = 1;
			
			if (this._y > y)
				this._last_y_movement = 1;
			else
				this._last_y_movement = 0;
				
			return true;
		} 
		
		return false;
	}
	
	Character.prototype.attacking_anim = function(delta) {
		var y = 345;
		var x = 0;
		var flip = 0;
		
		if (this._last_y_movement == 1) y += this._height;
		if (this._last_x_movement == 1) flip = 721;
		
		this._framex = (this._framex + this._attack_speed * delta) % 7;
		x = flip + Math.floor(this._framex) * this._width;
		
		if (Math.floor(this._framex) == 6) this._attacking = 0;
		
		return [x, y];
	}
	
	Character.prototype.hit = function() {
		if (this._got_hit == 0) {
			this._got_hit = 1;
			this._framex = 0;
			
			this._health--;
			
			this._emotion = 'hit';
			this._emoting = 1;
			
			return true;
		} 
		
		return false;
	}
	
	Character.prototype.hit_anim = function(delta) {
		var y = 575;
		var x = 0;
		var flip = 0;
		
		if (this._last_y_movement == 1) x += 360;
		if (this._last_x_movement == 1) flip = 721;
		
		this._framex = (this._framex + this._hit_walk_anim_speed * delta) % 4;
		x = flip + Math.floor(this._framex) * this._width;
		
		if (Math.floor(this._framex) == 3) this._got_hit = 0;
		
		return [x, y];
	}
	
	Character.prototype.getType = function() {
		return 'char';
	}
	
	Character.prototype.emote = function(delta) {
		if (this._emoting == 1) {

			this._emote_lag += delta;
			if (this._emote_lag >= 0.5){
				this._emoting = 0;
				this._emote_lag = 0;
			}
			var txt = '';
			var txt_color = '';
			var txt_stroke = '';
			
			switch(this._emotion) {
				case 'miss':
					txt = 'Miss!';
					txt_color = 'white';
					txt_stroke = 'black';
					break;
				case 'hit':
					txt = 'Ouch!';
					txt_color = 'red';
					txt_stroke = 'black';
					break;
				case 'nomana':
					txt = 'No Mana!';
					txt_color = 'blue';
					txt_stroke = 'black';
					break;
			}
		
			_CTX.font = "15px Courier New"
			_CTX.strokeStyle = txt_stroke;
			_CTX.lineWidth = 2;
			_CTX.strokeText(txt, this._x,this._y - 30);
			_CTX.fillStyle = txt_color;
			_CTX.fillText(txt, this._x,this._y - 30);
		}
	}
	
	Character.prototype.addHP = function(add) {
		this._health = Math.min(this._health + add, CHAR.MAX_HP);
		_HUD.pulsateHP();
	}
	
	Character.prototype.addMP = function(add) {
		this._mana = Math.min(this._mana + add, CHAR.MAX_MP);
		_HUD.pulsateMP();
	}
	
return Character;
})();