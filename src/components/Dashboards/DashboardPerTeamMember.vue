<template>
  <v-expansion-panels>
    <v-expansion-panel
      v-for="(item,i) in $store.state.users[0]"
      :key="i"
    >
      <v-expansion-panel-header @click="getDashboardReport(item.id)">
        {{item.first_Name}} {{item.last_Name}}
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-card>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title mb-5">
              Dashboard
            </v-list-item-title>
            <template>             
               <v-simple-table>
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
                        <td>{{percentage(member_dashboard.Projects.P1_Count_Met_SLA / member_dashboard.Projects.P1_Total_volume)}}</td>
                        <td>{{percentage(member_dashboard.Projects.P2_Count_Met_SLA / member_dashboard.Projects.P2_Total_volume)}}</td>
                        <td>{{percentage(member_dashboard.Projects.P3_Count_Met_SLA / member_dashboard.Projects.P3_Total_volume)}}</td>
                        <td>{{percentage(member_dashboard.Projects.P4_Count_Met_SLA / member_dashboard.Projects.P4_Total_volume)}}</td>
                        <td>{{percentage(member_dashboard.Projects.P5_Count_Met_SLA / member_dashboard.Projects.P5_Total_volume)}}</td>
                        <td>{{percentage(member_dashboard.Projects.P6_Count_Met_SLA / member_dashboard.Projects.P6_Total_volume)}}</td>
                        <td>{{percentage(member_dashboard.Projects.P7_Count_Met_SLA / member_dashboard.Projects.P7_Total_volume)}}</td>
                        <td>{{percentage(member_dashboard.Projects.P8_Count_Met_SLA / member_dashboard.Projects.P8_Total_volume)}}</td>
                        <td>{{percentage(member_dashboard.Projects.P9_Count_Met_SLA / member_dashboard.Projects.P9_Total_volume)}}</td>
                        <td>{{percentage(member_dashboard.Projects.P10_Count_Met_SLA / member_dashboard.Projects.P10_Total_volume)}}</td>
                        <td>{{percentage(member_dashboard.Projects.P11_Count_Met_SLA / member_dashboard.Projects.P11_Total_volume)}}</td>
                        <td>{{percentage(member_dashboard.Projects.P12_Count_Met_SLA / member_dashboard.Projects.P12_Total_volume)}}</td>
                      </tr>
                      <tr>
                        <td class="text-right">Count of Met SLAs</td>
                        <td>{{member_dashboard.Projects.P1_Count_Met_SLA}}</td>
                        <td>{{member_dashboard.Projects.P2_Count_Met_SLA}}</td>
                        <td>{{member_dashboard.Projects.P3_Count_Met_SLA}}</td>
                        <td>{{member_dashboard.Projects.P4_Count_Met_SLA}}</td>
                        <td>{{member_dashboard.Projects.P5_Count_Met_SLA}}</td>
                        <td>{{member_dashboard.Projects.P6_Count_Met_SLA}}</td>
                        <td>{{member_dashboard.Projects.P7_Count_Met_SLA}}</td>
                        <td>{{member_dashboard.Projects.P8_Count_Met_SLA}}</td>
                        <td>{{member_dashboard.Projects.P9_Count_Met_SLA}}</td>
                        <td>{{member_dashboard.Projects.P10_Count_Met_SLA}}</td>
                        <td>{{member_dashboard.Projects.P11_Count_Met_SLA}}</td>
                        <td>{{member_dashboard.Projects.P12_Count_Met_SLA}}</td>
                      </tr>
                      <tr>
                        <td class="text-right">Total Volume</td>
                        <td>{{member_dashboard.Projects.P1_Total_volume}}</td>
                        <td>{{member_dashboard.Projects.P2_Total_volume}}</td>
                        <td>{{member_dashboard.Projects.P3_Total_volume}}</td>
                        <td>{{member_dashboard.Projects.P4_Total_volume}}</td>
                        <td>{{member_dashboard.Projects.P5_Total_volume}}</td>
                        <td>{{member_dashboard.Projects.P6_Total_volume}}</td>
                        <td>{{member_dashboard.Projects.P7_Total_volume}}</td>
                        <td>{{member_dashboard.Projects.P8_Total_volume}}</td>
                        <td>{{member_dashboard.Projects.P9_Total_volume}}</td>
                        <td>{{member_dashboard.Projects.P10_Total_volume}}</td>
                        <td>{{member_dashboard.Projects.P11_Total_volume}}</td>
                        <td>{{member_dashboard.Projects.P12_Total_volume}}</td>
                      </tr>
                      <tr>
                        <td class="text-right">Count of Unmet SLAs</td>
                        <td>{{member_dashboard.Projects.P1_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Projects.P2_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Projects.P3_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Projects.P4_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Projects.P5_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Projects.P6_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Projects.P7_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Projects.P8_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Projects.P9_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Projects.P10_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Projects.P11_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Projects.P12_Count_UnMet_SLA}}</td>
                      </tr>
                        <!--Quality Performance--->
                      <tr style="background-color:#9FA1A4">
                        <td  class="text-center"><b>Quality Performance</b></td>
                        <td> {{percentage(member_dashboard.Projects.P1_Quality_Count_Met_SLA / member_dashboard.Projects.P1_Total_volume)}}</td>
                        <td> {{percentage(member_dashboard.Projects.P2_Quality_Count_Met_SLA / member_dashboard.Projects.P2_Total_volume)}}</td>
                        <td> {{percentage(member_dashboard.Projects.P3_Quality_Count_Met_SLA / member_dashboard.Projects.P3_Total_volume)}}</td>
                        <td> {{percentage(member_dashboard.Projects.P4_Quality_Count_Met_SLA / member_dashboard.Projects.P4_Total_volume)}}</td>
                        <td> {{percentage(member_dashboard.Projects.P5_Quality_Count_Met_SLA / member_dashboard.Projects.P5_Total_volume)}}</td>
                        <td> {{percentage(member_dashboard.Projects.P6_Quality_Count_Met_SLA / member_dashboard.Projects.P6_Total_volume)}}</td>
                        <td> {{percentage(member_dashboard.Projects.P7_Quality_Count_Met_SLA / member_dashboard.Projects.P7_Total_volume)}}</td>
                        <td> {{percentage(member_dashboard.Projects.P8_Quality_Count_Met_SLA / member_dashboard.Projects.P8_Total_volume)}}</td>
                        <td> {{percentage(member_dashboard.Projects.P9_Quality_Count_Met_SLA / member_dashboard.Projects.P9_Total_volume)}}</td>
                        <td> {{percentage(member_dashboard.Projects.P10_Quality_Count_Met_SLA / member_dashboard.Projects.P10_Total_volume)}}</td>
                        <td> {{percentage(member_dashboard.Projects.P11_Quality_Count_Met_SLA / member_dashboard.Projects.P11_Total_volume)}}</td>
                        <td> {{percentage(member_dashboard.Projects.P12_Quality_Count_Met_SLA / member_dashboard.Projects.P12_Total_volume)}}</td>
                      </tr>
                      <tr>
                        <td class="text-right">Count of Met SLAs</td>
                        <td>{{member_dashboard.Projects.P1_Quality_Count_Met_SLA }}</td>
                        <td>{{member_dashboard.Projects.P2_Quality_Count_Met_SLA }}</td>
                        <td>{{member_dashboard.Projects.P3_Quality_Count_Met_SLA }}</td>
                        <td>{{member_dashboard.Projects.P4_Quality_Count_Met_SLA }}</td>
                        <td>{{member_dashboard.Projects.P5_Quality_Count_Met_SLA }}</td>
                        <td>{{member_dashboard.Projects.P6_Quality_Count_Met_SLA }}</td>
                        <td>{{member_dashboard.Projects.P7_Quality_Count_Met_SLA }}</td>
                        <td>{{member_dashboard.Projects.P8_Quality_Count_Met_SLA }}</td>
                        <td>{{member_dashboard.Projects.P9_Quality_Count_Met_SLA }}</td>
                        <td>{{member_dashboard.Projects.P10_Quality_Count_Met_SLA }}</td>
                        <td>{{member_dashboard.Projects.P11_Quality_Count_Met_SLA }}</td>
                        <td>{{member_dashboard.Projects.P12_Quality_Count_Met_SLA }}</td>

                      </tr>
                      <tr>
                        <td class="text-right">Total Volume</td>
                        <td>{{member_dashboard.Projects.P1_Total_volume}}</td>
                        <td>{{member_dashboard.Projects.P2_Total_volume}}</td>
                        <td>{{member_dashboard.Projects.P3_Total_volume}}</td>
                        <td>{{member_dashboard.Projects.P4_Total_volume}}</td>
                        <td>{{member_dashboard.Projects.P5_Total_volume}}</td>
                        <td>{{member_dashboard.Projects.P6_Total_volume}}</td>
                        <td>{{member_dashboard.Projects.P7_Total_volume}}</td>
                        <td>{{member_dashboard.Projects.P8_Total_volume}}</td>
                        <td>{{member_dashboard.Projects.P9_Total_volume}}</td>
                        <td>{{member_dashboard.Projects.P10_Total_volume}}</td>
                        <td>{{member_dashboard.Projects.P11_Total_volume}}</td>
                        <td>{{member_dashboard.Projects.P12_Total_volume}}</td>
                        
                      </tr>
                      <tr>
                        <td class="text-right">Count of Unmet SLAs</td>
                        <td>{{member_dashboard.Projects.P1_Quality_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Projects.P2_Quality_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Projects.P3_Quality_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Projects.P4_Quality_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Projects.P5_Quality_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Projects.P6_Quality_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Projects.P7_Quality_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Projects.P8_Quality_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Projects.P9_Quality_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Projects.P10_Quality_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Projects.P11_Quality_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Projects.P12_Quality_Count_UnMet_SLA}}</td>                        
                      </tr> 
                                     <!--Transactional Support--->
                       <tr style="background-color:#008C4F">
                        <td class="text-center" colspan="13">Transactional Support</td>
                      </tr>
                      <!--Service Performance-->
                      <tr style="background-color:#9FA1A4">
                        <td class="text-center"><b>Service Performance</b></td>
                        <td>{{percentage(member_dashboard.Trasactional.P1_Count_Met_SLA / member_dashboard.Trasactional.P1_Total_volume)}}</td>
                        <td>{{percentage(member_dashboard.Trasactional.P2_Count_Met_SLA / member_dashboard.Trasactional.P2_Total_volume)}}</td>
                        <td>{{percentage(member_dashboard.Trasactional.P3_Count_Met_SLA / member_dashboard.Trasactional.P3_Total_volume)}}</td>
                        <td>{{percentage(member_dashboard.Trasactional.P4_Count_Met_SLA / member_dashboard.Trasactional.P4_Total_volume)}}</td>
                        <td>{{percentage(member_dashboard.Trasactional.P5_Count_Met_SLA / member_dashboard.Trasactional.P5_Total_volume)}}</td>
                        <td>{{percentage(member_dashboard.Trasactional.P6_Count_Met_SLA / member_dashboard.Trasactional.P6_Total_volume)}}</td>
                        <td>{{percentage(member_dashboard.Trasactional.P7_Count_Met_SLA / member_dashboard.Trasactional.P7_Total_volume)}}</td>
                        <td>{{percentage(member_dashboard.Trasactional.P8_Count_Met_SLA / member_dashboard.Trasactional.P8_Total_volume)}}</td>
                        <td>{{percentage(member_dashboard.Trasactional.P9_Count_Met_SLA / member_dashboard.Trasactional.P9_Total_volume)}}</td>
                        <td>{{percentage(member_dashboard.Trasactional.P10_Count_Met_SLA / member_dashboard.Trasactional.P10_Total_volume)}}</td>
                        <td>{{percentage(member_dashboard.Trasactional.P11_Count_Met_SLA / member_dashboard.Trasactional.P11_Total_volume)}}</td>
                        <td>{{percentage(member_dashboard.Trasactional.P12_Count_Met_SLA / member_dashboard.Trasactional.P12_Total_volume)}}</td>
                      </tr>
                      <tr>
                        <td class="text-right">Count of Met SLAs</td>
                        <td>{{member_dashboard.Trasactional.P1_Count_Met_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P2_Count_Met_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P3_Count_Met_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P4_Count_Met_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P5_Count_Met_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P6_Count_Met_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P7_Count_Met_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P8_Count_Met_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P9_Count_Met_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P10_Count_Met_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P11_Count_Met_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P12_Count_Met_SLA}}</td>
                      </tr>
                      <tr>
                        <td class="text-right">Total Volume</td>
                        <td>{{member_dashboard.Trasactional.P1_Total_volume}}</td>
                        <td>{{member_dashboard.Trasactional.P2_Total_volume}}</td>
                        <td>{{member_dashboard.Trasactional.P3_Total_volume}}</td>
                        <td>{{member_dashboard.Trasactional.P4_Total_volume}}</td>
                        <td>{{member_dashboard.Trasactional.P5_Total_volume}}</td>
                        <td>{{member_dashboard.Trasactional.P6_Total_volume}}</td>
                        <td>{{member_dashboard.Trasactional.P7_Total_volume}}</td>
                        <td>{{member_dashboard.Trasactional.P8_Total_volume}}</td>
                        <td>{{member_dashboard.Trasactional.P9_Total_volume}}</td>
                        <td>{{member_dashboard.Trasactional.P10_Total_volume}}</td>
                        <td>{{member_dashboard.Trasactional.P11_Total_volume}}</td>
                        <td>{{member_dashboard.Trasactional.P12_Total_volume}}</td>
                      </tr>
                      <tr>
                        <td class="text-right">Count of Unmet SLAs</td>
                        <td>{{member_dashboard.Trasactional.P1_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P2_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P3_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P4_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P5_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P6_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P7_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P8_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P9_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P10_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P11_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P12_Count_UnMet_SLA}}</td>
                      </tr>
                      <!--Quality Performance--->
                      <tr style="background-color:#9FA1A4">
                        <td class="text-center"><b>Quality Performance</b></td>
                        <td> {{percentage(member_dashboard.Trasactional.P1_Quality_Count_Met_SLA / member_dashboard.Trasactional.P1_Total_volume)}}</td>
                        <td> {{percentage(member_dashboard.Trasactional.P2_Quality_Count_Met_SLA / member_dashboard.Trasactional.P2_Total_volume)}}</td>
                        <td> {{percentage(member_dashboard.Trasactional.P3_Quality_Count_Met_SLA / member_dashboard.Trasactional.P3_Total_volume)}}</td>
                        <td> {{percentage(member_dashboard.Trasactional.P4_Quality_Count_Met_SLA / member_dashboard.Trasactional.P4_Total_volume)}}</td>
                        <td> {{percentage(member_dashboard.Trasactional.P5_Quality_Count_Met_SLA / member_dashboard.Trasactional.P5_Total_volume)}}</td>
                        <td> {{percentage(member_dashboard.Trasactional.P6_Quality_Count_Met_SLA / member_dashboard.Trasactional.P6_Total_volume)}}</td>
                        <td> {{percentage(member_dashboard.Trasactional.P7_Quality_Count_Met_SLA / member_dashboard.Trasactional.P7_Total_volume)}}</td>
                        <td> {{percentage(member_dashboard.Trasactional.P8_Quality_Count_Met_SLA / member_dashboard.Trasactional.P8_Total_volume)}}</td>
                        <td> {{percentage(member_dashboard.Trasactional.P9_Quality_Count_Met_SLA / member_dashboard.Trasactional.P9_Total_volume)}}</td>
                        <td> {{percentage(member_dashboard.Trasactional.P10_Quality_Count_Met_SLA / member_dashboard.Trasactional.P10_Total_volume)}}</td>
                        <td> {{percentage(member_dashboard.Trasactional.P11_Quality_Count_Met_SLA / member_dashboard.Trasactional.P11_Total_volume)}}</td>
                        <td> {{percentage(member_dashboard.Trasactional.P12_Quality_Count_Met_SLA / member_dashboard.Trasactional.P12_Total_volume)}}</td>
                      </tr>
                      <tr>
                        <td class="text-right">Count of Met SLAs</td>
                        <td>{{member_dashboard.Trasactional.P1_Quality_Count_Met_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P2_Quality_Count_Met_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P3_Quality_Count_Met_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P4_Quality_Count_Met_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P5_Quality_Count_Met_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P6_Quality_Count_Met_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P7_Quality_Count_Met_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P8_Quality_Count_Met_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P9_Quality_Count_Met_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P10_Quality_Count_Met_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P11_Quality_Count_Met_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P12_Quality_Count_Met_SLA}}</td>
                      </tr>
                      <tr>
                        <td class="text-right">Total Volume</td>
                        <td>{{member_dashboard.Trasactional.P1_Total_volume}}</td>
                        <td>{{member_dashboard.Trasactional.P2_Total_volume}}</td>
                        <td>{{member_dashboard.Trasactional.P3_Total_volume}}</td>
                        <td>{{member_dashboard.Trasactional.P4_Total_volume}}</td>
                        <td>{{member_dashboard.Trasactional.P5_Total_volume}}</td>
                        <td>{{member_dashboard.Trasactional.P6_Total_volume}}</td>
                        <td>{{member_dashboard.Trasactional.P7_Total_volume}}</td>
                        <td>{{member_dashboard.Trasactional.P8_Total_volume}}</td>
                        <td>{{member_dashboard.Trasactional.P9_Total_volume}}</td>
                        <td>{{member_dashboard.Trasactional.P10_Total_volume}}</td>
                        <td>{{member_dashboard.Trasactional.P11_Total_volume}}</td>
                        <td>{{member_dashboard.Trasactional.P12_Total_volume}}</td>                     
                      </tr>
                      <tr>
                        <td class="text-right">Count of Unmet SLAs</td>
                        <td>{{member_dashboard.Trasactional.P1_Quality_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P2_Quality_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P3_Quality_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P4_Quality_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P5_Quality_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P6_Quality_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P7_Quality_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P8_Quality_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P9_Quality_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P10_Quality_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P11_Quality_Count_UnMet_SLA}}</td>
                        <td>{{member_dashboard.Trasactional.P12_Quality_Count_UnMet_SLA}}</td>
                      </tr> 
                    </tbody>
                  </template>
                </v-simple-table>
            </template>
          </v-list-item-content>
        </v-list-item>
      </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  data(){
    return{
      member_dashboard:[]
    }
  },
  components:{
  },
  computed:{
    dashboard_projects(){
      return this.$store.state.OpsDashboard_Projects_Per_Team_Member
    },
    dashboard_transactional(){
      return this.$store.state.OpsDashboard_Transactionals_Per_Team_Member
    }
  },
  methods:{
    getDashboardReport(userID){ 
        for(let p = 0; p < this.dashboard_projects.length; p++ ){
          if(userID ==  this.dashboard_projects[p].userID){
            this.member_dashboard["Projects"] = this.dashboard_projects[p]
          } 
        }
        for(let p = 0; p < this.dashboard_transactional.length; p++ ){
          if(userID ==  this.dashboard_transactional[p].userID){
            this.member_dashboard["Trasactional"] = this.dashboard_transactional[p]
          } 
        }
    },
    percentage(dec){
      if (dec <= 1) {
          var percentage = 0
          percentage = dec * 100
          return  percentage.toFixed(2) + "%";
       }
       return "0%"
    }
  }
}
</script>