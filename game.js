var canvas, ctx, tileScale, playing, W, H;
	var ball, player1, player2;
	var scoreP1 = 0, scoreP2 = 0;

	var key = {
		up: 87,
		down: 83
	}

	window.addEventListener("resize", resizeWindow);
	window.addEventListener("keydown", keyDown);
	window.addEventListener("keyup", keyUp);

	function keyUp(e){
		setTimeout(function(){
			player.direction = 0;
		}, 100);
	}

	function keyDown(e){

		if(!playing && (e.keyCode == key.up || e.keyCode == key.down))
			playing = true;

		if(e.keyCode == 87){
			player.direction = -1;
		} 
		else if(e.keyCode == 83){
			player.direction = 1;
		}
	}

	function resizeWindow(){
		W = window.innerWidth;
		H = window.innerHeight;

		canvas.width  = W;
		canvas.height = H;

		tileScale = Math.max(Math.floor(W / 60), Math.floor(H / 60));
	}

	function ScoreLayer(){
		this.color = "#fff";

		this.draw = function(){
			ctx.fillStyle = this.color;
			ctx.font = tileScale + "px 'Press Start 2P', cursive";
			ctx.fillText(scoreP1 + " " + scoreP2, W / 2, H / 2);
		}
	}

	function PlayLayer(){
		this.color = '#fff';
		this.text = "Pressiona W ou S para começar";

		this.draw = function(){
			ctx.fillStyle = this.color;
			ctx.font = (tileScale + 5) + "px 'Press Start 2P', cursive";
			ctx.fillText(this.text, W / 2 - ctx.measureText(this.text).width / 2, H / 2);
		}
	}

	function Player(){
		this.color = "#fff";
		this.body = [5, Math.floor((H / 2) / tileScale * 0.8)];
		this.direction = 0;

		this.update = function(){
			var nextPos = this.body[1] + this.direction * 0.95;

			if(!playing){
				if(ball.direction[0] == 1){
					if(this.body[1] < Math.floor((H / tileScale) / 2)){
						this.direction = 1;
					} else {
						this.direction = -1;
					}
					this.direction = 0;
					} 
				else {
					if(ball.body[1] > Math.round(this.body[1] + 3)){
						this.direction = 1;
					} 
					else if (ball.body[1] < Math.round(this.body[1] + 1)){
						this.direction = -1;
					}
					else if (ball.body[1] == Math.round(this.body[1] + 4)){
						this.direction = 0;
					}
				}
			}

			if(this.direction == 1 && nextPos >= Math.floor(H / tileScale - 5) || this.direction == -1 && nextPos <= 0)
				this.direction = 0;
			else
				this.body.splice(1,1, nextPos);			
		}

		this.IA = function(){
			//Se a bola estiver não direção do player 2, ele vai centralizar
			if(ball.direction[0] == -1){
				if(this.body[1] < Math.floor((H / tileScale) / 2)){
					this.direction = 1;
				} else {
					this.direction = -1;
				}
				this.direction = 0;
			} 
			else {
				if(Math.round(ball.body[1]) > Math.round(this.body[1] + 5)){
					this.direction = 1;
				} 
				else if (Math.round(ball.body[1]) < Math.round(this.body[1] + 1)){
					this.direction = -1;
				}
				else if (Math.round(ball.body[1]) === Math.round(this.body[1]) + 4){
					this.direction = 0;
				}
			}
		}

		this.draw = function(){
			ctx.fillStyle = this.color;
			ctx.fillRect(this.body[0] * tileScale, this.body[1] * tileScale, tileScale, tileScale * 6);
		}
	}

	function Ball(){
		this.color = "#fff";
		this.body = [Math.floor(W / tileScale / 2), 10];
		this.direction = [1, 0];

		this.update = function(){
			var nextPos = [this.body[0] + this.direction[0], this.body[1] + this.direction[1]];
			this.body.splice(0,2, nextPos[0], nextPos[1]);	
		}

		this.trigged = function(){
			//Verifica se a bola chegou a uma das extremidades verticais
			if(this.body[1] <= 0){
				this.direction = [this.direction[0], 1];
			}
			else if(this.body[1] >= (H / tileScale)){
				this.direction = [this.direction[0], -1];
			}

			//Verifica se houve colisão com o Player1
			//randNum = (-1 + Math.round(Math.random()) * 3) + (Math.abs(Math.random() * 1)) - 1;
			randNum = (-1 + Math.round(Math.random()) * 2) + (Math.abs(Math.random() * 1));
			if(this.body[0] == player.body[0] && (this.body[1] >= player.body[1] - 1 && this.body[1] <= player.body[1] + 6)){
				if(this.direction[1] == 0 && player.direction == 0){
					this.direction = [1 , 0];
				}
				else {
					if(this.direction[1] >= 1) {
						this.direction = [1 , (1 * Math.abs(Math.random() * 2))];
					} else if(this.direction[1] < 1) {
						this.direction = [1 , (-1 * Math.abs(Math.random() * 2))];
					}
				}
			}

			//Verifica se houve colisão com o Player2
			if(this.body[0] == player2.body[0] && (this.body[1] >= player2.body[1] - 1 && this.body[1] <= player2.body[1] + 6)){
				if(this.direction[1] == 0 && player2.direction == 0){
					this.direction = [-1 , 0];
				}
				else {
					if(this.direction[1] >= 1) {
						this.direction = [-1 , (1 * Math.abs(Math.random() * 2))];
					} else if(this.direction[1] < 1) {
						this.direction = [-1 , (-1 * Math.abs(Math.random() * 2))];
					}
				}
			}

			//Verifica se houve pontuação
			if(!playing){ 
				if(this.body[0] < 0){
					ball.direction = [-1, 0];
					ball.body = [Math.floor(W / tileScale / 2), Math.floor((H / 2) / tileScale)];
				}
				else if(this.body[0] > W /tileScale){
					ball.direction = [1, 0];
					ball.body = [Math.floor(W / tileScale / 2), Math.floor((H / 2) / tileScale)];
				}
			} else {	
				if(this.body[0] < 0)
					newRound("p2");
				else if(this.body[0] > W /tileScale)
					newRound("p1");
			}
		}

		this.draw = function(){
			ctx.fillStyle = this.color;
			ctx.fillRect(this.body[0] * tileScale, this.body[1] * tileScale, tileScale, tileScale);
		}
	}

	function init(){
		canvas = document.createElement("canvas");
		resizeWindow();
		document.body.appendChild(canvas);

		ctx = canvas.getContext("2d");

		newGame();
		run();
	}

	function newGame(){
		player = new Player();
		player2 = new Player();
		player2.body[0] = Math.floor(W / tileScale - 5);
		ball = new Ball();
		playLayer = new PlayLayer();
		scoreLayer = new ScoreLayer();
		playing = false;
	}

	function newRound(w){
		if(w == "p2"){
			scoreP2++;
			ball.direction = [-1, 0];
		}
		else{
			scoreP1++;
			ball.direction = [1, 0];
		}

		ball.body = [Math.floor(W / tileScale / 2), Math.floor((H / 2) / tileScale)];
	}

	function update(){
		player.update();
		player2.IA();
		player2.update();
		ball.update();
		ball.trigged();
	}

	function run(){
		update();
		draw();

		setTimeout(run, 1000 / 15);
	}

	function draw(){
		ctx.clearRect(0, 0, W, H);

		player.draw();
		player2.draw();
		ball.draw();
		if(!playing)
			playLayer.draw();
		else
			scoreLayer.draw();
	}

	init();

