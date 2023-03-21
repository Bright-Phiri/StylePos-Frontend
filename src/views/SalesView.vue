<template>
  <div class="ItemsView">
    <v-app-bar app flat color="white">
      <v-toolbar-title>
        <v-avatar tile width="250" height="40" class="ml-2000000000">
          <v-img src="../assets/icon1.png"></v-img>
        </v-avatar>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-avatar color="F9F9F9" size="39">
        <v-img src="../assets/avatar.png"></v-img>
      </v-avatar>
      <h3 class="ml-3 font-weight-bold">{{ this.user.first_name }} {{ this.user.last_name }} | {{ this.user.job_title }}
      </h3>
      <v-btn v-on:click="logout" depressed class="ml-3"><v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
    <v-row>
      <v-col cols="12" lg="9" xl="9">
        <v-card class="mt-2">
          <v-card-title class="d-flex justify-space-between">
            <h3 class="mb-9">Order details</h3>
            <v-text-field dense outlined v-model="search" placeholder="Search" class="shrink ml-2"
              append-icon="mdi-magnify"></v-text-field>
          </v-card-title>
          <v-card-text>
            <v-divider></v-divider>
            <v-data-table height="250" :loading="loading" loading-text="Loading Line Items... Please wait"
              :headers="headers" :items="lineItems" :items-per-page="6" :search="search" :sort-desc="[false, true]"
              multi-sort>
              <template v-slot:[`item.action`]="{ item }">
                <v-icon small class="mr-0" color="red" v-on:click="removeLineItem(item.id)">mdi-delete</v-icon>
              </template>
              <template v-slot:[`item.price`]="{ item }">
                {{ formartValue(item.price) }}
              </template>
              <template v-slot:[`item.total`]="{ item }">
                {{ formartValue(item.total) }}
              </template>
              <template v-slot:[`item.quantity`]="{ item }">
                <input type="number" v-model="item.quantity" @change="updateLineItemQauantity(item)"
                  style="width: 60px;" />
              </template>
              <template v-slot:[`item.vat`]="{ item }">
                {{ formartValue(item.vat) }}
              </template>
            </v-data-table>
            <h4>Number of items: {{ items_count }}</h4>
          </v-card-text>
        </v-card>
        <v-card class="mt-4">
          <v-card-title>Add Item</v-card-title>
          <v-card-text>
            <v-form ref="addLineItemForm" class="d-flex justify-space-between">
              <div class="d-inline-flex">
                <v-text-field label="Item Code" v-model="item.id" v-on:keyup="searchItem" outlined></v-text-field>
                <v-text-field label="Item Name" class="ml-4" v-model="item.name" outlined readonly></v-text-field>
                <v-text-field label="Price" class="ml-4" v-model="item.price" outlined readonly></v-text-field>
                <v-text-field label="Quantity" type="number" v-model="item.quantity" outlined class="ml-4"></v-text-field>
              </div>
              <div class="justify-end">
                <v-btn class="white--text" color="primary" x-large v-on:click="addLineItem">
                  <v-icon large>mdi-cart</v-icon>Add
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" lg="3" xl="3">
        <v-sheet elevation="1" rounded="lg" class="pa-4 text-center mt-2 mx-auto">
          <v-card class="elevation-0">
            <v-card-text>
              <div class="d-flex flex-column" style="border-color: black">
                <v-alert outlined color="black" style="border-radius: 0">
                  <div class="text-h6">
                    {{ order_total }}
                  </div>
                </v-alert>
                <div class="d-flex mt-2">
                  <h1 class="text-h6 text-center">SUB&nbsp;:</h1>
                  <h1 class="text-h6 text-center ml-1">{{ sub_total }}</h1>
                </div>
                <div class="d-flex mt-2">
                  <h1 class="text-h6 text-center">DIS&nbsp;&nbsp;:</h1>
                  <h1 class="text-h6 text-center ml-1">0.00</h1>
                </div>
                <div class="d-flex mt-2">
                  <h1 class="text-h6 text-center">VAT&nbsp;:</h1>
                  <h1 class="text-h6 text-center ml-1">{{ vat }}</h1>
                </div>
                <v-text-field class="mt-1" v-model="pay" v-on:keyup="processPayment" style="border-radius: 0"
                  outlined></v-text-field>
                <h2>CHANGE</h2>
                <v-alert outlined color="black" style="border-radius: 0">
                  <div class="text-h6">{{ change }}</div>
                </v-alert>
                <v-btn x-large class="white--text" v-on:click="issueReceipt" depressed flat color="green">Finish
                  Sale</v-btn>
                <v-btn x-large class="mt-2 white--text" v-on:click="voidOrder" depressed flat color="red">VOID</v-btn>
                <v-btn x-large class="mt-2 white--text" v-on:click="newOrder" depressed flat color="blue">NEW
                  SALE</v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-sheet>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import ItemsService from '../services/ItemsService'
