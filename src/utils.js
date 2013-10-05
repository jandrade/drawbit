function round(num) {
	return (0.5 + num) << 0;
}

/**
 * Mouse events mapper
 * @enum {Object.<String>}
 */
var TouchEvent = ('ontouchstart' in document.documentElement) ?
//	touch events
{
	START: 'touchstart',
	MOVE: 'touchmove',
	CLICK: 'touchend',
	END: 'touchend'
} :
//	desktop events
{
	START: 'mousedown',
	MOVE: 'mousemove',
	CLICK: 'click',
	END: 'mouseup'
};

//	handle events invoking directly a method inside the DOM Element
if (!Element.prototype.addEventListener) {
	Element.prototype.addEventListener = function(type, handler, useCapture) {
		if (this.attachEvent) {
			this.attachEvent('on' + type, handler);
		}
		return this;
	};
}

Object.extend = function(destination, source) {
	for (var property in source) {
		destination[property] = source[property];
	}
	return destination;
};