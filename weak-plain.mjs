import memoize from "./plain.mjs";
import weak from "./weak.mjs";

const weakPlainMemoize = weak(memoize);
export default weakPlainMemoize;
