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
          labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          series: [[50, 20, 30, 100, 190]],
        },
        options: {
          axisX: {
            showGrid: false,
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
    };
  },
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