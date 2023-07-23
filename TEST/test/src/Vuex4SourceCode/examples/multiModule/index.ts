import { createStore } from "../../src";
import { foodSortModule } from "./foodSortModule";
import { hotelSortModule } from "./hotelSortModule";
import { RootState } from "./rootState";

export default createStore<RootState>({
  state: {
    navList: [10, 30, 40],
  },
  modules: {
    foodSortModule: foodSortModule,
    hotelSortModule: hotelSortModule,
  },
});
