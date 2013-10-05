/**
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

}(window.db = window.db || {}));