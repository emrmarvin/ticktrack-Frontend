<template>
  <div>
    <v-row  class="row-login">
      <div class="color"></div>
      <div class="color"></div>
      <div class="color"></div>
      <div class="box">

        <v-card
          class="login-card mx-auto py-8 pt-4 mb-8"
          width="800"
          height="600"
        >
          <v-card-text style="margin-top:20%">
            <h1 class="text-center black--text">
             <v-icon size="100">mdi-account-off</v-icon>
            </h1>
            <br>
             <h1 class="text-center black--text">
              Your account is deactivated.
            </h1>
            <br>
            <h3 class="text-center black--text">
              Please ask your Team Lead to activate your account.
            </h3>
             <v-card-actions class="justify-center mt-5">
            <p>Once your your account is activated you can try to <span class="login" style="font-weight:bold; color:blue; font-size:17px" @click="redirect()">sign-in</span> again.</p>
              </v-card-actions>
          </v-card-text>
        </v-card>
      </div>
    </v-row>
  </div>
</template>

<script>
import axios from "axios";
import AuthService from "../../services/AuthService";
import GraphService from "../../services/GraphService";
import SparrowService from "../../services/SparrowService";

export default {
  name: "PendingApproval",
  data (){
    return {
    // user: this.createNewUser(),
    // notification: this. createNewNotification(),
    teamLeadID:0,
    graph_data:[],
    register_dialog:false,
    isRegistered:false,
    user_data: null,
    userInfo: null,
    apiCallFailed: false,
    loginFailed: false,

    }
  },
  created() {
    this.authService = new AuthService();
    this.graphService = new GraphService();
  },
  computed:{
    getShiftSchedules(){
      return this.$store.state.shift_schedules[0]
    },
    getRoles(){
      return this.$store.state.roles[0]
    },
    getTeams(){
      return this.$store.state.teams[0]
    }
  },
  mounted(){
    var authService = new AuthService();
    var graphService = new GraphService();
    if(this.$store.state.isRegistered == false){
    authService.getToken().then(
           (token) => {
             if (token) {
               graphService.getUserInfo(token).then(
                 (data) => {
                   this.user.first_Name = data.givenName
                   this.user.last_Name = data.surname
                   this.user.email = data.mail
                   this.user.contact_Info1 = data.businessPhones[0]
                   this.user.job_Title = data.jobTitle
                 },
                 (error) => {
                   console.error(error);
                 }
               );
             }
             console.log();
           },
           (error) => {
             console.error(error);
           }
         );
    }
  },
  methods:{
    redirect(){
      location.replace(process.env.VUE_APP_BASED_URL);
    }
  }
};
</script>

<style>
.v-navigation-drawer {
  display: none;
}
.v-main {
  padding: 0 !important;
}
header.v-sheet {
  display: none;
}
html {
  overflow-y: auto;
}
a {
  text-decoration: none;
}
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover,
textarea:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus {
  border: none;
  -webkit-text-fill-color: inherit;
  -webkit-box-shadow: 0 0 0px 0px #000 inset;
  transition: background-color 5000s ease-in-out 0s;
}
.container {
  padding: 0px;
}
.row-login {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0;
  background: linear-gradient(to bottom, #f1f4f9, #dff1ff);
}
.row-login .color {
  position: absolute;
  filter: blur(150px);
}
.row-login .color:nth-child(1) {
  top: -350px;
  width: 100%;
  height: 600px;
  background: #0079c1;
}
.row-login .color:nth-child(2) {
  bottom: 0px;
  left: 50px;
  width: 40%;
  height: 550px;
  background: #00afe9;
}
.row-login .color:nth-child(3) {
  bottom: 0px;
  right: 50px;
  width: 40%;
  height: 380px;
  background: #f79428;
}
.row-login .image-center {
  margin: 0 auto;
}
.box {
  position: relative;
}

.login-card {
  background-color: rgba(255, 255, 255, 0.5) !important;
  border-radius: 10px;
  backdrop-filter: blur(5px);
  box-shadow: 0 25px 45px rgba(255, 255, 255, 0.1);
  border: 1px solid;
  border-color: rgba(255, 255, 255, 0.3) !important;
  border-right: 1px solid;
  border-right-color: rgba(255, 255, 255, 0.1) !important;
  border-bottom: 1px solid;
  border-bottom-color: rgba(255, 255, 255, 0.1) !important;
}
.text-popout {
  z-index: 2;
}
.display-1 {
  font-size: 1.8rem !important;
}
.theme--dark.v-label {
color: rgba(255, 255, 255, 0.7);
color: #000;
}
.theme--dark.v-text-field > .v-input__control > .v-input__slot:before {
border-color: #000 !important;
}
.login{
  cursor: pointer;
}
</style>