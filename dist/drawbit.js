/*! drawbit v1.0.0 2013-10-05 */
/**
 * @fileOverview Loads and converts an alphabet from an image to a matrix
 * @author Juan Andrade <juandavidandrade@gmail.com>
 * @version 1.0
 * @since 0.5
 */

/*globals console:false */

(function (db) {
	'use strict';
	
	/**
	 * Represents an Alphabit
	 * @constructor
	 * @param  {Enum} options  - Alphabit options
	 * @return {Object}          Exposed methods
	 */
	db.Alphabit = function Alphabit(options) {

		/**
		 * Layer Canvas Element
		 * @type {HTMLCanvasElement}
		 */
		var canvas,
			
		/**
		 * Canvas Context
		 * @type {CanvasRenderingContext2D}
		 */
			context,

		/**
		 * Source image
		 * @type {HTMLImage}
		 */
			source,
		
		/**
		 * Processed letters
		 * @type {Object}
		 */
			letters = {},
		
		/**
		 * Default Settings
		 * @type {Enum}
		 */
			SETTINGS = {
				padding: 1,
				width: 7,
				height: 7,
				color: '0,0,0,255',
				image: 'img/alphabet.png',
				onComplete: function(){}
			},

		/**
		 * Available letters
		 * @type {Array}
		 */
			LETTERS = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

		
		/**
		 * @construcs db.Alphabit
		 */
		(function() {
			Object.extend(SETTINGS, options);

			canvas = document.createElement('canvas');

			context = canvas.getContext('2d');

			createSpecialCharacter('space');
			createSpecialCharacter('delete');

			addEventListeners();
		}());

		/**
		 * Attach event handlers
		 */
		function addEventListeners() {
			source = document.createElement('img');
			source.addEventListener('load', source_loadHandler);
			source.addEventListener('error', source_errorHandler);
			source.src = SETTINGS.image;
		}

		/**
		 * Add special keys (scape, delete)
		 * @param  {String} key - The special char
		 */
		function createSpecialCharacter(key) {
			var i = 0,
				j = 0,
				colCollection = [],
				rowCollection = [],	
				flag = 0;

			for ( ; i < SETTINGS.width; i++ ) {
				colCollection = [];
				for ( j = 0; j < SETTINGS.height; j++ ) {
					colCollection.push(flag);
				}
				rowCollection.push(colCollection);
			}

			letters[key] = rowCollection;
		}

		/**
		 * Process alphabet image
		 */
		function process() {
			var i = 0,
				row = 0,
				col = 0,
				numLetter = 0,
				result = [],
				rowCollection = [],			
				dataLength,
				flag = 0;

			canvas.width = source.width;
			canvas.height = source.height;
			// Draw image into canvas
			context.drawImage(source, 0, 0, source.width, source.height);

			
			var imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
			dataLength = imageData.length;

			for ( ; i < dataLength; i+=4 ) {
				//	rgba
				flag = ([imageData[i], imageData[i+1], imageData[i+2], imageData[i+3]].toString() === SETTINGS.color) ? 1 : 0;

				//	next col
				rowCollection.push(flag);
				col++;

				//	next row
				if (col % SETTINGS.width === 0) {
					result.push(rowCollection);
					rowCollection = [];
					row++;

					//	next letter
					if (row % (SETTINGS.height+SETTINGS.padding) === 0) {
						letters[LETTERS[numLetter]] = result;
						result = [];
						numLetter++;
					}
				}
			}

			if (typeof SETTINGS.onComplete === 'function') {
				SETTINGS.onComplete();
			}
		}

		/**
		 * Image loaded
		 * @event
		 */
		function source_loadHandler(e) {
			process();
		}

		/**
		 * Image error
		 * @event
		 */
		function source_errorHandler(e) {
			console.log("Error loading alphabet.png");
		}

	//	public methods and properties
		return letters;
	};

}(window.db = window.db || {}));;/**
 * @fileOverview Manages the configuration Object (JSON or Object Literal)
 * @author Juan Andrade <juandavidandrade@gmail.com>
 * @version 1.0
 * @since 1.0
 */

/*globals console:false */

