<template>
<div>
  <v-tour name="myTour" :steps="steps"></v-tour>
  <v-row class="mx-auto mt-2 mb-6">
    <v-col cols="12">
      <v-card elevation="10">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title  class="title mb-5 mt-5 mx-5">
              Operations Group  Dashboard
            </v-list-item-title>
             <v-row class="mb-6">
                <v-col cols="2"></v-col>
                <v-col cols="5">
                  <v-autocomplete 
                      v-model="team_id"
                      :items="$store.state.opsManagerTeams"
                      item-value="id"
                      item-text="name"
                      label="Select Team"
                      style="height: 50px !important"
                      outlined
                      no-data-text="No data to display"
                      @change="getTickets(team_id)"
                      id="v-step-0"
                  >
                  <template v-slot:selection="{ item }"> 
                      {{item.name}}
                  </template>
                  <template v-slot:item="{ item }">
                    {{item.name}}
                  </template>
                  </v-autocomplete>
                </v-col>
                <v-col cols="4" class="justify-center" style="justify-content:center;display:flex">
                  <!-- <v-btn class="primary mr-5" @click="getTickets(team_id)" :disabled="team_id == 0" height="54">View Dashboard</v-btn> -->
                   <!--FY Filter-->
                  <v-select  
                      id="v-step-1"
                      :items="$store.state.fiscalYears[0]"
                      item-value="id"
                      label="Filter FY"
                      item-text="label"
                      required
                      outlined
                      :menu-props="{ maxHeight: '400',maxWidth:'400'}"
                      v-model="filter_fy"
                      style="height: 50px !important;max-width:300px;float:right;"
                      no-data-text="No data to display"
                      class="mr-5"
                      :disabled="team_id == 0"
                      @change="getTickets(team_id)"
                  >
                </v-select>
                  <OpsDashboardExport
                    :toExport_transactionals="dashboard_transactional"
                    :toExport_projects="dashboard_projects"
                    :teamID="team_id"
                    :disabled="team_id == 0"
                    class="dashboard"
                    id="v-step-3"
                  />

                </v-col>
             </v-row>
  
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-col>
  </v-row>

  <v-row class="mx-auto mt-2 mb-6">
    <v-col>
        <v-list-item>
          <v-list-item-content>
            <template>  
               <v-skeleton-loader v-if="dashboard_projects.length != 12 && dashboard_transactional.length != 12"
                  v-bind="attrs"
                  type="table"
                ></v-skeleton-loader>         
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
                      <tr style="background-color:#008C4F;color:white">
                        <td class="text-center title" colspan="13">Project Support</td>
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
                       <tr style="background-color:#008C4F;color:white">
                        <td class="text-center title" colspan="13">Transactional Support</td>
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

    </v-col>
  </v-row>
  
  </div>
</template>

<script>

import SparrowService from "@/services/SparrowService.js";
import OpsDashboardExport from "../Export/OpsDashboardExport.vue";
export default {
  components:{
    OpsDashboardExport
  },
  name: "DashboardManager",
  data() {
    return {
      team_id:0,
      filter_period:[],
      loading:false,
      filter_fy:this.$store.state.activeFY.id,
      attrs: {
        class: 'mb-6',
        boilerplate: true,
        elevation: 2,
      },
      steps: [
          {
            target: '#v-step-0',  
            header: {
              title: 'Get Started',
            },
            content: `Select <strong>Team</strong>`,
            params: {
              placement: 'top' 
            }
          },
          {
            target: '#v-step-1', 
            content: `Select <strong>FY</strong>`,
            params: {
              placement: 'top' 
            }
          },
          {
            target: '#v-step-3', 
            content: `<strong>Export Dashboard</strong>`,
            params: {
              placement: 'top' 
            }
          },
        ]
    };
  },
   computed:{
    dashboard_projects(){
      return this.$store.state.OpsDashboard_Projects
    },
    dashboard_transactional(){
      return this.$store.state.OpsDashboard_Transactionals
    },
  },
  mounted: function () {
      this.$tours['myTour'].start()
  },
  methods:{
    getTickets(teamID){
            var project = []
            var project_promise = []

            var transactional = []
            var transactional_promise = []
            //Transactional
            for (let t = 0; t < this.$store.state.periods[0].length; t++) {
               transactional_promise.push(
                  SparrowService.getTicketOpsDashboard(this.filter_fy, this.$store.state.periods[0][t].id, teamID, 1)
                  .then(response => {
                     response.data["periodID"] = this.$store.state.periods[0][t].id
                     response.data["period"] = this.$store.state.periods[0][t].abbreviation
                     transactional.push(response.data)
                  })
               )
            }

            Promise.all(transactional_promise).then(() => {
               this.$store.state.OpsDashboard_Transactionals = transactional.sort(function (a, b) {
                  var periodA = a.periodID;
                  var periodB = b.periodID;
                  return (periodA < periodB) ? -1 : (periodA > periodB) ? 1 : 0;
               });
            })

            //Projects
            for (let t = 0; t < this.$store.state.periods[0].length; t++) {
               project_promise.push(
                  SparrowService.getTicketOpsDashboard(this.filter_fy, this.$store.state.periods[0][t].id, teamID, 2)
                  .then(response => {
                     response.data["periodID"] = this.$store.state.periods[0][t].id
                     response.data["period"] = this.$store.state.periods[0][t].abbreviation
                     project.push(response.data)

                  })
               )

            }
            Promise.all(project_promise).then(() => {
               this.$store.state.OpsDashboard_Projects = project.sort(function (a, b) {
                  var periodA = a.periodID;
                  var periodB = b.periodID;
                  return (periodA < periodB) ? -1 : (periodA > periodB) ? 1 : 0;
               });
            })

    },
     percentage(dec){
      var value = ""
      if (dec <= 1) {
          value = dec * 100
          return parseInt(value).toFixed(2)  + "%";
       }
       return "0%"
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
.ct-series-a .ct-area,
.ct-series-a .ct-slice-donut-solid,
.ct-series-a .ct-slice-pie {
  fill: #1565c0;
}
.dashboard{
  float:right;
  margin-right:2px
}
</style>