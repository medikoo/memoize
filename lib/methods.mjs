import forEach from "es5-ext/object/for-each.js";
import normalizeOpts from "es5-ext/object/normalize-options.js";
import callable from "es5-ext/object/valid-callable.js";
import lazy from "d/lazy.js";
import resolveLength from "./resolve-length.mjs";
import { async } from "./registered-extensions.mjs";

export default function methods(memoize) {
	return function (props) {
		forEach(props, function (desc) {
			var fn = callable(desc.value), length;
			desc.value = function (options) {
				if (options.getNormalizer) {
					options = normalizeOpts(options);
					if (length === undefined) {
						length = resolveLength(options.length, fn.length, options.async && async);
					}
					options.normalizer = options.getNormalizer(length);
					delete options.getNormalizer;
				}
				return memoize(fn.bind(this), options);
			};
		});
		return lazy(props);
	};
}
