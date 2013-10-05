/**
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

}(window.db = window.db || {}));