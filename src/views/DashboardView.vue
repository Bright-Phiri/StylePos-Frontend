<template>
  <div class="DashboardView">
    <v-container class="py-8 px-6" fluid>
      <v-row>
        <v-col cols="12" lg="8">
          <v-row>
            <v-col>
              <v-card color="#B55B52" height="180px" style="border-radius: 10px;" class="elevation-0 pa-5">
                <v-card-title class="d-flex justify-space-between">
                  <v-avatar style="border-radius: 13%;" color="#BE6F67" size="64">
                    <v-icon large color="white">mdi-cart</v-icon>
                  </v-avatar>
                  <v-icon x-small color="white">mdi-greater-than</v-icon>
                </v-card-title>
                <v-card-text class="d-flex flex-column">
                  <h2 class="font-weight-regular heading-color">Total sales</h2>
                  <h2 class="heading-color mt-2"><animated-number :value="total_sales" :formatValue="formatAmount"
                      :duration="1200" /></h2>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col>
              <v-card height="180px" class="elevation-0 my-card pa-5">
                <v-card-title class="d-flex justify-space-between">
                  <v-avatar style="border-radius: 13%;" color="#F4E7E5" size="64">
                    <v-icon large color="#B55B52">mdi-cart</v-icon>
                  </v-avatar>
                  <v-icon x-small color="black">mdi-greater-than</v-icon>
                </v-card-title>
                <v-card-text class="d-flex flex-column">
                  <h2 class="font-weight-regular">Daily total sales</h2>
                  <h2 class="mt-2"><animated-number :value="daily_total_sales" :formatValue="formatAmount"
                      :duration="1500" /></h2>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col>
              <v-card color="white" height="180px" style="border-radius: 10px;" class="elevation-0 pa-5">
                <v-card-title class="d-flex justify-space-between">
                  <v-avatar style="border-radius: 13%;" color="#F4E7E5" size="64">
                    <v-icon large color="#B55B52">mdi-cash-multiple</v-icon>
                  </v-avatar>
                  <v-icon x-small color="black">mdi-greater-than</v-icon>
                </v-card-title>
                <v-card-text class="d-flex flex-column">
                  <h2 class="font-weight-regular">Daily Transactions</h2>
                  <h2 class="mt-2"><animated-number :value="orders_count" :formatValue="formatValue" :duration="900" />
                  </h2>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" lg="12" xl="12" sm="12" md="12">
              <v-card color="#ffffff" style="border-radius: 10px;" class="elevation-0">
                <v-card-title>
                  <h4 class="ml-7">Transaction Statistics</h4>
                </v-card-title>
                <v-card-text>
                  <div class="justify-center">
                    <apexchart width="100%" height="226%" type="area" :options="statisticsOptions" :series="stati">
                    </apexchart>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="4">
          <div class="side-content">
            <v-card color="#ffffff" style="border-radius: 10px;" class="elevation-0">
              <v-card-title>Sales Overview</v-card-title>
              <v-card-text class="d-flex justify-center">
                <apexchart v-if="series && series.length" width="350" type="donut" :options="options" :series="series">
                </apexchart>
              </v-card-text>
            </v-card>
            <v-card color="#ffffff" style="border-radius: 10px;" class="mt-0 elevation-0">
              <v-card-title>Inventory</v-card-title>
              <v-card-text>
                <v-alert border="left" colored-border color="green" elevation="1">
                  <v-row>
                    <v-col>
                      <v-avatar tile size="64">
                        <v-img src="@/assets/i-stock.png"></v-img>
                      </v-avatar>
                    </v-col>
                    <v-col>
                      <h4 class="text-center font-weight-light">Items In Stock</h4>
                      <h4 class="text-center text-white">
                        <animated-number :value="in_stock_count" :formatValue="formatValue" :duration="2200" />
                      </h4>
                    </v-col>
                  </v-row>
                </v-alert>
                <v-alert border="left" colored-border color="red" elevation="1">
                  <v-row>
                    <v-col>
                      <v-avatar tile size="64">
                        <v-img src="@/assets/o-stock.png"></v-img>
                      </v-avatar>
                    </v-col>
                    <v-col>
                      <h4 class="text-center font-weight-light">Items Out Of Stock</h4>
                      <h4 class="text-center text-white">
                        <animated-number :value="out_of_stock_count" :formatValue="formatValue" :duration="2500" />
                      </h4>
                    </v-col>
                  </v-row>
                </v-alert>
              </v-card-text>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import AnimatedNumber from "animated-number-vue";
