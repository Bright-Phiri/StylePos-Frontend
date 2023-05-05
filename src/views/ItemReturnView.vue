<template>
  <div class="OrderSummaryView">
    <v-container class="py-8 px-6" fluid>
      <v-row>
        <v-col cols="12">
          <div class="d-flex justify-space-between">
            <h1 class="font-weight-regular">Return Request</h1>
          </div>
          <div class="d-flex justify-end">
            <v-text-field color="#B55B68" dense rounded outlined placeholder="Search" class="shrink ml-2"
              append-icon="mdi-magnify"></v-text-field>
          </div>

          <v-card>
            <v-data-table :loading="loading ? '#B55B68' : null" loading-text="Loading Order Summary... Please wait"
              :headers="headers" :items="line_items" :items-per-page="5" :sort-desc="[false, true]" multi-sort>
              <template v-slot:[`item.action`]="{ item }">
                <v-icon class="mr-0" v-on:click="issueItemReturn(item.id)" color="primary">mdi-undo
                </v-icon>
              </template>
              <template v-slot:[`item.price`]="{ item }">
                {{ formartValue(item.price) }}
              </template>
              <template v-slot:[`item.total`]="{ item }">
                {{ formartValue(item.total) }}
              </template>
              <template v-slot:[`item.vat`]="{ item }">
                {{ formartValue(item.vat) }}
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
  name: "OrderSummaryView",
  data() {
    return {
      loading: false,
      line_items: [],
      headers: [
        {
          text: 'Id',
          align: 'start',
          sortable: false,
          value: 'id',
        },
        { text: 'Item', value: 'item' },
        { text: 'Quantity', value: 'quantity' },
        { text: 'Price', value: 'price' },
        { text: 'VAT', value: 'vat' },
        { text: 'Total', value: 'total' },
        { text: 'Action', value: 'action' },
      ],
    }
  },
  computed: {
    order_ID() {
      return this.$store.state.order_ID !== null ? this.$store.state.order_ID : 0;
    }
  },
  methods: {
    async fetchDataFromAPI(order_id) {
      this.loading = true
      try {
        const response = await OrdersService.show(order_id);
        this.line_items = response.data.line_items
        this.loading = false
      } catch (error) {
        this.loading = false
        this.handleError(error);
      }
    },
    async issueItemReturn(line_item_id) {
      try {
        const response = await OrdersService.item_return(this.order_ID, line_item_id);
        if (response.status === 200) {
          this.$swal('Information', 'Item returned successfully', 'success').then(() => {
            this.fetchDataFromAPI(this.order_ID);
          })
        }
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
    if (this.$route.params.order_id !== undefined) {
      this.$store.commit('setOderID', this.$route.params.order_id);
      this.fetchDataFromAPI(this.order_ID);
    } else{
      if (this.order_ID !== 0) {
        this.fetchDataFromAPI(this.order_ID);
      }
    }
  }
};
</script>