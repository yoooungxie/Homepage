/*
	commonFunctions
 */
window.requestAnimFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
		function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
			return window.setTimeout(callback, 1000 / 60);
		};
})();


function calLength2(x1, y1, x2, y2) {   //距离值的平方
	return Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
}


function randomColor() {
	var col = [0, 1, 2];
	col[0] = Math.random() * 100 + 155;
	col[0] = col[0].toFixed();
	col[1] = Math.random() * 100 + 155;
	col[1] = col[1].toFixed();
	col[2] = Math.random() * 100 + 155;
	col[2] = col[2].toFixed();
	var num = Math.floor(Math.random() * 3);
	col[num] = 0;
	return "rgba(" + col[0] + "," + col[1] + "," + col[2] + ",";
}


function lerpAngle(a, b, t) {
	var d = b - a;
	if (d > Math.PI) d = d - 2 * Math.PI;
	if (d < -Math.PI) d = d + 2 * Math.PI;
	return a + d * t;
}

function lerpDistance(aim, cur, ratio) {
	//aim:目标值， cur:当前值， radio:百分比
	var delta = cur - aim;
	return aim + delta * ratio;
}

function inOboundary(arrX, arrY, l, r, t, b) { //在l r t b范围内的检测
	return arrX > l && arrX < r && arrY > t && arrY < b;
}

function rgbColor(r, g, b) {
	r = Math.round(r * 256);
	g = Math.round(g * 256);
	b = Math.round(b * 256);
	return "rgba(" + r + "," + g + "," + b + ",1)";
}

function rgbNum(r, g, b) {
	r = Math.round(r * 256);
	g = Math.round(g * 256);
	b = Math.round(b * 256);
	return "rgba(" + r + "," + g + "," + b;
}

function rnd(m) {
	var n = m || 1;
	return Math.random() * n;
}

function rateRandom(m, n) {
	var sum = 0;
	for (var i = 1; i < (n - m); i++) {
		sum += i;

	}

	var ran = Math.random() * sum;

	for (var i = 1; i < (n - m); i++) {
		ran -= i;
		if (ran < 0) {
			return i - 1 + m;
		}
	}
}

function distance(x1, y1, x2, y2, l) {
	var x = Math.abs(x1 - x2);
	var y = Math.abs(y1 - y2);
	if (x < l && y < l) {
		return true;
	}
	return false;
}

function AABBbox(object1, w1, h1, object2, w2, h2, overlap) {
	A1 = object1.x + overlap;
	B1 = object1.x + w1 - overlap;
	C1 = object1.y + overlap;
	D1 = object1.y + h1 - overlap;

	A2 = object2.x + overlap;
	B2 = object2.x + w2 - overlap;
	C2 = object2.y + overlap;
	D2 = object2.y + h2 - overlap;

	if (A1 > B2 || B1 < A2 || C1 > D2 || D1 < C2) return false;
	else return true;
}


function dis2(x, y, x0, y0) {
	var dx = x - x0;
	var dy = y - y0;
	return dx * dx + dy * dy;
}

function rndi2(m, n) {
	var a = Math.random() * (n - m) + m;
	return Math.floor(a);
}

/*
	main
 */
var can1;
var ctx1;

var can2;
var ctx2;

var lastTime;   //上一帧的时间
var deltaTime;   //两帧的时间差

var canWidth;   //画布宽度
var canHeight;

var ane;    //海葵
var fruit;    //果实

var mom;   //大鱼妈妈
var baby;

var babyTail = []; //小鱼尾巴数组
var babyEye = [];  //小鱼眨眼数组
var babyBody = []; //小鱼身体数组

var momTail = [];
var momEye = [];
var momBodyOra = [];  //大鱼橙色身体
var momBodyBlue = [];  //大鱼蓝色身体

var mx;
var	my;  //鼠标移动的位置

var data;   //分值数据

var wave;  //白色的特效圈
var helo;

var dust;  //漂浮物
var dustPic = [];

