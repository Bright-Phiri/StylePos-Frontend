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
              <template v-slot:[`item.discount`]="{ item }">
                <input type="text" v-model="item.discount" @change="applyDiscount(item)"
                  style="width: 70px;border: 1px solid grey;" />
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
                <v-text-field label="Item Code" v-model="item.barcode" v-on:keyup="searchItem" outlined></v-text-field>
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
                  <h1 class="text-h6 text-center ml-1">{{ discount }}</h1>
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

    <div class="receipt" ref="receipt">
      <h1 class="heading-1">StylePos Receipt</h1>
      <ul>
        <li v-for="item in lineItems" :key="item.id">
          <span class="item">{{ item.item }}</span>
          <span class="price">{{ item.quantity }} * {{ formartValue(item.price) }}</span>
          <span class="total">{{ formartValue(item.total) }}</span>
        </li>
      </ul>
      <P>--------------------------------------------------------------------------------------------------------------
      </P>
      <div class="total mt-2">
        <span>Sub total&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: </span>
        <span class="price">{{ sub_total }}</span>
      </div>
      <div class="total mt-2">
        <span>Discount&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: </span>
        <span class="price">{{ discount }}</span>
      </div>
      <div class="total mt-2">
        <span>VAT A-16.5%&nbsp;: </span>
        <span class="price">{{ vat }}</span>
      </div>
      <div class="total mt-2">
        <span>Total VAT&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: </span>
        <span class="price">{{ vat }}</span>
      </div>
      <P>--------------------------------------------------------------------------------------------------------------
      </P>
      <div class="total">
        <span>Total&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: </span>
        <span class="price">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{
          order_total }}</span>
      </div>
      <div class="total">
        <span>Change: </span>
        <span class="price">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{
          change }}</span>
      </div>
      <p>You were served by:</p>
      <p>Cashier: {{ user.first_name }} {{ user.last_name }}</p>
      <p>Date Time : {{ transaction_date }}</p>
      <button @click="printReceipt">Print Receipt</button>
    </div>

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
        { text: 'Barcode', value: 'barcode' },
        { text: 'Item Name', value: 'item' },
        { text: 'Selling Price', value: 'price' },
        { text: 'Quantity', value: 'quantity' },
        { text: 'Discount', value: 'discount' },
        { text: 'Total VAT', value: 'vat' },
        { text: 'Total', value: 'total' },
        { text: 'Action', value: 'action' },
      ],
      item: {
        id: null,
        barcode: null,
        name: null,
        price: null,
        quantity: null,
        discount: null
      },
      line_item: {
        id: null,
        item: null,
        quantity: null,
        discount: null,
        price: null,
        vat: null,
        total: null,
      },
      sub_total: 0,
      order_total: 0,
      discount: 0,
      vat: 0,
      transaction_date: null,
      change: 0,
      pay: null,
      items_count: 0,
    }
  },
  methods: {
    printReceipt() {
      // Clone the receipt element and remove the print button
      const receipt = this.$refs.receipt.cloneNode(true)
      const button = receipt.querySelector('button')
      button.parentNode.removeChild(button)

      // Open a new window and print the receipt
      const printWindow = window.open('', '', 'height=600,width=800')
      printWindow.document.write('<html><head><title>Receipt</title>')
      printWindow.document.write('<style scoped>' + this.getPrintStyles() + '</style>')
      printWindow.document.write('</head><body>')
      printWindow.document.write(receipt.outerHTML)
      printWindow.document.write('</body></html>')
      printWindow.print()
      printWindow.close()
    },

    getPrintStyles() {
      // Return the CSS code as a string
      return `
        .receipt {
          border: 1px solid black;
          padding: 10px;
          font-family: Arial, sans-serif;
          font-size: 14px;
          width: 300px;
          visibility: hidden; /* hide by default */
        }

        .receipt h1 {
          font-size: 18px;
          font-weight: bold;
          text-align: center;
          margin: 0 0 10px 0;
        }

        .receipt ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .receipt li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 5px;
        }

        .receipt .item {
          flex: 0.3;
        }

        .receipt .price {
          flex: 0.3;
        }

        .receipt .total {
          flex: 0.3;
        }

        .receipt .total span:first-child {
          font-weight: bold;
        }

        .receipt .total .price {
          font-weight: bold;
        }

        @media print {
          .receipt {
            display: block;
            margin: 0;
            font-size: 12pt;
            width: 100%;
            page-break-after: always;
            visibility: visible;
          }
        }
      `
    },
    async newOrder() {
      if (this.order_id != 0) {
        this.$vToastify.error('Order in progress', 'Message');
        return;
      }
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
      this.discount = this.formartValue(order.discount)
      this.vat = this.formartValue(order.vat)
      this.change = this.formartValue(0)
      this.items_count = order.items_count
      this.transaction_date = order.transaction_date
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
        const response = await ItemsService.show(this.item.barcode)
        const transformedData = {
          ...response.data,
          price: this.formartValue(response.data.price),
        }
        this.item = transformedData
      }
      catch (error) {
        this.handleError(error)
        this.$refs.addLineItemForm.reset()
      }
    },
    async addLineItem() {
      if (this.order_id == 0) {
        this.$vToastify.error('Order not found, Please create new order', 'Error');
        return;
      }
      if (this.item.barcode == null) {
        this.$vToastify.error('Message, Please enter item code', 'Error');
        return
      }
      try {
        let line_item_payload = {
          item_id: this.item.id,
          quantity: this.item.quantity
        }
        this.loading = true
        const response = await LineItemService.create(this.user.id, this.order_id, line_item_payload)
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
    async applyDiscount(item) {
      try {
        let line_item_payload = {
          discount: item.discount
        }
        this.loading = true
        const response = await LineItemService.applyDiscount(this.user.id, this.order_id, line_item_payload, item.id)
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
    processPayment() {
      if (this.pay >= parseFloat(this.order_total.replace(",", ""))) {
        const change = this.pay - parseFloat(this.order_total.replace(",", ""));
        this.change = this.formartValue(change)
      } else {
        this.change = this.formartValue(0)
      }
    },
    issueReceipt() {
      if (this.order_id == 0) {
        this.$vToastify.error('Order not found', 'Message');
        return;
      }
      if (this.pay != null && this.pay >= parseFloat(this.order_total.replace(",", ""))) {
        this.lineItems = []
        this.$store.commit('setOderId', 0)
        this.$vToastify.success('Order successfully completed', 'Message');
        // this.printReceipt();
        this.clearData();
      }
    },
    clearData() {
      this.lineItems = []
      this.sub_total = this.formartValue(0)
      this.order_total = this.formartValue(0)
      this.vat = this.formartValue(0)
      this.change = this.formartValue(0)
      this.discount = this.formartValue(0)
      this.pay = null
      this.items_count = 0
    },
    formartValue(value) {
      return parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    logout() {
      this.$store.commit('setToken', null)
      this.$store.commit('setUser', null)
      this.$store.commit('setTempPass', null)
      this.$router.push('/login')
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
<style scoped>
.receipt {
  border: 1px solid black;
  padding: 10px;
  font-family: Arial, sans-serif;
  font-size: 14px;
  width: 300px;
  visibility: hidden; /* hide by default */
}

.receipt h1 {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin: 0 0 10px 0;
}

.receipt ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.receipt li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.receipt .item {
  flex: 0.3;
}

.receipt .price {
  flex: 0.3;
}

.receipt .total {
  flex: 0.3;
}

.receipt .total span:first-child {
  font-weight: bold;
}

.receipt .total .price {
  font-weight: bold;
}

@media print {
  .receipt {
    display: block;
    margin: 0;
    font-size: 12pt;
    width: 100%;
    page-break-after: always;
    visibility: visible; /* show only when printing */
  }
}

</style>