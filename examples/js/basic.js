var grid = new db.Grid('.drawbit'),
	alphabit,
	app = new db.gui.App();

//	0. Create two layers
grid.addLayer();
app.layers.add('layer_0');
grid.addLayer();
app.layers.add('layer_1');

//	1. draw base layer
drawBoard();

function drawBoard() {
	var numCols = Math.floor(grid.width / 11),
		numRows = Math.floor(grid.height / 11),
		layer = grid.getLayer('layer_0'),
		i = 0,
		j = 0;
	
	for ( ; i < numRows; i++) {
		for (j = 0 ; j < numCols; j++) {
			layer.draw(i,j);
		}
	}
}

//	2. change colors
changeColors();

function changeColors() {
	var colors = document.querySelectorAll('.db-colors a'),
		numColors = colors.length,
		i = 0;

		for ( ; i < numColors; i++) {
			colors[i].addEventListener(TouchEvent.CLICK, color_clickHandler);
		}

	function color_clickHandler(e) {
		var color =  this.getAttribute('href').replace('#', '');
		db.Tools.erase = false;
		db.Tools.color = color;
	}
}

//	3. draw using the mouse as pencil
drawPencil();

function drawPencil() {
	var board = grid.element,
		isPressed = false;

	
	board.addEventListener(TouchEvent.START, board_startHandler);
	board.addEventListener(TouchEvent.MOVE, board_moveHandler);
	board.addEventListener(TouchEvent.END, board_endHandler);


	function board_startHandler(e) {
		isPressed = true;
	}

	function board_moveHandler(e) {
		if (!isPressed || db.Tools.erase) {
			return;
		}
		var x = round(e.layerX / 11),
			y = round(e.layerY / 11);
		grid.getLayer(db.Tools.layer).draw(x,y);
	}

	function board_endHandler(e) {
		isPressed = false;
	}
}

//	4. Erase tiles
document.querySelector('.erase-button').addEventListener(TouchEvent.CLICK, eraseTiles);

function eraseTiles() {
	var board = grid.element,
		isPressed = false;

	db.Tools.erase = true;
	
	board.addEventListener(TouchEvent.START, board_startHandler);
	board.addEventListener(TouchEvent.MOVE, board_moveHandler);
	board.addEventListener(TouchEvent.END, board_endHandler);


	function board_startHandler(e) {
		isPressed = true;
	}

	function board_moveHandler(e) {
		if (!isPressed || !db.Tools.erase) {
			return;
		}
		var x = round(e.layerX / 11),
			y = round(e.layerY / 11);
		grid.getLayer(db.Tools.layer).erase(x,y);
	}

	function board_endHandler(e) {
		isPressed = false;
	}
}

//	5. Draw a letter
drawLetter();
function drawLetter() {
	alphabit = new db.Alphabit({
		onComplete: function() {
			grid.getLayer('layer_2').drawPath(alphabit.a);
		}
	});

	grid.addLayer();
	app.layers.add('layer_2');
	
	db.Tools.color = '0,255,255';
}


//	6. Add new layer
addLayer();

function addLayer() {
	var layersCount = 3;
	document.querySelector('.add-layer-button').addEventListener(TouchEvent.CLICK, addLayerButton_clickHandler);

	function addLayerButton_clickHandler(e) {
		e.preventDefault();
		grid.addLayer();
		app.layers.add('layer_'+layersCount);
		db.Tools.layer = 'layer_' + layersCount;
		layersCount++;
	}
}

//	7. Write....
writeLetters();

function writeLetters() {
	document.getElementById('message').addEventListener('keyup', function(e) {
		e.preventDefault();
		var code = e.keyCode,
			character;

		character = String.fromCharCode(code).toLowerCase();
		if (code === 32) {
			character = 'space';
		} else if (code === 8) {
			character = 'delete';
		}
		console.log("key!!! ", e.keyCode, character);
		grid.getLayer('layer_2').drawPath(alphabit[character]);
	});
}

//	8. Effects
createEffects();

function createEffects() {
	var effect;

	document.querySelector('.flip-button').addEventListener(TouchEvent.CLICK, flipButton_clickHandler);
	document.querySelector('.flip-next-button').addEventListener(TouchEvent.CLICK, flipNextButton_clickHandler);
	document.querySelector('.fade-button').addEventListener(TouchEvent.CLICK, fadeButton_clickHandler);
	document.querySelector('.flip-fade-button').addEventListener(TouchEvent.CLICK, flipFadeButton_clickHandler);

	function flipButton_clickHandler(e) {
		e.preventDefault();
		var layer = grid.getLayer('layer_2');
		effect = new db.Effect(layer, {type: 'Flip', back: 'blue'}, 1000);
	}

	function flipNextButton_clickHandler(e) {
		e.preventDefault();
		effect.next();
	}

	function fadeButton_clickHandler(e) {
		e.preventDefault();
		var layer = grid.getLayer('layer_2');
		effect = new db.Effect(layer, {type: 'Fade'}, 1000);
	}

	function flipFadeButton_clickHandler(e) {
		e.preventDefault();
		var layer = grid.getLayer('layer_2');
		effect = new db.Effect(layer, {type: 'Flip', back: 'blue'}, 1000);

		var layer = grid.getLayer('layer_0');
		effect = new db.Effect(layer, {type: 'Fade', delay: 300}, 500);
	}

}