var bgPic = new Image();   //背景图片

document.body.onload = game;

function game() {
	init();
	lastTime = Date.now();
	deltaTime = 0;
	gameloop();
}

function init() {
	can1 = document.getElementById("canvas1");  //fish, dust,UI,circle
	ctx1 = can1.getContext("2d");
	can2 = document.getElementById("canvas2");  //background,fruit,haikui
	ctx2 = can2.getContext("2d");
	//检测鼠标的移动
	can1.addEventListener('mousemove',onMouseMove, false);
	//加载背景图片
	bgPic.src="./src/background.jpg";     
	//画布宽高
	canWidth = can1.width;
	canHeight = can1.height;

	ane = new aneObj();
	ane.init();

	fruit = new fruitObj();
	fruit.init();

	mom = new momObj();
	mom.init();

	baby = new babyObj();
	baby.init();

	mx = canWidth * 0.5;
	my = canHeight * 0.5;    //初始化鼠标开始的位置

	//初始化小鱼尾巴数组
	for(var i = 0; i < 8; i++) {
		babyTail[i] = new Image();
		babyTail[i].src = "src/babyTail" + i + ".png";
	}
	//初始化小鱼眨眼数组
	for(var j = 0; j < 2; j++) {
		babyEye[j] = new Image();
		babyEye[j].src = "src/babyEye" + j + ".png";
	}
	// 初始化身体变白数组
	for(var k = 0; k < 20; k++) {
		babyBody[k] = new Image();
		babyBody[k].src = "src/babyFade" + k + ".png";
	}
	//初始化大鱼尾巴数组
	for(var mi = 0; mi < 8; mi++) {
		momTail[mi] = new Image();
		momTail[mi].src = "src/bigTail" + mi + ".png";
	}
	for(var mj = 0; mj < 2; mj++) {
		momEye[mj] = new Image();
		momEye[mj].src = "src/bigEye" + mj + ".png";
	}
	data = new dataObj();   //分值的类
	
	for(var mbody = 0; mbody < 8; mbody++) {   //大鱼身体变化
		momBodyOra[mbody] = new Image();
		momBodyBlue[mbody] = new Image();
		momBodyOra[mbody].src = "src/bigSwim" + mbody + ".png";
		momBodyBlue[mbody].src = "src/bigSwimBlue" + mbody + ".png";
	}

	//分值显示样式
	ctx1.font = "40px";
	ctx1.textAlign = "center";

	//特效
	wave = new waveObj();
	wave.init();
	helo = new heloObj();
	helo.init();

	//漂浮物
	// dust = new dustObj();
	// for(var di = 0; di < 7; di++) {
	// 	dustPic[di] = new Image();
	// 	dustPic[di].src = "src/dust" + di + ".png";
	// }
	// dust.init();

}
function gameloop() {

	window.requestAnimFrame(gameloop);
	//获取两帧时间差
	var now = Date.now();
	deltaTime = now - lastTime;
	lastTime = now;
	//防止切换时deltaTime太大而使得食物也太大
	if(deltaTime > 50) {
		deltaTime = 50;
	}
	drawBackground();
	ane.draw();
	fruitMonitor();
	fruit.draw();

	ctx1.clearRect(0, 0, canWidth, canHeight);   //把前面一帧的内容清空掉
	mom.draw();
	baby.draw();
	momFruitsCollision();
	momBabyCollision();

	data.draw();  //分值
	wave.draw();   //特效
	//helo.draw();
	// dust.draw();  // 漂浮物

}
function onMouseMove(e) {  
	if( !data.gameOver ) {
		if(e.offSetX || e.layerX) {
			// 获取鼠标坐标
			mx = e.offSetX === undefined ? e.layerX : e.offSetX;
			my = e.offSetY === undefined ? e.layerY : e.offSetY;
		}
	}
	
}


/*
	background
 */
function drawBackground() {
	ctx2.drawImage(bgPic, 0, 0, canWidth, canHeight); 
}

