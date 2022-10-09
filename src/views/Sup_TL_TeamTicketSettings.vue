<template>
  <div class="mx-auto mt-12 mb-6">
    <v-tabs  v-model="tab">
        <v-tab class="text_color--text" v-for="item in sup_tl_team"  :key="item.id" @click="getTeamticketSettings(item.id)">{{item.name}}</v-tab>            
      </v-tabs>
      <v-tabs-items v-model="tab" style="width:100%">
        <v-tab-item
           v-for="item in sup_tl_team"
           :key="item.id" 
         >

          <v-card flat style="width:100%">
            <v-card-text style="padding-left:45%" class="justify-center" v-if="main_categories.length == 0">
              <span>Choose team</span>        
            </v-card-text>
            
            <v-card-text style="padding-left:15%" class="justify-center" v-if="isShow">
              <v-row class="mx-auto mt-12">
                  <v-col>
                    <v-row class="mb-10">
                     <SupTL_TicketSettingsMainCat :main_categories="main_categories" :teamID="item.id"/>  
                     <SupTL_TicketSettingsSubCat :teamID="item.id" />   
                    </v-row>
                    <v-row class="mb-10">
                      <SupTL_TicketSettingsStatus :teamID="item.id"/>   
                      <SupTL_TicketSettingsComplex :teamID="item.id"/>
                    </v-row>
                    <v-row>
                      <SupTL_TicketSettingsBusinessUnit :teamID="item.id"/>
                      <SupTl_TicketSettingRequester :teamID="item.id" />
                    </v-row>
                  </v-col>
                </v-row>
                     
            </v-card-text>
          </v-card>
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
        </v-tab-item>
      </v-tabs-items>

  </div>
</template>
<script>
import SupTL_TicketSettingsMainCat from "@/components/SupTLTicketSettings/SupTL_TicketSettingsMainCat"; 
import SupTL_TicketSettingsSubCat from "@/components/SupTLTicketSettings/SupTL_TicketSettingsSubCat"; 
import SupTL_TicketSettingsStatus from "@/components/SupTLTicketSettings/SupTL_TicketSettingsStatus";
import SupTL_TicketSettingsComplex from "@/components/SupTLTicketSettings/SupTL_TicketSettingsComplex"; 
import SupTL_TicketSettingsBusinessUnit from "@/components/SupTLTicketSettings/SupTL_TicketSettingsBusinessUnit"; 
import SupTl_TicketSettingRequester from "@/components/SupTLTicketSettings/SupTl_TicketSettingRequester";

import SparrowService from '@/services/SparrowService'
export default {
  data() {
    return {
        tab: null,
        main_categories:[],
        team_status:[],
        team_complexity:[],
        team_bu:[],
        team_requesters:[],
        dialog_loading:false,
        isShow:false
    };
  },
  components:{
    SupTL_TicketSettingsMainCat,
    SupTL_TicketSettingsSubCat,
    SupTL_TicketSettingsStatus,
    SupTL_TicketSettingsComplex,
    SupTL_TicketSettingsBusinessUnit,
    SupTl_TicketSettingRequester
  },
  computed:{
    sup_tl_team(){
      return this.$store.state.Sup_TLTeams;
    }
  },
  methods:{
    getTeamticketSettings(teamid){
      this.isShow = true
      this.getMainCategories(teamid)
      this.getTeamStatus(teamid)
      this.getTeamComplexities(teamid)
      this.getTeamBusinessUnits(teamid)
      this.getTeamRequesters(teamid)
    },
    getMainCategories(teamid){
      let main_cat_promise = []
      this.dialog_loading = true
      this.$store.state.teamID = teamid
      main_cat_promise.push(
      SparrowService.getTicketMain_CategoryByTeam(teamid)
            .then(response => {
               this.main_categories = response.data
            })
            .catch(error => {
               console.log(error.response)
            })
      )
      Promise.all(main_cat_promise).then(()=>{     
        this.$store.dispatch('fetchTicketMainCategoriesByTeam',teamid)
        this.$store.state.main_Categories_by_team[0] = this.main_categories
        setTimeout(() => {         
          this.dialog_loading = false
        }, 3000);
        
      })
    },
    getTeamStatus(teamid){
      let status_promise = []
      this.dialog_loading = true
      this.$store.state.teamID = teamid
      status_promise.push(
      SparrowService.getTicketTicket_Status_By_Team(teamid)
            .then(response => {
               this.team_status = response.data
            })
            .catch(error => {
               console.log(error.response)
            })
      )
      Promise.all(status_promise).then(()=>{     
        this.$store.dispatch('fetchTicketStatusByTeam',teamid)
        this.$store.state.ticket_Status_by_team[0] = this.team_status
        setTimeout(() => {         
          this.dialog_loading = false
        }, 3000);
        
      })
    },
    getTeamComplexities(teamid){
      let complexity_promise = []
      this.dialog_loading = true
      this.$store.state.teamID = teamid
      complexity_promise.push(
      SparrowService.getTicketComplexitiesbyTeam(teamid)
            .then(response => {
               this.team_complexity = response.data
            })
            .catch(error => {
               console.log(error.response)
            })
      )
      Promise.all(complexity_promise).then(()=>{     
        this.$store.dispatch('fetchTicketComplexitiesbyTeam',teamid)
        this.$store.state.complexitiesByTeam[0] = this.team_complexity
        setTimeout(() => {         
          this.dialog_loading = false
        }, 3000);
        
      })
    },
    getTeamBusinessUnits(teamid){
      let bu_promise = []
      this.dialog_loading = true
      this.$store.state.teamID = teamid
      bu_promise.push(
      SparrowService.getBusinessUnitByTeam(teamid)
            .then(response => {
               this.team_bu = response.data
            })
            .catch(error => {
               console.log(error.response)
            })
      )
      Promise.all(bu_promise).then(()=>{     
        this.$store.dispatch('fetchBusinessUnitsByTeam',teamid)
        this.$store.state.business_units_by_team[0] = this.team_bu
        setTimeout(() => {         
          this.dialog_loading = false
        }, 3000);
        
      })
    },
    getTeamRequesters(teamid){
      let requester_promise = []
      this.dialog_loading = true
      this.$store.state.teamID = teamid
      requester_promise.push(
      SparrowService.getRequesterByTeam(teamid)
            .then(response => {
               this.team_requesters = response.data
            })
            .catch(error => {
               console.log(error.response)
            })
      )
      Promise.all(requester_promise).then(()=>{     
        this.$store.dispatch('fetchRequesterByTeam',teamid)
        this.$store.state.requesters_by_team[0] = this.team_requesters
        setTimeout(() => {         
          this.dialog_loading = false
        }, 3000);
        
      })
    }
  }
}
</script>