(function (db) {
	'use strict';
	
	/**
	 * Represents the configuration
	 * @constructor
	 * @return {Object} Exposed methods
	 */
	db.Config = function(value) {

		/**
		 * Configuration Data
		 * @type {db.gui.Layers}
		 */
		var data;

		/**
		 * @construcs db.Config
		 */
		(function () {
			parseConfig();
		}());

		/**
		 * Parse config JSON file
		 */
		function parseConfig() {
			data = value;

			console.log("data: ", data);
		}

		//	public methods and properties
		return {
			
		};
	};

}(window.db = window.db || {}));;/**
 * @fileOverview Make transitions between Tiles
 * @author Juan Andrade <juandavidandrade@gmail.com>
 * @version 1.0
 * @since 0.5
 */

(function (db) {
	'use strict';
	
	/**
	 * Represents an Effect
	 * @constructor
	 * @param  {db.Layer} target  - The target Layer
	 * @param  {Enum} options  - effect options
	 * @return {Object}	Exposed methods
	 */
	db.Effect = function(target, options, _time) {

		/**
		 * Tile Identifier
		 * @type {String}
		 */
		var id = 'tile',

		/**
		 * Frame interval
		 */
			requestID,

		/**
		 * Number of tiles finished
		 * @type {Number}
		 */
			completedTiles = 0,

		/**
		 * Tiles to be processed
		 * @type {Array}
		 */
			tiles = [],

		/**
		 * Checks if the all tiles has been completed
		 * @type {Number}
		 */
			isCompleted,

		/**
		 * Transition time
		 * @type {Number} of miliseconds
		 */
			time = _time || 1000;

		/**
		 * @construcs db.Effect
		 */
		(function () {

			var numTiles = target.tiles.length;

			while (numTiles-- > 0) {
				tiles.push(new db.effects[options.type](target.tiles[numTiles], target.context, options, time));
			}

			if (options.delay) {
				setTimeout(start, options.delay);
			} else {
				start();
			}

		}());

		/**
		 * Start transition
		 */
		function start() {
			requestID = window.requestAnimationFrame(render);
		}

		/**
		 * Stop transition
		 * @return {[type]} [description]
		 */
		function stop() {
			requestID = window.cancelAnimationFrame(requestID);
		}

		/**
		 * Update / frame loop
		 */
		function render() {
			next();
			if (requestID && !isCompleted) {
				window.requestAnimationFrame(render);	
			}
		}

		/**
		 * Render next frame
		 */
		function next() {
			var numTiles = tiles.length;

			if (completedTiles >= numTiles) {
				isCompleted = true;
			}
			while (numTiles-- > 0) {
				if (tiles[numTiles] && !tiles[numTiles].complete()) {
					
					tiles[numTiles].update();
					if (tiles[numTiles] && tiles[numTiles].complete()) {
						completedTiles++;
					}
				}
			}


		}

		//	public methods and properties
		return {
			id: id,
			next: next
		};
	};

}(window.db = window.db || {}));;/**
 * @fileOverview Creates a Fade effect for a selected Tile
 * @author Juan Andrade <juandavidandrade@gmail.com>
 * @version 1.0
 * @since 0.5
 */

(function (db) {
	'use strict';

	/**
	 * @namespace Effects
	 */
	db.effects = db.effects || {};
	
	/**
	 * Represents a Fade Effect
	 * @constructor
	 * @param  {db.Tile} Context  - The tile
	 * @param  {CanvasRenderingContext2D} Context  - The tile context (canvas)
	 * @param  {Enum} options  - Tile options
	 * @param  {Number} time  - Transition time
	 *
	 * @return {Object}	Exposed methods
	 */
	db.effects.Fade = function(tile, context, options, time) {

		/**
		 * Frame duration
		 * @type {Float}
		 */
		var	stepSize = 600 / time,

		/**
		 * Transition completed
		 * @type {Boolean}
		 */
			isCompleted,

		/**
		 * Current alpha
		 * @type {Number}
		 */
			alpha = 10;

		/**
		 * @construcs db.Tile
		 */
		(function () {
			reset();
			draw();
		}());

		/**
		 * Reset effect
		 * @private
		 */
		function reset() {
			isCompleted = false;
			alpha = 10;
		}

		/**
		 * Draws a frame
		 */
		function draw() {
			context.clearRect(tile.x, tile.y, tile.width, tile.height);
			
			context.fillStyle = 'rgba(' + tile.color + ',' + alpha/10 + ')';
			context.fillRect(tile.x, tile.y, tile.width, tile.height);

			if (alpha <= 0) {
				isCompleted = true;
			}
			
			alpha -= stepSize;
		}

		/**
		 * Effect already completed?
		 * @return {Boolean}
		 */
		function complete() {
			return isCompleted;
		}

		//	public methods and properties
		return {
			update: draw,
			complete: complete
		};
	};

}(window.db = window.db || {}));;/**
 * @fileOverview Creates a Flip effect for a selected Tile
 * @author Juan Andrade <juandavidandrade@gmail.com>
 * @version 1.0
 * @since 0.5
 */

