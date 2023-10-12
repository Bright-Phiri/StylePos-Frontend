<template>
  <div class="SignUp">
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col class="col-xl-4 col-lg-4 col-sm-7 col-xs-5 col-md-5">
          <div class="d-flex justify-center">
            <v-avatar size="173">
              <v-img src="../assets/icon4.png"></v-img>
            </v-avatar>
          </div>
          <v-card>
            <v-card-title class="d-flex flex-column">
              <span class="font-weight-light title">LETS GET STARTED!</span>
              <span class="font-weight-light">Create account</span>
            </v-card-title>
            <v-card-text>
              <v-form @submit.prevent="signUp">
                <v-text-field label="Username" outlined v-model.trim="user.user_name"></v-text-field>
                <v-text-field label="Email Address" outlined v-model.trim="user.email"></v-text-field>
                <v-text-field label="Password" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"  @click:append="showPassword = !showPassword" outlined v-model.trim="user.password">
                </v-text-field>
                <v-text-field color="#B55B68" label="Confirm Password" :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showConfirmPassword ? 'text' : 'password'"  @click:append="showConfirmPassword = !showConfirmPassword" outlined v-model.trim="user.password_confirmation">
                </v-text-field>
                <v-btn type="submit" :loading="loading" dark depressed large block color="#B55B68">Sign up</v-btn>
                <v-divider class="my-4"></v-divider>
                <div class="text-center">
                  Already have acoount? <router-link class="titleC" to="/login">Login</router-link>
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import AuthService from '../services/AuthService'
export default {
  name: 'SignUp',
  data() {
    return {
      loading: false,
      showPassword: false,
      showConfirmPassword: false,
      user: {
        user_name: null,
        email: null,
        password: null,
        password_confirmation: null
      },
    }
  },
  methods: {
    async signUp() {
      const { user_name, email, password, password_confirmation } = this.user
      if (!user_name || !email || !password_confirmation || !password ) {
        await this.$swal("Fields validation", "Please fill in all required fields", "warning")
        return
      }
      this.loading = true
      try {
        const response = await AuthService.register({ employee: { user_name, email, password, password_confirmation} })
        if (response.status === 201) {
          this.loading = false
          this.$swal('Information', 'Account successfully created', 'success').then(() => {
            this.$router.push({name: 'login'})
          })
        }
      } catch (error) {
        this.loading = false
        this.handleError(error);
      }
    },
  }
}
</script>
<style scoped>
.titleC {
  color: #B55B68;
  text-decoration: none;
}
</style>