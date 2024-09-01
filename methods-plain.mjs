import memoize from "./index.mjs";
import methods from "./methods.mjs";

const methodsPlainMemoize = methods(memoize);
export default methodsPlainMemoize;
