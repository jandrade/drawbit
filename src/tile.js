/**
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

}(window.db = window.db || {}));