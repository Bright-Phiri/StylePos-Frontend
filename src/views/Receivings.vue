<template>
  <div class="InventoryView">
    <v-container class="py-4 px-1" fluid>
      <v-row>
        <v-col cols="12">
          <div class="d-flex justify-space-between">
            <h1 class="font-weight-regular">Receivings</h1>
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

          <v-card shaped>
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
              <template v-slot:[`item.stock_value`]="{ item }">
                {{ formartValue(item.stock_value) }}
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
import 'jspdf-autotable'
export default {
  name: "InventoryView",
  data() {
    return {
      heading: 'Receivings',
      dialog: false,
      loading: false,
      selected: [],
      total: 0,
      currentPage: 1,
      itemsPerPage: 7,
      search: '',
      headers: [
        {
          text: 'Id',
          align: 'start',
          sortable: false,
          value: 'id',
        },
        { text: 'Barcode', value: 'barcode' },
        { text: 'name', value: 'item' },
        { text: "Cost Price", value: "cost_price" },
        { text: "Seling Price", value: "selling_price" },
        { text: 'Quantity', value: 'quantity' },
        { text: 'Supplier', value: 'supplier' },
        { text: 'Stock Value', value: 'stock_value' },
        { text: 'Received on', value: 'received_on' }, 
        { text: 'Action', value: 'action' },
      ],
    }
  },
  methods: {
    formartValue(value) {
      return parseFloat(value).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
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
  },
  mounted() {
    this.fetchDataFromAPI(this.currentPage, this.itemsPerPage, this.search);
  }
};
</script>
