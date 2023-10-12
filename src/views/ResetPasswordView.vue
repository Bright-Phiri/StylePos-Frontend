<template>
  <div class="ResetPassword">
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="6" xs="12" md="4" lg="4">
          <div class="d-flex justify-center">
            <v-avatar size="173">
              <v-img src="../assets/icon4.png"></v-img>
            </v-avatar>
          </div>
          <v-card>
            <v-card-title>
              <span class="font-weight-light">Reset Your Password</span>
            </v-card-title>
            <v-card-subtitle>Reset your password below</v-card-subtitle>
            <v-card-text>
              <v-form v-on:submit.prevent="resetPassword">
                <v-text-field color="#B55B68" label="Password Reset Token" type="text" outlined dense v-model.trim="user.token">
                </v-text-field>
                <v-text-field color="#B55B68" label="New Password" type="password" outlined dense v-model.trim="user.password">
                </v-text-field>
                <v-text-field color="#B55B68" label="Re-enter new password" type="password" outlined dense v-model.trim="user.password_confirmation">
                </v-text-field>
                <v-btn type="submit" block :loading="loading" dark outlined depressed class="text-capitalize font-weight-light mb-2"
                  color="#B55B68">Reset Password</v-btn>
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
  name: 'ResetPassword',
  data() {
    return {
      loading: false,
      user: {
        password: null,
        password_confirmation: null,
        token: null
      },
    }
  },
  methods: {
    async resetPassword() {
      if (!this.user.password || !this.user.password_confirmation || !this.user.token) {
        await this.$swal("Fields validation", "Please fill in all required fields", "warning")
        return
      }
      let userPayload = {
        user: {
          password: this.user.password,
          password_confirmation: this.user.password_confirmation,
          token: this.user.token
        }
      }
      this.loading = true
      try {
        const response = await AuthService.resetPassword(userPayload)
        if (response.status === 200) {
          this.loading = false
          this.$swal('Information', response.data.message, 'success').then(() => {
            this.$router.push({path: '/login'})
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
}
</style>