"use strict";

var normalizeOpts = require("es5-ext/object/normalize-options");
var resolveLength = require("./lib/resolve-length.js");
var plain = require("./plain.js");

module.exports = function (fn/*, options*/) {
	var options = normalizeOpts(arguments[1]), length;

	if (!options.normalizer) {
		length = options.length = resolveLength(options.length, fn.length, options.async);
		if (length !== 0) {
			if (options.primitive) {
				if (length === false) {
					options.normalizer = require("./normalizers/primitive.js");
				} else if (length > 1) {
					options.normalizer = require("./normalizers/get-primitive-fixed.js")(length);
				}
			} else if (length === false) options.normalizer = require("./normalizers/get.js")();
			else if (length === 1) options.normalizer = require("./normalizers/get-1.js")();
			else options.normalizer = require("./normalizers/get-fixed.js")(length);
		}
	}

	// Assure extensions
	if (options.async) plain.registeredExtensions.add("async");
	if (options.promise) plain.registeredExtensions.add("promise");
	if (options.dispose) plain.registeredExtensions.add("dispose");
	if (options.maxAge) plain.registeredExtensions.add("maxAge");
	if (options.max) plain.registeredExtensions.add("max");
	if (options.refCounter) plain.registeredExtensions.add("refCounter");

	return plain(fn, options);
};
