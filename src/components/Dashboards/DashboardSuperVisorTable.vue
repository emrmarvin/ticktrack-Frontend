<template>
  <v-row class="mx-auto mt-2 mb-6">
    <v-col cols="12">
      <v-card>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title mb-5">
              Teams Overall Dashboard
            </v-list-item-title>
             <v-progress-linear v-if="dashboard_projects.length != 12 && dashboard_transactional.length != 12"  indeterminate color="yellow darken-2"></v-progress-linear>
            <div style="justify-content:center;display:flex;height:500px;padding-top:150px" v-if="dashboard_projects.length != 12 && dashboard_transactional.length != 12">Loading...</div>
            <template>             
               <v-simple-table v-if="dashboard_projects.length == 12 && dashboard_transactional.length == 12">
                  <template v-slot:default>
                    <thead>
                      <tr style="background-color:white;">
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
      <v-card>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title mb-5">
              Individual Dashboards per Team
            </v-list-item-title>
            <template>
              <v-tabs  v-model="tab">
                <v-tab class="text_color--text" v-for="item in supervisor_teams" style="border:1px solid white;" :key="item.id" @click="getOpsDashboardReportPerTeam(item.id)">{{item.name}}</v-tab>            
              </v-tabs>
              <v-tabs-items v-model="tab" style="width:100%">
              <v-tab-item
                v-for="item in supervisor_teams"
                :key="item.id" 
              >
                <v-card flat style="width:100%">
                  <v-progress-linear v-if="OpsDashboard_Total_Count != TeamMember_Count" indeterminate color="yellow darken-2"></v-progress-linear>

                  <v-card-text style="padding-left:45%" class="justify-center" v-if="OpsDashboard_Projects_Per_Team_Member.length == 0">
                    <span>Choose team</span>        
                  </v-card-text>

                  <v-card-text>
                     <DashboardSupervisorPerTeamMember
                     :OpsDashboard_Projects_Per_Team_Member="OpsDashboard_Projects_Per_Team_Member"   
                     :OpsDashboard_Transactionals_Per_Team_Member="OpsDashboard_Transactionals_Per_Team_Member"    
                     :TeamMembers="TeamMembers"              
                      v-if="OpsDashboard_Total_Count == TeamMember_Count" />
                  </v-card-text>
                  <!-- <div style="justify-content:center;display:flex;height:500px;padding-top:150px" v-if="OpsDashboard_Total_Count != TeamMember_Count"><Circle8/></div> -->
                  <v-dialog v-model="dialog_loading" persistent width="300">
                      <v-card
                        color="primary"
                        dark
                      >
                        <v-card-text style="text-align:center;padding-top:5px">
                                    Getting data
                            <v-progress-linear
                                indeterminate
                                color="white"
                                class="mb-0 mt-2"
                          ></v-progress-linear>
                        </v-card-text>
                      </v-card>
                </v-dialog>

                </v-card>
              </v-tab-item>
            </v-tabs-items>
            </template>
             

          </v-list-item-content>
        </v-list-item>
      </v-card>

    </v-col>
    <v-col cols="12"  v-if="TeamMembers.length != 0 ">
      <v-card elevation="10">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title mb-5">
              View Ticket/s per Team Member
            </v-list-item-title>
            <v-progress-linear v-if="$store.state.OpsDashboard_Total_Count != $store.state.TeamMember_Count" indeterminate color="yellow darken-2"></v-progress-linear>
            <div style="justify-content:center;display:flex;height:500px;padding-top:150px" v-if="$store.state.OpsDashboard_Total_Count != $store.state.TeamMember_Count">Loading...</div>
            <template>             
              <GetTicketByTeamMember :Users="TeamMembers" v-if="TeamMembers.length != 0 " />
            </template>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-col>

  </v-row>
</template>

<script>
import DashboardSupervisorPerTeamMember from '@/components/Dashboards/DashboardSupervisorPerTeamMember.vue'
import SparrowService from '@/services/SparrowService'
import GetTicketByTeamMember from '@/components/Dashboards/GetTicketByTeamMember.vue'
export default {
  name: "DashboardSupervisor",
  data() {
    return {
        tab: null,
        dialog_loading:false,
        TeamMembers:[],
        TeamMember_Count:0,
        OpsDashboard_Total_Count:0,
        OpsDashboard_Projects_Per_Team_Member:[],
        OpsDashboard_Transactionals_Per_Team_Member:[]
    };
  },
  components:{
    DashboardSupervisorPerTeamMember,
    GetTicketByTeamMember
  },
  computed:{
    dashboard_projects(){
      return this.$store.state.Sup_OpsDashboard_Projects
    },
    dashboard_transactional(){
      return this.$store.state.Sup_OpsDashboard_Transactionals
    },
    supervisor_teams(){
      return this.$store.state.supervior_teams[0]
    }
  },
  created(){    
  },
  mounted(){

  },
  methods:{ 
    getOpsDashboardReportPerTeam(teamid){
        this.dialog_loading = true
        this.TeamMember_Count=0,
        this.OpsDashboard_Total_Count=1,
        this.TeamMembers  = []
        SparrowService.getUserByTeam(teamid)
            .then(response => {
               this.TeamMembers = response.data
              //  this.$store.state.users[0] = []
              //  console.log("this.TeamMembers",this.TeamMembers)
              //  this.$store.state.users[0] = this.TeamMembers
               
               this.TeamMember_Count = response.data.length
               for (let p = 0; p < response.data.length; p++) {

                  //Get Dashboard per Team Member
                  var transactional_per_team_member = []
                  var transactional_per_team_member_promise = []

                  var project_per_team_member = []
                  var project_per_team_member_promise = []

                  transactional_per_team_member_promise.push(
                     SparrowService.getTicketOpsDashboardByTeam(this.$store.state.activeFY.id, response.data[p].id, teamid, 1)
                     .then(res => {
                        res.data["userID"] = response.data[p].id
                        res.data["userName"] = response.data[p].first_Name + " " + response.data[p].last_Name
                        transactional_per_team_member.push(res.data)
                     })
                  )
                  project_per_team_member_promise.push(
                     SparrowService.getTicketOpsDashboardByTeam(this.$store.state.activeFY.id, response.data[p].id, teamid, 2)
                     .then(res => {
                        res.data["userID"] = response.data[p].id
                        res.data["userName"] = response.data[p].first_Name + " " + response.data[p].last_Name
                        project_per_team_member.push(res.data)
                     })

                  )
                  Promise.all(transactional_per_team_member_promise).then(() => {
                     this.OpsDashboard_Transactionals_Per_Team_Member = transactional_per_team_member.sort(function (a, b) {
                        var periodA = a.userID;
                        var periodB = b.userID;
                        return (periodA < periodB) ? -1 : (periodA > periodB) ? 1 : 0;
                     });
                     this.OpsDashboard_Total_Count = this.OpsDashboard_Transactionals_Per_Team_Member.length
                     if(this.OpsDashboard_Total_Count == this.TeamMember_Count){this.dialog_loading = false}
                  })
                  Promise.all(project_per_team_member_promise).then(() => {
                     this.OpsDashboard_Projects_Per_Team_Member = project_per_team_member.sort(function (a, b) {
                        var periodA = a.userID;
                        var periodB = b.userID;
                        return (periodA < periodB) ? -1 : (periodA > periodB) ? 1 : 0;
                     });
                  })
               }

            })
    },

    percentage(dec){
      if (dec <= 1) {
          return dec * 100 + "%";
       }
       return "0%"
    }
  }
};
</script>
<style scoped>
th {
  font-size: 15px!important;
  color: black !important;
}
</style>