(function (db) {
	'use strict';

	/**
	 * @namespace Effects
	 */
	db.effects = db.effects || {};
	
	/**
	 * Represents a Flip Effect
	 * @constructor
	 * @param  {db.Tile} Context  - The tile
	 * @param  {CanvasRenderingContext2D} Context  - The tile context (canvas)
	 * @param  {Enum} options  - Tile options
	 * @param  {Number} time  - Transition time
	 * 
	 * @return {Object} Exposed methods
	 */
	db.effects.Flip = function(tile, context, options, time) {

		/**
		 * Delta
		 * @type {Number}
		 */
		var	delta = 0,

		/**
		 * Previous bounds
		 * @type {Object}
		 */
			initialBounds = {},
		
		/**
		 * Current bounds
		 * @type {Object}
		 */
			bounds = {},

		/**
		 * Transition Speed
		 * @type {Number}
		 */
			stepSize = 0.5,

		/**
		 * Tile reachs the half transition
		 * @type {Boolean}
		 */
			isFlipped,

		/**
		 * Tile transition completed
		 * @type {Boolean}
		 */
			isCompleted,

		/**
		 * Current tile color
		 * @type {String}
		 */
			currentColor = tile.color,

		/**
		 * flipped
		 * @type {Boolean}
		 */
			isBack = false
		;

		/**
		 * @construcs db.Tile
		 */
		(function () {
			reset();
			draw();

			initialBounds = JSON.stringify(bounds);
		}());

		/**
		 * Reset effect
		 */
		function reset() {
			bounds = {
				t: 0,
				b: 0,
				tl: 0,
				bl: 0,
				tr: 0,
				br: 0
			};

			context.fillStyle = isBack ? options.back : tile.color;
			
			delta = 0;
			isFlipped = false;
			isCompleted = false;
		}

		/**
		 * Draws a frame
		 * @type {Function} fnHalf - Flip ocurs
		 */
		function draw(fnHalf) {

			context.clearRect(tile.x, tile.y, tile.width, tile.height);
			//	halfway
			if (!isFlipped && bounds.b < bounds.t) {
				if (currentColor === tile.color) {
					currentColor = options.back;
				} else {
					currentColor = tile.color;
				}
				context.fillStyle = currentColor;
				isFlipped = true;
				if (typeof fnHalf === 'function') {
					fnHalf();
				}
			}

			if (!isFlipped) {
				bounds.t = tile.y + delta;
				bounds.b = tile.y + tile.height - delta;
				bounds.tl = tile.x;
				bounds.bl = tile.x + delta;
				bounds.tr = tile.x + tile.width;
				bounds.br = tile.x + tile.width - delta;
			} else {
				bounds.t = tile.y + tile.height - delta;
				bounds.b = tile.y + delta;
				bounds.tl = tile.x + tile.width - delta;
				bounds.bl = tile.x;
				bounds.br = tile.x + tile.width;
				bounds.tr = tile.x + delta;
			}

			context.beginPath();

			context.moveTo(bounds.tl, bounds.t);
			//	left edge
			context.lineTo(bounds.bl, bounds.b);
			//	bottom edge
			context.lineTo(bounds.br, bounds.b);
			//	right edge
			context.lineTo(bounds.tr, bounds.t);
			//	top edge
			context.closePath();
			context.fill();
			
			if (isFlipped && initialBounds === JSON.stringify(bounds)) {
				isCompleted = true;
				isBack = true;
			}
			
			delta = delta + stepSize;
		}

		/**
		 * Effect already completed?
		 * @return {Boolean}
		 */
		function complete() {
			return isCompleted;
		}

		//	public methods and properties
		return {
			update: draw,
			complete: complete
		};
	};

}(window.db = window.db || {}));;/**
 * @fileOverview Manages the functionality to implement a Canvas Grid (8-bits)
 * @author Juan Andrade <juandavidandrade@gmail.com>
 * @version 1.0
 * @since 1.0 
 */

