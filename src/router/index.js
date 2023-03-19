import Vue from "vue";
import VueRouter from "vue-router";
import Navbar from "@/components/NavBar.vue";
import store from '../store'

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Navbar,
    children: [
      {
        path: "",
        name: "dashboard",
        component: () => import("../views/DashboardView.vue"),
      },
      {
        path: "/items",
        name: "items",
        component: () => import("../views/ItemsView.vue"),
      },
      {
        path: "/inventory",
        name: "inventory",
        component: () => import("../views/InventoryView.vue"),
      },
      {
        path: "/orders",
        name: "orders",
        component: () => import("../views/OrdersView.vue"),
      },
      {
        path: "/employees",
        name: "employees",
        component: () => import("../views/EmployeesView.vue"),
      },
      {
        path: "/purchases",
        name: "purchases",
        component: () => import("../views/PurchasesView.vue"),
      },
      {
        path: "/order_summary",
        name: "order_summary",
        component: () => import("../views/OrderSummaryView.vue"),
      },
      {
        path: "/returns",
        name: "returns",
        component: () => import("../views/ReturnsView.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/LoginView.vue"),
  },
  {
    path: "/sales",
    name: "sales",
    component: () => import("../views/SalesView.vue"),
  },
  {
    path: "/logout",
    name: "logout",
    beforeEnter(to, from, next) {
      store.commit('setToken', null)
      store.commit('setUser', null)
      store.commit('setTempPass', null)
      next({ path: "/login" });
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.name !== 'login' && !store.state.isUserLoggedIn) next({ name: 'login' })
  else next()
})

export default router;
