import { Module } from "../../../src";
import { RootState } from "../rootState";
import { HotelSortListState, state } from "./state";
import { Types } from "./type";
import hotelSortRec from "./serverData";

export const hotelSortModule: Module<HotelSortListState, RootState> = {
  namespaced: true,
  state,
  getters: {
    getHotelSortList(state) {
      return state.hotelInfoList;
    },
  },
  mutations: {
    [Types.FindHotelSortList](state, allHotelSort) {
      state.hotelInfoList = allHotelSort;
    },
  },
  actions: {
    [Types.FindHotelSortList]({ commit }) {
      setTimeout(() => {
        commit(Types.FindHotelSortList, hotelSortRec);
      }, 5);
    },
  },
};