(function (db) {
	'use strict';
	
	/**
	 * Represents a canvas grid
	 * @constructor
	 * @param  {String} selector - The HTML selector
	 * @param  {Enum} options  - Grid options
	 * @return {Object}          Exposed methods
	 */
	db.Grid = function(selector, options) {

		/**
		 * Grid HTML Element
		 * @type {HTMLElement}
		 */
		var element,

		/**
		 * Grid Layers
		 * @type {Array}
		 */
			layers = [],
			
		/**
		 * Grid Width
		 * @type {Number}
		 */
			width = 300,

		/**
		 * Grid Height
		 * @type {Number}
		 */
			height = 300;

		/**
		 * @construcs db.Grid
		 */
		(function () {
			element = document.querySelector(selector);
		}());

		/**
		 * Creates a new layer
		 */
		function addLayer() {
			var layer = new db.Layer('layer_' + layers.length, width, height);
			element.appendChild(layer.element);

			layers.push(layer);

			db.Tools.layer = layer.id;
		}

		/**
		 * Removes a selected layer
		 * @return {[type]} [description]
		 */
		function removeLayer() {

		}

		/**
		 * Gets a selected layer
		 * @param  {String} id - The layer name
		 * @return {db.Layer}
		 */
		function getLayer(id) {
			var layer,
				i = 0,
				numLayers = layers.length;
			
			while(numLayers-- > 0) {
				if (layers[numLayers].id === id) {
					layer = layers[numLayers];
					break;
				}
			}

			return layer;
		}

		//	public methods and properties
		return {
			element: element,
			addLayer: addLayer,
			getLayer: getLayer,
			width: width,
			height: height
		};
	};

}(window.db = window.db || {}));;/**
 * @fileOverview Manages the App
 * @author Juan Andrade <juandavidandrade@gmail.com>
 * @version 1.0
 * @since 1.0
 */

(function (db) {
	'use strict';
	
	/**
	 * @namespace Graphical User Interface
	 */
	db.gui = db.gui || {};

	/**
	 * Represents the Graphical User Interface
	 * @constructor
	 * @return {Object}	Exposed methods
	 */
	db.gui.App = function() {

		/**
		 * App layers
		 * @type {db.gui.Layers}
		 */
		var layers;

		/**
		 * @construcs db.gui.App
		 */
		(function () {
			layers = new db.gui.Layers('.db-layers');
		}());

		//	public methods and properties
		return {
			layers: layers
		};
	};

}(window.db = window.db || {}));;/**
 * @fileOverview Manages the functionality to implement a Tile inside the Grid
 * @author Juan Andrade <juandavidandrade@gmail.com>
 * @version 1.0
 * @since 1.0
 */

/*globals TouchEvent:false */

