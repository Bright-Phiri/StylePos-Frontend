<template>
  <div class="InventoryView">
    <v-container class="py-4 px-1" fluid>
      <v-row>
        <v-col cols="12">
          <v-dialog max-width="600" v-model="dialog" persistent transition="fab-transition">
            <v-card>
              <v-card-title class="d-flex justify-space-between">
                Add Received Item
                <v-icon v-on:click="dialog = false">mdi-close</v-icon>
              </v-card-title>
              <v-card-text>
                <v-form ref="addReceivedItemForm">
                  <v-autocomplete dense outlined :search-input.sync="searchItemTxField" :items="items" :loading="loading"
                    label="Search Item" placeholder="Start typing to Search" prepend-inner-icon="mdi-magnify" return-object
                    item-text="name"
                    item-value="id"></v-autocomplete>
                  <v-text-field v-model="item.price" label="Cost Price"></v-text-field>
                  <v-text-field v-model="item.selling_price" label="Selling Price"></v-text-field>
                  <v-text-field v-model="item.size" label="Size"></v-text-field>
                  <v-text-field v-model="item.color" label="Color"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions class="d-flex justify-end">
                <v-btn class="text-capitalize mb-3" elevation="2" outlined v-on:click="dialog = !dialog">Cancel</v-btn>
                <v-btn class="text-capitalize mb-3" :loading="saveItemLoading" elevation="2" outlined color="#B55B68"
                  v-on:click="saveItem">Save Item</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <div class="d-flex justify-space-between">
            <h1 class="font-weight-regular">Receivings</h1>
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
            <v-btn color="#FFCDD2" class="mt-2" v-on:click="fetchDataFromAPI" fab depressed x-small>
              <v-icon color="#E57373">mdi-cached</v-icon>
            </v-btn>
            <v-text-field color="#B55B68" v-model.trim="search" dense rounded outlined placeholder="Search"
              @input="searchItem" class="shrink ml-2" append-icon="mdi-magnify"></v-text-field>
          </div>

          <v-card shaped>
            <v-data-table :loading="loadingReceivings" v-model="selected" loading-text="Loading Inventory Levels... Please wait"
              :headers="headers" :server-items-length="total" :items-per-page="itemsPerPage" :page.sync="currentPage"
              @pagination="onPagination" :items="inventoryLevels" show-select :search="search"
              :sort-desc="[false, true]" multi-sort>
              <template v-slot:[`item.action`]="{ item }">
                <v-icon small class="mr-0" v-on:click="showEditInventoryDialog(item.id)" color="blue">mdi-pencil
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
import ItemsService from "../services/ItemsService";
import 'jspdf-autotable'
export default {
  name: "InventoryView",
  data() {
    return {
      heading: 'Receivings',
      dialog: false,
      loading: false,
      loadingReceivings: false,
      selected: [],
      total: 0,
      currentPage: 1,
      itemsPerPage: 7,
      search: '',
      items: [],
      searchItemTxField: "",
      item: {
        id: null,
        name: null,
        price: null,
        selling_price: null,
        size: null,
        color: null,
      },
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
  watch: {
    searchItemTxField(val) {
      this.fetchDataFromAPI(this.currentPage, this.total, val);
    },
  },
  methods: {
    formartValue(value) {
      return parseFloat(value).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },
    async fetchDataFromAPI(page, perPage, search) {
      this.loading = true;
      try {
        const response = await ItemsService.getData(page, perPage, search);
        this.items = response.data.items;
        this.total = response.data.total;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.handleError(error);
      }
    },
    searchItem() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.fetchDataFromAPI(this.currentPage, this.itemsPerPage, this.searchItemTxField);
      }, 500);
    },
    onPagination(page) {
      this.currentPage = Number(page.page);
      this.fetchDataFromAPI(this.currentPage, this.itemsPerPage, this.search);
    },
  },
};
</script>
