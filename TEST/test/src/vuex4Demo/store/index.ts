import { createStore, Store } from "vuex";
export enum StoreTypes {
  INCREMENT = "increment",
  INCREMENTASYNC = "incrementAsync",
}

export const store = createStore({
  state() {
    return {
      todos: [
        { id: 1, text: "text1", done: false },
        { id: 2, text: "text2", done: true },
      ],
      count: 1,
    };
  },
  // 创建getters
  getters: {
    countGetter(state) {
      return state.count * 10;
    },
    doneTodos(state) {
      return state.todos.filter((todo) => todo.done);
    },
    // 在getters内部访问getter
    doneTodosLength(state, getters) {
      return getters.doneTodos.length;
    },
    // 返回一个函数，在组件中调用
    // 实现通过传入id来返回对应的todo
    getTodoById(state) {
      return (id: number) => {
        return state.todos.find((todo) => todo.id === id);
      };
    },
  },
  // mutations: {
  //   // increment(state, n) {
  //   //   state.count += n;
  //   // },
  //   increment(state, payload) {
  //     console.log('increment...')
  //     state.count += payload.n;
  //   },
  // },
  mutations: {
    [StoreTypes.INCREMENT](state, payload) {
      state.count += payload.n;
    },
  },
  actions: {
    // [StoreTypes.INCREMENT](context) {
    //   // 获取state和getters
    //   console.log(context.state.count);
    //   console.log(context.getters.countGetter);
    //   // commit mutation
    //   context.commit(StoreTypes.INCREMENT);
    // },
    // [StoreTypes.INCREMENT]({ commit }, payload) {
    //   // commit(StoreTypes.INCREMENT);
    //   commit({
    //     type: StoreTypes.INCREMENT,
    //     n :10,
    //   });
    // },

    // }
    [StoreTypes.INCREMENTASYNC]({ commit }, payload) {
      // 返回一个promise
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          commit(StoreTypes.INCREMENT, payload);
          // 成功，则传递success value
          resolve("success value");
        }, payload.timeout);
      });
    },

    anotherAction({ dispatch, commit }, payload) {
      return dispatch(StoreTypes.INCREMENTASYNC, payload).then((value) => {
        commit("");
        console.log(value); // 'success value'
      })
    }
  },
});
