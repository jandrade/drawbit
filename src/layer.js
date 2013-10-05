/**
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

}(window.db = window.db || {}));