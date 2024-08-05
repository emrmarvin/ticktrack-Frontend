<template>
  <v-row class="mx-auto mt-2 mb-6">
    <v-col cols="6">
      <v-card>
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title class="headline mb-5">
              P5 Weekly Work Type Summary
            </v-list-item-title>

            <v-sheet
              color="background"
              class="mx-auto"
              max-width="calc(100% - 32px)"
              height="200"
            >
              <chartist
                :data="ProductsPerBU.data"
                :options="ProductsPerBU.options"
                :responsive-options="ProductsPerBU.responsiveOptions"
                color="#FFFFFF"
                type="Bar"
              />
            </v-sheet>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-col>
    <v-col cols="6">
      <v-card>
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title class="headline mb-5">
              P5 Work Type Summary
            </v-list-item-title>
            <v-sheet
              color="background"
              class="mx-auto"
              max-width="calc(100% - 32px)"
              height="200"
            >
              <chartist
                ratio="ct-major-second"
                type="Pie"
                :data="chartData.data"
                :options="chartData.options"
                :responsive-options="chartData.responsiveOptions"
              >
              </chartist>
            </v-sheet>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "DashboardStaff",
  data() {
    return {
      ProductsPerBU: {
        data: {
          labels: ["P1", "P2", "P3", "P4", "P5","P6", "P7", "P8", "P9", "P10", "P11", "P12"],
          series: [[50, 20, 30, 100, 190,50, 20, 30, 100, 190,0,0]],
        },
        options: {
          axisX: {
            showGrid: true,
          },
          low: 0,
          high: 200,
          chartPadding: {
            top: 0,
            right: 5,
            bottom: 0,
            left: 0,
          },
          height: 200,
        },
        responsiveOptions: [
          [
            "screen and (max-width: 640px)",
            {
              seriesBarDistance: 100,
              axisX: {
                labelInterpolationFnc: function (value) {
                  return value[0];
                },
              },
            },
          ],
        ],
      },
      chartData: {
        data: {
          labels: ["Projects", "Transactional"],
          series: [20, 40],
        },
        options: {
          labelInterpolationFnc: function (value) {
            return value[0];
          },
        },
        responsiveOptions: [
          [
            "screen and (min-width: 640px)",
            {
              chartPadding: 30,
              labelOffset: 100,
              labelDirection: "explode",
              labelInterpolationFnc: function (value) {
                return value;
              },
            },
          ],
          [
            "screen and (min-width: 1024px)",
            {
              labelOffset: 80,
              chartPadding: 20,
            },
          ],
        ],
      },
      TicketCountPerPeriod:[]
    };
  },
  mounted(){
    this.getTicketCountPerPeriod()
  },
  methods:{
    getTicketCountPerPeriod(){
      setTimeout(() => {
        console.log("count", this.$store.state.userTickets[0])
      }, 3000);
      
      this.TicketCountPerPeriod.push()
    }
  }
};
</script>

<style>
.ct-major-second {
  height: 200px;
}
.ct-series-a .ct-bar,
.ct-series-a .ct-line,
.ct-series-a .ct-point,
.ct-series-a .ct-slice-donut {
  stroke: #1565c0;
}
.ct-series-b .ct-area,
.ct-series-b .ct-slice-donut-solid,
.ct-series-b .ct-slice-pie {
  fill: #4caf50;
}
</style>