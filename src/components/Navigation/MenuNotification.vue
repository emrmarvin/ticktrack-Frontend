<template >
<div v-if="$store.state.isLogIn">
          
    <v-toolbar flat>
      <v-banner elevation="2" color="primary" dark style="padding:3px"><v-icon class="mr-3">mdi-calendar</v-icon>Current FY : {{$store.state.activeFY.label}} </v-banner>
    <v-spacer></v-spacer>
    

    <v-avatar class="mr-3"  style="border:solid 2px white!important;">
      <img v-if="$store.state.image" :src="$store.state.image" alt="profile picture" class="image" />  
      <v-icon size="50" v-if="!$store.state.image">mdi-account-circle</v-icon>
    </v-avatar>
    <a text>
      <router-link to="/user-profile">
        {{ $store.state.userName }}
      </router-link>
    </a>

    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-badge color="red" overlap offset-x="22" offset-y="22">
          <span slot="badge">{{$store.state.notif_count}}</span>
          <v-btn icon color="primary" v-bind="attrs" v-on="on">
            <v-icon color="text_color" >mdi-bell</v-icon>
          </v-btn>
        </v-badge>
      </template>
      <v-list>
        <v-list-item v-if="$store.state.notif_count == 0">
          <v-list-item-title>
              <span> No notification to display</span>
          </v-list-item-title>
        </v-list-item>
        <v-list-item class="mt-2" v-for="(notification, id) in $store.state.notifications[0]" :key="id">
           <v-list-item-title> <b>{{ notification.title }}</b> <v-icon style="float:right"  @click="closeNotification(notification)"> mdi-close-circle-outline </v-icon>
            <div class="mt-2">{{ notification.message }}</div>
            <v-divider  class="mt-1 mb-1"></v-divider>
           </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-toolbar>
</div>

</template>

<script>
import SparrowService from "@/services/SparrowService.js";
export default {
  data: () => ({
    test:[1,2,3,4],
    notifications:[],
    notif_count:0,
    imageInfos:[],
    image:"",
    alt:"",
  }),
  created(){
    setTimeout(() => {
      this.notifications = this.$store.state.notifications[0] 
      
    }, 4000);

  },
  mouted(){
    setTimeout(() => {
      this.notifications = this.$store.state.notifications[0] 
      console.log(this.notifications)
    }, 4000);
  },
  computed:{
    sup_tl_team(){
      return this.$store.state.Sup_TLTeams;
    }
  },
  methods:{
    closeNotification(notif){
      let temp_promise=[]
      let param = {
        id:notif.id,
        title:notif.title,
        message:notif.message,
        url:notif.url,
        status:false,
        received_Date:notif.received_Date,
        user_notified_id:notif.user_notified_id
      }
      temp_promise.push(
        SparrowService.putNotification(notif.id, param).then(()=>{
          //this.$store.state.notif_count -= 1
        })
      ) 
      Promise.all(temp_promise).then(()=>{
            SparrowService.getNotificationsByUser(this.$store.state.userID).then(response=>{
              this.$store.state.notifications[0] = response.data
              this.$store.state.notif_count = response.data.length
            })
      })
    },

  }
};
</script>

<style scoped>
.v-application a {
  color: #0079c1;
  text-decoration: none;
}
.badge-position {
  position: relative;
}
.image{
  width:50px;
  height:50px;
}
.v-list .v-list-item--active{
  color: white!important;
}
.v-application .primary--text{
  color: white!important;
}
</style>