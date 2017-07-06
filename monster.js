var Monster = (function(){

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
	
	var _v_x;
	var _v_y;
	
	var _target_char;
	
	var _got_hit;
	var _dead;
	
	var _emoting;
	var _emotion;
	var _emote_lag;
	
	var _strayDist;
	var _strayDelay;
	var _strayLag;
	
	var _chasing;
		
	function Monster(x, y, speed) {
		this._x = x;
		this._y = y;
		this._speed = speed;
		this._framex = 0;
		
		this._width = 75;
		this._height = 114;
		
		this._last_y_movement = 0; //front
		this._last_x_movement = 0; //left
		
		this._attacking = 0;
		this._attack_speed = 10;
		
		this._v_x = 0;
		this._v_y = 0;
		
		this._target_char = null;
		
		this._got_hit = 0;
		this._dead = 0;
		
		this._emoting = 0;
		this._emotion = null;
		this._emote_lag = 0;
		
		this._strayDist = 50.0;
		this._strayDelay = 5.0;
		this._strayLag = this._strayDelay;
		this._stray_x = 0;
		this._stray_y = 0;
		
		this._chasing = 0;
	}
	
	Monster.prototype.stray = function(delta) {
		this._strayLag += delta;
		
		if (this._strayLag >= this._strayDelay) {
			
			var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
			
			//move to other direction if random dest_x is out of bounds
			var tmp_x_add = Math.floor((Math.random() * this._strayDist) + 50);
			this._stray_x = Math.floor(this._x) + (tmp_x_add * plusOrMinus);
			
			if (this._stray_x >  CANVAS.WIDTH - 50 || this._stray_x < 50) {
				this._stray_x = Math.floor(this._x) + (tmp_x_add * -plusOrMinus);
			}
			
			//move to other direction if random dest_y is out of bounds
			var tmp_y_add = Math.floor((Math.random() * this._strayDist) + 50);
			this._stray_y = Math.floor(this._y) + (tmp_y_add * plusOrMinus);
			
			if (this._stray_y >  CANVAS.HEIGHT - 50 || this._stray_y < 50) {
				this._stray_y = Math.floor(this._y) + (tmp_y_add * -plusOrMinus);
			}
		}
		
		this.update_velocity(this._stray_x, this._stray_y);
	}
	
	Monster.prototype.update_velocity = function(dest_x, dest_y) {
		var x = Math.floor(this._x)
		var y = Math.floor(this._y)
		
		if (x == dest_x && y == dest_y) {
			this._v_x = 0;
			this._v_y = 0;
		} else {
			var tmp = Math.abs(dest_x -  x) + Math.abs(dest_y - y);
			var sign_x = (dest_x - x) < 0 ? -1 : 1;
			var sign_y = (dest_y - y) < 0 ? -1 : 1;
			
			this._v_x = (sign_x * (Math.abs(dest_x - x)/tmp)) * this._speed;
			this._v_y = (sign_y * (Math.abs(dest_y - y)/tmp)) * this._speed;
			
			this._strayLag = 0.0;
		}
	}

	Monster.prototype.update = function(character, delta) {
		
		if (this._dead)
			return false;
		
		var sprite_x = 0;
		var sprite_y = 0;
		
		this._target_char = character;
		
		if (this._got_hit) {
			var axy = this.hit_anim(delta);
			sprite_x = axy[0];
			sprite_y = axy[1];
		} else if (this._attacking) {
			var axy = this.attacking_anim(delta);
			sprite_x = axy[0];
			sprite_y = axy[1];
		} else {
			if (Math.abs(character._x - this._x) < 35 && Math.abs(character._y - this._y) < 55) {
				this.attack();
			} else {
			
				// chase if close
				//if (Math.abs(character._x - this._x) < 100 && Math.abs(character._y - this._y) < 125) {
					this.update_velocity(character._x, character._y);

				/*	this._emotion = 'chase';
					this._emoting = 1;
					this._chasing = 1;
				} else {
					if (this._chasing == 1) {
						this._chasing = 0;
						this._stray_x = Math.floor(this._x);
						this._stray_y = Math.floor(this._y);
						this._strayLag = 3.0;
						
					}
					
					this.stray(delta);
				}
				*/
				this._x += this._v_x * delta;
				this._y += this._v_y * delta;
				
				sprite_x = this.getFrameX(this._v_x, delta);
				sprite_y = this.getSpriteStaryY(this._v_y, this._v_x);
			}
		}
		
		_CTX.drawImage(
			MONSTER.IMG,                // image object
			sprite_x,  					   // sprite start x pos
			sprite_y,     				   // sprite start y pos 
			this._width,            	   // sprite clip-width
			this._height,                  // sprite clip-height
			this._x - 30,                  // canvas x pos
			this._y - 45,                  // canvas y pos
			this._width,                   // image (tile) display width 
			this._height                   // image (tile) display height
		);
		
		this.emote(delta);
		
		return true;
	}
	
	Monster.prototype.getX = function() {
		return this._x;
	}
	
	Monster.prototype.getY = function() {
		return this._y;
	}
	
	Monster.prototype.getFrameX = function(movement_x, delta) {
		var slices = 8;
		var frontback = 0;
		var flip = 0;
		
		if (movement_x > 0) {
			this._last_x_movement = 1;
		} else if (movement_x < 0){
			this._last_x_movement = 0;
		}
		
		if (this._last_x_movement == 1) flip = 675;
		if (this._v_x == 0 || this._v_y == 0) slices = 6;
		
		this._framex = (this._framex + 10 * delta) % slices;
		return flip + Math.floor(this._framex) * this._width;
	}
	
	Monster.prototype.getSpriteStaryY = function(movement_y, movement_x) {
		if (movement_y > 0) { //front
			this._last_y_movement = 0;
			return 228;
		}
		else if (movement_y < 0) { //back
			this._last_y_movement = 1;
			return 342;
		}
		else if (movement_y == 0 && movement_x != 0)
			if (this._last_y_movement == 0)
				return 115;
			else 
				return 230;
		else
			return 0;
	}
	
	Monster.prototype.attack = function() {
		if (this._attacking == 0) {
			this._attacking = 1;
			this._framex = 0;

			return true;
		} 
		
		return false;
	}
	
	Monster.prototype.attacking_anim = function(delta) {
		var y = 457;
		var x = 0;
		var flip = 0;
		
		if (this._last_y_movement == 1) y += this._height;
		if (this._last_x_movement == 1) flip = 675;
		
		this._framex = (this._framex + this._attack_speed * delta) % 9;
		x =  flip + Math.floor(this._framex) * this._width;
		
		// first detect attack in the middle of attack anim
		if (Math.floor(this._framex + 0.2) == 5){
			
			if (Math.abs(this._target_char._x - this._x) < 35 && Math.abs(this._target_char._y - this._y) < 55) {
				this._target_char.hit();
			} else {
				this._emotion = 'miss';
				this._emoting = 1;
			}
		}
		
		if (Math.floor(this._framex + 0.2) == 9){
			
			this._attacking = 0;
		}
		
		return [x, y];
	}
	
	Monster.prototype.hit = function() {
		if (this._got_hit == 0) {
			this._got_hit = 1;
			this._framex = 0;

			return true;
		} 
		
		return false;
	}
	
	Monster.prototype.hit_anim = function(delta) {
		var y = 684;
		var x = 0;
		var flip = 0;
		
		if (this._last_y_movement == 1) x += 150;
		if (this._last_x_movement == 1) flip = 675;
		
		this._framex = (this._framex + 1 * delta) % 2;
		x = flip + Math.floor(this._framex) * this._width;
		
		if (Math.floor(this._framex + 0.4) == 2) this._dead = 1;
		
		return [x, y];
	}
	
	Monster.prototype.getType = function() {
		return 'mob';
	}
	
	Monster.prototype.emote = function(delta) {
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
					txt = '1';
					txt_color = '#ffd700';
					txt_stroke = '#b29600';
					break;
				case 'chase':
					txt = 'Rawrr!!';
					txt_color = '#ff8000';
					txt_stroke = '#000000';
					break;
			}
		
			_CTX.font = "15px Courier New"
			_CTX.strokeStyle = txt_stroke;
			_CTX.lineWidth = 2;
			_CTX.strokeText(txt, this._x,this._y);
			_CTX.fillStyle = txt_color;
			_CTX.fillText(txt, this._x,this._y);
		}
	}

return Monster;
})();