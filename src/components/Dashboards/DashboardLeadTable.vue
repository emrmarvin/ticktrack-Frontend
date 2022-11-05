<template>
  <v-row class="mx-auto mt-2 mb-6">
    <v-col cols="12">
      <v-card elevation="10">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title  class="title mb-5">
              Team Overall Dashboard
            <OpsDashboardExport
                    :toExport_transactionals="dashboard_transactional"
                    :toExport_projects="dashboard_projects"
                    :disabled="false"
                    :teamID="$store.state.teamID"
                    style="float:right;margin-right:2px"
                  />
            </v-list-item-title>

            <v-progress-linear v-if="dashboard_projects.length != 12 && dashboard_transactional.length != 12" indeterminate color="yellow darken-2"></v-progress-linear>
            <div style="justify-content:center;display:flex;height:500px;padding-top:150px" v-if="dashboard_projects.length != 12 && dashboard_transactional.length != 12">Loading...</div>
            <template>             
               <v-simple-table v-if="dashboard_projects.length == 12 && dashboard_transactional.length == 12">
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">
                          KRAs
                        </th>
                        <th class="text-left">
                          P1
                        </th>
                        <th class="text-left">
                          P2
                        </th>
                        <th class="text-left">
                          P3
                        </th>
                        <th class="text-left">
                          P4
                        </th>
                        <th class="text-left">
                          P5
                        </th>
                        <th class="text-left">
                          P6
                        </th>
                        <th class="text-left">
                          P7
                        </th>
                        <th class="text-left">
                          P8
                        </th>
                        <th class="text-left">
                          P9
                        </th>
                        <th class="text-left">
                          P10
                        </th>
                        <th class="text-left">
                          P11
                        </th>
                        <th class="text-left">
                          P12
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                                        <!--Project Support--->
                      <tr style="background-color:#008C4F">
                        <td class="text-center" colspan="13">Project Support</td>
                      </tr>
                      <!--Service Performance-->
                      <tr style="background-color:#9FA1A4">
                        <td class="text-center"><b>Service Performance</b></td>
                        <td> {{percentage(dashboard_projects[0].Count_Met_SLA / dashboard_projects[0].Total_volume)}}</td>
                        <td> {{percentage(dashboard_projects[1].Count_Met_SLA / dashboard_projects[1].Total_volume)}}</td>
                        <td> {{percentage(dashboard_projects[2].Count_Met_SLA / dashboard_projects[2].Total_volume)}}</td>
                        <td> {{percentage(dashboard_projects[3].Count_Met_SLA / dashboard_projects[3].Total_volume)}}</td>
                        <td> {{percentage(dashboard_projects[4].Count_Met_SLA / dashboard_projects[4].Total_volume)}}</td>
                        <td> {{percentage(dashboard_projects[5].Count_Met_SLA / dashboard_projects[5].Total_volume)}}</td>
                        <td> {{percentage(dashboard_projects[6].Count_Met_SLA / dashboard_projects[6].Total_volume)}}</td>
                        <td> {{percentage(dashboard_projects[7].Count_Met_SLA / dashboard_projects[7].Total_volume)}}</td>
                        <td> {{percentage(dashboard_projects[8].Count_Met_SLA / dashboard_projects[8].Total_volume)}}</td>
                        <td> {{percentage(dashboard_projects[9].Count_Met_SLA / dashboard_projects[9].Total_volume)}}</td>
                        <td> {{percentage(dashboard_projects[10].Count_Met_SLA / dashboard_projects[10].Total_volume)}}</td>
                        <td> {{percentage(dashboard_projects[11].Count_Met_SLA / dashboard_projects[11].Total_volume)}}</td>
                      </tr>
                      <tr>
                        <td class="text-right">Count of Met SLAs</td>
                        <td>{{dashboard_projects[0].Count_Met_SLA}}</td>
                        <td>{{dashboard_projects[1].Count_Met_SLA}}</td>
                        <td>{{dashboard_projects[2].Count_Met_SLA}}</td>
                        <td>{{dashboard_projects[3].Count_Met_SLA}}</td>
                        <td>{{dashboard_projects[4].Count_Met_SLA}}</td>
                        <td>{{dashboard_projects[5].Count_Met_SLA}}</td>
                        <td>{{dashboard_projects[6].Count_Met_SLA}}</td>
                        <td>{{dashboard_projects[7].Count_Met_SLA}}</td>
                        <td>{{dashboard_projects[8].Count_Met_SLA}}</td>
                        <td>{{dashboard_projects[9].Count_Met_SLA}}</td>
                        <td>{{dashboard_projects[10].Count_Met_SLA}}</td>
                        <td>{{dashboard_projects[11].Count_Met_SLA}}</td>
                      </tr>
                      <tr>
                        <td class="text-right">Total Volume</td>
                        <td>{{dashboard_projects[0].Total_volume}}</td>
                        <td>{{dashboard_projects[1].Total_volume}}</td>
                        <td>{{dashboard_projects[2].Total_volume}}</td>
                        <td>{{dashboard_projects[3].Total_volume}}</td>
                        <td>{{dashboard_projects[4].Total_volume}}</td>
                        <td>{{dashboard_projects[5].Total_volume}}</td>
                        <td>{{dashboard_projects[6].Total_volume}}</td>
                        <td>{{dashboard_projects[7].Total_volume}}</td>
                        <td>{{dashboard_projects[8].Total_volume}}</td>
                        <td>{{dashboard_projects[9].Total_volume}}</td>
                        <td>{{dashboard_projects[10].Total_volume}}</td>
                        <td>{{dashboard_projects[11].Total_volume}}</td>
                      </tr>
                      <tr>
                        <td class="text-right">Count of Unmet SLAs</td>
                        <td>{{dashboard_projects[0].Count_UnMet_SLA}}</td>
                        <td>{{dashboard_projects[1].Count_UnMet_SLA}}</td>
                        <td>{{dashboard_projects[2].Count_UnMet_SLA}}</td>
                        <td>{{dashboard_projects[3].Count_UnMet_SLA}}</td>
                        <td>{{dashboard_projects[4].Count_UnMet_SLA}}</td>
                        <td>{{dashboard_projects[5].Count_UnMet_SLA}}</td>
                        <td>{{dashboard_projects[6].Count_UnMet_SLA}}</td>
                        <td>{{dashboard_projects[7].Count_UnMet_SLA}}</td>
                        <td>{{dashboard_projects[8].Count_UnMet_SLA}}</td>
                        <td>{{dashboard_projects[9].Count_UnMet_SLA}}</td>
                        <td>{{dashboard_projects[10].Count_UnMet_SLA}}</td>
                        <td>{{dashboard_projects[11].Count_UnMet_SLA}}</td>
                        
                      </tr>
                      <!--Quality Performance--->
                      <tr style="background-color:#9FA1A4">
                        <td  class="text-center"><b>Quality Performance</b></td>
                        <td> {{percentage(dashboard_projects[0].Quality_Count_Met_SLA / dashboard_projects[0].Total_volume)}}</td>
                        <td> {{percentage(dashboard_projects[1].Quality_Count_Met_SLA / dashboard_projects[1].Total_volume)}}</td>
                        <td> {{percentage(dashboard_projects[2].Quality_Count_Met_SLA / dashboard_projects[2].Total_volume)}}</td>
                        <td> {{percentage(dashboard_projects[3].Quality_Count_Met_SLA / dashboard_projects[3].Total_volume)}}</td>
                        <td> {{percentage(dashboard_projects[4].Quality_Count_Met_SLA / dashboard_projects[4].Total_volume)}}</td>
                        <td> {{percentage(dashboard_projects[5].Quality_Count_Met_SLA / dashboard_projects[5].Total_volume)}}</td>
                        <td> {{percentage(dashboard_projects[6].Quality_Count_Met_SLA / dashboard_projects[6].Total_volume)}}</td>
                        <td> {{percentage(dashboard_projects[7].Quality_Count_Met_SLA / dashboard_projects[7].Total_volume)}}</td>
                        <td> {{percentage(dashboard_projects[8].Quality_Count_Met_SLA / dashboard_projects[8].Total_volume)}}</td>
                        <td> {{percentage(dashboard_projects[9].Quality_Count_Met_SLA / dashboard_projects[9].Total_volume)}}</td>
                        <td> {{percentage(dashboard_projects[10].Quality_Count_Met_SLA / dashboard_projects[10].Total_volume)}}</td>
                        <td> {{percentage(dashboard_projects[11].Quality_Count_Met_SLA / dashboard_projects[11].Total_volume)}}</td>
                      </tr>
                      <tr>
                        <td class="text-right">Count of Met SLAs</td>
                        <td>{{dashboard_projects[0].Quality_Count_Met_SLA}}</td>
                        <td>{{dashboard_projects[1].Quality_Count_Met_SLA}}</td>
                        <td>{{dashboard_projects[2].Quality_Count_Met_SLA}}</td>
                        <td>{{dashboard_projects[3].Quality_Count_Met_SLA}}</td>
                        <td>{{dashboard_projects[4].Quality_Count_Met_SLA}}</td>
                        <td>{{dashboard_projects[5].Quality_Count_Met_SLA}}</td>
                        <td>{{dashboard_projects[6].Quality_Count_Met_SLA}}</td>
                        <td>{{dashboard_projects[7].Quality_Count_Met_SLA}}</td>
                        <td>{{dashboard_projects[8].Quality_Count_Met_SLA}}</td>
                        <td>{{dashboard_projects[9].Quality_Count_Met_SLA}}</td>
                        <td>{{dashboard_projects[10].Quality_Count_Met_SLA}}</td>
                        <td>{{dashboard_projects[11].Quality_Count_Met_SLA}}</td>
                      </tr>
                      <tr>
                        <td class="text-right">Total Volume</td>
                        <td>{{dashboard_projects[0].Total_volume}}</td>
                        <td>{{dashboard_projects[1].Total_volume}}</td>
                        <td>{{dashboard_projects[2].Total_volume}}</td>
                        <td>{{dashboard_projects[3].Total_volume}}</td>
                        <td>{{dashboard_projects[4].Total_volume}}</td>
                        <td>{{dashboard_projects[5].Total_volume}}</td>
                        <td>{{dashboard_projects[6].Total_volume}}</td>
                        <td>{{dashboard_projects[7].Total_volume}}</td>
                        <td>{{dashboard_projects[8].Total_volume}}</td>
                        <td>{{dashboard_projects[9].Total_volume}}</td>
                        <td>{{dashboard_projects[10].Total_volume}}</td>
                        <td>{{dashboard_projects[11].Total_volume}}</td>
                      </tr>
                      <tr>
                        <td class="text-right">Count of Unmet SLAs</td>
                        <td>{{dashboard_projects[0].Quality_Count_UnMet_SLA}}</td>
                        <td>{{dashboard_projects[1].Quality_Count_UnMet_SLA}}</td>
                        <td>{{dashboard_projects[2].Quality_Count_UnMet_SLA}}</td>
                        <td>{{dashboard_projects[3].Quality_Count_UnMet_SLA}}</td>
                        <td>{{dashboard_projects[4].Quality_Count_UnMet_SLA}}</td>
                        <td>{{dashboard_projects[5].Quality_Count_UnMet_SLA}}</td>
                        <td>{{dashboard_projects[6].Quality_Count_UnMet_SLA}}</td>
                        <td>{{dashboard_projects[7].Quality_Count_UnMet_SLA}}</td>
                        <td>{{dashboard_projects[8].Quality_Count_UnMet_SLA}}</td>
                        <td>{{dashboard_projects[9].Quality_Count_UnMet_SLA}}</td>
                        <td>{{dashboard_projects[10].Quality_Count_UnMet_SLA}}</td>
                        <td>{{dashboard_projects[11].Quality_Count_UnMet_SLA}}</td>
                      </tr> 
                                     <!--Transactional Support--->
                       <tr style="background-color:#008C4F">
                        <td class="text-center" colspan="13">Transactional Support</td>
                      </tr>
                      <!--Service Performance-->
                      <tr style="background-color:#9FA1A4">
                        <td class="text-center"><b>Service Performance</b></td>
                        <td> {{percentage(dashboard_transactional[0].Count_Met_SLA / dashboard_transactional[0].Total_volume)}}</td>
                        <td> {{percentage(dashboard_transactional[1].Count_Met_SLA / dashboard_transactional[1].Total_volume)}}</td>
                        <td> {{percentage(dashboard_transactional[2].Count_Met_SLA / dashboard_transactional[2].Total_volume)}}</td>
                        <td> {{percentage(dashboard_transactional[3].Count_Met_SLA / dashboard_transactional[3].Total_volume)}}</td>
                        <td> {{percentage(dashboard_transactional[4].Count_Met_SLA / dashboard_transactional[4].Total_volume)}}</td>
                        <td> {{percentage(dashboard_transactional[5].Count_Met_SLA / dashboard_transactional[5].Total_volume)}}</td>
                        <td> {{percentage(dashboard_transactional[6].Count_Met_SLA / dashboard_transactional[6].Total_volume)}}</td>
                        <td> {{percentage(dashboard_transactional[7].Count_Met_SLA / dashboard_transactional[7].Total_volume)}}</td>
                        <td> {{percentage(dashboard_transactional[8].Count_Met_SLA / dashboard_transactional[8].Total_volume)}}</td>
                        <td> {{percentage(dashboard_transactional[9].Count_Met_SLA / dashboard_transactional[9].Total_volume)}}</td>
                        <td> {{percentage(dashboard_transactional[10].Count_Met_SLA / dashboard_transactional[10].Total_volume)}}</td>
                        <td> {{percentage(dashboard_transactional[11].Count_Met_SLA / dashboard_transactional[11].Total_volume)}}</td>
                      </tr>
                      <tr>
                        <td class="text-right">Count of Met SLAs</td>
                        <td>{{dashboard_transactional[0].Count_Met_SLA}}</td>
                        <td>{{dashboard_transactional[1].Count_Met_SLA}}</td>
                        <td>{{dashboard_transactional[2].Count_Met_SLA}}</td>
                        <td>{{dashboard_transactional[3].Count_Met_SLA}}</td>
                        <td>{{dashboard_transactional[4].Count_Met_SLA}}</td>
                        <td>{{dashboard_transactional[5].Count_Met_SLA}}</td>
                        <td>{{dashboard_transactional[6].Count_Met_SLA}}</td>
                        <td>{{dashboard_transactional[7].Count_Met_SLA}}</td>
                        <td>{{dashboard_transactional[8].Count_Met_SLA}}</td>
                        <td>{{dashboard_transactional[9].Count_Met_SLA}}</td>
                        <td>{{dashboard_transactional[10].Count_Met_SLA}}</td>
                        <td>{{dashboard_transactional[11].Count_Met_SLA}}</td>
                      </tr>
                      <tr>
                        <td class="text-right">Total Volume</td>
                        <td>{{dashboard_transactional[0].Total_volume}}</td>
                        <td>{{dashboard_transactional[1].Total_volume}}</td>
                        <td>{{dashboard_transactional[2].Total_volume}}</td>
                        <td>{{dashboard_transactional[3].Total_volume}}</td>
                        <td>{{dashboard_transactional[4].Total_volume}}</td>
                        <td>{{dashboard_transactional[5].Total_volume}}</td>
                        <td>{{dashboard_transactional[6].Total_volume}}</td>
                        <td>{{dashboard_transactional[7].Total_volume}}</td>
                        <td>{{dashboard_transactional[8].Total_volume}}</td>
                        <td>{{dashboard_transactional[9].Total_volume}}</td>
                        <td>{{dashboard_transactional[10].Total_volume}}</td>
                        <td>{{dashboard_transactional[11].Total_volume}}</td>
                      </tr>
                      <tr>
                        <td class="text-right">Count of Unmet SLAs</td>
                        <td>{{dashboard_transactional[0].Count_UnMet_SLA}}</td>
                        <td>{{dashboard_transactional[1].Count_UnMet_SLA}}</td>
                        <td>{{dashboard_transactional[2].Count_UnMet_SLA}}</td>
                        <td>{{dashboard_transactional[3].Count_UnMet_SLA}}</td>
                        <td>{{dashboard_transactional[4].Count_UnMet_SLA}}</td>
                        <td>{{dashboard_transactional[5].Count_UnMet_SLA}}</td>
                        <td>{{dashboard_transactional[6].Count_UnMet_SLA}}</td>
                        <td>{{dashboard_transactional[7].Count_UnMet_SLA}}</td>
                        <td>{{dashboard_transactional[8].Count_UnMet_SLA}}</td>
                        <td>{{dashboard_transactional[9].Count_UnMet_SLA}}</td>
                        <td>{{dashboard_transactional[10].Count_UnMet_SLA}}</td>
                        <td>{{dashboard_transactional[11].Count_UnMet_SLA}}</td>
                      </tr>
                      <!--Quality Performance--->
                      <tr style="background-color:#9FA1A4">
                        <td class="text-center"><b>Quality Performance</b></td>
                        <td> {{percentage(dashboard_transactional[0].Quality_Count_Met_SLA / dashboard_transactional[0].Total_volume)}}</td>
                        <td> {{percentage(dashboard_transactional[1].Quality_Count_Met_SLA / dashboard_transactional[1].Total_volume)}}</td>
                        <td> {{percentage(dashboard_transactional[2].Quality_Count_Met_SLA / dashboard_transactional[2].Total_volume)}}</td>
                        <td> {{percentage(dashboard_transactional[3].Quality_Count_Met_SLA / dashboard_transactional[3].Total_volume)}}</td>
                        <td> {{percentage(dashboard_transactional[4].Quality_Count_Met_SLA / dashboard_transactional[4].Total_volume)}}</td>
                        <td> {{percentage(dashboard_transactional[5].Quality_Count_Met_SLA / dashboard_transactional[5].Total_volume)}}</td>
                        <td> {{percentage(dashboard_transactional[6].Quality_Count_Met_SLA / dashboard_transactional[6].Total_volume)}}</td>
                        <td> {{percentage(dashboard_transactional[7].Quality_Count_Met_SLA / dashboard_transactional[7].Total_volume)}}</td>
                        <td> {{percentage(dashboard_transactional[8].Quality_Count_Met_SLA / dashboard_transactional[8].Total_volume)}}</td>
                        <td> {{percentage(dashboard_transactional[9].Quality_Count_Met_SLA / dashboard_transactional[9].Total_volume)}}</td>
                        <td> {{percentage(dashboard_transactional[10].Quality_Count_Met_SLA / dashboard_transactional[10].Total_volume)}}</td>
                        <td> {{percentage(dashboard_transactional[11].Quality_Count_Met_SLA / dashboard_transactional[11].Total_volume)}}</td>
                      </tr>
                      <tr>
                        <td class="text-right">Count of Met SLAs</td>
                        <td>{{dashboard_transactional[0].Quality_Count_Met_SLA}}</td>
                        <td>{{dashboard_transactional[1].Quality_Count_Met_SLA}}</td>
                        <td>{{dashboard_transactional[2].Quality_Count_Met_SLA}}</td>
                        <td>{{dashboard_transactional[3].Quality_Count_Met_SLA}}</td>
                        <td>{{dashboard_transactional[4].Quality_Count_Met_SLA}}</td>
                        <td>{{dashboard_transactional[5].Quality_Count_Met_SLA}}</td>
                        <td>{{dashboard_transactional[6].Quality_Count_Met_SLA}}</td>
                        <td>{{dashboard_transactional[7].Quality_Count_Met_SLA}}</td>
                        <td>{{dashboard_transactional[8].Quality_Count_Met_SLA}}</td>
                        <td>{{dashboard_transactional[9].Quality_Count_Met_SLA}}</td>
                        <td>{{dashboard_transactional[10].Quality_Count_Met_SLA}}</td>
                        <td>{{dashboard_transactional[11].Quality_Count_Met_SLA}}</td>
                      </tr>
                      <tr>
                        <td class="text-right">Total Volume</td>
                        <td>{{dashboard_transactional[0].Total_volume}}</td>
                        <td>{{dashboard_transactional[1].Total_volume}}</td>
                        <td>{{dashboard_transactional[2].Total_volume}}</td>
                        <td>{{dashboard_transactional[3].Total_volume}}</td>
                        <td>{{dashboard_transactional[4].Total_volume}}</td>
                        <td>{{dashboard_transactional[5].Total_volume}}</td>
                        <td>{{dashboard_transactional[6].Total_volume}}</td>
                        <td>{{dashboard_transactional[7].Total_volume}}</td>
                        <td>{{dashboard_transactional[8].Total_volume}}</td>
                        <td>{{dashboard_transactional[9].Total_volume}}</td>
                        <td>{{dashboard_transactional[10].Total_volume}}</td>
                        <td>{{dashboard_transactional[11].Total_volume}}</td>
                      </tr>
                      <tr>
                        <td class="text-right">Count of Unmet SLAs</td>
                        <td>{{dashboard_transactional[0].Quality_Count_UnMet_SLA}}</td>
                        <td>{{dashboard_transactional[1].Quality_Count_UnMet_SLA}}</td>
                        <td>{{dashboard_transactional[2].Quality_Count_UnMet_SLA}}</td>
                        <td>{{dashboard_transactional[3].Quality_Count_UnMet_SLA}}</td>
                        <td>{{dashboard_transactional[4].Quality_Count_UnMet_SLA}}</td>
                        <td>{{dashboard_transactional[5].Quality_Count_UnMet_SLA}}</td>
                        <td>{{dashboard_transactional[6].Quality_Count_UnMet_SLA}}</td>
                        <td>{{dashboard_transactional[7].Quality_Count_UnMet_SLA}}</td>
                        <td>{{dashboard_transactional[8].Quality_Count_UnMet_SLA}}</td>
                        <td>{{dashboard_transactional[9].Quality_Count_UnMet_SLA}}</td>
                        <td>{{dashboard_transactional[10].Quality_Count_UnMet_SLA}}</td>
                        <td>{{dashboard_transactional[11].Quality_Count_UnMet_SLA}}</td>
                      </tr> 
                    </tbody>
                  </template>
                </v-simple-table>
            </template>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-col>

    <v-col cols="12">
      <v-card elevation="10">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title mb-5">
              Individual Dashboards
            </v-list-item-title>
            <v-progress-linear v-if="$store.state.OpsDashboard_Total_Count != $store.state.TeamMember_Count" indeterminate color="yellow darken-2"></v-progress-linear>
            <div style="justify-content:center;display:flex;height:500px;padding-top:150px" v-if="$store.state.OpsDashboard_Total_Count != $store.state.TeamMember_Count">Loading...</div>
            <template>             
              <DashboardPerTeamMember v-if="$store.state.OpsDashboard_Total_Count == $store.state.TeamMember_Count" />
            </template>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-col>
    
    <v-col cols="12">
      <v-card elevation="10">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title mb-5">
              View Ticket/s per Team Member
            </v-list-item-title>
            <v-progress-linear v-if="$store.state.OpsDashboard_Total_Count != $store.state.TeamMember_Count" indeterminate color="yellow darken-2"></v-progress-linear>
            <div style="justify-content:center;display:flex;height:500px;padding-top:150px" v-if="$store.state.OpsDashboard_Total_Count != $store.state.TeamMember_Count">Loading...</div>
            <template>             
              <GetTicketByTeamMember :Users="$store.state.users[0]" v-if="$store.state.OpsDashboard_Total_Count == $store.state.TeamMember_Count" />
            </template>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-col>
    
    <!-- <v-col cols="6">
      <v-card>
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title class="title mb-5">
              Team Weekly Work Type Summary
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
    </v-col> -->
  </v-row>
