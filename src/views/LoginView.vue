<template>
  <div class="Login">
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="6" xs="12" md="4" lg="3">
          <div class="d-flex justify-center">
            <v-avatar size="173">
              <v-img src="../assets/icon4.png"></v-img>
            </v-avatar>
          </div>
          <v-card>
            <v-card-title>
              <span class="font-weight-light title">Login</span>
            </v-card-title>
            <v-card-text>
              <v-form @submit.prevent="login">
                <v-text-field color="#B55B68" label="Username" outlined v-model.trim="user.username"></v-text-field>
                <v-text-field color="#B55B68" label="Password" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"  @click:append="showPassword = !showPassword" outlined v-model.trim="user.password">
                </v-text-field>
                <v-btn type="submit" :loading="loading" dark depressed large block color="#B55B68">Sign in</v-btn>
                <v-divider class="my-4"></v-divider>
                <div class="text-center">
                  <router-link class="titleC" to="/signup">Sign up</router-link>
                </div>
              </v-form>
            </v-card-text>
          </v-card>
          <div class="text-center mt-1">
            <router-link class="titleC" to="/forgot">Forgot Password?</router-link>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import AuthService from '../services/AuthService'
export default {
  name: 'LoginView',
  data() {
    return {
      loading: false,
      showPassword: false,
      user: {
        username: null,
        password: null,
      },
    }
  },
  methods: {
    async login() {
      const { username, password } = this.user
      if (!username || !password) {
        await this.$swal("Fields validation", "Please fill in all required fields", "warning")
        return
      }
      this.loading = true
      try {
        const response = await AuthService.login({ user_name: username, password })
        if (response.status === 200) {
          const user = response.data.user
          this.loading = false
          this.$store.commit('setToken', response.data.token)
          this.$store.commit('setUser', user)
          this.$store.commit('setTempPass', this.user.password)
          this.switchUserPanel(user)
        }
      } catch (error) {
        this.loading = false
        this.handleError(error);
      }
    },
    switchUserPanel(user) {
      const jobTitle = user.job_title;
      switch (jobTitle) {
        case "Store Manager":
          this.$router.push({ path: '/' });
          break;
        case "Cashier":
          this.$router.push({ path: '/sales' });
          break;
        default:
          alert(`Invalid job title: ${jobTitle}`);
      }
    }
  }
}
</script>
<style scoped>
.titleC {
  color: #B55B68;
}
</style>