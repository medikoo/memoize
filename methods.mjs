import memoize from "./index.mjs";
import methods from "./methods.mjs";

const methodsMemoize = methods(memoize);
export default methodsMemoize;
