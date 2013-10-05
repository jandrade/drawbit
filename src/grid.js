/**
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

}(window.db = window.db || {}));