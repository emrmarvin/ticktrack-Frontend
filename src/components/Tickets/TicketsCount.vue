<template>
  <v-row align="center" no-gutters>
    <v-row class="mb-6">


      <v-col class="cols-12" md="6">
        <v-card elevation="5" min-width="500" min-height="100">
          <v-list-item style="padding:0">
            <v-list-item-content class="card"  style="height:100px;padding-left:35px;padding-top:20px;padding-bottom:100px">
              <v-list-item-title>
                <span style="font-size:15px!important;color:#aaaaaa" class="title">On-Going Tickets </span><br><br>
                <span style="font-size:40px!important;" class="title text-center card_text--text">{{TotalActiveTicket}}</span>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>


      <v-col class="cols-12" md="6">
        <v-card elevation="5" min-width="500" min-height="100">
          <v-list-item style="padding:0">
            <v-list-item-content class="card"  style="height:100px;padding-left:35px;padding-top:20px;padding-bottom:100px">
              <v-list-item-title>
                <span style="font-size:15px!important;color:#aaaaaa" class="title">Total Completed Tickets </span><br><br>
                <span style="font-size:40px!important;" class="title text-center card_text--text">{{TotalCompletedTickets}}</span>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>

      <v-col class="cols-12" md="6">
        <v-card elevation="5" min-width="500" min-height="100">
          <v-list-item style="padding:0">
            <v-list-item-content class="card"  style="height:100px;padding-left:35px;padding-top:20px;padding-bottom:100px">
              <v-list-item-title>
                <span style="font-size:15px!important;color:#aaaaaa" class="title">On-Going Non Functional Activities</span><br><br>
                <span style="font-size:40px!important;" class="title text-center card_text--text">{{TotalOnGoingNonFunctional}}</span>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
      <v-col class="cols-12" md="6"> 
        <v-card elevation="5" min-width="500" min-height="100">
          <v-list-item style="padding:0">
            <v-list-item-content class="card"  style="height:100px;padding-left:35px;padding-top:20px;padding-bottom:100px">
              <v-list-item-title>
                <span style="font-size:15px!important;color:#aaaaaa" class="title">Total Overdue Tickets</span><br><br>
                <span style="font-size:40px!important;" class="title text-center card_text--text">0</span>
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
    "TotalOverDueTickets",
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