(function (db) {
	'use strict';
	
	/**
	 * @namespace Graphical User Interface
	 */
	db.gui = db.gui || {};

	/**
	 * Represents the Layer IDE
	 * @constructor
	 * @param  {String} selector  - The layers DOM selector
	 * @return {Object} Exposed methods
	 */
	db.gui.Layers = function(selector) {

		/**
		 * Layer HTML Element
		 * @type {HTMLElement}
		 */
		var element,
			
		/**
		 * Current layer
		 * @type {HTMLElement}
		 */
			current,
		/**
		 * Layers collection
		 * @type {Array}
		 */
			items = []
		;

		/**
		 * @construcs db.Layer
		 */
		(function () {
			element = document.querySelector(selector + ' ul');
			current = document.querySelector('h3 strong');
			current.innerHTML = db.Tools.layer;
			items = element.querySelectorAll('li');
		}());

		/**
		 * Adds a new layer
		 * @param {String} label - The layer label
		 */
		function add(label) {
			var hyperlink = document.createElement('a'),
				listItem = document.createElement('li');

			hyperlink.href = '#' + label;
			hyperlink.innerHTML = label;
			listItem.appendChild(hyperlink);


			element.appendChild(listItem);

			update();
		}

		/**
		 * Updates DOM
		 * @private
		 */
		function update() {
			items = element.querySelectorAll('li a');

			var numItems = items.length;

			while (numItems-- > 0) {
				items[numItems].removeEventListener(TouchEvent.CLICK, item_clickHandler);
				items[numItems].addEventListener(TouchEvent.CLICK, item_clickHandler);
			}

			current.innerHTML = db.Tools.layer;
		}

		function item_clickHandler(e) {
			e.preventDefault();

			db.Tools.layer = e.currentTarget.getAttribute('href').replace('#','');

			current.innerHTML = db.Tools.layer;
		}

		//	public methods and properties
		return {
			add: add
		};
	};

}(window.db = window.db || {}));;/**
 * @fileOverview Manages the functionality to implement a Tile inside the Grid
 * @author Juan Andrade <juandavidandrade@gmail.com>
 * @version 1.0
 * @since 1.0
 */

(function (db) {
	'use strict';
	
	/**
	 * Represents a Grid Layer
	 * @constructor
	 * @param  {Enum} options  - Tile options
	 * @return {Object}          Exposed methods
	 */
	db.Layer = function(id, width, height) {

		/**
		 * Layer Canvas Element
		 * @type {HTMLCanvasElement}
		 */
		var canvas,
			
		/**
		 * Canvas Context
		 * @type {CanvasRenderingContext2D}
		 */
			context,
		/**
		 * Tiles collection
		 * @type {Array}
		 */
			tiles = [],

		/**
		 * Current horizontal position
		 * @type {Number}
		 */
			currentX = 0,
		
		/**
		 * Current vertical position
		 * @type {Number}
		 */
			currentY = 0;

		/**
		 * @construcs db.Layer
		 */
		(function () {
			canvas = document.createElement('canvas');
			canvas.id = id;
			canvas.width = width;
			canvas.height = height;

			context = canvas.getContext('2d');
		}());

		/**
		 * Checks if the ID exists into the tiles collection
		 * @param  {String} id - The tile identifier
		 * @return {Number}    The tile index
		 *
		 * @private
		 */
		function tileExists(id) {
			var tile,
				i = 0,
				numItems = tiles.length;
			
			while(numItems-- > 0) {
				if (tiles[numItems] && tiles[numItems].id === id) {
					tile = numItems;
					break;
				}
			}

			return tile;
		}

		/**
		 * Draws a tile into the selected position (if it's available)
		 * @param  {Number} x Horizontal position
		 * @param  {Number} y Vertical position
		 */
		function draw(x, y) {
			var exists = tileExists('tile_' + x + '_' + y);
			
			if (!isNaN(exists)) {
				return;
			}

			var tile = new db.Tile(context, {
				x: x,
				y: y,
				color: db.Tools.color
			});

			tiles.push(tile);
		}

		/**
		 * Draws a set of tiles
		 * @param  {Array} path - The path as a Multi-dimensional array
		 */
		function drawPath(path) {
			var rows = path.length,
				cols = path[0] ? path[0].length : 0,
				currentPos,
				i = 0,
				j = 0,
				numFrame;

			//	loop into rows
			for ( ; i < rows; i++) {
				//	loop into columns
				for (j = 0 ; j < cols; j++) {
					currentPos = path[i][j];
					if (currentPos === 1) {
						//	round num
						numFrame = (0.5 + Math.random()*15) << 0;
						draw(currentX + j, currentY + i);
					}
				}
			}

			currentX += cols;

			//	start new row
			if (currentX + cols > 30) {
				currentY += rows;
				currentX = 0;
			}
		}

		/**
		 * Erase a tile into the selected position
		 * @param  {Number} x Horizontal position
		 * @param  {Number} y Vertical position
		 */
		function erase(x, y) {
			var exists = tileExists('tile_' + x + '_' + y);
			
			
			if (typeof exists === 'undefined') {
				return;
			}

			//	clear area
			tiles[exists].dispose();
			//	delete tile
			tiles.splice(exists, 1);
		}

		//	public methods and properties
		return {
			id: id,
			element: canvas,
			context: context,
			draw: draw,
			erase: erase,
			drawPath: drawPath,
			tiles: tiles
		};
	};

}(window.db = window.db || {}));;/**
 * @fileOverview Manages the functionality to implement a Tile inside the Grid
 * @author Juan Andrade <juandavidandrade@gmail.com>
 * @version 1.0
 * @since 0.2
 */

