<template>
  <div class="InventoryView">

    <v-container class="py-8 px-6" fluid>
      <v-row>
        <v-col cols="12">
          <v-dialog max-width="570" v-model="inventoryLevelDialog" persistent transition="fab-transition">
            <v-card>
              <v-card-title class="d-flex justify-space-between">
                Edit Inventory Level
                <v-icon v-on:click="inventoryLevelDialog = false">mdi-close</v-icon>
              </v-card-title>
              <v-card-text>
                <v-form ref="updateInventoryLevelForm">
                  <v-text-field v-model="inventoryLevel.quantity" label="Quantity"></v-text-field>
                  <v-text-field v-model="inventoryLevel.reorder_level"
                    label="Reorder Level"></v-text-field>
                  <v-text-field v-model="inventoryLevel.supplier" label="Supplier"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions class="d-flex justify-end">
                <v-btn class="text-capitalize mb-3" elevation="2" outlined
                  v-on:click="inventoryLevelDialog = !inventoryLevelDialog">Cancel</v-btn>
                <v-btn class="text-capitalize mb-3" :loading="updateInventoryLoading" elevation="2"
                  outlined color="#B55B68" v-on:click="updateInventoryLevel">Update Inventory</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <div class="d-flex justify-space-between">
            <h1 class="font-weight-regular">Inventory Levels</h1>
          </div>
          <div class="d-flex justify-end">
            <v-btn class="ma-2 text-capitalize font-weight-regular" v-on:click="exportToPdf" plain color="#B55B68">
              <v-icon left dark color="#B55B68">
                mdi-file-export-outline
              </v-icon>
              Export all
            </v-btn>
            <v-btn color="#FFCDD2" class="mt-2" v-on:click="fetchDataFromAPI" fab depressed x-small>
              <v-icon color="#E57373">mdi-cached</v-icon>
            </v-btn>
            <v-text-field color="#B55B68" v-model.trim="search" dense rounded outlined placeholder="Search" @input="searchItem" class="shrink ml-2"
              append-icon="mdi-magnify"></v-text-field>
          </div>

          <v-card>
            <v-data-table :loading="loading" v-model="selected" loading-text="Loading Inventory Levels... Please wait"
              :headers="headers" :server-items-length="total" :items-per-page="itemsPerPage" :page.sync="currentPage"
              @pagination="onPagination" :items="inventoryLevels" show-select :search="search" :sort-desc="[false, true]"
              multi-sort>
              <template v-slot:[`item.action`]="{ item }">
                <v-icon small class="mr-0" v-on:click="showEditInventoryDialog(item.id)"
                  color="blue">mdi-pencil
                </v-icon>
                <v-icon small class="mr-0" color="red" v-on:click="deleteInventory(item.id)">mdi-delete</v-icon>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import InventoryLevelService from '@/services/InventoryLevelService';
import jsPDF from 'jspdf';
import 'jspdf-autotable'
export default {
  name: "InventoryView",
  data() {
    return {
      heading: 'Inventory Levels',
      dialog: false,
      loading: false,
      inventoryLevels: [],
      selected: [],
      item_id: null,
      updateInventoryLoading: false,
      total: 0,
      currentPage: 1,
      itemsPerPage: 7,
      inventoryLevel: {
        id: null,
        quantity: null,
        reorder_level: null,
        supplier: null,
      },
      inventoryLevelDialog: false,
      search: '',
      headers: [
        {
          text: 'Id',
          align: 'start',
          sortable: false,
          value: 'id',
        },
        { text: 'Item', value: 'item' },
        { text: 'Quantity', value: 'quantity' },
        { text: 'Re-order Level', value: 'reorder_level' },
        { text: 'Supplier', value: 'supplier' },
        { text: 'Action', value: 'action' },
      ],
    }
  },
  methods: {
    async fetchDataFromAPI(page, perPage, search) {
      this.loading = true
      try {
        const response = await InventoryLevelService.getData(page, perPage, search);
        this.inventoryLevels = response.data.inventory_levels
        this.total = response.data.total;
        this.loading = false
      }
      catch (error) {
        this.loading = false
        this.handleError(error)
      }
    },
    searchItem(){
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.fetchDataFromAPI(this.currentPage, this.itemsPerPage, this.search); 
      }, 500);
    },
    onPagination(page) {
      this.currentPage = Number(page.page);
      this.fetchDataFromAPI(this.currentPage, this.itemsPerPage, this.search);
    },
    async showEditInventoryDialog(id) {
      this.inventoryLevelDialog = true
      try {
        const response = await InventoryLevelService.show(id);
        this.inventoryLevel = response.data
      } catch (error) {
        this.handleError(error)
      }
    },
    async updateInventoryLevel() {
      const requiredFields = ['quantity', 'reorder_level'];
      if (requiredFields.some(field => !this.inventoryLevel[field])) {
        await this.$swal('Fields Validation', 'Please fill in all required fields', 'error');
        return;
      }
      this.updateInventoryLoading = true;
      try {
        const inventoryLevelPayload = {
          quantity: this.inventoryLevel.quantity,
          reorder_level: this.inventoryLevel.reorder_level,
          supplier: this.inventoryLevel.supplier
        };
        const response = await InventoryLevelService.put(inventoryLevelPayload, this.inventoryLevel.id);
        if (response.status === 200) {
          await this.$swal('Information', 'Inventory Level successfully updated', 'success').then(() => {
            this.updateInventoryLoading = false;
            this.inventoryLevelDialog = false;
            this.$refs.updateInventoryLevelForm.reset();
            this.fetchDataFromAPI(this.currentPage, this.itemsPerPage, this.search);
          })
        }
      } catch (error) {
        this.updateInventoryLoading = false;
        this.handleError(error);
      }
    }
    ,
    async deleteInventory(id) {
      try {
        const response = await InventoryLevelService.delete(id);
        if (response.status === 204) {
          this.$swal('Information', 'Inventory deleted successfully', 'success').then(() => {
            this.fetchDataFromAPI(this.currentPage, this.itemsPerPage, this.search);
          })
        }
      } catch (error) {
        this.handleError(error)
      }
    }, 
    exportToPdf() {
      let items = [];
      if (this.inventoryLevels.length == 0) {
        this.$swal("Infor", "Records not found", "info");
      } else {
        if (this.selected.length == 0) {
          items = this.inventoryLevels
        } else {
          items = this.selected
        }
        const columns = [
          { title: "Item Name", dataKey: "item" },
          { title: "Quantity", dataKey: "quantity" },
          { title: "Re-order Level", dataKey: "reorder_level" },
          { title: "Supplier", dataKey: "supplier" }
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
    this.fetchDataFromAPI(this.currentPage, this.itemsPerPage, this.search);
  }
};
</script>
