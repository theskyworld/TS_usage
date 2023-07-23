import { Module } from "../../../../src";
import { RootState } from "../../rootState";
import { state, FoodStateListState } from "./state";
import { Types } from "./type";
import foodRec from "./serverData";

export const foodModule: Module<FoodStateListState, RootState> = {
  namespaced: true,
  state,
  getters: {
    getFoodList(state) {
      return state.foodInfoList;
    },
  },
  mutations: {
    [Types.FindFoodList](state, allfood) {
      state.foodInfoList = allfood;
    },
  },
  actions: {
    [Types.FindFoodList]({ commit }) {
      setTimeout(() => {
        commit(Types.FindFoodList, foodRec);
      });
    },
  },
};
