<template>
  <div class="ItemsView">
    <v-container class="py-4 px-1" fluid>
      <v-row>
        <v-col cols="12">

          <div class="d-flex justify-space-between">
            <h1 class="font-weight-regular">Print Barcodes</h1>
          </div>
          <div class="d-flex justify-end">
            <v-btn color="#FFCDD2" class="mt-2" fab depressed x-small v-on:click="fetchDataFromAPI">
              <v-icon color="#E57373">mdi-cached</v-icon>
            </v-btn>
            <v-text-field color="#B55B68" v-model.trim="search" @input="searchItem" dense rounded outlined
              placeholder="Search" class="shrink ml-2" append-icon="mdi-magnify"></v-text-field>
          </div>

          <v-card shaped>
            <v-data-table :loading="loading" loading-text="Loading Items... Please wait"
              :headers="headers" :server-items-length="total" :items-per-page="itemsPerPage" :page.sync="currentPage"
              @pagination="onPagination" :items="items" show-select :search="search" :sort-desc="[false, true]"
              multi-sort>
              <template v-slot:[`item.action`]="{ item }">
                <v-icon class="mr-0" color="blue darken-2"
                  v-on:click="generateAndPrintBarcode(item.barcode)">mdi-barcode</v-icon>
              </template>
              <template v-slot:[`item.price`]="{ item }">
                {{ formartValue(item.price) }}
              </template>
              <template v-slot:[`item.selling_price`]="{ item }">
                {{ formartValue(item.selling_price) }}
              </template>
              <template v-slot:[`item.stock_level`]="{ item }">
                <v-chip class="text-center" small style="width: 90px" outlined :color="getColor(item.stock_level)" dark>
                  {{ item.stock_level }}
                </v-chip>
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
import JsBarcode from "jsbarcode";
import printJS from "print-js";
export default {
  name: "ItemsView",
  data() {
    return {
      searchTimeout: null, // Initialize searchTimeout variable as null
      loading: false,
      total: 0,
      currentPage: 1,
      itemsPerPage: 7,
      search: "",
      items: [],
      errors: [],
      headers: [
        
        { text: "Barcode", align: "start", sortable: false, value: "barcode" },
        { text: "Name", value: "name" },
        { text: "Cost Price", value: "price" },
        { text: "Seling Price", value: "selling_price" },
        { text: "Size", value: "size" },
        { text: "Color", value: "color" },
        { text: "Stock Level", value: "stock_level" },
        { text: "Action", value: "action" },
      ],
    };
  },
  methods: {
    getColor(status) {
      switch (status) {
        case 'In stock':
          return "success";
        case 'Out of stock':
          return "red";
        case 'Low stock':
          return "warning";
        case 'Not added':
          return "secondary";
        default:
          return "secondary";
      }
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
        this.fetchDataFromAPI(this.currentPage, this.itemsPerPage, this.search);
      }, 500);
    },
    onPagination(page) {
      this.currentPage = Number(page.page);
      if (this.$route.params.category_id !== undefined) {
        this.showCategoryItems(
          this.currentPage,
          this.itemsPerPage,
          this.search,
          this.$route.params.category_id
        );
      } else {
        this.fetchDataFromAPI(this.currentPage, this.itemsPerPage, this.search);
      }
    },
    formartValue(value) {
      return parseFloat(value).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },
    generateAndPrintBarcode(barcodeValue) {
      const canvas = document.createElement("canvas");
      JsBarcode(canvas, barcodeValue);
      // Send the barcode image to the printer using print-js
      printJS({
        printable: canvas.toDataURL(), // Convert the canvas to a base64-encoded image URL
        type: "image",
        maxWidth: 300, // Set the maximum width of the image
        targetStyles: ["height=auto"], // Set the height of the image to auto
        documentTitle: "Barcode", // Set the title of the print document
      });
    },
  },
  mounted() {
    this.fetchDataFromAPI(this.currentPage, this.itemsPerPage, this.search);
  },
};
</script>