/*
	Sea-anemone
 */
var aneObj = function() {
	//海葵摆动，利用二次贝塞尔曲线，起始点，控制点，结束点
	//需要在结束点用正弦函数控制，形成摆动
	this.rootx = [];   //开始值
	this.headx = [];   //结束点x坐标，即海葵头部
	// this.len = [];
	this.heady = [];  //结束点x坐标，
	this.alpha = 0;  //正弦角度，用于控制headx的摆动
	this.amp = [];   //控制振幅，控制摆动幅度
}; 
aneObj.prototype.num = 70;
aneObj.prototype.init = function() {
	for(var i = 0; i < this.num; i++) {
		//海葵的位置及高度
		this.rootx[i] = i * 15 + Math.random() * 20; 
		this.headx[i] = this.rootx[i];   
		this.heady[i] = canHeight - 200 + Math.random() * 60;  
		// this.len[i] = 170 + Math.random() * 40;
		this.amp[i] = Math.random() * 50 + 30;  //摆动幅度
	}
};
aneObj.prototype.draw = function() {
	this.alpha += deltaTime * 0.002;   //this.alpha随着时间不断的增加(x轴)
	var l = Math.sin(this.alpha);  //y轴正弦函数，控制头部的摆动[-1, 1];
	ctx2.save();
	ctx2.globalAlpha = 0.6;
	ctx2.strokeStyle = "#009966";
	ctx2.lineWidth = 15;
	ctx2.lineCap = "round";
	for(var i = 0; i < this.num; i++) {
		ctx2.beginPath();
		ctx2.moveTo(this.rootx[i], canHeight);  //起始点
		this.headx[i] = this.rootx[i] + l * this.amp[i] * 0.5;  //当前海葵头部的具体位置
		ctx2.quadraticCurveTo(this.rootx[i], canHeight - 150, this.headx[i], this.heady[i]);  //控制点
		ctx2.stroke();
	}
	ctx2.restore();   //save(), restore()画笔只在这两者之间起作用

};


/*
	fruit
 */
var fruitObj = function() {
	this.alive = [];      //bool	
	this.x = [];
	this.y = [];
	this.aneNO = [];
	this.l = [];            //果实的半径(大小)
	this.spd = [];          //每个果实自己的速度
	this.fruitType = [];    //果实类型
	this.orange = new Image();
	this.blue = new Image();
};
fruitObj.prototype.num = 30;
fruitObj.prototype.init = function() {
	
	for(var i = 0; i < this.num; i++) {
		this.alive[i] = false;  //初始时果实都为false
		this.x[i] = 0;
		this.y[i] = 0;
		this.aneNO[i] = 0;  //哪一个海葵
		// this.l[i] = 0;
		this.spd[i] = Math.random() * 0.02 + 0.005;
		// this.born(i);
		this.fruitType[i] = "";
	}
	this.orange.src = './src/fruit.png';
	this.blue.src = './src/blue.png';
};
fruitObj.prototype.draw = function() {
	for(var i = 0; i < this.num; i++) {
		var pic;
		if( this.alive[i] ) {
			if(this.fruitType[i] == "blue") {   //判断蓝色还是黄色果实
				pic = this.blue;
			}else {
				pic = this.orange;
			}
			if(this.l[i] <= 15) {
				var NO = this.aneNO[i];
				//随时间变化果实长大，deltaTime使过程平缓些
				this.x[i] = ane.headx[NO];
				this.y[i] = ane.heady[NO];
				this.l[i] += this.spd[i] * deltaTime;  
				ctx2.drawImage(pic, this.x[i]-this.l[i] / 2, this.y[i]-this.l[i] / 2, this.l[i], this.l[i]);

			}else {
				//果实上升的速度变化
				this.y[i] -= this.spd[i] * 8 * deltaTime;
				ctx2.drawImage(pic, this.x[i]-this.l[i] / 2, this.y[i]-this.l[i] / 2, this.l[i], this.l[i]);
			}
			
			//让果实生长在海葵顶部位置,尺寸
			// ctx2.drawImage(pic, this.x[i]-this.l[i] / 2, this.y[i]-this.l[i] / 2, this.l[i], this.l[i]);
			if( this.y[i] < 10) {
				this.alive[i] = false;
			}
		}
	}
};
fruitObj.prototype.born = function(i) {     
	// var aneID = Math.floor(Math.random() * ane.num);
	//果实x,y
	// this.x[i] = ane.headx[aneID];
	// this.y[i] = ane.heady[aneID];
	//果实出生的时候会长在哪一个海葵上
	this.aneNO[i] = Math.floor(Math.random() * ane.num);
	this.l[i] = 0;
	this.alive[i] = true;
	var fruRand = Math.random();   //随机果实类型
	if(fruRand < 0.3) {
		this.fruitType[i] = "blue";
	}else {
		this.fruitType[i] = "orange";
	}

};
fruitObj.prototype.dead = function(i) {     //果实被吃了
	this.alive[i] = false;
};
function fruitMonitor() {
	var num = 0;
	for(var i = 0; i < fruit.num; i++) {
		if (fruit.alive[i]) {
			//记录存活的果实数量
			num++;
		}  
	}
	if ( num < 15) {
		sendFruit();
		return;
	}
}
function sendFruit() {
	for (var i = 0; i < fruit.num; i++) {
		if( !fruit.alive[i] ) {
			fruit.born(i);
			return;
		}
	}
}


