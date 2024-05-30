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
                    label="Search Item" v-model="item.id" placeholder="Start typing to Search" prepend-inner-icon="mdi-magnify"
                    item-text="name"
                    item-value="id"></v-autocomplete>
                  <v-text-field v-model="item.price" label="Cost Price"></v-text-field>
                  <v-text-field v-model="item.selling_price" label="Selling Price"></v-text-field>
                  <v-text-field v-model="item.quantity" label="Quantity"></v-text-field>
                  <v-text-field v-model="item.batch_number" label="Batch Number"></v-text-field>
                  <v-text-field v-model="item.supplier" label="Supplier"></v-text-field>
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
            <v-data-table :loading="loadingReceivings" v-model="selected" loading-text="Loading Received Items... Please wait"
              :headers="headers" :server-items-length="receivedItemstotal" :items-per-page="itemsPerPage" :page.sync="receivedcurrentPage"
              @pagination="onPagination" :items="receivedItems" show-select :search="search"
              :sort-desc="[false, true]" multi-sort>
              <template v-slot:[`item.action`]="{ item }">
                <v-icon small class="mr-0" color="red" v-on:click="deleteItem(item.id)">mdi-delete</v-icon>
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
import ReceivedItemsService from "../services/ReceivedItemService";
import 'jspdf-autotable'
export default {
  name: "InventoryView",
  data() {
    return {
      heading: 'Receivings',
      dialog: false,
      loading: false,
      loadingReceivings: false,
      saveItemLoading: false,
      selected: [],
      total: 0,
      currentPage: 1,
      receivedItemstotal: 0,
      receivedcurrentPage: 1,
      itemsPerPage: 7,
      search: '',
      items: [],
      receivedItems: [],
      searchItemTxField: "",
      item: {
        id: null,
        price: null,
        selling_price: null,
        quantity: null,
        batch_number: null,
        supplier: null
      },
      headers: [
        {
          text: 'Id',
          align: 'start',
          sortable: false,
          value: 'id',
        },
        { text: 'name', value: 'item' },
        { text: "Cost Price", value: "cost_price" },
        { text: "Seling Price", value: "selling_price" },
        { text: 'Quantity', value: 'quantity' },
        { text: "Batch Number", value: "batch_number" },
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
    async saveItem() {
      const requiredFields = ["id", "price", "selling_price", "quantity", "batch_number"];

      if (requiredFields.some((field) => !this.item[field])) {
        await this.$swal(
          "Fields Validation",
          "Please fill in all required fields",
          "warning"
        );
        return;
      }
      console.log(this.item.id)
      try {
        this.saveItemLoading = true;
        const itemPayload = {
          cost_price: this.item.price,
          selling_price: this.item.selling_price,
          quantity: this.item.quantity,
          batch_number: this.item.batch_number,
          supplier: this.item.supplier
        };
        const response = await ReceivedItemsService.create(itemPayload, this.item.id);
        if (response.status === 201) {
          this.$swal("Information", "Item saved successfully", "success");
          this.$refs.addItemForm.reset();
          this.dialog = false;
          this.fetchReceivingsDataFromAPI();
        }
      } catch (error) {
        this.handleError(error);
      } finally {
        this.saveItemLoading = false;
      }
    },
    async fetchReceivingsDataFromAPI(page, perPage, search) {
      this.loadingReceivings = true;
      try {
        const response = await ReceivedItemsService.getData(page, perPage, search);
        this.receivedItems = response.data.items;
        this.receivedItemstotal = response.data.total;
        this.loadingReceivings = false;
      } catch (error) {
        this.loadingReceivings = false;
        this.handleError(error);
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
    async deleteItem(item_id) {
      try {
        const response = await ReceivedItemsService.delete(item_id);
        if (response.status === 204) {
          this.$swal(
            "Information",
            "Received Item deleted successfully",
            "success"
          ).then(() => {
            this.fetchReceivingsDataFromAPI(this.currentPage, this.itemsPerPage, this.search);
          });
        }
      } catch (error) {
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
      this.receivedcurrentPage = Number(page.page);
      this.fetchDataFromAPI(this.currentPage, this.itemsPerPage, this.search);
      this.fetchReceivingsDataFromAPI(this.receivedcurrentPage, this.itemsPerPage, this.search);
    },
  },
  mounted() {
    this.fetchReceivingsDataFromAPI(this.currentPage, this.itemsPerPage, this.search);
  },
};
</script>
