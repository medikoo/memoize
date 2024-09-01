import normalizeOpts from "es5-ext/object/normalize-options.js";
import resolveLength from "./lib/resolve-length.mjs";
import { default as plain, registeredExtensions } from "./plain.mjs";

export default async function memoize(fn/*, options*/) {
	var options = normalizeOpts(arguments[1]), length;

	if (!options.normalizer) {
		length = options.length = resolveLength(options.length, fn.length, options.async);
		if (length !== 0) {
			if (options.primitive) {
				if (length === false) {
					options.normalizer = (await import("./normalizers/primitive.mjs")).default;
				} else if (length > 1) {
					options.normalizer = (
						await import("./normalizers/get-primitive-fixed.mjs")
					).default(length);
				}
			} else if (length === false)
				options.normalizer = (await import("./normalizers/get.mjs")).default();
			else if (length === 1)
				options.normalizer = (await import("./normalizers/get-1.mjs")).default();
			else options.normalizer = (await import("./normalizers/get-fixed.mjs")).default(length);
		}
	}

	// Assure extensions
	if (options.async) registeredExtensions.add("async");
	if (options.promise) registeredExtensions.add("promise");
	if (options.dispose) registeredExtensions.add("dispose");
	if (options.maxAge) registeredExtensions.add("maxAge");
	if (options.max) registeredExtensions.add("max");
	if (options.refCounter) registeredExtensions.add("refCounter");

	return plain(fn, options);
}