/*
	mom
 */
var momObj = function () {
	this.x = 0;
	this.y = 0;
	this.angle = 0;  //大鱼移动角度变化
	this.bigEye = new Image();
	// this.bigBody = new Image();
	this.bigTail = new Image();

	this.momTailTimer = 0;
	this.momTailCount = 0;

	this.momEyeTimer = 0;
	this.momEyeCount = 0;
	this.momEyeInterval = 1000;

	this.momBodyCount = 0;

};

momObj.prototype.init = function() {
	this.x = canWidth * 0.5;
	this.y = canHeight * 0.5;
	this.angle = 0;
	// this.bigEye.src = "./src/bigEye0.png";
	// this.bigBody.src = "./src/bigSwim0.png";
	// this.bigTail.src = "./src/bigTail0.png";
};

momObj.prototype.draw = function() {

	//Lerp x,y  使得一个值趋向于一个目标值
	this.x = lerpDistance(mx, this.x, 0.9);
	this.y = lerpDistance(my, this.y, 0.9);
	//delta angle
	var deltaY = my - this.y;
	var deltaX = mx - this.x;
	//大鱼运动时转动角度
	var beta = Math.atan2(deltaY, deltaX) + Math.PI; 
	//learp angle
	this.angle = lerpAngle(beta, this.angle, 0.7);

	//tail
	this.momTailTimer += deltaTime;
	if(this.momTailTimer > 50) {
		this.momTailCount = (this.momTailCount + 1) % 8;    //计数器加1, 但是不能超过8
		this.momTailTimer %= 50;      //timer回到初始状态
	}
	//eye
	this.momEyeTimer += deltaTime;
	if(this.momEyeTimer > this.momEyeInterval) {
		this.momEyeCount = (this.momEyeCount + 1) % 2;
		this.momEyeTimer %= this.momEyeInterval;
		if(this.momEyeCount === 0) {                                                                                                                      
			//大鱼睁眼时间
			this.momEyeInterval = Math.random() * 1200 + 1300;
		}else {
			//大鱼眨眼时间
			this.momEyeInterval = 200;
		}
	}

	ctx1.save();
	ctx1.translate(this.x, this.y);    //大鱼的坐标位置
	ctx1.rotate(this.angle);
	var momTailCount = this.momTailCount;
	// 尾巴不动
	momTailCount = 0;
	var momEyeCount = this.momEyeCount;
	ctx1.drawImage(momTail[momTailCount], -momTail[momTailCount].width * 0.5 + 30, -momTail[momTailCount].height * 0.5);
	//大鱼身体变化
	var momBodyCount = this.momBodyCount;
	if( data.double == 1) {
		//橙色
		ctx1.drawImage(momBodyOra[momBodyCount], -momBodyOra[momBodyCount].width * 0.5, -momBodyOra[momBodyCount].height * 0.5);
	}else {
		//蓝色
		ctx1.drawImage(momBodyBlue[momBodyCount], -momBodyBlue[momBodyCount].width * 0.5, -momBodyBlue[momBodyCount].height * 0.5);

	}
	// ctx1.drawImage(this.bigBody, -this.bigBody.width * 0.5, -this.bigBody.height * 0.5);
	ctx1.drawImage(momEye[momEyeCount], -momEye[momEyeCount].width * 0.5, -momEye[momEyeCount].height * 0.5);
	ctx1.restore();
};



