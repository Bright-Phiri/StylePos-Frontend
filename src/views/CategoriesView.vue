<template>
  <div class="CategoriesView">
    <v-container class="py-4 px-1" fluid>
      <v-row>
        <v-col cols="12">
          <v-dialog max-width="570" v-model="dialog" persistent transition="fab-transition">
            <v-card>
              <v-card-title class="d-flex justify-space-between">
                Add New Category
                <v-icon v-on:click="dialog = false">mdi-close</v-icon>
              </v-card-title>
              <v-card-text>
                <v-form ref="addCategoryForm">
                  <v-text-field v-model="category.name" label="Name"></v-text-field>
                  <v-text-field v-model="category.description" label="Description"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions class="d-flex justify-end">
                <v-btn class="text-capitalize mb-3" elevation="2" outlined v-on:click="dialog = !dialog">Cancel</v-btn>
                <v-btn class="text-capitalize mb-3" :loading="saveCategoryLoading ? '#B55B68' : null" elevation="2" outlined
                  color="#B55B68" v-on:click="saveCategory">Save Category</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog max-width="570" v-model="editdialog" persistent transition="fab-transition">
            <v-card>
              <v-card-title class="d-flex justify-space-between">
                Edit Category
                <v-icon v-on:click="editdialog = false">mdi-close</v-icon>
              </v-card-title>
              <v-card-text>
                <v-form ref="editCategoryForm">
                  <v-text-field v-model="category.name" label="Name"></v-text-field>
                  <v-text-field v-model="category.description" label="Description"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions class="d-flex justify-end">
                <v-btn class="text-capitalize mb-3" elevation="2" outlined
                  v-on:click="editdialog = !editdialog">Cancel</v-btn>
                <v-btn class="text-capitalize mb-3" :loading="updateCategoryloading" elevation="2" outlined
                  color="#B55B68" v-on:click="updateCategory">Update Category</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <div class="d-flex justify-space-between">
            <h1 class="font-weight-regular">Categories</h1>
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
            <v-text-field color="#B55B68" v-model.trim="search" dense rounded outlined placeholder="Search"
              class="shrink ml-2" append-icon="mdi-magnify"></v-text-field>
          </div>

          <v-card>
            <v-data-table :loading="loading" v-model="selected" loading-text="Loading Categories... Please wait"
              :headers="headers" :items-per-page="itemsPerPage"
              :items="categories" show-select :search="search" :sort-desc="[false, true]"
              multi-sort>
              <template v-slot:[`item.items_count`]="{ item }">
                {{item.items_count === null ? 0 : item.items_count }}
              </template>
              <template v-slot:[`item.action`]="{ item }">
                <v-icon small class="mr-0" v-on:click="showEditCategoryDialog(item.id)" color="blue">mdi-pencil
                </v-icon>
                <v-icon small class="mr-0" color="#2A9B90" v-on:click="showCategoryItems(item.id)">mdi-eye
                </v-icon>
                <v-icon small class="mr-0" color="red" v-on:click="deleteCategory(item.id)">mdi-delete</v-icon>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import CategoryService from '../services/CategoryService'
import jsPDF from 'jspdf';
import 'jspdf-autotable'
export default {
  name: "CategoriesView",
  data() {
    return {
      heading: 'Categories',
      dialog: false,
      editdialog: false,
      searchTimeout: null, // Initialize searchTimeout variable as null
      loading: false,
      saveCategoryLoading: false,
      updateCategoryloading: false,
      itemsPerPage: 7,
      search: '',
      categories: [],
      selected: [],
      category_id: null,
      category: {
        name: null,
        description: null,
      },
      errors: [],
      headers: [
        {
          text: 'Id',
          align: 'start',
          sortable: false,
          value: 'id',
        },
        { text: 'Name', value: 'name' },
        { text: 'Description', value: 'description' },
        { text: 'Items Count', value: 'items_count' },
        { text: 'Action', value: 'action' },
      ],
    }
  },
  methods: {
    async fetchDataFromAPI() {
      this.loading = true
      try {
        const response = await CategoryService.getData()
        this.categories = response.data;
        this.loading = false
      }
      catch (error) {
        this.loading = false
        this.handleError(error)
      }
    },
    async saveCategory() {
      const requiredFields = ['name', 'description'];

      if (requiredFields.some(field => !this.category[field])) {
        await this.$swal('Fields Validation', 'Please fill in all required fields', 'warning');
        return;
      }

      try {
        this.saveCategoryLoading = true;
        const categoryPayload = {
          name: this.category.name,
          description: this.category.description
        };
        const response = await CategoryService.create(categoryPayload);
        if (response.status === 201) {
          this.$swal('Information', 'Category saved successfully', 'success').then(()=>{
            this.$refs.addCategoryForm.reset();
            this.dialog = false;
            this.fetchDataFromAPI();
          })
        }
      } catch (error) {
        this.handleError(error);
      } finally {
        this.saveItemLoading = false;
      }
    },
    async showEditCategoryDialog(category_id) {
      this.editdialog = true
      this.category_id = category_id
      try {
        const response = await CategoryService.show(category_id)
        this.category = response.data
      } catch (error) {
        this.handleError(error)
      }
    },
    showCategoryItems(category_id){
      this.$router.push({ name: 'items', params: { category_id } })
    },
    async updateCategory() {
      const requiredFields = ['name'];

      if (requiredFields.some(field => !this.category[field])) {
        await this.$swal('Fields Validation', 'Please fill in all required fields', 'warning');
        return;
      }
      this.updateCategoryloading = true;
      try {
        const categoryPayload = {
          name: this.category.name,
          description: this.category.description
        };

        const response = await CategoryService.put(categoryPayload, this.category_id);

        if (response.status === 200) {
          this.$swal('Information', 'Category updated successfully', 'success').then(() => {
            this.$refs.editCategoryForm.reset();
            this.updateCategoryloading = false;
            this.editdialog = false;
            this.fetchDataFromAPI()
          })
        }
      } catch (error) {
        this.handleError(error);
      }
    },
    async deleteCategory(category_id) {
      try {
        const response = await CategoryService.delete(category_id);
        if (response.status === 204) {
          this.$swal('Information', 'Category deleted successfully', 'success').then(() => {
            this.fetchDataFromAPI()
          })
        }
      }
      catch (error) {
        this.handleError(error)
      }
    },
    exportToPdf() {
      let items = [];
      if (this.categories.length == 0) {
        this.$swal("Infor", "Records not found", "info");
      } else {
        if (this.selected.length == 0) {
          items = this.categories
        } else {
          items = this.selected
        }
        const columns = [
          { title: "Name", dataKey: "name" },
          { title: "Description", dataKey: "description" },
          { title: "Items Count", dataKey: "items_count" },
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
    this.fetchDataFromAPI()
  }
};
</script>