</template>

<script>
import DashboardPerTeamMember from '@/components/Dashboards/DashboardPerTeamMember.vue'
import GetTicketByTeamMember from '@/components/Dashboards/GetTicketByTeamMember.vue'
import OpsDashboardExport from "../Export/OpsDashboardExport.vue";
export default {
  name: "DashboardStaff",
  data() {
    return {
      // chartData: {
      //   data: {
      //     labels: ["Projects", "Transactional"],
      //     series: [20, 40],
      //   },
      //   options: {
      //     labelInterpolationFnc: function (value) {
      //       return value[0];
      //     },
      //   },
      //   responsiveOptions: [
      //     [
      //       "screen and (min-width: 640px)",
      //       {
      //         chartPadding: 30,
      //         labelOffset: 100,
      //         labelDirection: "explode",
      //         labelInterpolationFnc: function (value) {
      //           return value;
      //         },
      //       },
      //     ],
      //     [
      //       "screen and (min-width: 1024px)",
      //       {
      //         labelOffset: 80,
      //         chartPadding: 20,
      //       },
      //     ],
      //   ],
      // },
      //dashboard_projects:[],
     // dashboard_transactional:[]
    };
  },
  components:{
    DashboardPerTeamMember,
    GetTicketByTeamMember,
    OpsDashboardExport
  },
  computed:{
    dashboard_projects(){
      return this.$store.state.OpsDashboard_Projects
    },
    dashboard_transactional(){
      return this.$store.state.OpsDashboard_Transactionals
    },
  },
  created(){    
  },
  mounted(){

  },
  methods:{
    percentage(dec){
      if (dec <= 1) {
          var percentage = 0
          percentage = dec * 100
          return  percentage.toFixed(2) + "%";
       }
       return "0%"
    }
  }
};
</script>