/*
	collision
 */
// 判断大鱼和果实的碰撞距离
function momFruitsCollision() {
	if( !data.gameOver ) {
		for(var i = 0; i < fruit.num; i++) {
			if(fruit.alive[i]){		//果实的状态是true
				//果实和大鱼之间的距离
				var l = calLength2(fruit.x[i], fruit.y[i], mom.x, mom.y);
				if(l < 400) {   
					//fruit eaten
					fruit.dead(i);
					//分值
					data.fruitNum++;  
					mom.momBodyCount++;
					if(mom.momBodyCount > 7) {
						mom.momBodyCount = 7;
					}
					if(fruit.fruitType[i] == "blue") {   //蓝色果实加倍
						data.double = 2;
					}
					wave.born(fruit.x[i], fruit.y[i]);  //碰撞特效
				}
			}  
		}
	}
	
}
//大鱼喂小鱼
function momBabyCollision() {
	if(data.fruitNum > 0 && !data.gameOver) {  //只有在大鱼有果实而且游戏没有结束的时候才碰撞成功
		var mbl = calLength2(mom.x, mom.y, baby.x, baby.y);
			//大鱼和小鱼距离
			if(mbl < 800) {
				baby.babyBodyCount = 0;
				// data.reset();
				//分值更新
				data.addScore();
				mom.momBodyCount = 0;  //碰撞后大鱼身体恢复
				//特效
				helo.born(baby.x, baby.y);
			}
	}
	
}

/*
	baby
 */
