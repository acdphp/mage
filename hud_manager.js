var Hud = (function(){
	
	var _lerpSpeed;
	var _hpLerp;
	var _mpLerp;
	
	var _pulsateHP;
	var _pulseHPLag;
	var _pulseHPAdj;
	var _pulseHPOpacity;
	
	var _pulsateMP;
	var _pulseMPLag;
	var _pulseMPAdj;
	var _pulseMPOpacity;
	
	function Hud() {
		this._lerpSpeed = 5;
		this._hpLerp = HUD.HP.WIDTH;
		this._mpLerp = HUD.MP.WIDTH;
	
		this._pulsateHP = 0;
		this._pulseHPLag = 0;
		this._pulseHPAdj = 0;
		this._pulseHPOpacity = 0;
		
		this._pulsateMP = 0;
		this._pulseMPLag = 0;
		this._pulseMPAdj = 0;
		this._pulseMPOpacity = 0;
	}
	
	Hud.prototype.drawHP = function(currentHP, delta) {
		//draw health
		_CTX.drawImage(HUD.HP.BAR_BG, 90, 22, HUD.HP.WIDTH + 5, HUD.HP.HEIGHT);
		
		//damage deduction
		var hp_deduct = HUD.HP.WIDTH - (HUD.HP.WIDTH / (CHAR.MAX_HP/currentHP)); 
		
		//hp actual bar pattern
		var pat = _CTX.createPattern(HUD.HP.BAR,"repeat");
		_CTX.fillStyle=pat;
		
		//lerping the actual bar
		this._hpLerp += (hp_deduct - this._hpLerp) * (delta * this._lerpSpeed);
		_CTX.fillRect(95 + this._hpLerp, 24, HUD.HP.WIDTH - this._hpLerp, HUD.HP.HEIGHT - 4);
		
		//hp tip(the shiny thing at the end of the actual bar)		
		_CTX.drawImage(HUD.HP.BAR_TIP, 90 + this._hpLerp, 21, 20, HUD.HP.HEIGHT);
		//hp icon
		_CTX.drawImage(HUD.HP.ICON, 185, 10, 40, 40);
		
		this.animatePulsateHP(delta);
	}
	
	Hud.prototype.drawMP = function(currentMP, delta) {
		//draw mana
		_CTX.drawImage(HUD.MP.BAR_BG, 310, 22, HUD.MP.WIDTH + 5, HUD.MP.HEIGHT); 
		
		//mana reduction
		var mp_deduct = HUD.MP.WIDTH - (HUD.MP.WIDTH / (CHAR.MAX_MP/currentMP)); 
		
		//hp actual bar pattern
		var pat = _CTX.createPattern(HUD.MP.BAR,"repeat");
		_CTX.fillStyle=pat;
		
		//lerping the actual bar
		this._mpLerp += (mp_deduct - this._mpLerp) * (delta * this._lerpSpeed);
		_CTX.fillRect(310, 24, HUD.MP.WIDTH - this._mpLerp, HUD.MP.HEIGHT - 4);
		
		//mp tip(the shiny thing at the end of the actual bar)		
		_CTX.drawImage(HUD.MP.BAR_TIP, 390 - this._mpLerp, 21, 20, HUD.MP.HEIGHT); 
		//mp icon
		_CTX.drawImage(HUD.MP.ICON, 275, 10, 40, 40);
		
		this.animatePulsateMP(delta);
	}
	
	Hud.prototype.pulsateHP = function() {
		this._pulseHPLag = 0;
		this._pulsateHP = 1;
		this._pulseHPAdj = 0;
		this._pulseHPOpacity = 0.7;
	}
	
	Hud.prototype.animatePulsateHP = function(delta) {
		if(this._pulseHPOpacity <= 0) return false;
		
		this._pulseHPLag += delta;
		this._pulseHPAdj += 0.5;
		this._pulseHPOpacity = Math.max(0, this._pulseHPOpacity-=delta);
		
		_CTX.globalAlpha = this._pulseHPOpacity;
		var x_shake = Math.cos(delta * 0.5) + Math.sin(delta * 0.1);
		_CTX.drawImage(HUD.HP.ICON, 185 - (this._pulseHPAdj/2) + x_shake, 10 - (this._pulseHPAdj/2), 40 + this._pulseHPAdj, 40 + this._pulseHPAdj);
		//_CTX.drawImage(HUD.HP.ICON, 185 - (this._pulseHPAdj/2), 10 - (this._pulseHPAdj/2), 40 + this._pulseHPAdj, 40 + this._pulseHPAdj);
		_CTX.globalAlpha = 1;
 
		if(this._pulseHPLag >= 0.3 && this._pulsateHP == 1) {
			this._pulseHPLag = 0;
			this._pulsateHP = 0;
		
			this._pulseHPAdj += (40 * 1.5) - 40;
		}
	}
	
	Hud.prototype.pulsateMP = function() {
		this._pulseMPLag = 0;
		this._pulsateMP = 1;
		this._pulseMPAdj = 0;
		this._pulseMPOpacity = 0.7;
	}
	
	Hud.prototype.animatePulsateMP = function(delta) {
		if(this._pulseMPOpacity <= 0) return false;
		
		this._pulseMPLag += delta;
		this._pulseMPAdj += 0.5;
		this._pulseMPOpacity = Math.max(0, this._pulseMPOpacity-=delta);
		
		_CTX.globalAlpha = this._pulseMPOpacity;
		_CTX.drawImage(HUD.MP.ICON, 275 - (this._pulseMPAdj/2), 10 - (this._pulseMPAdj/2), 40 + this._pulseMPAdj, 40 + this._pulseMPAdj);
		_CTX.globalAlpha = 1;
 
		if(this._pulseMPLag >= 0.3 && this._pulsateMP == 1) {
			this._pulseMPLag = 0;
			this._pulsateMP = 0;
		
			this._pulseMPAdj += (40 * 1.5) - 40;
		}
	}

return Hud;
})();