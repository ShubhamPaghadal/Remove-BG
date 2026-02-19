/* eslint-disable no-var */
if (!Object.hasOwn) {
	Object.defineProperty(Object, 'hasOwn', {
		value(object, property) {
			if (object == null) {
				throw new TypeError('Cannot convert undefined or null to object');
			}
			return Object.prototype.hasOwnProperty.call(Object(object), property);
		},
		configurable: true,
		enumerable: false,
		writable: true
	});
}

if (!Array.prototype.findLast) {
	// eslint-disable-next-line no-extend-native
	Array.prototype.findLast = function (callback, thisArg) {
		var list = Object(this);
		var length = list.length >>> 0;
		var i = length - 1;
		var value;

		if (this == null) {
			throw new TypeError(
				'Array.prototype.findLast called on null or undefined'
			);
		}

		if (typeof callback !== 'function') {
			throw new TypeError(callback + ' is not a function');
		}

		while (i-- > 0) {
			value = list[i];

			if (callback.call(thisArg, value, i, list)) {
				return value;
			}
		}
		return undefined;
	};
}

if (!Array.prototype.toReversed) {
	// eslint-disable-next-line no-extend-native
	Array.prototype.toReversed = function () {
		return this.slice().reverse();
	};
}
