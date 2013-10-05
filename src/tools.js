/**
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

}(window.db = window.db || {}));