<template>
  <div class="ItemsView">
    <v-container class="py-8 px-6" fluid>
      <v-row>
        <v-col cols="12">
          <div class="d-flex justify-space-between">
            <h1 class="font-weight-regular">Transactions</h1>
          </div>
          <div class="d-flex justify-end">
            <v-btn class="ma-2 text-capitalize font-weight-regular" plain color="#B55B68">
              <v-icon left dark color="#B55B68">
                mdi-file-export-outline
              </v-icon>
              Export all
            </v-btn>
            <v-btn color="#FFCDD2" class="mt-2" fab depressed x-small>
              <v-icon color="#E57373">mdi-cached</v-icon>
            </v-btn>
            <v-text-field color="#B55B68" dense rounded outlined placeholder="Search" class="shrink ml-2"
              append-icon="mdi-magnify"></v-text-field>
          </div>
          <v-card>
            <v-data-table :loading="loading ? '#B55B68' : null" loading-text="Loading Transactions... Please wait"
              :headers="headers"  :server-items-length="total" :items-per-page="itemsPerPage" :page.sync="currentPage"
              @pagination="onPagination" :items="orders" :sort-desc="[false, true]" multi-sort>
              <template v-slot:[`item.action`]="{ item }">
                <v-icon class="mr-0" v-on:click="viewOrderSummary(item.id)" color="primary">mdi-eye
                </v-icon>
              </template>
              <template v-slot:[`item.total`]="{ item }">
                {{ formartValue(item.total) }}
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import OrdersService from '../services/OrdersService'
export default {
  name: "ItemsView",
  data() {
    return {
      dialog: false,
      loading: false,
      orders: [],
      total: 0,
      currentPage: 1,
      itemsPerPage: 7,
      headers: [
        {
          text: 'Id',
          align: 'start',
          sortable: false,
          value: 'id',
        },
        { text: 'Processed By', value: 'processed_by' },
        { text: 'Transaction Date', value: 'transaction_date' },
        { text: 'Total (MWK)', value: 'total' },
        { text: 'Action', value: 'action' },
      ],
    }
  },
  methods: {
    async fetchDataFromAPI(page, perPage) {
      this.loading = true
      try {
        const response = await OrdersService.getData(page, perPage);
        this.orders = response.data.orders
        this.total = response.data.total;
        this.loading = false
      } catch (error) {
        this.loading = false
        this.handleError(error);
      }
    },
    onPagination(page) {
      this.currentPage = Number(page.page);
      this.fetchDataFromAPI(this.currentPage, this.itemsPerPage);
    },
    formartValue(value) {
      return parseInt(value).toLocaleString('en-US', { minimumFractionDigits: 2 })
    },
    async viewOrderSummary(order_id) {
      try {
        const response = await OrdersService.show(order_id);
        if (response.status === 200) {
          this.$router.push({ name: 'order_summary', params: { order_id } })
        }
      } catch (error) {
        this.handleError(error);
      }
    }
  },
  mounted() {
    this.fetchDataFromAPI(this.currentPage, this.itemsPerPage)
  }
};
</script>
