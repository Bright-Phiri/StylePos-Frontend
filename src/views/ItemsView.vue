<template>
  <div class="ItemsView">
    <v-container class="py-8 px-6" fluid>
      <v-row>
        <v-col cols="12">
          <v-dialog max-width="570" v-model="dialog" persistent>
            <v-card>
              <v-card-title class="d-flex justify-space-between">
                Add New Item
                <v-icon v-on:click="dialog = false">mdi-close</v-icon>
              </v-card-title>
              <v-card-text>
                <v-form ref="addItemForm">
                  <v-text-field color="#B55B68" v-model="item.name" label="Name"></v-text-field>
                  <v-text-field color="#B55B68" v-model="item.price" label="Price (MWK)"></v-text-field>
                  <v-text-field color="#B55B68" v-model="item.size" label="Size"></v-text-field>
                  <v-text-field color="#B55B68" v-model="item.color" label="Color"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions class="d-flex justify-end">
                <v-btn class="text-capitalize mb-3" elevation="2" outlined v-on:click="dialog = !dialog">Cancel</v-btn>
                <v-btn class="text-capitalize mb-3" :loading="saveItemLoading ? '#B55B68' : null" elevation="2" outlined
                  color="#B55B68" v-on:click="saveItem">Save Item</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog max-width="570" v-model="editdialog" persistent>
            <v-card>
              <v-card-title class="d-flex justify-space-between">
                Edit Item
                <v-icon v-on:click="editdialog = false">mdi-close</v-icon>
              </v-card-title>
              <v-card-text>
                <v-form ref="editItemForm">
                  <v-text-field color="#B55B68" v-model="item.name" label="Name"></v-text-field>
                  <v-text-field color="#B55B68" v-model="item.price" label="Price (MWK)"></v-text-field>
                  <v-text-field color="#B55B68" v-model="item.size" label="Size"></v-text-field>
                  <v-text-field color="#B55B68" v-model="item.color" label="Color"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions class="d-flex justify-end">
                <v-btn class="text-capitalize mb-3" elevation="2" outlined
                  v-on:click="editdialog = !editdialog">Cancel</v-btn>
                <v-btn class="text-capitalize mb-3" :loading="updateItemloading ? '#B55B68' : null" elevation="2" outlined
                  color="#B55B68" v-on:click="updateItem">Update Item</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog max-width="570" v-model="inventoryLevelDialog" persistent>
            <v-card>
              <v-card-title class="d-flex justify-space-between">
                Add Inventory Level
                <v-icon v-on:click="inventoryLevelDialog = false">mdi-close</v-icon>
              </v-card-title>
              <v-card-text>
                <v-form ref="addInventoryLevelForm">
                  <v-text-field color="#B55B68" v-model="inventoryLevel.quantity" label="Quantity"></v-text-field>
                  <v-text-field color="#B55B68" v-model="inventoryLevel.reorder_level"
                    label="Reorder Level"></v-text-field>
                  <v-text-field color="#B55B68" v-model="inventoryLevel.supplier" label="Supplier"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions class="d-flex justify-end">
                <v-btn class="text-capitalize mb-3" elevation="2" outlined
                  v-on:click="inventoryLevelDialog = !inventoryLevelDialog">Cancel</v-btn>
                <v-btn class="text-capitalize mb-3" :loading="saveInventoryLoading ? '#B55B68' : null" elevation="2"
                  outlined color="#B55B68" v-on:click="addInventoryLevel">Add Inventory</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <div class="d-flex justify-space-between">
            <h1 class="font-weight-regular">Items</h1>
            <v-btn color="#B55B68" depressed class="mt-2" fab x-small v-on:click="dialog = !dialog">
              <v-icon color="#fff">mdi-plus</v-icon>
            </v-btn>
          </div>
          <div class="d-flex justify-end">
            <v-btn class="ma-2 text-capitalize font-weight-regular" plain color="#B55B68">
              <v-icon left dark color="#B55B68">
                mdi-file-export-outline
              </v-icon>
              Export all
            </v-btn>
            <v-btn color="#FFCDD2" class="mt-2" fab depressed x-small v-on:click="fetchDataFromAPI">
              <v-icon color="#E57373">mdi-cached</v-icon>
            </v-btn>
            <v-text-field color="#B55B68" v-model="search" @input="searchItem" dense rounded outlined placeholder="Search"
              class="shrink ml-2" append-icon="mdi-magnify"></v-text-field>
          </div>

          <v-card>
            <v-data-table :loading="loading ? '#B55B68' : null" loading-text="Loading Items... Please wait"
              :headers="headers" :server-items-length="total" :items-per-page="itemsPerPage" :page.sync="currentPage"
              @pagination="onPagination" :items="items" show-select :search="search" :sort-desc="[false, true]"
              multi-sort>
              <template v-slot:[`item.action`]="{ item }">
                <v-icon small class="mr-0" v-on:click="showEditItemDialog(item.id)" color="primary">mdi-pencil
                </v-icon>
                <v-icon small class="mr-0" color="#2A9B90" v-on:click="showInventoryLevelDialog(item.id)">mdi-plus-box
                </v-icon>
                <v-icon small class="mr-0" color="blue darken-2" v-on:click="generateAndPrintBarcode(item.barcode)">mdi-barcode</v-icon>
                <v-icon small class="mr-0" color="red" v-on:click="deleteItem(item.id)">mdi-delete</v-icon>
              </template>
              <template v-slot:[`item.price`]="{ item }">
                {{ formartValue(item.price) }}
              </template>
              <template v-slot:[`item.selling_price`]="{ item }">
                {{ formartValue(item.selling_price) }}
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import ItemsService from '../services/ItemsService'
import InventoryLevelService from '../services/InventoryLevelService'
import JsBarcode from 'jsbarcode';
import printJS from 'print-js';
export default {
  name: "ItemsView",
  data() {
    return {
      dialog: false,
      editdialog: false,
      searchTimeout: null, // Initialize searchTimeout variable as null
      inventoryLevelDialog: false,
      loading: false,
      saveItemLoading: false,
      saveInventoryLoading: false,
      updateItemloading: false,
      total: 0,
      currentPage: 1,
      itemsPerPage: 7,
      search: '',
      items: [],
      item_id: null,
      item: {
        name: null,
        price: null,
        size: null,
        color: null
      },
      inventoryLevel: {
        quantity: null,
        reorder_level: null,
        supplier: null,
      },
      errors: [],
      headers: [
        {
          text: 'Id',
          align: 'start',
          sortable: false,
          value: 'id',
        },
        { text: 'Barcode', value: 'barcode' },
        { text: 'Name', value: 'name' },
        { text: 'Pre VAT Price', value: 'price' },
        { text: 'Seling Price', value: 'selling_price' },
        { text: 'Size', value: 'size' },
        { text: 'Color', value: 'color' },
        { text: 'Stock Level', value: 'stock_level' },
        { text: 'Inventory Level', value: 'inventory_level' },
        { text: 'Action', value: 'action' },
      ],
    }
  },
  methods: {
    async fetchDataFromAPI(page, perPage, search) {
      this.loading = true
      try {
        const response = await ItemsService.getData(page, perPage, search)
        this.items = response.data.items;
        this.total = response.data.total;
        this.loading = false
      }
      catch (error) {
        this.loading = false
        this.handleError(error)
      }
    },
    searchItem() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.fetchDataFromAPI(this.currentPage, this.itemsPerPage, this.search);
      }, 500);
    },
    onPagination(page) {
      this.currentPage = Number(page.page);
      this.fetchDataFromAPI(this.currentPage, this.itemsPerPage, this.search);
    },
    async saveItem() {
      const requiredFields = ['name', 'price', 'size', 'color'];

      if (requiredFields.some(field => !this.item[field])) {
        await this.$swal('Fields Validation', 'Please fill in all required fields', 'error');
        return;
      }

      try {
        this.saveItemLoading = true;
        const itemPayload = {
          name: this.item.name,
          price: this.item.price,
          size: this.item.size,
          color: this.item.color
        };
        const response = await ItemsService.create(itemPayload);
        if (response.status === 201) {
          this.$swal('Information', 'Item saved successfully', 'success');
          this.$refs.addItemForm.reset();
          this.dialog = false;
          this.fetchDataFromAPI();
        }
      } catch (error) {
        this.handleError(error);
      } finally {
        this.saveItemLoading = false;
      }
    },
    async showEditItemDialog(item_id) {
      this.editdialog = true
      this.item_id = item_id
      try {
        const response = await ItemsService.show(item_id)
        this.item = response.data
      } catch (error) {
        this.handleError(error)
      }
    },
    formartValue(value) {
      return parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    async updateItem() {
      const requiredFields = ['name', 'price', 'size', 'color'];

      if (requiredFields.some(field => !this.item[field])) {
        await this.$swal('Fields Validation', 'Please fill in all required fields', 'error');
        return;
      }
      this.updateItemloading = true;
      try {
        const itemPayload = {
          name: this.item.name,
          price: this.item.price,
          size: this.item.size,
          color: this.item.color
        };

        const response = await ItemsService.put(itemPayload, this.item_id);

        if (response.status === 200) {
          this.$swal('Information', 'Item updated successfully', 'success').then(() => {
            this.$refs.editItemForm.reset();
            this.updateItemloading = false;
            this.editdialog = false;
            this.fetchDataFromAPI(this.currentPage, this.itemsPerPage, this.search)
          })
        }
      } catch (error) {
        this.handleError(error);
      }
    }
    ,
    async deleteItem(item_id) {
      try {
        const response = await ItemsService.delete(item_id);
        if (response.status === 204) {
          this.$swal('Information', 'Item deleted successfully', 'success').then(() => {
            this.fetchDataFromAPI(this.currentPage, this.itemsPerPage, this.search)
          })
        }
      }
      catch (error) {
        this.handleError(error)
      }
    },
    generateAndPrintBarcode(barcodeValue) {
      const canvas = document.createElement('canvas');
      JsBarcode(canvas, barcodeValue);
      // Send the barcode image to the printer using print-js
      printJS({
        printable: canvas.toDataURL(), // Convert the canvas to a base64-encoded image URL
        type: 'image',
        maxWidth: 300, // Set the maximum width of the image
        targetStyles: ['height=auto'], // Set the height of the image to auto
        documentTitle: 'Barcode', // Set the title of the print document
      });
    },
    showInventoryLevelDialog(item_id) {
      this.item_id = item_id
      this.inventoryLevelDialog = true
    },
    async addInventoryLevel() {
      if (!this.inventoryLevel.quantity || !this.inventoryLevel.reorder_level) {
        this.$swal('Fields Validation', 'Please fill in all required fields', 'error');
        return;
      }
      this.saveInventoryLoading = true
      let inventoryLevelPayload = {
        quantity: this.inventoryLevel.quantity,
        reorder_level: this.inventoryLevel.reorder_level,
        supplier: this.inventoryLevel.supplier
      }
      try {
        const response = await InventoryLevelService.create(inventoryLevelPayload, this.item_id)
        if (response.status === 201) {
          this.$swal('Information', 'Inventory Level successfully added', 'success').then(() => {
            this.saveInventoryLoading = false
            this.inventoryLevelDialog = false
            this.$refs.addInventoryLevelForm.reset()
            this.fetchDataFromAPI(this.currentPage, this.itemsPerPage, this.search)
          })
        }
      }
      catch (error) {
        this.saveInventoryLoading = false
        this.handleError(error)
      }
    }
  },
  mounted() {
    this.fetchDataFromAPI(this.currentPage, this.itemsPerPage, this.search)
  }
};
</script>
