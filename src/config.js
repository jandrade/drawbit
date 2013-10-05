/**
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

			console.log("data: ", data.grid.layers);

			var grid = new db.Grid('.drawbit'),
				alphabit,
				app = new db.gui.App(),
				i = 0,
				j = 0,
				tiles,
				numTiles = 0,
				numLayers = data.grid.layers.length;

			for ( ; i < numLayers; i++) {
				grid.addLayer();
				app.layers.add('layer_' + i);
				tiles = data.grid.layers[i].tiles;
				numTiles = tiles.length;

				for ( j = 0; j < numTiles; j++) {
					grid.getLayer(db.Tools.layer).draw(tiles[j].x, tiles[j].y);
				}
				
			};
			
		}

		//	public methods and properties
		return {
			
		};
	};

}(window.db = window.db || {}));