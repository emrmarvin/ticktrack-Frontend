<template>  
  <v-row class="mx-auto mt-12">
    <v-col>
      <v-row class="mb-10 ml-15">
        <v-checkbox v-model="$store.state.showTimer" label="Show Pause/Play button in Ticket Card ?" @change="showhideTimer"></v-checkbox> 
        <v-dialog persistent v-model="dialog" width="480">
              <v-card >
              <v-card-title  style="color:white;background-color:#004b8d">
                  Save changes?
              </v-card-title>
              <v-card-text class="text-xs-center">
                <div style="font-size:15px" class="mb-5 mt-5 text_color--text"></div>
                <v-btn type="submit" @click="getTeam"  style="color:white;" color="#004b8d">YES</v-btn>
                <v-btn text @click="cancel"  style="color:#004b8d;">NO</v-btn>
              </v-card-text>
              </v-card>
            </v-dialog>
      </v-row>
      <v-row class="mb-10">
        <TicketSettingsMainCat />
        <TicketSettingsSubCat />
      </v-row>
      <v-row class="mb-10">
        <TicketSettingsStatus />
        <TicketSettingsComplex />
      </v-row>
      <v-row>
        <TicketSettingsBusinessUnit />
        <TicketSettingRequester />
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import TicketSettingsComplex from "@/components/Tickets/TicketSettingsComplex";
import TicketSettingsMainCat from "@/components/Tickets/TicketSettingsMainCat";
import TicketSettingsSubCat from "@/components/Tickets/TicketSettingsSubCat";
import TicketSettingsStatus from "@/components/Tickets/TicketSettingsStatus";
import TicketSettingsBusinessUnit from "@/components/Tickets/TicketSettingsBusinessUnit";
import TicketSettingRequester from '@/components/Tickets/TicketSettingRequester'
import SparrowService from "@/services/SparrowService.js";
import TicketSettingsClassifications from "@/components/Tickets/TicketSettingsClassifications";

export default {
  name: "TicketSettings",
  components: {
    TicketSettingsSubCat,
    TicketSettingsComplex,
    TicketSettingsMainCat,
    TicketSettingsStatus,
    TicketSettingsBusinessUnit,
    TicketSettingRequester
  },
   data() {
    return {
      showTimer:false,
      team: this.createNewTeam(),
      team_id:0,
      dialog:false,
    };
  },
  computed:{
  },
  created(){
    this.showTimer = this.$store.state.showTimer
  },
  methods:{
    showhideTimer(){
      
      this.showTimer = this.$store.state.showTimer
      this.dialog =true
    },
    cancel(){
      this.dialog =false
      this.showTimer = this.$store.state.showTimer
    },
    getTeam(){ 
      let getTeamPromise = []
      getTeamPromise.push(
        SparrowService.getTeam(this.$store.state.teamID).then(response => {
          this.team_id = response.data[0].id
          this.team.name = response.data[0].name
          this.team.description = response.data[0].description
          this.team.status = response.data[0].status
          this.team.showTimer = response.data[0].showTimer
          this.team.team_Lead_User_ID = response.data[0].team_Lead_User_ID
          this.team.supervisor_User_ID = response.data[0].supervisor_User_ID
        })
      )
      Promise.all(getTeamPromise).then(()=>{
        this.updateTeam()
      })
    },
    updateTeam(){
      let params ={
        id:this.team_id,
        name:this.team.name,
        description: this.team.description,
        status:this.team.status,
        showTimer:this.showTimer,
        business_Units:[],
        team_Lead_User_ID:this.team.team_Lead_User_ID,
        supervisor_User_ID:this.team.supervisor_User_ID,
      }
      SparrowService.putTeam(this.team_id, params).then(()=>{
          setTimeout(() => {
            SparrowService.getTeams().then(response => {
              this.$store.state.showTimer = this.showTimer
              this.team = this.createNewTeam();
              this.dialog = false
            })
        }, 1500);
      })
    },
    createNewTeam() {
      return {
        name: "",
        description: "",
        status:"",
        showTimer:false,
        business_Units:[],
        team_Lead_User_ID:0,
        supervisor_User_ID:0,
      };
    },
  }

};
</script>

<style scoped>
.max-width {
  max-width: 1020px;
}
</style>