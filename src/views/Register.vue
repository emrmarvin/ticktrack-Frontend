<template>
  <div>
    <v-row  class="row-login">
      <div class="color"></div>
      <div class="color"></div>
      <div class="color"></div>
      <div class="box" style="height:100;margin-top:70px">
        <v-card
          class="login-card mx-auto py-8 pt-4 mb-8 mt-40"
          width="400"
          height="850"
        >
          <v-card-text class="pa-10">
            <p class="text-center subtitle-1 font-weight-medium black--text">
              First time Signing In?<br />Let's request for your Account
              Activation.
            </p>
            <form>
              <v-text-field
                        v-model="user.first_Name"
                        label="First Name"
                      ></v-text-field>
                      <v-text-field
                        v-model="user.middle_Name"
                        label="Middle Name"
                      ></v-text-field>
                      <v-text-field
                        v-model="user.last_Name"
                        label="Last Name"
                      ></v-text-field>
                      <v-text-field
                        v-model="user.contact_Info1"
                        label="Contact Info 1"
                      ></v-text-field>
                      <v-text-field
                        v-model="user.contact_Info2"
                        label="Contact Info 2"
                      ></v-text-field>
                      <v-text-field
                        v-model="user.job_Title"
                        label="Job Title"
                      ></v-text-field>
                      <v-text-field
                        v-model="user.email"
                        label="Email"
                        :disabled="true"
                      ></v-text-field>

                      <v-select
                        v-model="user.shift_Schedule_ID"
                        :items="getShiftSchedules"
                        item-value="id"
                        label=" Shift Schedule"
                        item-text="shift_Code"
                        required
                        style="height: 50px !important"
                      ></v-select>

                      <v-select
                        v-model="user.teamID"
                        :items="getTeams"
                        v-on:change="getTeamLeadID()"
                        item-value="id"
                        label="Which Team do you belong?"
                        item-text="name"
                        required
                        style="height: 50px !important"
                      ></v-select>
                      <v-select
                        v-model="user.worldAreaID"
                        :items="getWorldAreas"
                        item-value="id"
                        label="World Area Support"
                        item-text="label"
                        required
                        style="height: 50px !important"
                        no-data-text="No data to display"
                        >
                        </v-select>
              <v-card-actions class="justify-center">
                <v-btn width="220" height="40" color="primary" @click="register_dialog=true">
                  Request To Activate
                </v-btn>
              </v-card-actions>
            </form>
          </v-card-text>
        </v-card>
      </div>
    </v-row>
    <v-dialog dark persistent v-model="error_dialog" width="480">
          <v-card-title class="headline blue lighten-2" style="color:white">
              Oops...
          </v-card-title>
          <v-card-text  style="background-color:white">
            <div style="font-size:15px;" class="pb-5 pt-5">Shift Schedule is required.</div>
            <v-btn type="submit" @click="error_dialog = false" color="blue">I Understand</v-btn>
          </v-card-text>
        </v-dialog>


    <v-dialog dark persistent v-model="register_dialog" width="480">
          <v-card-title class="headline blue lighten-2" style="color:white">
              Request to activate your account
          </v-card-title>
          <v-card-text  style="background-color:white">
            <div style="font-size:15px;" class="pb-5 pt-5">Upon submitting your request your Team Lead will receive a notification to activate your account.</div>
            <v-btn type="submit" @click="addUser" color="blue">I Understand</v-btn>
            <v-btn text @click="register_dialog = false" color="blue">Cancel</v-btn>
          </v-card-text>
        </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
import AuthService from "../services/AuthService";
import GraphService from "../services/GraphService";
import SparrowService from "../services/SparrowService";

export default {
  name: "Register",
  data (){
    return {
    user: this.createNewUser(),
    notification: this. createNewNotification(),
    teamLeadID:0,
    graph_data:[],
    register_dialog:false,
    error_dialog:false,
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
    },
    getWorldAreas(){
      return this.$store.state.world_areas[0];
    },
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
    },
    addUser() {
      if(this.user.shift_Schedule_ID == 0){
        this.error_dialog = true
      }else{
          let addUserPromise = []
          this.user.roleID = 4
          if(this.user.worldAreaID == 0){
            this.user.worldAreaID = 1
          }
          addUserPromise.push(
            this.$store
              .dispatch("addUser", this.user)
              .then(() => {
                this.register_dialog = false;
                this.sendNotification();
              })
              .catch(() => {
                console.log("There was a problem in adding the user");
              })
          )
          Promise.all(addUserPromise).then(()=>{
              this.$router.push('/pending-approval')
          })
      }
     
    },
    getTeamLeadID(){
      SparrowService.getTeam(this.user.teamID).then(response =>{
        this.teamLeadID = response.data[0].team_Lead_User_ID
      })
    },
    sendNotification(){
      let name = this.user.first_Name +" "+ this.user.last_Name
      let param={
        title:"User Activation",
        message:"Your staff" + " "+ name + " " + "is requesting for you to activate his/her account, Go to User Management tab to activate his/her profile",
        url :"https://ticktrack.azurewebsites.net/group-management",
        status:true,
        user_notified_id: this.teamLeadID
      }
        this.$store
        .dispatch("addNotification", param)
    },
    login() {
      this.loading = true;
      this.loginFailed = false;
      this.authService.login().then(
        (user) => {
          if (user) {
            this.user_data = user;
          } else {
            this.loginFailed = true;
          }
        },
        () => {
          this.loginFailed = true;
        }
      );
    },
    createNewUser() {
      return {
        first_Name: "",
        middle_Name: "",
        last_Name: "",
        contact_Info1: "",
        contact_Info2: "",
        job_Title:"",
        email: "",
        status: false,
        shift_Schedule_ID: 0,
        roleID: 4,
        teamID:0,
        worldAreaID:0
      };
    },
    createNewNotification(){
      return{
        title:"",
        message:"",
        url :"",
        status:true,
        received_Date:"",
        user_notified_id:"",
        }
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