(function (db) {
	'use strict';
	
	/**
	 * Represents a Tile
	 * @constructor
	 * @param  {CanvasRenderingContext2D} Context  - The tile context (canvas)
	 * @param  {Enum} options  - Tile options
	 * @return {Object}          Exposed methods
	 */
	db.Tile = function(context, options) {

		/**
		 * Tile Identifier
		 * @type {String}
		 */
		var id = 'tile',

		/**
		 * Tile Width
		 * @type {Number}
		 */
			width = 10,
		
		/**
		 * Tile height
		 * @type {Number}
		 */
			height = 10,

		/**
		 * Horizontal position
		 * @type {Number}
		 */
			x = 0,

		/**
		 * Vertical position
		 * @type {Number}
		 */
			y = 0,

		/**
		 * Tile padding
		 * @type {Number}
		 */
			padding = 1,

		/**
		 * Background color
		 * @type {String}
		 */
			color = options.color || '200,200,200',

		/**
		 * Background alpha
		 * @type {Float}
		 */
			opacity = 1.0
		;

		/**
		 * @construcs db.Tile
		 */
		(function () {
			id = options.id || 'tile_' + options.x + '_' + options.y;
			x = (options.x * width) + (padding * options.x);
			y = (options.y * height) + (padding * options.y);

			context.fillStyle = 'rgba(' + color + ',' + opacity + ')';
			context.fillRect(x,y,width,height);
		}());

		/**
		 * Clear tile
		 */
		function dispose() {
			context.clearRect(x,y,width,height);
		}

		//	public methods and properties
		return {
			id: id,
			color: color,
			context: context,
			width: width,
			height: height,
			x: x,
			y: y,
			dispose: dispose
		};
	};

}(window.db = window.db || {}));;/**
 * @fileOverview Manages the toolbars for DrawBit
 * @author Juan Andrade <juandavidandrade@gmail.com>
 */

(function (db) {
	'use strict';
	
	/**
	 * Represents the Toolbar Persistence Layer
	 * @constructor
	 * @return {Object} Exposed methods
	 */
	db.Tools = (function() {

		/**
		 * Background color
		 * @type {String}
		 */
		var color = '200,200,200',

		/**
		 * Background alpha
		 * @type {Float}
		 */
			opacity = 1.0,

		/**
		 * Eraser enabled?
		 * @type {Boolean}
		 */
			erase = false,

		/**
		 * Current layer
		 * @type {String}
		 */
			layer = 'layer_0'
		;

		/**
		 * @construcs db.Tools
		 */
		(function () {
			
		}());

		//	public methods and properties
		return {
			color: color,
			erase: erase,
			layer: layer
		};
	}());

}(window.db = window.db || {}));;function round(num) {
	return (0.5 + num) << 0;
}

/**
 * Mouse events mapper
 * @enum {Object.<String>}
 */
var TouchEvent = ('ontouchstart' in document.documentElement) ?
//	touch events
{
	START: 'touchstart',
	MOVE: 'touchmove',
	CLICK: 'touchend',
	END: 'touchend'
} :
//	desktop events
{
	START: 'mousedown',
	MOVE: 'mousemove',
	CLICK: 'click',
	END: 'mouseup'
};

//	handle events invoking directly a method inside the DOM Element
if (!Element.prototype.addEventListener) {
	Element.prototype.addEventListener = function(type, handler, useCapture) {
		if (this.attachEvent) {
			this.attachEvent('on' + type, handler);
		}
		return this;
	};
}

Object.extend = function(destination, source) {
	for (var property in source) {
		destination[property] = source[property];
	}
	return destination;
};