import { mutations } from "../store/module1";

const { increment } = mutations;
describe("mutations", () => {
  it("increment", () => {
    const state = { count: 0 };
    increment(state);
    expect(state.count).toBe(1);
  });
});
