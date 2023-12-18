<template>
  <div class="ItemsView">
    <v-container class="py-8 px-6" fluid>
      <v-row>
        <v-col cols="12">
          <v-dialog max-width="800" v-model="dialog" persistent transition="fab-transition">
            <v-card>
              <v-card-title class="d-flex justify-space-between">
                Add New User
                <v-icon v-on:click="cancelAdd">mdi-close</v-icon>
              </v-card-title>
              <v-card-text>
                <v-form ref="addEmployeeForm">
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="employee.first_name" label="First Name"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="employee.last_name" label="Last Name"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="employee.user_name" label="Username"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-autocomplete label="Role" :items="job_titles" v-model="employee.job_title">
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="employee.email" label="Email"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="employee.phone_number" label="Phone Number"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field type="password" label="Password" v-model="employee.password">
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field type="password" label="Confirm Password"
                        v-model="employee.password_confirmation">
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions class="d-flex justify-end">
                <v-btn class="text-capitalize mb-3" elevation="2" outlined v-on:click="cancelAdd">Cancel</v-btn>
                <v-btn class="text-capitalize mb-3" elevation="2" color="#B55B68"
                  :loading="saveEmployeeLoading" outlined v-on:click="saveEmployee">Save
                  User</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog max-width="800" v-model="editDialog" persistent transition="fab-transition">
            <v-card>
              <v-card-title class="d-flex justify-space-between">
                Edit User
                <v-icon v-on:click="cancelUpdate">mdi-close</v-icon>
              </v-card-title>
              <v-card-text>
                <v-form ref="editEmployeeForm">
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="employee.first_name" label="First Name"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="employee.last_name" label="Last Name"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="employee.user_name" label="Username"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-autocomplete label="Role" :items="job_titles" v-model="employee.job_title">
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="employee.email" label="Email"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field  v-model="employee.phone_number" label="Phone Number"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field type="password" label="Password" v-model="employee.password">
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field type="password" color="#B55B68" label="Confirm Password"
                        v-model="employee.password_confirmation">
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions class="d-flex justify-end">
                <v-btn class="text-capitalize mb-3" elevation="2" outlined
                  v-on:click="cancelUpdate">Cancel</v-btn>
                <v-btn class="text-capitalize mb-3" :loading="saveEmployeeLoading" elevation="2"
                  outlined color="#B55B68" v-on:click="updateEmployee">Update User</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <div class="d-flex justify-space-between">
            <h1 class="font-weight-regular">Users</h1>
            <v-btn color="#B55B68" depressed class="mt-2" fab x-small v-on:click="dialog = !dialog">
              <v-icon color="#fff">mdi-plus</v-icon>
            </v-btn>
          </div>
          <div class="d-flex justify-end">
            <v-btn class="ma-2 text-capitalize font-weight-regular" v-on:click="exportToPdf" plain color="#B55B68">
              <v-icon left dark color="#B55B68">
                mdi-file-export-outline
              </v-icon>
              Export all
            </v-btn>
            <v-btn color="#FFCDD2" class="mt-2" fab depressed x-small v-on:click="fetchDataFromAPI">
              <v-icon color="#E57373">mdi-cached</v-icon>
            </v-btn>
            <v-text-field color="#B55B68" v-model="search" dense rounded outlined placeholder="Search" class="shrink ml-2"
              append-icon="mdi-magnify"></v-text-field>
          </div>

          <v-card>
            <v-data-table :loading="loading" v-model="selected" loading-text="Loading Items... Please wait"
              :headers="headers" :items="employees" :items-per-page="6" show-select :search="search"
              :sort-desc="[false, true]" multi-sort>
              <template v-slot:[`item.action`]="{ item }">
                <v-icon small class="mr-0" v-on:click="showEditEmployeeDialog(item.id)" color="blue">mdi-pencil
                </v-icon>
                <v-tooltip bottom v-if="item.status === 'disabled'">
                 <template v-slot:activator="{ on, attrs }">
                  <v-icon small class="mr-0" color="green" v-on:click="activateEmployee(item.id)" v-bind="attrs" v-on="on">mdi-account-off</v-icon>
                 </template>
                  <span>Activate</span>
                </v-tooltip>
                <v-tooltip bottom v-if="item.status === 'active'">
                 <template v-slot:activator="{ on, attrs }">
                  <v-icon small class="mr-0" color="red" v-on:click="disableEmployee(item.id)" v-bind="attrs" v-on="on">mdi-account-lock</v-icon>
                 </template>
                  <span>Disable</span>
                </v-tooltip>
              </template>
               <template v-slot:[`item.status`]="{ item }">
                <v-chip class="text-center" small style="width: 65px" outlined :color="getColor(item.status)" dark>
                  {{item.status === 'active' ? "Active":"Inactive"}}
                </v-chip>
              </template>
              <template  v-slot:[`item.avatar`]="{ item }">
                <div class="d-flex align-center">
                  <v-avatar size="28" class="my-2">
                  <v-img :src="item.avatar"></v-img>
                  </v-avatar>
                  <div class="d-flex flex-column ms-2">
                  <a class="text-decoration-none font-weight-normal text-capitalize">{{item.username}}</a>
                   <small>@{{item.user_name}}</small>
                  </div>
                </div>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import EmployeesService from '@/services/EmployeesService';
