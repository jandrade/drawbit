/**
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

}(window.db = window.db || {}));