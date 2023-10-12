<template>
  <div class="ItemsView">
    <v-container class="py-8 px-6" fluid>
      <v-row>
        <v-col cols="12">
          <div class="d-flex justify-space-between">
            <h1 class="font-weight-regular">Refunds</h1>
          </div>
          <div class="d-flex justify-end">
            <v-text-field color="#B55B68" dense rounded v-model="search" outlined placeholder="Search" class="shrink ml-2"
              append-icon="mdi-magnify"></v-text-field>
          </div>
          <v-card>
            <v-data-table :loading="loading" loading-text="Loading Refunds... Please wait"
              :headers="headers"  :search="search" :items-per-page="7"
               :items="refunds" multi-sort>
               <template v-slot:[`item.refund_amount`]="{ item }">
                {{ formartValue(item.refund_amount) }}
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
      search: '',
      loading: false,
      refunds: [],
      headers: [
        {
          text: 'Id',
          align: 'start',
          sortable: false,
          value: 'id',
        },
        { text: 'Order Id', value: 'order' },
        { text: 'Item', value: 'item' },
        { text: 'Reason', value: 'reason' },
        { text: 'Refund Amount', value: 'refund_amount' },
        { text: 'Refund Date', value: 'return_date' },
      ],
    }
  },
  methods: {
    async fetchDataFromAPI() {
      this.loading = true
      try {
        const response = await OrdersService.getRetuns();
        this.refunds = response.data
        this.loading = false
      } catch (error) {
        this.loading = false
        this.handleError(error);
      }
    },
    formartValue(value) {
      return parseInt(value).toLocaleString('en-US', { minimumFractionDigits: 2 })
    },
  },
  mounted() {
    this.fetchDataFromAPI();
  }
};
</script>