import jsPDF from 'jspdf';
import 'jspdf-autotable'
export default {
  name: "EmployeesView",
  data() {
    return {
      dialog: false,
      editDialog: false,
      loading: false,
      heading: 'Users',
      saveEmployeeLoading: false,
      search: '',
      employees: [],
      selected: [],
      employee_id: null,
      job_titles: ['Cashier', 'Store Manager'],
      employee: {
        first_name: null,
        last_name: null,
        user_name: null,
        email: null,
        phone_number: null,
        job_title: null,
        password: null,
        password_confirmation: null,
      },
      errors: [],
      headers: [
        { 
          text: "User", 
          value: "avatar",
          sortable: false 
        },
        { text: 'First Name',  align: 'start', value: 'first_name' },
        { text: 'Last Name', value: 'last_name' },
        { text: 'Username', value: 'user_name' },
        { text: 'Email', value: 'email' },
        { text: 'Phone', value: 'phone_number' },
        { text: 'Role', value: 'job_title' },
        { text: 'Status', value: 'status' },
        { text: 'Action', value: 'action' },
      ],
    }
  },
  methods: {
    async fetchDataFromAPI() {
      this.loading = true
      try {
        const response = await EmployeesService.getData();
        this.employees = response.data
        this.loading = false
      } catch (error) {
        this.loading = false
        this.handleError(error);
      }
    },
    async saveEmployee() {
      if (!this.employee.first_name || !this.employee.last_name || !this.employee.user_name || !this.employee.email || !this.employee.phone_number || !this.employee.password || !this.employee.password_confirmation) {
        this.$swal('Fields Validation', 'Please fill in all required fields', 'warning');
        return;
      }
      this.saveEmployeeLoading = true
      let employeePayload = {
        employee: {
          first_name: this.employee.first_name,
          last_name: this.employee.last_name,
          user_name: this.employee.user_name,
          job_title: this.employee.job_title,
          phone_number: this.employee.phone_number,
          email: this.employee.email,
          password: this.employee.password,
          password_confirmation: this.employee.password_confirmation
        }
      };
      try {
        const response = await EmployeesService.create(employeePayload);
        if (response.status === 201) {
          this.saveEmployeeLoading = false
          this.$swal('Information', 'User successfully added', 'success').then(() => {
            this.dialog = false
            this.$refs.addEmployeeForm.reset()
            this.fetchDataFromAPI();
          })
        }
      }
      catch (error) {
        this.saveEmployeeLoading = false
        this.handleError(error)
      }
    },
    getColor(status) {
      if (status === 'active') return "success";
      else return "red";
    },
    async updateEmployee() {
      if (!this.employee.first_name || !this.employee.last_name || !this.employee.user_name || !this.employee.email || !this.employee.phone_number || !this.employee.password || !this.employee.password_confirmation) {
        this.$swal('Fields Validation', 'Please fill in all required fields', 'warning');
        return;
      }
      this.saveEmployeeLoading = true
      let employeePayload = {
        employee: {
        first_name: this.employee.first_name,
        last_name: this.employee.last_name,
        user_name: this.employee.user_name,
        job_title: this.employee.job_title,
        phone_number: this.employee.phone_number,
        email: this.employee.email,
        password: this.employee.password,
        password_confirmation: this.employee.password_confirmation
        }
      };
      try {
        const response = await EmployeesService.put(employeePayload, this.employee_id);
        if (response.status === 200) {
          this.saveEmployeeLoading = false
          this.$swal('Information', 'User successfully updated', 'success').then(() => {
            this.editDialog = false
            this.$refs.editEmployeeForm.reset()
            this.fetchDataFromAPI();
          })
        }
      } catch (error) {
        this.saveEmployeeLoading = false
        this.handleError(error)
      }
    },
    cancelAdd(){
      this.$refs.addEmployeeForm.reset()
      this.dialog = false;
    },
    cancelUpdate(){
      this.$refs.editEmployeeForm.reset()
      this.editDialog = false;
    },
    async showEditEmployeeDialog(employee_id) {
      this.employee_id = employee_id
      try {
        const response = await EmployeesService.show(employee_id);
        this.employee = response.data
        this.editDialog = true
      } catch (error) {
        this.handleError(error)
      }
    },
    async activateEmployee(employee_id) {
      try {
        const response = await EmployeesService.activate(employee_id);
        if (response.status === 200) {
          this.$swal('Information', 'User activated successfully', 'success').then(() => {
            this.fetchDataFromAPI();
          })
        }
      } catch (error) {
        this.handleError(error)
      }
    },
    async disableEmployee(employee_id) {
      try {
        const response = await EmployeesService.disable(employee_id);
        if (response.status === 200) {
          this.$swal('Information', 'User disabled successfully', 'success').then(() => {
            this.fetchDataFromAPI();
          })
        }
      } catch (error) {
        this.handleError(error)
      }
    },
    exportToPdf() {
      let items = [];
      if (this.employees.length == 0) {
        this.$swal("Infor", "Records not found", "info");
      } else {
        if (this.selected.length == 0) {
          items = this.employees
        } else {
          items = this.selected
        }
        const columns = [
          { title: "First Name", dataKey: "first_name" },
          { title: "Last Name", dataKey: "last_name" },
          { title: "Username", dataKey: "user_name" },
          { title: "Phone Number", dataKey: "phone_number" },
          { title: "Role", dataKey: "job_title" },
          { title: "Status", dataKey: "status" },
        ];
        const doc = new jsPDF({
          orientation: "portrait",
          unit: "in",
          format: "letter"
        });
        // Using autoTable plugin
        doc.autoTable({
          columns,
          body: items,
          //margin: { left: 0.5, top: 1.25 }
        });
        // Creating footer and saving file
        doc.save(`${this.heading}.pdf`);
      }
    },
  },
  mounted() {
    this.fetchDataFromAPI();
  }
};
</script>
