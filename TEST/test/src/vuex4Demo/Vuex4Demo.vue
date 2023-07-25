<template>
  <div>
    <p>{{ name }}</p>
    <p>{{ age1 }}</p>
    <p>{{ age2 }}</p>
    <button @click="clickFn()">+</button>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { store } from "./store";
export default {
  setup() {
    const name = computed(() => store.state.module2.name);
    const age1 = computed(() => store.state.module1.age);
    const age2 = computed(() => store.state.module2.age);
    console.dir(console.group)
    return {
      name,
      age1,
      age2,
    };
  },
  computed: mapState({}),
  methods: {
    clickFn() {
      // commit module1下的mutation，被调用的mutation的type值为increment
      store.commit('module1/increment');
    },
  },
};
</script>
<style scoped></style>
