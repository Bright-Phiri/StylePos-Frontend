/* eslint-disable vue/multi-word-component-names */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import axios from "axios";
import VueAxios from "vue-axios";
import VueSweetalert2 from "vue-sweetalert2";
import VueApexCharts from "vue-apexcharts";
import handleError from "./mixins/handleError";
import "sweetalert2/dist/sweetalert2.min.css";
import VueToastify from "vue-toastify";
import ActionCableVue from "actioncable-vue";

Vue.mixin(handleError);
Vue.use(VueAxios, axios);
Vue.use(VueSweetalert2);
Vue.use(VueApexCharts);
Vue.use(VueToastify);
Vue.use(ActionCableVue, {
  debug: true,
  debugLevel: "error",
  connectionUrl: "ws://localhost:3000/cable",
  connectImmediately: false,
});

Vue.component("apexchart", VueApexCharts);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
