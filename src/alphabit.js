/**
 * @fileOverview Loads and converts an alphabet from an image to a matrix
 * @author Juan Andrade <juandavidandrade@gmail.com>
 * @version 1.0
 * @since 0.5
 */

/*globals console:false */

(function (db) {
	'use strict';
	
	/**
	 * Represents an Alphabit
	 * @constructor
	 * @param  {Enum} options  - Alphabit options
	 * @return {Object}          Exposed methods
	 */
	db.Alphabit = function Alphabit(options) {

		/**
		 * Layer Canvas Element
		 * @type {HTMLCanvasElement}
		 */
		var canvas,
			
		/**
		 * Canvas Context
		 * @type {CanvasRenderingContext2D}
		 */
			context,

		/**
		 * Source image
		 * @type {HTMLImage}
		 */
			source,
		
		/**
		 * Processed letters
		 * @type {Object}
		 */
			letters = {},
		
		/**
		 * Default Settings
		 * @type {Enum}
		 */
			SETTINGS = {
				padding: 1,
				width: 7,
				height: 7,
				color: '0,0,0,255',
				image: 'img/alphabet.png',
				onComplete: function(){}
			},

		/**
		 * Available letters
		 * @type {Array}
		 */
			LETTERS = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

		
		/**
		 * @construcs db.Alphabit
		 */
		(function() {
			Object.extend(SETTINGS, options);

			canvas = document.createElement('canvas');

			context = canvas.getContext('2d');

			createSpecialCharacter('space');
			createSpecialCharacter('delete');

			addEventListeners();
		}());

		/**
		 * Attach event handlers
		 */
		function addEventListeners() {
			source = document.createElement('img');
			source.addEventListener('load', source_loadHandler);
			source.addEventListener('error', source_errorHandler);
			source.src = SETTINGS.image;
		}

		/**
		 * Add special keys (scape, delete)
		 * @param  {String} key - The special char
		 */
		function createSpecialCharacter(key) {
			var i = 0,
				j = 0,
				colCollection = [],
				rowCollection = [],	
				flag = 0;

			for ( ; i < SETTINGS.width; i++ ) {
				colCollection = [];
				for ( j = 0; j < SETTINGS.height; j++ ) {
					colCollection.push(flag);
				}
				rowCollection.push(colCollection);
			}

			letters[key] = rowCollection;
		}

		/**
		 * Process alphabet image
		 */
		function process() {
			var i = 0,
				row = 0,
				col = 0,
				numLetter = 0,
				result = [],
				rowCollection = [],			
				dataLength,
				flag = 0;

			canvas.width = source.width;
			canvas.height = source.height;
			// Draw image into canvas
			context.drawImage(source, 0, 0, source.width, source.height);

			
			var imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
			dataLength = imageData.length;

			for ( ; i < dataLength; i+=4 ) {
				//	rgba
				flag = ([imageData[i], imageData[i+1], imageData[i+2], imageData[i+3]].toString() === SETTINGS.color) ? 1 : 0;

				//	next col
				rowCollection.push(flag);
				col++;

				//	next row
				if (col % SETTINGS.width === 0) {
					result.push(rowCollection);
					rowCollection = [];
					row++;

					//	next letter
					if (row % (SETTINGS.height+SETTINGS.padding) === 0) {
						letters[LETTERS[numLetter]] = result;
						result = [];
						numLetter++;
					}
				}
			}

			if (typeof SETTINGS.onComplete === 'function') {
				SETTINGS.onComplete();
			}
		}

		/**
		 * Image loaded
		 * @event
		 */
		function source_loadHandler(e) {
			process();
		}

		/**
		 * Image error
		 * @event
		 */
		function source_errorHandler(e) {
			console.log("Error loading alphabet.png");
		}

	//	public methods and properties
		return letters;
	};

}(window.db = window.db || {}));