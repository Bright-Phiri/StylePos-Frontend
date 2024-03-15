<template>
  <div class="DashboardView">
    <v-container class="py-4 px-1" fluid>
      <v-row>
        <v-col cols="12" lg="8">
          <v-row>
            <v-col cols="12" lg="4" sm="6" md="4">
              <v-card color="#B55B52" style="border-radius: 10px;" class="elevation-0 pa-5">
                <div class="d-flex justify-space-between mt-0">
                  <v-avatar style="border-radius: 13%;" color="#BE6F67" size="64">
                    <v-icon large color="white">mdi-cart</v-icon>
                  </v-avatar>
                  <v-icon x-small color="white">mdi-greater-than</v-icon>
                </div>
                <div class="d-flex flex-column flex-grow">
                  <p class="text-sm mt-1 heading-color">Total sales</p>
                  <span class="heading-color font-weight-bold"><animated-number :value="total_sales"
                      :formatValue="formatAmount" :duration="1200" /></span>
                </div>
              </v-card>
            </v-col>
            <v-col cols="12" lg="4" sm="6" md="4">
              <v-card class="elevation-0 my-card pa-5" style="border-radius: 10px;">
                <div class="d-flex justify-space-between">
                  <v-avatar style="border-radius: 13%;" color="#F4E7E5" size="64">
                    <v-icon large color="#B55B52">mdi-cart</v-icon>
                  </v-avatar>
                  <v-icon x-small color="black">mdi-greater-than</v-icon>
                </div>
                <div class="d-flex flex-column flex-grow">
                  <p class="text-sm mt-1">Daily total sales</p>
                  <span class="font-weight-bold"><animated-number :value="daily_total_sales" :formatValue="formatAmount"
                      :duration="1500" /></span>
                </div>
              </v-card>
            </v-col>
            <v-col cols="12" lg="4" sm="12" md="4">
              <v-card color="white" style="border-radius: 10px;" class="elevation-1 pa-5">
                <div class="d-flex justify-space-between">
                  <v-avatar style="border-radius: 13%;" color="#F4E7E5" size="64">
                    <v-icon large color="#B55B52">mdi-cash-multiple</v-icon>
                  </v-avatar>
                  <v-icon x-small color="black">mdi-greater-than</v-icon>
                </div>
                <div class="d-flex flex-column">
                  <p class="text-sm mt-1">Daily Sales</p>
                  <span class="font-weight-bold"><animated-number :value="orders_count" :formatValue="formatValue"
                      :duration="900" />
                  </span>
                </div>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" lg="12" xl="12" sm="12" md="12">
              <v-card color="#ffffff" style="border-radius: 10px;" class="elevation-0">
                <v-card-title>
                  <h4 class="ml-7 text-subtitle-1 font-weight-regular">Annual Transactions Summary</h4>
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
              <v-card-title class="text-subtitle-1 font-weight-regular">Sales Overview</v-card-title>
              <v-card-text class="d-flex justify-center">
                <apexchart v-if="series && series.length" width="350" type="donut" :options="options" :series="series">
                </apexchart>
              </v-card-text>
            </v-card>
            <v-card color="#ffffff" style="border-radius: 10px;" class="mt-0 elevation-0">
              <v-card-title class="text-subtitle-1 font-weight-regular">Inventory Levels</v-card-title>
              <v-card-text>
                <v-alert border="left" colored-border color="green" elevation="1">
                  <v-row>
                    <v-col class="d-flex flex-column">
                      <v-avatar tile size="40">
                        <v-img src="@/assets/i-stock.png"></v-img>
                      </v-avatar>
                      <v-sparkline :value="value" :gradient="gradient" :smooth="radius || false" :padding="padding"
                        :line-width="width" :stroke-linecap="lineCap" :gradient-direction="gradientDirection"
                        :fill="fill" :type="type" :auto-line-width="autoLineWidth" auto-draw></v-sparkline>
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
                    <v-col class="d-flex flex-column">
                      <v-avatar tile size="40">
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
const gradients = [
  ['#222'],
  ['#42b3f4'],
  ['red', 'orange', 'yellow'],
  ['purple', 'violet'],
  ['#00c6ff', '#F0F', '#FF0'],
  ['#f72047', '#ffd200', 'black'],
]
export default {
  name: "DashboardView",
  components: {
    AnimatedNumber
  },
  data() {
    return {
      width: 2,
      radius: 10,
      padding: 8,
      lineCap: 'round',
      gradient: gradients[5],
      value: [0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0],
      gradientDirection: 'top',
      gradients,
      fill: false,
      type: 'trend',
      autoLineWidth: false,
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
        forecastDataPoints: {
          count: 9
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
            size: '30%',
          }
        },
        legend: {
          position: 'bottom'
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return `MK${val.toLocaleString('en-US', { minimumFractionDigits: 2 })}`; // Display decimal places
            }
          }
        },
        colors: ['#555555', '#FF968B', '#FCBEB6'],
        labels: ["Daily", "Weekly", "Monthly"],
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
    formatValue(value) {
      return `${value.toFixed(0)}`;
    },
    formatAmount(value) {
      return `MK ${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    },
    updateDashboard(data) {
      switch (data.type) {
        case "refresh_dashbaord":
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
  },
  channels: {
    DashboardChannel: {
      connected() { },
      rejected() { },
      received(data) {
        this.updateDashboard(data)
      },
      disconnected() { },
    },
  },
  mounted() {
    this.$cable.connection.connect(`ws://localhost:3000/cable?token=${this.$store.state.token}`);
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
}
</style>
