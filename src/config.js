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

			console.log("data: ", data);
		}

		//	public methods and properties
		return {
			
		};
	};

}(window.db = window.db || {}));