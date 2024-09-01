/* global console */
/* eslint no-console: 0, id-length: 0 */

// Simple benchmark for very simple memoization case (fibonacci series)
// To run it, do following in memoizee package path:
//
// $ cd benchmark && npm install && cd ..
// $ node benchmark/fibonacci.mjs

import forEach from "es5-ext/object/for-each.js";
import pad from "es5-ext/string/%23/pad.js";
import memoizee from "../index.mjs";
import { memoize as underscore } from "underscore";
import lodash from "lodash/memoize.js";
import * as lruCache from "lru-cache";
import { Cache as lruSecondaryCache } from "secondary-cache";

var now = Date.now,
	time,
	lru,
	memo,
	total,
	index = 3000,
	count = 10,
	i,
	lruMax = 1000,
	data = {},
	lruObj;

async function getFib(memoize, opts) {
	const fib = await memoize(function (x) {
		return x < 2 ? 1 : fib(x - 1) + fib(x - 2);
	}, opts);
	return fib;
}

lru = function (x) {
	var value = lruObj.get(x);
	if (value === undefined) {
		value = x < 2 ? 1 : lru(x - 1) + lru(x - 2);
		lruObj.set(x, value);
	}
	return value;
};

console.log("Fibonacci", index, "x" + count + ":\n");

total = 0;
i = count;
memo = await getFib(memoizee);
while (i--) {
	time = now();
	memo(index);
	total += now() - time;
}
data["Memoizee (object mode)"] = total;

total = 0;
i = count;
memo = await getFib(memoizee, { primitive: true });
while (i--) {
	time = now();
	memo(index);
	total += now() - time;
}
data["Memoizee (primitive mode)"] = total;

total = 0;
i = count;
memo = await getFib(underscore);
while (i--) {
	time = now();
	memo(index);
	total += now() - time;
}
data.Underscore = total;

total = 0;
i = count;
memo = await getFib(lodash);
while (i--) {
	time = now();
	memo(index);
	total += now() - time;
}
data["Lo-dash"] = total;

total = 0;
i = count;
memo = await getFib(memoizee, { primitive: true, max: lruMax });
while (i--) {
	time = now();
	memo(index);
	total += now() - time;
}
data["Memoizee (primitive mode) LRU (max: 1000)"] = total;

total = 0;
i = count;
memo = await getFib(memoizee, { max: lruMax });
while (i--) {
	time = now();
	memo(index);
	total += now() - time;
}
data["Memoizee (object mode)    LRU (max: 1000)"] = total;

total = 0;
i = count;
lruObj = new lruCache.LRUCache({ max: lruMax });
while (i--) {
	time = now();
	lru(index);
	total += now() - time;
}
data["lru-cache                 LRU (max: 1000)"] = total;

total = 0;
i = count;
lruObj = new lruSecondaryCache(lruMax);
while (i--) {
	time = now();
	lru(index);
	total += now() - time;
}
data["secondary-cache           LRU (max: 1000)"] = total;

forEach(
	data,
	function (value, name, obj, currentIndex) {
		console.log(currentIndex + 1 + ":", pad.call(value, " ", 5) + "ms ", name);
	},
	function (a, b) {
		return this[a] - this[b];
	},
);
