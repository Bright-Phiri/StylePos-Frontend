<template>
  <div class="ItemsView">
    <v-container class="py-4 px-1" fluid>
      <v-row>
        <v-col cols="12">
          <div class="d-flex justify-space-between">
            <h1 class="font-weight-regular">Settings</h1>
          </div>
          <v-card shaped class="elevation-1" height="530">
            <v-card-text>
              <v-container fluid>
                <v-tabs>
                  <v-tab color="primary">
                    <v-icon left> mdi-account </v-icon>
                    User Info
                  </v-tab>
                  <v-tab>
                    <v-icon left> mdi-cogs </v-icon>
                    TAX RATE
                  </v-tab>
                  <v-tab>
                    <v-icon left> mdi-lock </v-icon>
                    Security
                  </v-tab>
                  <v-tab-item>
                    <v-card flat>
                      <v-card-title class="font-weight-light">
                        Update User Info
                      </v-card-title>
                      <v-card-text>
                        <v-form v-on:submit.prevent="updateUser">
                          <v-row dense>
                            <v-col cols="12" xl="5" lg="6" sm="7" md="7">
                              <v-text-field
                                v-model.trim="user.first_name"
                                label="First Name"
                                dense
                                prepend-icon="mdi-account"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col cols="12" xl="5" lg="6" sm="7" md="7">
                              <v-text-field
                                v-model.trim="user.last_name"
                                label="Last Name"
                                dense
                                prepend-icon="mdi-account"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col cols="12" xl="5" lg="6" sm="7" md="7">
                              <v-text-field
                                v-model.trim="user.user_name"
                                label="Username"
                                dense
                                prepend-icon="mdi-account"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col cols="12" xl="5" lg="6" sm="7" md="7">
                              <v-text-field
                                type="email"
                                v-model.trim="user.email"
                                label="Email"
                                dense
                                prepend-icon="mdi-mail"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col cols="12" xl="5" lg="6" sm="7" md="7">
                              <v-text-field
                                v-model.trim="user.phone_number"
                                label="Phone"
                                dense
                                prepend-icon="mdi-phone"
                              >
                              </v-text-field>
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col cols="12" xl="5" lg="6" sm="7" md="7">
                              <v-text-field
                                type="password"
                                v-model.trim="user.password"
                                label="Enter password"
                                dense
                                prepend-icon="mdi-lock"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-btn
                            class="text-capitalize"
                            elevation="2"
                            outlined
                            v-on:click="cancelUserUpdate"
                            >Cancel</v-btn
                          >
                          <v-btn
                            type="submit"
                            elevation="2"
                            color="#B55B68"
                            :loading="loading"
                            outlined
                            class="text-capitalize ml-2"
                            >Save</v-btn
                          >
                        </v-form>
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                  <v-tab-item>
                    <v-card flat>
                      <v-card-title class="font-weight-light">
                        Add New
                      </v-card-title>
                      <v-card-text>
                        <v-form>
                          <v-row dense>
                            <v-col cols="12" xl="5" lg="6" sm="7" md="7">
                              <v-text-field
                                v-model.trim="taxRate.name"
                                label="TAX Name"
                                dense
                              ></v-text-field>
                              <v-text-field
                                v-model.trim="taxRate.rate"
                                label="TAX Rate"
                                dense
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          
                          <v-btn
                            class="text-capitalize"
                            elevation="2"
                            outlined
                            v-on:click="cancelConfigUpdate"
                            >Cancel</v-btn
                          >
                          <v-btn v-if="taxRates.length == 0"
                            elevation="2"
                            v-on:click="saveConfig"
                            color="#B55B68"
                            :loading="loading"
                            outlined
                            class="text-capitalize ml-2"
                            >Save</v-btn
                          >
                          <v-btn v-if="taxRates.length > 0"
                            elevation="2"
                            v-on:click="updateConfig"
                            color="#B55B68"
                            :loading="loading"
                            outlined
                            class="text-capitalize ml-2"
                            >Update</v-btn
                          >
                        </v-form>
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                  <v-tab-item>
                    <v-card flat>
                      <v-card-title class="font-weight-light">
                        Change Password
                      </v-card-title>
                      <v-card-text>
                        <v-form
                          ref="passwordForm"
                          v-on:submit.prevent="updatePassword"
                        >
                          <v-row dense>
                            <v-col cols="12" xl="5" lg="6" sm="7" md="7">
                              <v-text-field
                                color="#B55B68"
                                type="password"
                                v-model.trim="user.oldPassword"
                                label="Enter old password"
                                dense
                                prepend-icon="mdi-lock"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col cols="12" xl="5" lg="6" sm="7" md="7">
                              <v-text-field
                                color="#B55B68"
                                type="password"
                                v-model.trim="user.password"
                                label="New password"
                                dense
                                prepend-icon="mdi-lock"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row dense>
                            <v-col cols="12" xl="5" lg="6" sm="7" md="7">
                              <v-text-field
                                color="#B55B68"
                                type="password"
                                v-model.trim="user.password_confirmation"
                                label="Confirm new password"
                                dense
                                prepend-icon="mdi-lock"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-btn
                            class="text-capitalize"
                            elevation="2"
                            outlined
                            v-on:click="cancelPasswordUpdate"
                            >Cancel</v-btn
                          >
                          <v-btn
                            type="submit"
                            elevation="2"
                            color="#B55B68"
                            :loading="loading ? '#B55B68' : null"
                            outlined
                            class="text-capitalize ml-2"
                            >Save</v-btn
                          >
                        </v-form>
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                </v-tabs>
              </v-container>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import EmployeesService from "@/services/EmployeesService";
