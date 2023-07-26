<template>
  <div>
    <button @click="clickFn()">+</button>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { store } from "./store/index2.ts";
export default {
  setup() {
    return {};
  },
  computed: mapState({}),
  methods: {
    clickFn() {
      store.dispatch("action1");
    },
  },
};
</script>
<style scoped></style>
