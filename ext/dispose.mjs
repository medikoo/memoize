// Call dispose callback on each cache purge

import callable from "es5-ext/object/valid-callable.js";
import forEach from "es5-ext/object/for-each.js";
import async from "./async.mjs";
import promise from "./promise.mjs";

var apply = Function.prototype.apply;

export default function disposeExtension(dispose, conf, options) {
	var del;
	callable(dispose);
	if ((options.async && async) || (options.promise && promise)) {
		conf.on(
			"deleteasync",
			(del = function (id, resultArray) { apply.call(dispose, null, resultArray); })
		);
		conf.on("clearasync", function (cache) {
			forEach(cache, function (result, id) { del(id, result); });
		});
		return;
	}
	conf.on("delete", (del = function (id, result) { dispose(result); }));
	conf.on("clear", function (cache) {
		forEach(cache, function (result, id) { del(id, result); });
	});
}
