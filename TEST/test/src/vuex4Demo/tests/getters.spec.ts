import { getters } from "../store/module1";

const { filteredProducts } = getters;
describe("getters", () => {
    it("filteredProducts", () => {
        // 模拟state
        const state = {
          products: [
            { id: 1, title: "Apple", category: "fruit" },
            { id: 2, title: "Orange", category: "fruit" },
            { id: 3, title: "Carrot", category: "vegetable" },
          ],
        };
        const filterCategory = "fruit";
        
        // 测试结果
        const result = filteredProducts(state, { filterCategory });

        // 断言结果
        expect(result).toEqual([
          { id: 1, title: "Apple", category: "fruit" },
          { id: 2, title: "Orange", category: "fruit" },
        ]);
    });
})