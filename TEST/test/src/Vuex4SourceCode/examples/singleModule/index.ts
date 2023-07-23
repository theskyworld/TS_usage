import { createStore } from "../../src/index";

export default createStore({
  state: {
    navList: ["测试state", 1, "hello"],
  },
  getters: {
    getNavList(state) {
      return state.navList;
    },
  },
  mutations: {
    findNavList(state, navList) {
      return (state.navList = navList);
    },
  },
  actions: {
    getNavListFromAPI({ commit }) {
      // 模拟从后端获取数据
      setTimeout(() => {
        const navList = [1, 2, 3];
        commit("findNavList", navList);
      });
    },
  },
});
