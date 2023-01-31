<template>
  <v-row v-if="ticket_status != 'Completed'" align="center" justify="end">
                <v-btn class="mx-2" :disabled="$store.state.runningTickets[running_ticket_index].isStarted" @click="stopWatch()" fab  small color="green">
                  <v-icon color="white" > mdi-pause </v-icon>
                </v-btn>
                <v-btn class="mx-2" :disabled="$store.state.runningTickets[running_ticket_index].isStopped" @click="startWatch()" fab small color="#F44336">
                  <v-icon color="white"> mdi-play </v-icon>
                </v-btn>
                <span style="color:white" v-show="$store.state.runningTickets.length != 0" class="subheading mr-2">{{$store.state.runningTickets[running_ticket_index].time}}</span>
   </v-row>
</template>

<script>
import moment from 'moment'
import SparrowService from "@/services/SparrowService.js";
export default {
data() {
   return {
      running_ticket_index:null
   }
},
created(){
    this.running_ticket_index = this.$store.state.runningTickets.findIndex(t => t.id === this.ticket.id)
   // console.log(this.running_ticket_index)
    window.onbeforeunload = function() {
      return "Data will be lost if you leave the page, are you sure?";
    };
},
mounted(){
    localStorage.setItem(this.$store.state.runningTickets[this.running_ticket_index].id,moment().hour(this.$store.state.runningTickets[this.running_ticket_index].hour).minute(this.$store.state.runningTickets[this.running_ticket_index].minute).second(this.$store.state.runningTickets[this.running_ticket_index].counter++).format('HH:mm:ss'))
    let runningTime = localStorage.getItem(this.$store.state.runningTickets[this.running_ticket_index].id)
    this.updateTicketTime(runningTime)
    this.$store.state.runningTickets[this.running_ticket_index].time = moment().hour(runningTime.split(":")[0]).minute(runningTime.split(":")[1]).second("00").format('HH:mm:ss')  
}
,
watch:{
},
computed:{
  
  
},
props:["ticket_status","running_time","ticket"],
methods:{
  displayTime(){     
    //let runningTime = sessionStorage.getItem(this.$store.state.runningTickets[this.running_ticket_index].id)
    //this.$store.state.runningTickets[this.running_ticket_index].time = moment().hour(this.$store.state.runningTickets[this.running_ticket_index].hour).minute(this.$store.state.runningTickets[this.running_ticket_index].minute).second(this.$store.state.runningTickets[this.running_ticket_index].counter++).format('HH:mm:ss')
    this.$store.state.runningTickets[this.running_ticket_index].time = moment().hour(this.$store.state.runningTickets[this.running_ticket_index].hour).minute(this.$store.state.runningTickets[this.running_ticket_index].minute).second(this.$store.state.runningTickets[this.running_ticket_index].counter++).format('HH:mm:ss')
  },
  startWatch() {
      this.$store.state.runningTickets[this.running_ticket_index].isStarted = false
      this.$store.state.runningTickets[this.running_ticket_index].isStopped = true
      this.$store.state.runningTickets[this.running_ticket_index].runClock = setInterval(this.displayTime, 1000);
      this.$store.state.runningTickets[this.running_ticket_index].save_Ticket = setInterval(this.saveRunningTime, 300000) //900000
  },
  stopWatch() {
        this.$store.state.runningTickets[this.running_ticket_index].isStarted = true;
        this.$store.state.runningTickets[this.running_ticket_index].isStopped = false;
        clearInterval(this.$store.state.runningTickets[this.running_ticket_index].runClock);
        clearInterval(this.$store.state.runningTickets[this.running_ticket_index].save_Ticket);
        this.saveRunningTime()
  },

  saveRunningTime(){
      //sessionStorage.setItem(this.$store.state.runningTickets[this.running_ticket_index].id,this.$store.state.runningTickets[this.running_ticket_index].time)
      localStorage.setItem(this.$store.state.runningTickets[this.running_ticket_index].id,this.$store.state.runningTickets[this.running_ticket_index].time)
      let runningTime = localStorage.getItem(this.$store.state.runningTickets[this.running_ticket_index].id)
      this.updateTicketTime(runningTime)
  },
  updateTicketTime(runningTime){ 

      let ticket_param ={
        id:this.ticket.id,
        title: this.ticket.title,
        description: this.ticket.description ,
        actual_due_date:this.ticket.actual_due_date,
        service_rating:0,
        start_Date:this.ticket.start_Date, 
        date_Completion:null, 
        total_hrs:0,
        running_time: runningTime,
        requester: this.ticket.requester,
        world_area: this.ticket.world_area,
        service_Level_Agreement : this.ticket.service_Level_Agreement,
        classification_ID:this.ticket.classification_ID,
        complexity_ID:this.ticket.complexity_ID,
        period_ID:null,
        main_Category_ID: this.ticket.main_Category_ID,
        sub1_Category_ID: this.ticket.sub1_Category_ID,
        sub2_Category_ID: null,
        quality_Rating_ID:this.ticket.quality_Rating_ID, 
        ticket_Owner_ID: this.ticket.ticket_Owner_ID,
        ticket_Status_ID: this.ticket.ticket_Status_ID,
        fY_ID:this.ticket.fY_ID,
      }
      SparrowService.putTicket(this.ticket.id,ticket_param).then((result)=>{

      }
       ).catch((error) => {
        if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
              } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                //window.alert("Your Actual Time Spent cannot be saved. Please check your internet connection.")     
                localStorage.setItem(this.$store.state.runningTickets[this.running_ticket_index].id,this.$store.state.runningTickets[this.running_ticket_index].time)
                console.log(error.request);
              } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
              }
       })
    }
}
}

</script>

<style>

</style>