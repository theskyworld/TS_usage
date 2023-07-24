import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
// import store from "./Vuex4SourceCode/examples/multiModule";
import { store } from "./vuex4Demo/store";

createApp(App).use(store).mount("#app");
