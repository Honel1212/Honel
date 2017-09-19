// 1、引入该文件
// 2、创建一个js文件，_game2048.init(classname);

// 做游戏的要点
// 1、游戏的算法（思路）
// 2、做游戏开始时要清楚游戏规划、需求
// //2048套路
// //1、游戏的初始化
// 	1、棋盘 4*4
// 	2、随机棋子
// 	3、数据初始化 data[3][3]
// //2、玩游戏
// 	1、触摸或者按键 up、right、down、left
// 	2、数据的叠加
// 	3、判断是否游戏结束
// 	4、随机棋子

// //3、游戏结束

(function(w) {
	//构造函数初始化数据
	function Game() {
		//棋盘数据的初始化
		this.data = new Array();//创建一维数组，
		this.isMoveChese = false;//每次按键时，棋子是否移动，false表示未移动
		this.isCombine = false;
		this.score_1 = 0;
		//判断是否为最后一个棋子的标志量
		this.isLastChese = false;
		this.flagCombineArr = new Array();
		//棋子数据初始化
		this.dataInit = function() {
			for(var i = 0;i < 4;i++){
				this.data[i] = new Array();//一维数组的每个数据都是数组
				for(var j = 0;j < 4;j++){
					this.data[i][j] = 0;
				}
			}
		}
		//合并标志数组初始化
		this.flagCombineArrInit = function() {
			for(var i = 0;i < 16;i++) {
				this.flagCombineArr[i] = false;
			}
		}
		//棋盘初始化、整个游戏的初始化
		//@param classname 游戏棋桌的class
		this.init = function(className) {
			this.dataInit();
			this.cheseInit(className);
			//游戏开始时，随机出现两个棋子 ，落子的初始化
			for (var i = 0; i < 2;i++) {
				this.randomChese();
			}
			this.play();
			this.score();
		}		
	}//Game end
	// 随机棋子
	Game.prototype.randomChese = function () {
		var arrXY = this.randomCheseXY();
		if (arrXY != 0) {
			var num = this.randomValue();
			this.drawChese(arrXY[0],arrXY[1],num);	
		}		
	}
	//1、棋盘图形初始化、、界面
		//棋子100*100
		//棋子之间的间隔2px	
		//棋盘410*410
	Game.prototype.cheseInit = function(className) {		
		var game = document.querySelector("." + className);		
		var chese = document.createElement("div");//创建棋盘
		chese.className = "game2048";//类名中不能以纯数字开头
		chese.setAttribute("style","width:430px;height:430px;background-color:#B6ACA2;margin:80px auto;"+
			"border-radius:10px;position:relative;")
		game.appendChild(chese);
		//棋子的位置
		for (var i = 0;i < 4;i++) {
			for (var j = 0;j < 4;j++) {
				var c = document.createElement("div");
				c.className = "child";
				c.setAttribute("style","top:"+(i*106+6)+"px;left:"+(j*106+6)+"px;width:100px;"+
					"height:100px;background-color:#CCC0B2;"+"position:absolute;");				
				chese.appendChild(c);//添加进去
			}
		}
	}//CheseInit end

	//2、画棋子
	// @param cheseRow 棋子所在行
	// @param cheseCol 棋子所在列
	// @param cheseValue 棋子的值
	Game.prototype.drawChese = function(cheseRow,cheseCol,cheseValue) {		
		this.data[cheseRow][cheseCol] = cheseValue;//更新data

		var chese = document.querySelector(".game2048");
		var child = document.createElement("div");
		child.className = "children_"+cheseRow+"_"+cheseCol;
		child.innerHTML = cheseValue;
		child.setAttribute("style","width:80px;height:80px;"+"background-color:"+this.selectBgColor(cheseValue)+
			";color:#fff;font-size:2.2em;text-align:center;"+"line-height:100px;position:absolute;left:"+
			(106*cheseCol+6)+"px;top:"+(106*cheseRow+6)+"px;"+"transition:all .6s;font-weight:bolder;");
		chese.appendChild(child);
		child.style.width = "100px";
		child.style.height = "100px";

		//没有空位时，进行游戏胜负判断
		if (this.isLastChese) {
			this.isGameOver();
		}
	}

	//选择背景颜色
	//@param num 棋子上的值
	Game.prototype.selectBgColor = function(num) {                                                                                    
		switch(num){
			case 2:
				return "#EBE1D7";
			case 4:
				return "#ECE0C8";
			case 8:
				return "#EFB171";
			case 16:
				return "#F88E63";
			case 32:
				return "#F57D57";
			case 64:
				return "#FA3C3A";
			case 128:
				return "#ECCC73";
			case 256:
				return "#ECCD58";
			case 512:
				return "#ECCD58";
		}
	}
	// 随机棋子
	Game.prototype.randomValue = function() {
		return (Math.floor(Math.random()*2)+1)*2;
	}//randomValue end
	//随机坐标
	Game.prototype.randomCheseXY = function() {
		//筛选未落子的位置
		var arrXY = new Array();//用此数组来保存
		var k = 0;
		for (var i = 0;i < 4;i++) {
			for (var j = 0;j < 4;j++) {
				if (this.data[i][j] == 0){
					arrXY[k] = [i,j];
					k++;
				}
			}
		}
		// 当没有空位的时候，判断胜负
		if (1 == k) {
			this.isLastChese = true;
		}

		if (0 == k) {
			return 0;
		} else {
			var randomNum = Math.floor(Math.random()*k);
			return arrXY[randomNum];
		}		
	}
	//玩游戏
	Game.prototype.play = function() {	
		var obj = this;//给游戏对象起别名，防止和js事件中的this 冲突
		// 1、绑定按键事件

		document.onkeydown = function(event) {		
			switch(event.keyCode) {
				case 37://left
					obj.gameProcess(37);
					break;
				case 38://up
					obj.gameProcess(38);
					break;
				case 39://right
					obj.gameProcess(39);
					break;
				case 40://down
					obj.gameProcess(40);
					break;
			}
		}	
	}//end play
	// 2、移动
	Game.prototype.gameProcess = function (key) {
		var obj = this;		
		obj.moveChese(key);
		//是否随机棋子
		if (obj.isMoveChese) {
			setTimeout(function(){
			obj.randomChese();
			},405);
		}		
	}
	// // 左右移动 改变步长
	//移动
	Game.prototype.moveChese = function(key) {
		this.isMoveChese = false;//重新初始化移动
		this.flagCombineArrInit();
		var GPS = this.searchChese(key);

		var len = GPS.length;

		for (var i = 0;i < len;i++) {
			var classNameMove = "children_"+GPS[i][0]+"_"+GPS[i][1];
			var moveObj = document.querySelector("."+classNameMove);
			this.isCombine = false;//重新初始化合并
			var index = 0;
			switch(key) {
				case 37://left
					for (var j = GPS[i][1]-1;j >= 0;j--) {
					if (this.data[GPS[i][0]][j] == 0) {
						index++;
						this.isMoveChese = true;
					}else if (this.data[GPS[i][0]][j] == 
						this.data[GPS[i][0]][GPS[i][1]]&& 
						this.flagCombineArr[GPS[i][0]*4+j] == false) {
						index++;
						this.isMoveChese = true;
						this.isCombine = true;
						break;
						} else {
						break;
						}
					}	
					break;
				case 38://up
					for (var j = GPS[i][0]-1; j >= 0; j--) {
					if (this.data[j][GPS[i][1]] == 0) {
						index++;
						this.isMoveChese = true;
					} else if (this.data[j][GPS[i][1]]== this.data[GPS[i][0]][GPS[i][1]]
						&& this.flagCombineArr[j*4+GPS[i][1]] == false) {
						index++;
						this.isMoveChese = true;
						this.isCombine = true;
						break;
						} else {
						break;
						}
					}	
					break;
				case 39://right
					for (var j = GPS[i][1]+1;j < 4;j++) {
					if (this.data[GPS[i][0]][j] == 0) {
						index--;
						this.isMoveChese = true;
					}else if (this.data[GPS[i][0]][j] == this.data[GPS[i][0]][GPS[i][1]]
						&& this.flagCombineArr[GPS[i][0]*4+j] == false) {
						index--;
						this.isMoveChese = true;
						this.isCombine = true;
						break;
						} else {
						break;
						}
					}	
					break;
				case 40://down
					for (var j = GPS[i][0]+1; j < 4; j++) {
					if (this.data[j][GPS[i][1]] == 0) {
						index--;
						this.isMoveChese = true;
					} else if (this.data[j][GPS[i][1]]== this.data[GPS[i][0]][GPS[i][1]]
						&& this.flagCombineArr[j*4+GPS[i][1]] == false) {
						index--;
						this.isMoveChese = true;
						this.isCombine = true;
						break;
						} else {
						break;
						}
					}	
					break;
			}

			if (index != 0) {
			 	switch (key) {
			 		case 37:
			 		case 39:
				 		moveObj.style.left = moveObj.style.left.replace("px","")-0-index*106+"px";
					 	this.data[GPS[i][0]][GPS[i][1]-index] = this.data[GPS[i][0]][GPS[i][1]];
					 	this.data[GPS[i][0]][GPS[i][1]] = 0;
					 	moveObj.className = "children_"+GPS[i][0]+"_"+(GPS[i][1]-index);
					 	break;
					case 38:
					case 40:
						moveObj.style.top = moveObj.style.top.replace("px","")-0-index*106+"px";
					 	this.data[GPS[i][0]-index][GPS[i][1]] = this.data[GPS[i][0]][GPS[i][1]];
					 	this.data[GPS[i][0]][GPS[i][1]] = 0;
					 	moveObj.className = "children_"+(GPS[i][0]-index)+"_"+GPS[i][1];
					 	break;
				}			 	
				
			 	if (this.isCombine) {
			 		var parent = document.querySelector(".game2048");
			 		var childs = document.querySelectorAll("."+moveObj.className);
			 		var lenChilds = childs.length;
			 		// setTimeout(function(){
				 	for (var d = 0; d < lenChilds;d++) {
				 		parent.removeChild(childs[d]);
				 	}
			 		// },405)
			 		switch (key) {
			 			case 37:
			 			case 39:
				 			this.data[GPS[i][0]][GPS[i][1]-index] *=2;
				 			this.drawChese(GPS[i][0],GPS[i][1]-index,
				 				this.data[GPS[i][0]][GPS[i][1]-index]);
				 			this.flagCombineArr[GPS[i][0]*4+GPS[i][1]-index] = true;
				 			this.score_1 += this.data[GPS[i][0]][GPS[i][1]-index];
				 			this.score();
				 			break;
				 		case 38:
				 		case 40:
				 			this.data[GPS[i][0]-index][GPS[i][1]] *=2;
				 			this.drawChese(GPS[i][0]-index,GPS[i][1],
				 				this.data[GPS[i][0]-index][GPS[i][1]]);
				 			this.flagCombineArr[(GPS[i][0]-index)*4+GPS[i][1]] = true;				 			
				 			this.score_1 += this.data[GPS[i][0]-index][GPS[i][1]];
				 			this.score();
				 			break;				 			
			 		}			 		
			 	}
			}
		}
	}
	//查找有棋子的位置
	// @param key 翻转棋子数组的标志，37&38不反转，39&40反转
	Game.prototype.searchChese =function(key) {
		var GPS = new Array();
		var k = 0;
		for (var i = 0;i < 4;i++) {
			for (var j = 0;j < 4;j++) {
				if (this.data[i][j] != 0) {
					GPS[k] = [i,j];
					k++;
				}
			}				
		}
		switch (key) {
			case 37:
			case 38:
				return GPS;
			case 39:
			case 40:
				return GPS.reverse();//反转数组
		}		
	}
	//计数
	Game.prototype.score = function () {
		var game = document.querySelector(".game");
		var score = document.createElement("div");
		score.setAttribute("style","width:160px;height:40px;"+
			"position:absolute;left:80px;top:10px;background-color:#aaa;"+
			"color:#fff;text-align:center;font-size:2em;");
		score.innerHTML = this.score_1;
		game.appendChild(score);
	}

	//判断游戏胜负
	Game.prototype.isGameOver = function() {
		var flag = false;
		for (var i = 0;i < 4; i++) {
			for (var j = 0;j < 4; j++) {
				if(i != 0 && this.data[i][j] == this.data[i-1][j]) {
					flag = true;
					break;
				}	else if (j != 3 && this.data[i][j] == this.data[i][j-1]) {
					flag = true;
					break;
				}	else if (i !=  3 && this.data[i][j] == this.data[i+1][j]) {
					flag = true;
					break;
				} else if (j != 0 && this.data[i][j] == this.data[i][j-1]) {
					flag = true;
					break;
				}
			}

			if (flag) {  
				break;		
			}
		} 
		if (!flag) {
			setTimeout(function() {
				alert("游戏结束！");
				var game2048 = document.querySelector(".game2048");
				game2048.parentNode.removeChild(game2048);
				game.init("game");
			},500)
		}else {
			this.isLastChese = false;
		}
	}

	w._game2048 =new Game;
})(window)
 
var game = _game2048;
 game.init("game");
