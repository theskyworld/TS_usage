<script setup lang="ts">
import { useStore } from "./Vuex4SourceCode/src";
import foodSortModuleGetters from "./Vuex4SourceCode/examples/multiModule/foodSortModule/gettersAutoInfer";
import { computed, onMounted } from "vue";
import { RootState } from "./Vuex4SourceCode/examples/multiModule/rootState";
const store = useStore<RootState>();

// 测试mutations,添加新数据
// store.commit("foodSortModule/FindFoodSortList", {
//   1: { id: 1, type: "新数据" },
// });

// 测试actions
onMounted(() => {
  store._dispatch("foodSortModule/FindFoodSortList");
});

const foodSortList = computed(() => {
  return foodSortModuleGetters["foodSortModule/getFoodSortList"];
});
// console.log("🚀 ~ file: App.vue:4 ~ store.getters:", store.getters);
// 打印输出指定的getter执行后的结果
// console.log("🚀 ~ file: App.vue:4 ~ store.getters:", store.getters["foodSortModule/getFoodSort"]);
// 使用自动推导
// console.log(
//   "🚀 ~ file: App.vue:4 ~ store.getters:",
//   foodSortModuleGetters["foodSortModule/getFoodSortList"]
// );
</script>

<template>
  <div>
    美食分类
    <!-- {{ store.test() }} -->
    {{ foodSortList }}
  </div>
</template>

<style scoped></style>
