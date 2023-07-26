import { createStore, CustomVue } from "vuex";

interface State {
  count: number;
  name: string;
  age: number;
  activated: boolean;
}

export const store = createStore<State>({
  state() {
    return {
      count: 0,
      name: "Alice",
      age: 12,
      activated: false,
    };
  },
  getters: {
    duobleCount: (state) => state.count * 2,
    doubleAgePlusDoubleCount: (state, getters) =>
      state.age * 2 + getters.duobleCount,
  },
  mutations: {
    increment(state, payload) {
      state.count += payload.num;
    },
  },
  actions: {
    action1(context, payload) {
      setTimeout(() => {
        context.commit("increment", payload);
      }, payload.timeout);
    },
  },
});

import { mapState } from "vuex";
console.log(mapState);

