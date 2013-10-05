/**
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

}(window.db = window.db || {}));