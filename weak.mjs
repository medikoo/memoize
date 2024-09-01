import memoize from "./index.mjs";
import weak from "./weak.mjs";

const weakMemoize = weak(memoize);
export default weakMemoize;
