<template>
  <div class="FogotPassword">
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
            <v-card-subtitle class="mt-1">Please enter your email address. You will receive a link to crate a new password via email.</v-card-subtitle>
            <v-card-text>
              <v-form v-on:submit.prevent="forgotPassword">
                <v-text-field label="Email Address" color="#B55B68" outlined dense v-model.trim="user.email"></v-text-field>
                <v-btn type="submit" :loading="loading ? '#B55B68' : null" dark depressed class="text-capitalize font-weight-light mb-2" outlined
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
  name: 'FogotPassword',
  data() {
    return {
      loading: false,
      user: {
        email: null,
      },
    }
  },
  methods: {
    async forgotPassword() {
      if (!this.user.email) {
        await this.$swal("Fields validation", "Please enter your email", "warning")
        return
      }
      let userPayload = {
        user: {
          email: this.user.email
        }
      }
      this.loading = true
      try {
        const response = await AuthService.forgotPassword(userPayload)
        if (response.status === 200) {
          this.loading = false
          this.$swal('Information', response.data.message, 'success').then(() => {
            this.$router.push({path: '/reset'})
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