// Limit cache size, LRU (least recently used) algorithm.

import toPosInteger from "es5-ext/number/to-pos-integer.js";
import lruQueue from "lru-queue";
import async from "./async.mjs";
import promise from "./promise.mjs";

export default function maxExtension(max, conf, options) {
	var postfix, queue, hit;

	max = toPosInteger(max);
	if (!max) return;

	queue = lruQueue(max);
	postfix = (options.async && async) || (options.promise && promise) ? "async" : "";

	conf.on(
		"set" + postfix,
		(hit = function (id) {
			id = queue.hit(id);
			if (id === undefined) return;
			conf.delete(id);
		})
	);
	conf.on("get" + postfix, hit);
	conf.on("delete" + postfix, queue.delete);
	conf.on("clear" + postfix, queue.clear);
}
