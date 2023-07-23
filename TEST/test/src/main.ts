import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import store from "./Vuex4SourceCode/examples/multiModule";

createApp(App).use(store).mount("#app");