var babyObj = function() {
	this.x;
	this.y;
	this.angle;
	// this.babyEye = new Image();
	this.babyBody = new Image();
	// this.babyTail = new Image();

	//babyTail
	this.babyTailTimer = 0;
	this.babyTailCount = 0;
	//babyEye
	this.babyEyeTimer = 0;
	this.babyEyeCount = 0;
	this.babyEyeInterval = 1000;
	//babyBody
	this.babyBodyTimer = 0;
	this.babyBodyCount = 0;

};
babyObj.prototype.init = function() {
	this.x = canWidth * 0.5 - 50;
	this.y = canHeight * 0.5 + 50;
	this.angle = 0;
	// this.babyEye.src =  './src/babyEye0.png';
	this.babyBody.src = './src/baby.png';
	// this.babyTail.src = './src/babyTail0.png';
};
babyObj.prototype.draw = function() {
	// lerp x, y
	this.x = lerpDistance(mom.x + 30, this.x, 0.98);
	this.y = lerpDistance(mom.y + 30, this.y, 0.98);
	// 小鱼跟随大鱼
	// lerp angle
	var deltaY = mom.y - this.y;
	var deltaX = mom.x - this.x;
	//大鱼运动时转动角度
	var beta = Math.atan2(deltaY, deltaX) + Math.PI; 
	this.angle = lerpAngle(beta, this.angle, 0.7);

	//baby tail count
	this.babyTailTimer += deltaTime;
	if(this.babyTailTimer > 50) {
		// babyTail计数
		this.babyTailCount = (this.babyTailCount + 1) % 8;   //让它一直在0-8之间
		this.babyTailTimer %= 50;    
	}
	//babyEye count
	this.babyEyeTimer += deltaTime;
	if( this.babyEyeTimer > this.babyEyeInterval ) {
		this.babyEyeCount = (this.babyEyeCount + 1) % 2;
		this.babyEyeTimer %= this.babyEyeInterval;

		if(this.babyEyeCount === 0) {
			this.babyEyeInterval = Math.random() * 1000 + 890;  //时间间隔
		}else {
			this.babyEyeInterval = 280;
		}
	}
	//baby body
	this.babyBodyTimer += deltaTime;
	if(this.babyBodyTimer > 250) {
		this.babyBodyCount = this.babyBodyCount + 1;
		//身体变白的时间
		this.babyBodyTimer %= 250;
		if(this.babyBodyCount > 19) {
			this.babyBodyCount = 19;
			//gameover
			data.gameOver = true;
		}
	}

	//ctx1
	ctx1.save();
	ctx1.translate(this.x, this.y);
	// 旋转画布
	ctx1.rotate(this.angle);
	//画小鱼
	var babyTailCount = this.babyTailCount;
	// 尾巴不动
	babyTailCount = 0;

	var babyEyeCount = this.babyEyeCount;
	var babyBodyCount = this.babyBodyCount;
	//尾巴摆动
	ctx1.drawImage(babyTail[babyTailCount], -babyTail[babyTailCount].width * 0.5 + 23, -babyTail[babyTailCount].height * 0.5);
	//身体变白
	ctx1.drawImage(babyBody[babyBodyCount], -babyBody[babyBodyCount].width * 0.5, -babyBody[babyBodyCount].height * 0.5);
	//眼睛眨动
	ctx1.drawImage(babyEye[babyEyeCount], -babyEye[babyEyeCount].width * 0.5, -babyEye[babyEyeCount].height * 0.5);
	ctx1.restore();
};

/*
	data
 */
var dataObj = function() {
	this.fruitNum = 0;
	this.double = 1;   
	this.score = 0;	//分值
	this.gameOver = false;   //游戏状态判断
	this.alpha = 0;
};

//把分值绘制到画布上
dataObj.prototype.draw = function() {
	//画布宽高
	var w = can1.width; 
	var h = can1.height;
	ctx1.save();
	ctx1.fillStyle = "#fff";
	ctx1.font = "20px Verdana";
	ctx1.shadowColor = "white";
	ctx1.shadowBlur = 5;
	//把font, 和textAlign放到初始化函数中
	// ctx1.font = "20 Verdana";
	// ctx1.textAlign = "center";
	// ctx1.fillText("果实数量" + this.fruitNum, w * 0.5, h - 50);
	// ctx1.fillText("double" + this.double, w * 0.5, h - 70);
	ctx1.fillText("Scores  " + this.score, w * 0.5, h - 50);
	ctx1.restore();
	ctx1.save();
	ctx1.font = "50px Verdana";
	ctx1.shadowColor = "white";
	ctx1.shadowBlur = 10;
	//画布提示游戏结束
	if(this.gameOver) {
		this.alpha += deltaTime * 0.0003;
		if(this.alpha > 1) {
			this.alpha = 1;
		}
		ctx1.fillStyle = "rgba(255,255,255," + this.alpha + ")";
		ctx1.fillText("Game Over", w * 0.5, h * 0.5);
		// game();
		$('.cd-popup').addClass('is-visible');
		var scores = this.score;
		$('.scores').html('Scores  ' + scores);
	}
	ctx1.restore();

};
dataObj.prototype.addScore = function() {
	this.score += this.fruitNum * 10 * this.double;
	this.fruitNum = 0;
	this.double = 1;
};

/*
	wave
 */
