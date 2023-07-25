import { createStore } from "vuex";
import module1 from "./module1";
import module2 from "./module2";

export const store = createStore({
  modules: {
    module1,
    module2,
  },
});
