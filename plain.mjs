import callable from "es5-ext/object/valid-callable.js";
import forEach from "es5-ext/object/for-each.js";
import async from "./ext/async.mjs";
import * as extensions from "./lib/registered-extensions.mjs";
import configure from "./lib/configure-map.mjs";
import resolveLength from "./lib/resolve-length.mjs";

export let registeredExtensions = new Set();

export default function self(fn/*, options */) {
	var options, length, conf;

	callable(fn);
	options = Object(arguments[1]);

	if (options.async && options.promise) {
		throw new Error("Options 'async' and 'promise' cannot be used together");
	}

	// Do not memoize already memoized function
	if (hasOwnProperty.call(fn, "__memoized__") && !options.force) return fn;

	// Resolve length;
	length = resolveLength(options.length, fn.length, options.async && async);

	// Configure cache map
	conf = configure(fn, length, options);

	// Bind eventual extensions
	forEach(registeredExtensions, function (name) {
		if (options[name]) extensions[name](options[name], conf, options);
	});

	if (self.__profiler__) self.__profiler__(conf);

	conf.updateEnv();
	return conf.memoized;
}
