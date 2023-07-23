import { Module, ActionContext } from "../../../src";
import { RootState } from "../rootState";
import { foodModule } from "./foodSortSonModule";
import { FoodSortListState, state } from "./state";
import { Types } from "./type";
import foodSortRec from "./serverData";

export const foodSortModule: Module<FoodSortListState, RootState> = {
  namespaced: true,
  state,
  getters: {
    getFoodSortList(state) {
      return state.foodSortInfoList;
    },
    getFoodSort(state) {
      return state.foodSortInfoList;
    },
  },
  modules: {
    foodModule: foodModule,
  },
  mutations: {
    [Types.FindFoodSortList](state, allfood) {
      state.foodSortInfoList = allfood;
      console.log(
        "mutations:正在state.foodSortInfoList:",
        state.foodSortInfoList
      );
    },
  },
  actions: {
    [Types.FindFoodSortList]({
      // dispatch,
      commit,
    }: // state,
    ActionContext<FoodSortListState, RootState>) {
      setTimeout(() => {
        console.log("actions:setTimeOut...", foodSortRec);
        commit(Types.FindFoodSortList, foodSortRec);
      }, 5);
    },
  },
};
