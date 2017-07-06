var CANVAS = {
	ID : 'mycanvas',
	WIDTH : 500,
	HEIGHT : 500,
	BG : new Image()
};
CANVAS.BG.src = 'images/map.png';

var HUD = {
	HP : {
		WIDTH: 95,
		HEIGHT: 10,
		ICON : new Image(),
		BAR_BG: new Image(),
		BAR_TIP: new Image(),
		BAR: new Image()
	},
	MP : {
		WIDTH: 95,
		HEIGHT: 10,
		ICON : new Image(),
		BAR_BG: new Image(),
		BAR_TIP: new Image(),
		BAR: new Image()
	},
	STAR : new Image()
};
HUD.HP.ICON.src = 'images/health.png';
HUD.HP.BAR_BG.src = 'images/hp_bg.png';
HUD.HP.BAR_TIP.src = 'images/hp_tip.png';
HUD.HP.BAR.src = 'images/hp_bar.png';
HUD.MP.ICON.src = 'images/mana.png';
HUD.MP.BAR_BG.src = 'images/mp_bg.png';
HUD.MP.BAR_TIP.src = 'images/mp_tip.png';
HUD.MP.BAR.src = 'images/mp_bar.png';
HUD.STAR.src = 'images/star.png';

var CHAR = {
	MAX_HP: 5,
	MAX_MP: 50,
	IMG : new Image()
};
CHAR.IMG.src = "images/mage.png";

var MONSTER = {
	IMG : new Image()
};
MONSTER.IMG.src = "images/zombie.png";

var PROJECTILE = {
	IMG : new Image()
};
PROJECTILE.IMG.src = "images/dot.png";

var MOB = {
	MAX_SPAWN : 15
};

var ITM = {
	MP_DROP : {
		IMG : new Image(),
		W : 14,
		H : 20,
		TYPE : 'mana'
	},
};
ITM.MP_DROP.IMG.src = "images/mp_drop.png";
