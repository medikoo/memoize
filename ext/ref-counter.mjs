// Reference counter, useful for garbage collector like functionality

import d from "d";
import async from "./async.mjs";
import promise from "./promise.mjs";
var create = Object.create;
var defineProperties = Object.defineProperties;

export default function refCounterExtension(ignore, conf, options) {
	var cache, postfix;

	cache = create(null);
	postfix = (options.async && async) || (options.promise && promise) ? "async" : "";

	conf.on("set" + postfix, function (id, length) { cache[id] = length || 1; });
	conf.on("get" + postfix, function (id) { ++cache[id]; });
	conf.on("delete" + postfix, function (id) { delete cache[id]; });
	conf.on("clear" + postfix, function () { cache = {}; });

	defineProperties(conf.memoized, {
		deleteRef: d(function () {
			var id = conf.get(arguments);
			if (id === null) return null;
			if (!cache[id]) return null;
			if (!--cache[id]) {
				conf.delete(id);
				return true;
			}
			return false;
		}),
		getRefCount: d(function () {
			var id = conf.get(arguments);
			if (id === null) return 0;
			if (!cache[id]) return 0;
			return cache[id];
		}),
	});
}
