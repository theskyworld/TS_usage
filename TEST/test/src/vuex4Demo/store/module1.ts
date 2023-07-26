const state = () => {
  return {
    strs: ["hello", "text"],
    age: 12,
    count : 0,
  };
};
export const getters = {
  filteredProducts(state: any, { filterCategory }: { filterCategory  : any}) {
    return state.products.filter((product: any) => {
      return product.category === filterCategory;
    });
  },
};
export const mutations = {
  increment(state : any) {
    // state.age++;
    state.count++;
  },
};
const actions = {};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
