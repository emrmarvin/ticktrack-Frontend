<template>
  <v-row style="justify-content:right;" no-gutters>
    <v-row class="mb-6" style="justify-content:right;">

      <v-col class="cols-12" md="3" >
        <v-card elevation="5" min-width="150" min-height="10">
          <v-list-item style="padding:0;">
            <v-list-item-content class="ongoing"  style="height:100px;padding-left:35px;padding-top:20px;padding-bottom:100px; ">
              <v-list-item-title>
                <span style="font-size:15px!important;color:white" class="title">On-Going Tickets </span><br><br>
                <span style="font-size:40px!important;color:white" class="title text-center">{{TotalActiveTicket}}</span>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>


      <v-col class="cols-12" md="3">
        <v-card elevation="5" min-width="200" min-height="100">
          <v-list-item style="padding:0">
            <v-list-item-content class="completed"  style="height:100px;padding-left:35px;padding-top:20px;padding-bottom:100px">
              <v-list-item-title>
                <span style="font-size:15px!important;color:white" class="title">Total Completed Tickets </span><br><br>
                <span style="font-size:40px!important;color:white" class="title text-center">{{TotalCompletedTickets}}</span>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>

      <v-col class="cols-12" md="3">
        <v-card elevation="5" min-width="200" min-height="100">
          <v-list-item style="padding:0">
            <v-list-item-content class="nf"  style="height:100px;padding-left:35px;padding-top:20px;padding-bottom:100px">
              <v-list-item-title>
                <span style="font-size:15px!important;color:white" class="title">On-Going Non Functional Activities</span><br><br>
                <span style="font-size:40px!important;color:white" class="title text-center">{{TotalOnGoingNonFunctional}}</span>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
  </v-row>


</template>

<script>
export default {
  name: "TicketCount",
  props:[
    "TotalActiveTicket",
    "TotalCompletedTickets",
    "TotalOnGoingNonFunctional"
  ],
  data(){
    return{
    }
  },
  created(){
  }
};
</script>
<style scoped>
.v-application .ongoing {
     background-color: #004B8D !important; 
     color: white !important;
}
.v-application .completed {
     background-color: #00573D !important; 
     color: white !important;
}
.v-application .nf {
     background-color: #F8B11E !important; 
}
</style>