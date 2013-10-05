/**
 * @fileOverview Manages the functionality to implement a Tile inside the Grid
 * @author Juan Andrade <juandavidandrade@gmail.com>
 * @version 1.0
 * @since 1.0
 */

/*globals TouchEvent:false */

(function (db) {
	'use strict';
	
	/**
	 * @namespace Graphical User Interface
	 */
	db.gui = db.gui || {};

	/**
	 * Represents the Layer IDE
	 * @constructor
	 * @param  {String} selector  - The layers DOM selector
	 * @return {Object} Exposed methods
	 */
	db.gui.Layers = function(selector) {

		/**
		 * Layer HTML Element
		 * @type {HTMLElement}
		 */
		var element,
			
		/**
		 * Current layer
		 * @type {HTMLElement}
		 */
			current,
		/**
		 * Layers collection
		 * @type {Array}
		 */
			items = []
		;

		/**
		 * @construcs db.Layer
		 */
		(function () {
			element = document.querySelector(selector + ' ul');
			current = document.querySelector('h3 strong');
			current.innerHTML = db.Tools.layer;
			items = element.querySelectorAll('li');
		}());

		/**
		 * Adds a new layer
		 * @param {String} label - The layer label
		 */
		function add(label) {
			var hyperlink = document.createElement('a'),
				listItem = document.createElement('li');

			hyperlink.href = '#' + label;
			hyperlink.innerHTML = label;
			listItem.appendChild(hyperlink);


			element.appendChild(listItem);

			update();
		}

		/**
		 * Updates DOM
		 * @private
		 */
		function update() {
			items = element.querySelectorAll('li a');

			var numItems = items.length;

			while (numItems-- > 0) {
				items[numItems].removeEventListener(TouchEvent.CLICK, item_clickHandler);
				items[numItems].addEventListener(TouchEvent.CLICK, item_clickHandler);
			}

			current.innerHTML = db.Tools.layer;
		}

		function item_clickHandler(e) {
			e.preventDefault();

			db.Tools.layer = e.currentTarget.getAttribute('href').replace('#','');

			current.innerHTML = db.Tools.layer;
		}

		//	public methods and properties
		return {
			add: add
		};
	};

}(window.db = window.db || {}));