import LineItemService from '../services/LineItemService'
import OrdersService from '../services/OrdersService'
export default {
  name: "SalesView",
  data() {
    return {
      loading: false,
      lineItems: [],
      search: '',
      user: {},
      headers: [
        {
          text: 'Id',
          align: 'start',
          sortable: false,
          value: 'id',
        },
        { text: 'Item Name', value: 'item' },
        { text: 'Selling Price', value: 'price' },
        { text: 'Quantity', value: 'quantity' },
        { text: 'Total VAT', value: 'vat' },
        { text: 'Total', value: 'total' },
        { text: 'Action', value: 'action' },
      ],
      item: {
        id: null,
        name: null,
        price: null,
        quantity: null
      },
      line_item: {
        id: null,
        item: null,
        quantity: null,
        price: null,
        vat: null,
        total: null,
      },
      sub_total: 0,
      order_total: 0,
      vat: 0,
      change: 0,
      pay: null,
      items_count: 0,
    }
  },
  methods: {
    async newOrder() {
      try {
        const response = await OrdersService.create(this.user.id)
        if (response.status === 201) {
          const order = response.data
          this.$store.commit('setOderId', order.id)
          this.$vToastify.success('Order successfully created', 'Message');
        }
      }
      catch (error) {
        this.handleError(error)
      }
    },
    async setOrder(order_id) {
      this.loading = true
      try {
        const response = await OrdersService.show(order_id)
        if (response.status === 200) {
          const order = response.data
          this.setData(order)
          this.loading = false
        }
      }
      catch (error) {
        this.handleError(error)
        this.loading = false
      }
    },
    setData(order) {
      this.lineItems = order.line_items
      this.sub_total = this.formartValue(order.sub_total)
      this.order_total = this.formartValue(order.total)
      this.vat = this.formartValue(order.vat)
      this.items_count = order.items_count
    },
    async voidOrder() {
      if (this.order_id == 0) {
        this.$vToastify.error('Order not found', 'Error');
        return;
      }
      try {
        const response = await OrdersService.delete(this.order_id)
        if (response.status === 204) {
          this.$store.commit('setOderId', 0)
          this.clearData();
          this.$vToastify.success('Order successfully voided', 'Message');
        }
      }
      catch (error) {
        this.handleError(error)
      }
    },
    async searchItem() {
      try {
        const response = await ItemsService.show(this.item.id)
        const transformedData = {
          ...response.data,
          price: this.formartValue(response.data.price),
        }
        this.item = transformedData
      }
      catch (error) {
        //this.handleError(error)
      }
    },
    async addLineItem() {
      if (this.order_id == 0) {
        this.$vToastify.error('Order not found, Please create new order', 'Error');
        return;
      }
      try {
        let line_item_payload = {
          item_id: this.item.id,
          quantity: this.item.quantity
        }
        this.loading = true
        const response = await LineItemService.create(this.user.id, this.order_id, line_item_payload)
        if (response.status === 201) {
          const order = response.data
          this.setData(order)
          this.loading = false
          this.$refs.addLineItemForm.reset()
        }
      }
      catch (error) {
        this.loading = false
        this.handleError(error)
      }
    },
    async updateLineItemQauantity(item) {
      try {
        let line_item_payload = {
          quantity: item.quantity
        }
        this.loading = true
        const response = await LineItemService.update(this.user.id, this.order_id, line_item_payload, item.id)
        if (response.status === 200) {
          const order = response.data
          this.setData(order)
          this.loading = false
          this.$refs.addLineItemForm.reset()
        }
      }
      catch (error) {
        this.loading = false
        this.handleError(error)
      }
    },
    async removeLineItem(line_item_id) {
      this.loading = true
      try {
        const response = await LineItemService.delete(this.user.id, this.order_id, line_item_id)
        if (response.status === 200) {
          const order = response.data
          this.setData(order)
          this.loading = false
          this.$refs.addLineItemForm.reset()
        }
      }
      catch (error) {
        this.handleError(error)
      }

    },
    processPayment() {
      if (this.pay >= parseFloat(this.order_total.replace(",", ""))) {
        const change = this.pay - parseFloat(this.order_total.replace(",", ""));
        this.change = this.formartValue(change)
      } else {
        this.change = this.formartValue(0)
      }
    },
    issueReceipt() {
      //Issue Receipt
      if (this.order_id == 0) {
        this.$vToastify.error('Order not found', 'Message');
        return;
      }
      if (this.pay != null && this.pay >= parseFloat(this.order_total.replace(",", ""))) {
        this.lineItems = []
        this.clearData();
        this.$store.commit('setOderId', 0)
        this.$vToastify.success('Order successfully completed', 'Message');
      }
    },
    clearData() {
      this.lineItems = []
      this.sub_total = this.formartValue(0)
      this.order_total = this.formartValue(0)
      this.vat = this.formartValue(0)
      this.change = this.formartValue(0)
      this.pay = null
      this.items_count = 0
    },
    formartValue(value) {
      return parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    logout() {
      this.$router.push({ name: "logout" })
    },
  },
  computed: {
    order_id() {
      return this.$store.state.order_id !== null ? this.$store.state.order_id : 0;
    }
  }, mounted() {
    this.user = this.$store.state.user
    if (this.order_id !== 0) {
      this.setOrder(this.order_id)
    } else {
      this.clearData();
    }
  }
}
</script>
