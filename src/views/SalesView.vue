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
      <v-dialog max-width="800" v-model="dialog" persistent transition="fab-transition">
        <v-card>
          <v-card-title class="d-flex justify-space-between">
             Item Lookup
            <v-icon v-on:click="toggleDialog">mdi-close</v-icon>
          </v-card-title>
          <v-card-text>
            <div class="d-flex justify-end">
            <v-text-field color="#B55B68" ref="findItemTextField" v-model.trim="search" @input="findItem" dense outlined
              placeholder="Search"  append-icon="mdi-magnify"></v-text-field>
          </div>
            <v-data-table :loading="itemsLoading" loading-text="Loading Items... Please wait"
              :headers="itemsHeaders" :server-items-length="total" :items-per-page="itemsPerPage" :page.sync="currentPage"
              @pagination="onPagination" :items="items" :search="searchItem" :sort-desc="[false, true]"
              multi-sort>
              <template v-slot:[`item.action`]="{ item }">
                <v-icon medium class="ml-2" v-on:click="addItem(item.barcode)" color="blue">mdi-plus</v-icon>
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
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-col cols="12" lg="9" xl="9">
        <v-card class="mt-2">
          <v-card-title class="d-flex justify-space-between">
            <h4 class="mb-9">Items</h4>
            <v-text-field dense outlined v-model="itemSearch" placeholder="Search line item" class="shrink ml-2"
              append-icon="mdi-magnify"></v-text-field>
          </v-card-title>
          <v-card-text>
            <v-divider></v-divider>
            <v-data-table height="250" dense :loading="loading" loading-text="Loading Line Items... Please wait"
              :headers="headers" :items="lineItems" :items-per-page="6" :search="itemSearch" :sort-desc="[false, true]"
              multi-sort>
              <template v-slot:[`item.action`]="{ item }">
                <v-icon small class="ml-2" color="red" v-on:click="removeLineItem(item.id)">mdi-close-thick</v-icon>
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
            <h4>Total Number Of Items: {{ items_count }}</h4>
          </v-card-text>
        </v-card>
        <v-card class="mt-4">
          <v-card-title class="d-flex justify-space-between">Add Item
            <v-btn small outlined color="grey" v-on:click="toggleDialog" class="text-capitalize"> <v-icon small>mdi-magnify</v-icon>Item Lookup</v-btn></v-card-title>
          <v-card-text>
            <v-form @submit.prevent ref="addLineItemForm" class="d-flex justify-space-between">
              <div class="d-inline-flex" style="width: 100%">
                <v-text-field ref="barcodeTextField" label="Scan/Enter Item Code" color="blue" class="mr-4"
                  v-model.trim="item.barcode" v-on:keyup.enter="searchItem" outlined></v-text-field>
                <v-btn class="white--text" color="#1572E8" x-large v-on:click="addLineItem">
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
                <v-alert color="#001F3F" style="border-radius: 0">
                  <div class="text-h6 white--text">
                    {{ order_total }}
                  </div>
                </v-alert>
                <div class="d-flex">
                  <h1 class="text-h6 text-center">SUB TOTAL&nbsp;:</h1>
                  <h1 class="text-h6 text-center ml-1">{{ sub_total }}</h1>
                </div>
                <div class="d-flex mt-2">
                  <h1 class="text-h6 text-center">DISCOUNT&nbsp;&nbsp;:</h1>
                  <h1 class="text-h6 text-center ml-1">{{ discount }}</h1>
                </div>
                <div class="d-flex mt-2">
                  <h1 class="text-h6 text-center">VAT&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</h1>
                  <h1 class="text-h6 text-center ml-1">{{ vat }}</h1>
                </div>
                <h2 class="mt-2">TENDERED AMOUNT</h2>
                <v-text-field class="mt-1" color="blue" v-model="pay" v-on:keyup="processPayment" style="border-radius: 0"
                  outlined></v-text-field>
                <h2 class="mt-1">CHANGE</h2>
                <v-alert color="#001F3F" style="border-radius: 0">
                  <div class="text-h6 white--text">{{ change }}</div>
                </v-alert>
                <v-btn large class="white--text" v-on:click="issueReceipt" depressed flat color="green">Finish
                  Sale</v-btn>
                <v-btn large class="mt-2 white--text" v-on:click="voidOrder" depressed flat color="red">VOID</v-btn>
                <v-btn large class="mt-2 white--text" v-on:click="newOrder" depressed flat color="blue">NEW
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
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
export default {
  name: "SalesView",
  data() {
    return {
      loading: false,
      lineItems: [],
      search: '',
      itemSearch: '',
      user: {},
      dialog: false,
      itemsLoading: false,
      searchTimeout: null,
      currentPage: 1,
      itemsPerPage: 7,
      items: [],
      total: 0,
      headers: [
        {
          text: 'Barcode',
          align: 'start',
          sortable: false,
          value: 'barcode',
        },
        { text: 'Item', value: 'item' },
        { text: 'Price', value: 'price' },
        { text: 'Quantity', value: 'quantity' },
        { text: 'Discount', value: 'discount' },
        { text: 'Subtotal ', value: 'total' },
        { text: 'Action', value: 'action' },
      ],
      itemsHeaders: [
        { text: "Barcode", align: "start", sortable: false, value: "barcode" },
        { text: "Product", value: "name" },
        { text: "Seling Price", value: "selling_price" },
        { text: "Size", value: "size" },
        { text: "Color", value: "color" },
        { text: "Action", value: "action" },
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
    onPagination(page) {
      this.currentPage = Number(page.page);
      this.fetchDataFromAPI(this.currentPage, this.itemsPerPage, this.search);
    },
    async generateReceipt() {
      const lineItems = [
        { description: 'Item 1', quantity: 2, unitPrice: 10.00, total: 20.00, totalVAT: 3.30 },
        { description: 'Item 2', quantity: 1, unitPrice: 15.00, total: 15.00, totalVAT: 2.48 },
      ];
      const total = 35.00;

      const pdfUrl = await this.generateTransactionReceipt(lineItems, total);
      if (pdfUrl) {
        this.printPDF(pdfUrl);
      } else {
        console.error('Failed to generate receipt');
      }
    },
    async generateTransactionReceipt(lineItems, total) {
      try {
        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([216, 432]); // Page size 72f * 3 by 72f * 6 (in points)

        // Embed a font
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontSize = 8;

        // Add taxpayer details
        this.addText(page, 'Business Name', font, fontSize, 108, 400, 'center');
        this.addText(page, 'Address', font, fontSize, 108, 390, 'center');
        this.addText(page, 'Address', font, fontSize, 108, 380, 'center');
        this.addText(page, '20204525', font, fontSize, 108, 370, 'center');
        this.addText(page, '*VAT REGISTERED*', font, fontSize, 108, 360, 'center');

        // Add buyer details
        const buyerDetails = [
          { label: "BUYER'S NAME", value: '' },
          { label: "BUYER'S TIN", value: '' },
          { label: 'ZNO', value: '' }
        ];
        let yPosition = 320;
        buyerDetails.forEach(detail => {
          this.addText(page, detail.label, font, fontSize, 10, yPosition, 'left');
          this.addText(page, detail.value, font, fontSize, 206, yPosition, 'right');
          yPosition -= 10;
        });

        // Add line items
        yPosition -= 10;
        let totalVAT = 0;
        let taxableAmount = 0;
        lineItems.forEach(item => {
          const itemName = item.description;
          const quantity = item.quantity.toString().padStart(6, ' ');
          const unitPrice = this.formatValue(item.unitPrice).padStart(10, ' ');
          const totalPrice = this.formatValue(item.total).padStart(10, ' ');

          this.addText(page, `${itemName} ${unitPrice} ${quantity} ${totalPrice}`, font, fontSize, 10, yPosition, 'left');
          yPosition -= 10;

          totalVAT += item.totalVAT;
          taxableAmount += item.total - item.totalVAT;
        });

        // Add totals and VAT
        yPosition -= 10;
        this.addText(page, `Taxable A-16.5%: ${this.formatValue(taxableAmount).padStart(20, ' ')}`, font, fontSize, 10, yPosition, 'left');
        yPosition -= 10;
        this.addText(page, `VAT A-16.5%: ${this.formatValue(totalVAT).padStart(20, ' ')}`, font, fontSize, 10, yPosition, 'left');
        yPosition -= 10;
        this.addText(page, `TOTAL VAT: ${this.formatValue(totalVAT).padStart(20, ' ')}`, font, fontSize, 10, yPosition, 'left');
        yPosition -= 10;
        this.addText(page, `Total: ${this.formatValue(total).padStart(20, ' ')}`, font, fontSize, 10, yPosition, 'left');

        // Add end of receipt text
        yPosition -= 20;
        this.addText(page, '*** END OF A LEGAL RECEIPT ***', font, fontSize, 108, yPosition, 'center');

        // Save the PDF document
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        // Return or download the PDF file as needed
        return url;
      } catch (error) {
        console.error('Error generating receipt:', error);
        return null;
      }
    },
    addText(page, text, font, size, x, y, align = 'left') {
      const textWidth = font.widthOfTextAtSize(text, size);
      if (align === 'center') x -= textWidth / 2;
      if (align === 'right') x -= textWidth;
      page.drawText(text, { x, y, size, font, color: rgb(0, 0, 0) });
    },
    formatValue(value) {
      return value.toFixed(2);
    },
    printPDF(pdfUrl) {
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = 'none';
      iframe.src = pdfUrl;
      document.body.appendChild(iframe);

      iframe.onload = () => {
        iframe.contentWindow.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      };
    },
    async fetchDataFromAPI(page, perPage, search) {
      this.itemsLoading = true;
      try {
        const response = await ItemsService.getData(page, perPage, search);
        this.items = response.data.items;
        this.total = response.data.total;
        this.itemsLoading = false;
      } catch (error) {
        this.itemsLoading = false;
        this.handleError(error);
      }
    },
    findItem() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.fetchDataFromAPI(this.currentPage, this.itemsPerPage, this.search);
      }, 500);
    },
    toggleDialog(){
      this.dialog = !this.dialog
      this.$refs.barcodeTextField.focus();
    },
    async newOrder() {
      if (this.order_id != 0) {
        this.$vToastify.error('Order in progress', 'Message');
        this.$refs.barcodeTextField.focus();
        return;
      }
      try {
        const response = await OrdersService.create(this.user.id)
        if (response.status === 201) {
          const order = response.data
          this.$store.commit('setOderId', order.id)
          this.$refs.barcodeTextField.focus();
          this.$vToastify.success('Order created successfully', 'Message');
        }
      }
      catch (error) {
        this.handleError(error)
        this.$refs.barcodeTextField.focus();
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
          this.$refs.barcodeTextField.focus();
        }
      }
      catch (error) {
        this.handleError(error)
        this.loading = false
        this.$refs.barcodeTextField.focus();
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
      this.$refs.barcodeTextField.focus();
    },
    async voidOrder() {
      if (this.order_id == 0) {
        this.$vToastify.error('No items added, add some items first', 'Warning');
        this.$refs.barcodeTextField.focus();
        return;
      }
      try {
        const response = await OrdersService.delete(this.order_id)
        if (response.status === 204) {
          this.$store.commit('setOderId', 0)
          this.clearData();
          this.$refs.barcodeTextField.focus();
          this.$vToastify.success('Order voided successfully', 'Message');
        }
      }
      catch (error) {
        this.handleError(error)
        this.$refs.barcodeTextField.focus();
      }
    },
    addItem(barcode){
      this.item.barcode = barcode
      this.searchItem();
      this.toggleDialog();
    },
    async searchItem() {
      try {
        const response = await ItemsService.show(this.item.barcode)
        const transformedData = {
          ...response.data,
          price: this.formartValue(response.data.selling_price),
        }
        this.item = transformedData
        this.item.quantity = 1
        this.addLineItem();
        this.$refs.barcodeTextField.focus();
      }
      catch (error) {
        this.handleError(error)
        this.$refs.addLineItemForm.reset()
        this.$refs.barcodeTextField.focus();
      }
    },
    async addLineItem() {
      if (this.order_id == 0) {
        this.$refs.barcodeTextField.focus();
        this.$vToastify.error('Order not found, Please create new order', 'Error');
        return;
      }
      if (this.item.barcode == null) {
        this.$refs.barcodeTextField.focus();
        this.$vToastify.error('Message, Please enter item code', 'Error');
        return
      }
      try {
        let line_item_payload = {
          item_id: this.item.id,
          quantity: this.item.quantity
        }
        this.loading = true
        const response = await LineItemService.create(this.order_id, line_item_payload)
        if (response.status === 200) {
          const order = response.data
          this.setData(order)
          this.loading = false
          this.$refs.addLineItemForm.reset()
          this.$refs.barcodeTextField.focus();
        }
      }
      catch (error) {
        this.loading = false
        this.handleError(error)
        this.$refs.addLineItemForm.reset()
        this.$refs.barcodeTextField.focus();
      }
    },
    async updateLineItemQauantity(item) {
      try {
        let line_item_payload = {
          quantity: item.quantity
        }
        this.loading = true
        const response = await LineItemService.update(line_item_payload, item.id)
        if (response.status === 200) {
          const order = response.data
          this.setData(order)
          this.loading = false
          this.$refs.addLineItemForm.reset()
          this.$refs.barcodeTextField.focus();
        }
      }
      catch (error) {
        this.loading = false
        this.handleError(error)
        this.user = this.$store.state.user
        if (this.order_id !== 0) {
          this.setOrder(this.order_id)
          this.$refs.barcodeTextField.focus();
        } else {
          this.clearData();
          this.$refs.barcodeTextField.focus();
        }
      }
    },
    async removeLineItem(line_item_id) {
      this.loading = true
      try {
        const response = await LineItemService.delete(line_item_id)
        if (response.status === 200) {
          const order = response.data
          this.setData(order)
          this.loading = false
          this.$refs.addLineItemForm.reset()
          this.$refs.barcodeTextField.focus();
        }
      }
      catch (error) {
        this.handleError(error)
        this.$refs.barcodeTextField.focus();
      }

    },
    async applyDiscount(item) {
      try {
        let line_item_payload = {
          discount: item.discount
        }
        this.loading = true
        const response = await LineItemService.applyDiscount(this.order_id, line_item_payload, item.id)
        if (response.status === 200) {
          const order = response.data
          this.setData(order)
          this.loading = false
          this.$refs.addLineItemForm.reset()
          this.$refs.barcodeTextField.focus();
        }
      }
      catch (error) {
        this.loading = false
        this.handleError(error)
        this.$refs.barcodeTextField.focus();
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
        this.$refs.barcodeTextField.focus();
        return;
      }
      if (this.pay != null && this.pay >= parseFloat(this.order_total.replace(",", ""))) {
        this.lineItems = []
        this.$store.commit('setOderId', 0)
        this.$vToastify.success('Order completed successfully', 'Message');
        this.clearData();
        //this.generateReceipt();
        this.$refs.barcodeTextField.focus();
      }
      this.$refs.barcodeTextField.focus();
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
  }, 
  mounted() {
    this.$refs.barcodeTextField.focus();
    this.user = this.$store.state.user
    if (this.order_id !== 0) {
      this.setOrder(this.order_id)
    } else {
      this.clearData();
    }
  }
}
</script>
