<template>
  <div>
    <p>{{ count }}</p>
    <button @click="clickFn()">+</button>
  </div>
</template>
<script>
import { StoreTypes } from "./store";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { ref } from "vue";
import { useStore } from "vuex";
import { store } from "./store";
export default {
  setup() {
    return {};
  },
  computed: mapState({
    count: "count",
  }),
  methods: {
    // 使用对象
    // ...mapMutations({
    //   // 将mutations中的increment()方法映射为add属性，在此处进行使用
    //   add : MutationsTypes.INCREMENT,
    // }),
    // 使用数组
    // 获取mutations中的increment()方法
    // ...mapMutations(["increment"]),
    ...mapActions(["incrementAsync"]),
    clickFn() {
      // this.add({ n: 10 });
      // this.increment({ n: 10 });
      // store.dispatch(StoreTypes.INCREMENT, {
      //   n : 10,
      // });
      // store.dispatch(StoreTypes.INCREMENTASYNC, {
      //   n: 10,
      //   timeout: 3000,
      // });

      // incrementAsync方法返回一个promise
      this.incrementAsync({
        n: 10,
        timeout: 1000,
      }).then((value) => {
        console.log("value : ", value); // 'value :  success value'
      });

      store.dispatch('anotherAction', {
        timeout : 1000,
      })
    },
  },
};
</script>
<style scoped></style>
