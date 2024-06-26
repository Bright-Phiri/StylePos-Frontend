<template>
  <div name="NavBar">
    <nav>
      <v-navigation-drawer color="#FFFFFF" :width="282" v-model="drawer" :mini-variant.sync="mini" app>
        <v-sheet color="#FFFFFF" class="pa-4">
          <div class="d-flex justify-space-between">
            <v-avatar tile width="100%" class="mr-11">
              <v-img src="../assets/icon1.png"></v-img>
            </v-avatar>
            <v-btn icon large @click.stop="mini = !mini" class="d-none d-xl-flex d-none d-lg-flex d-xl-none">
              <v-icon color="#B55B68">mdi-chevron-left</v-icon>
            </v-btn>
          </div>
        </v-sheet>

        <v-list nav dense shaped>
          <v-list-item v-for="item in store_manager" :key="item.text" link router :to="item.route">
            <v-list-item-icon>
              <v-tooltip right class="d-lg-none d-xl-flex">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-bind="attrs" v-on="on">{{ item.icon }}</v-icon>
                </template>
                <span>{{ item.text }}</span>
              </v-tooltip>
            </v-list-item-icon>
            <v-list-item-content class="ListItemClass">
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-spacer></v-spacer>
        <v-divider class="mx-5"></v-divider>

        <v-list shaped nav dense>
          <v-list-item v-for="item in app" :key="item.text" link router :to="item.route">
            <v-list-item-icon>
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-bind="attrs" v-on="on">{{ item.icon }}</v-icon>
                </template>
                <span>{{ item.text }}</span>
              </v-tooltip>
            </v-list-item-icon>
            <v-list-item-content class="ListItemClass">
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      
      <v-app-bar app flat color="#F3F3F3">
        <v-toolbar-title>
          <v-app-bar-nav-icon color="#B55B68" x-large class="" v-on:click="drawer = !drawer">
          </v-app-bar-nav-icon>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-avatar color="F9F9F9" size="39"> <v-img src="../assets/avatar.png"></v-img> </v-avatar>
        <h4 class="ml-3 font-weight-bold">Welcome back, {{ user.user_name }}!</h4>
        <v-icon @click="logout" class="ml-2">mdi-exit-to-app</v-icon>
      </v-app-bar>

    </nav>
    <transition name="page" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  data() {
    return {
      drawer: null,
      mini: null,
      store_manager: [
        { text: "Dashboard", icon: "mdi-view-dashboard", route: "/" },
        { text: "Categories", icon: "mdi-shape-outline", route: "/categories" },
        { text: "Items", icon: "mdi-package", route: "/items" },
        { text: "Barcodes", icon: "mdi-barcode", route: "/barcodes" },
        { text: "Inventory", icon: "mdi-trending-up", route: "/inventory" },
        { text: "Receivings", icon: "mdi-dolly", route: "/receivings" },
        { text: "Sales", icon: "mdi-cash-multiple", route: "/orders" },
        { text: "Returns", icon: "mdi-undo", route: "/returns" },
        { text: "Refunds", icon: "mdi-cash-refund", route: "/refunds" },
      ],
      app: [
        { text: "Users", icon: "mdi-account-multiple", route: "/employees" },
        { text: "Settings", icon: "mdi-cog", route: "/settings" },
      ]
    }
  },
  methods: {
    logout(){
      this.$router.push({ path: '/logout' });
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
}
</script>

<style scoped>
.DivItemClass {
  color: #FFFEFE;
}

.v-navigation-drawer>>>.v-navigation-drawer__border {
  display: none
}

.v-navigation-drawer .v-list-item:hover .v-icon {
  color: #B55B68;
}

.v-navigation-drawer .v-list-item:hover .v-list-item__title {
  color: #B55B68;
}

.v-navigation-drawer .v-list-item.v-list-item--active .v-icon {
  color: #B55B68;
}

.v-navigation-drawer .v-list-item.v-list-item--active .v-list-item__title {
  color: #B55B68;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 1s, transform 1s;
}

.page-enter,
.page-leave-to {
  opacity: 0;
  transform: translateX(-2%);
}

.text-color {
  color: #f25039;
}
</style>