var waveObj = function() {
	this.x = [];
	this.y = [];
	this.alive = [];
	this.r = [];  //半径
};
waveObj.prototype.num = 10;    //物体池，存放一个个圈圈
waveObj.prototype.init = function() {
	for(var i = 0; i < this.num; i++) {
		this.alive = false;
		this.r[i] = 0;
	}
};
waveObj.prototype.draw = function() {
	ctx1.save();
	ctx1.lineWidth = 2;
	ctx1.shadowBlur = 10;
	for(var i = 0; i < this.num; i++) {
		if( !this.alive[i] ) {
			this.r[i] += deltaTime * 0.05;
			if(this.r[i] > 80) {
				this.alive[i] = false;   //当半径大于某个值时消失
				break;
			}
			var alpha = 1 - this.r[i] / 80;  //透明度和半径反比
			//draw
			ctx1.beginPath();
			ctx1.arc(this.x[i], this.y[i],this.r[i], 0, Math.PI*2);
			ctx1.closePath();
			ctx1.strokeStyle = "rgba(255,255,255," + alpha + ")";
			ctx1.stroke();
		}
	}
	ctx1.restore();
};

//大鱼和果实碰撞时
waveObj.prototype.born = function(x, y) {  //判断当前是否满足条件
	for(var i = 0; i < this.num; i++) {
		if( !this.alive[i] ) {
			//born
			this.alive[i] = true;
			this.r[i] = 10;
			this.x[i] = x;    //来自大鱼和果实碰撞时的坐标值
			this.y[i] = y;
			return;  //跳出循环，避免所有的都出生
		}
	}

};

/*
	helo
 */
var heloObj = function() {
	this.x = [];
	this.y = [];
	this.alive = [];
	this.r = [];  //半径
};
heloObj.prototype.num = 5;
heloObj.prototype.init = function() {
	for(var i = 0; i < this.num; i++) {
		this.x[i] = 0;
		this.y[i] = 0;
		this.alive = false;
		this.r[i] = 0;
	}
};
heloObj.prototype.draw = function() {
	ctx1.save();
	ctx1.lineWidth = 2;
	ctx1.shadowBlur = 10;
	ctx1.shadowColor = "rgba(123, 45, 145, 1)";
	for(var i = 0; i < this.num; i++) {
		if( !this.alive[i] ) {
			//draw
			this.r[i] += deltaTime * 0.05;
			if( this.r[i] > 50) {
				this.alive = false;
				break;
			}
			var alpha = 1 - this.r[i] / 50;
			ctx1.beginPath();
			ctx1.arc(this.x[i], this.y[i], this.r[i],0, Math.PI * 2);
			ctx1.closePath();
			ctx1.strokeStyle = "rgba(205, 91, 0," + alpha + ")";
			ctx1.stroke();
		}
	}
	ctx1.restore();
};
heloObj.prototype.born = function(x, y) {
	for(var i = 0; i < this.num; i++) {  //闲置的
		if( !this.alive[i] ) {
			//born
			this.x[i] = x;
			this.y[i] = y;
			this.r[i] = 10;
		}
	}
};

/*
	dust
 */
var dustObj = function () {
	this.x = [];
	this.y = [];
	this.amp = [];  //漂浮物振幅
	this.NO = [];   //序号，哪一张图片

	this.alpha = 0;   //角度
};
dustObj.prototype.num = 30;   //数量
dustObj.prototype.init = function() {
	for(var i = 0; i < this.num; i++) {
		this.x[i] = Math.random() * canWidth;
		this.y[i] = Math.random() * canHeight;
		this.amp[i] = 20 + Math.random() * 15;
		this.NO[i] = Math.floor(Math.random() * 7);  //[0, 7)
		this.alpha = 0;
	}
};
dustObj.prototype.draw = function() {
	this.alpha += deltaTime * 0.002;
	var l = Math.sin(this.alpha);
	for(var i = 0; i < this.num; i++) {
		var no = this.NO[i];
		ctx1.drawImage(dustPic[no], this.x[i] + this.amp[i] * l, this.y[i]);
	}
};