import toArray from "es5-ext/array/to-array.js";
import isValue from "es5-ext/object/is-value.js";
import callable from "es5-ext/object/valid-callable.js";

var slice = Array.prototype.slice, resolveArgs;

resolveArgs = function (args) {
	return this.map(function (resolve, i) { return resolve ? resolve(args[i]) : args[i]; }).concat(
		slice.call(args, this.length)
	);
};

export default function resolveResolve(resolvers) {
	resolvers = toArray(resolvers);
	resolvers.forEach(function (resolve) { if (isValue(resolve)) callable(resolve); });
	return resolveArgs.bind(resolvers);
}