export default {
  name: "DashboardView",
  components: {
    AnimatedNumber
  },
  data() {
    return {
      orders_count: 0,
      total_sales: 0,
      daily_total_sales: 0,
      monthly_total_sales: 0,
      out_of_stock_count: 0,
      in_stock_count: 0,
      weekly_total_sales: 0,
      statisticsOptions: {
        chart: {
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false,
        },
        plotOptions: {
          bar: {
            horizontal: false
          }
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.5,
            opacityTo: 0,
            stops: []
          }
        },
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        colors: ['#E47C8C'],
        stroke: {
          curve: 'smooth'
        },
      },
      options: {
        plotOptions: {
          donut: {
            size: '30%'
          }
        },
        legend: {
          position: 'bottom'
        },
        colors: ['#EB996E', '#FF968B', '#FCBEB6'],
        labels: ["Daily", "Weekly", "Monthly"]
      },
      series: [],
      stati: [{
        name: 'Transactions',
        data: []
      }],
    }
  },
  methods: {
    clearChart(series) {
      while (series.length) {
        series.pop();
      }
    },
    setDashboardData(data) {
      this.orders_count = data.number_of_orders
      this.total_sales = Number(data.total_sales).toFixed(2)
      this.daily_total_sales = Number(data.daily_sales).toFixed(2);
      this.monthly_total_sales = Number(data.monthly_revenue).toFixed(2)
      this.weekly_total_sales = Number(data.weekly_revenue).toFixed(2)
      this.out_of_stock_count = data.items_out_of_stock_count
      this.in_stock_count = data.items_in_stock_count
      this.series.splice(0, this.series.length)
      this.series.push(Math.floor(this.daily_total_sales), Math.floor(this.weekly_total_sales), Math.floor(this.monthly_total_sales)) //apa ma float ako ayi
    },
    setOrdersStatistics(data) {
      const ordersStatistics = Array(12).fill(0);
      const m_order_statistics = data.monthly_order_statistics;
      m_order_statistics.forEach(m_order => {
        const order_month = new Date(m_order.created_at).getMonth();
        ordersStatistics[order_month]++;
      });
      this.stati = [{ data: ordersStatistics }];
    },
    formatValue(value) {
      return `${value.toFixed(0)}`;
    },
    formatAmount(value) {
      return `MK ${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    },
    updateDashboard(data){
      switch (data.type) {
        case "all":
          this.setOrdersStatistics(data)
          this.setDashboardData(data)
          break;
        case "order":
          this.orders_count = data.number_of_orders
          this.setOrdersStatistics(data)
          break;
        case "line_items":
          this.total_sales = Number(data.total_sales).toFixed(2)
          this.daily_total_sales = Number(data.daily_sales).toFixed(2);
          this.monthly_total_sales = Number(data.monthly_revenue).toFixed(2)
          this.weekly_total_sales = Number(data.weekly_revenue).toFixed(2)
          this.out_of_stock_count = data.items_out_of_stock_count
          this.in_stock_count = data.items_in_stock_count
          this.clearChart(this.series)
          this.series.splice(0, this.series.length)
          this.series.push(Math.floor(this.daily_total_sales), Math.floor(this.weekly_total_sales), Math.floor(this.monthly_total_sales)) //apa ma float ako ayi
          break;
        case "inventory":
          this.out_of_stock_count = data.items_out_of_stock_count
          this.in_stock_count = data.items_in_stock_count
          break;
      }
    }

  },
  channels: {
    DashboardChannel: {
      connected() {},
      rejected() {},
      received(data) {
        this.updateDashboard(data)
      },
      disconnected() {},
    },
  },
  mounted() {
    this.$cable.subscribe({ channel: "DashboardChannel" });
  }
};
</script>

<style scoped>
.heading-color {
  color: #ffffff;
}

.my-card {
  background-color: #F5F4F7;
  border: 2px dashed #D0D0D2;
  border-radius: 10px;
}

.font-class-name * {
  font-size: 14px;
}

.side-content {
  background-color: #ffffff;
  border-radius: 10px;
}</style>