import AuthService from "../services/AuthService";
import TaxRateService from "@/services/TaxRateService";
export default {
  name: "SettingsView",
  data() {
    return {
      loading: false,
      user: {
        first_name: null,
        last_name: null,
        user_name: null,
        email: null,
        phone_number: null,
        oldPassword: null,
        password: null,
        password_confirmation: null,
      },
      taxRate: {
        id: null,
        rate: null,
        name: null
      },
      taxRates: [],
      errors: [],
    };
  },
  methods: {
    cancelPasswordUpdate() {
      this.$refs.passwordForm.reset();
    },
    cancelUserUpdate() {
      this.user.password = null;
      this.fetchLoggedUserFromAPI();
    },
    async fetchLoggedUserFromAPI() {
      try {
        const loggedUser = this.$store.state.user;
        const response = await EmployeesService.show(loggedUser.id);
        this.user = response.data;
      } catch (error) {
        this.handleError(error);
      }
    },
    cancelConfigUpdate(){
      this.taxRate.rate = null;
      this.taxRate.name = null;
      this.fetchTaxRatessFromAPI();
    },
    async saveConfig(){
      if (!this.taxRate.rate || !this.taxRate.name){
        this.$swal("Fields Validations", "Please enter all required fields", "warning")
        return;
      }
      try {
          let taxRatePayload = {
            name: this.taxRate.name,
            rate: this.taxRate.rate
          };
          const response = await TaxRateService.create(
            taxRatePayload,
          );
          if (response.status === 201) {
            this.loading = false;
            this.$swal("Message", "Tax rate added successfully", "success").then(() => {
              this.fetchTaxRatessFromAPI();
            });
          }
        } catch (error) {
          this.loading = false;
          this.handleError(error);
        }
    },
    async updateConfig(){
      if (!this.taxRate.rate || !this.taxRate.name){
        this.$swal("Fields Validations", "Please enter all required fields", "warning")
        return;
      }
      try {
          let taxRatePayload = {
            rate: this.taxRate.rate,
            name: this.taxRate.name
          };
          const response = await TaxRateService.put(
            taxRatePayload, this.taxRate.id
          );
          if (response.status === 200) {
            this.loading = false;
            this.$swal("Message", "Tax rate updated successfully", "success").then(() => {
              this.fetchTaxRatessFromAPI();
            });
          }
        } catch (error) {
          this.loading = false;
          this.handleError(error);
        }
    },
    async fetchTaxRatessFromAPI() {
      try {
        const response = await TaxRateService.getData();
        this.taxRates = response.data;
        if (this.taxRates && this.taxRates.length > 0) {
          this.taxRate = this.taxRates[0];
        }
      } catch (error) {
        this.handleError(error);
      }
    },
    async updateUser() {
      if (
        !this.user.first_name ||
        !this.user.last_name ||
        !this.user.user_name ||
        !this.user.email ||
        !this.user.phone_number ||
        !this.user.password
      ) {
        this.$swal("Fields Validation", "Please fill in all required fields", "warning");
        return;
      }
      let old_password = this.$store.state.temp_pass;
      if (old_password === this.user.password) {
        let employeePayload = {
          employee: {
            first_name: this.user.first_name,
            last_name: this.user.last_name,
            user_name: this.user.user_name,
            job_title: "Store Manager",
            phone_number: this.user.phone_number,
            email: this.user.email,
            password: this.user.password,
            password_confirmation: this.user.password,
          }
        };
        try {
          this.loading = true;
          const loggedUser = this.$store.state.user;
          const response = await EmployeesService.put(
            employeePayload,
            loggedUser.id
          );
          if (response.status === 200) {
            this.loading = false;
            this.$swal(
              "Information",
              "User successfully updated",
              "success"
            ).then(() => {
              this.user.password = null;
              let updatedUser = response.data;
              this.$store.commit("setUser", updatedUser);
            });
          }
        } catch (error) {
          this.loading = false;
          this.handleError(error);
        }
      } else {
        this.$swal("Error", "Password is incorrect", "error");
      }
    },
    async updatePassword() {
      const { oldPassword, password, password_confirmation } = this.user;
      if (!oldPassword || !password || !password_confirmation) {
        await this.$swal(
          "Fields validation",
          "Please fill in all required fields",
          "warning"
        );
        return;
      }
      let old_password = this.$store.state.temp_pass;
      if (old_password === this.user.oldPassword) {
        this.loading = true;
        try {
          const loggedUser = this.$store.state.user;
          let userPayload = {
            user: {
              password: password,
              password_confirmation: password_confirmation
            }
          };
          const response = await AuthService.updatePassword(
            userPayload,
            loggedUser.id
          );
          if (response.status === 200) {
            this.loading = false;
            this.$swal("Message", response.data.message, "success").then(() => {
              this.$refs.passwordForm.reset();
            });
          }
        } catch (error) {
          this.loading = false;
          this.handleError(error);
        }
      } else {
        this.$swal("Error", "Old password is incorrect", "error");
      }
    },
  },
  mounted() {
    this.fetchLoggedUserFromAPI();
    this.fetchTaxRatessFromAPI();
  },
};
</script>
