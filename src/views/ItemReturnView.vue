<template>
  <div class="OrderSummaryView">
    <v-container class="py-8 px-6" fluid>
      <v-row>
        <v-col cols="12">
          <div class="d-flex justify-space-between">
            <h1 class="font-weight-regular">Return Request</h1>
          </div>
          <div class="d-flex justify-end">
            <v-text-field color="#B55B68" dense rounded outlined v-model="search" placeholder="Search" class="shrink ml-2"
              append-icon="mdi-magnify"></v-text-field>
          </div>
          <v-dialog max-width="570" v-model="returnDialog" persistent>
            <v-card>
              <v-card-title class="d-flex justify-space-between">
                Issue Return
                <v-icon v-on:click="returnDialog = false">mdi-close</v-icon>
              </v-card-title>
              <v-card-text>
                <v-form ref="issueReturnForm">
                  <v-textarea outlined v-model="return_item.reason" label="Reason"></v-textarea>
                </v-form>
              </v-card-text>
              <v-card-actions class="d-flex justify-end">
                <v-btn class="text-capitalize mb-3" elevation="2" outlined
                  v-on:click="returnDialog = !returnDialog">Cancel</v-btn>
                <v-btn class="text-capitalize mb-3" :loading="issueReturnLoading" elevation="2"
                  outlined color="#B55B68" v-on:click="issueItemReturn">Issue Return</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-card>
            <v-data-table :loading="loading" loading-text="Loading Order Summary... Please wait"
              :headers="headers" :items="line_items" :items-per-page="5" :search="search" :sort-desc="[false, true]" multi-sort>
              <template v-slot:[`item.action`]="{ item }">
                <v-icon class="mr-0" v-on:click="showReturnDialog(item.id)" color="primary">mdi-undo
                </v-icon>
              </template>
              <template v-slot:[`item.price`]="{ item }">
                {{ formartValue(item.price) }}
              </template>
              <template v-slot:[`item.total`]="{ item }">
                {{ formartValue(item.total) }}
              </template>
              <template v-slot:[`item.discount`]="{ item }">
                {{ formartValue(item.discount) }}
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
  name: "ItemReturnView",
  data() {
    return {
      loading: false,
      line_items: [],
      line_item_id: null,
      returnDialog: false,
      issueReturnLoading: false,
      return_item: {
       reason: null
      },
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
        { text: 'Price', value: 'price' },
        { text: 'VAT', value: 'vat' },
        { text: 'Discount', value: 'discount' },
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
    showReturnDialog(line_item_id){
     this.line_item_id = line_item_id
     this.returnDialog = true
    },
    async issueItemReturn() {
      if (!this.return_item.reason) {
        this.$swal('Fields Validation', 'Please fill in all required fields', 'warning');
        return;
      }
      let returnPayload = {
        reason: this.return_item.reason
      }
      try {
        this.issueReturnLoading = true
        const response = await OrdersService.item_return(returnPayload, this.order_ID, this.line_item_id);
        if (response.status === 200) {
          this.$swal('Information', 'Item returned successfully', 'success').then(() => {
            this.issueReturnLoading = false
            this.returnDialog = false
            this.$refs.issueReturnForm.reset();
            this.fetchDataFromAPI(this.order_ID);
          })
        }
      } catch (error) {
        this.issueReturnLoading = false
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
