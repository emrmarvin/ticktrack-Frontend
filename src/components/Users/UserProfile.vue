<template>
    <div style="margin-top:50px;margin-left:15px">
        <v-card class="login-card mx-auto py-8 mb-8" width="900" height="1050" style="padding-top:0px!important">
                    <v-card-title class="justify-center" style="background-color:#4caf50" color="green">
                        <div>
                        <v-avatar  size="150" class="mr-3" style="border:solid 3px white">
                            <div class="container-img" >
                                <img  v-if="$store.state.image" :src="$store.state.image" alt="Profile Picture" class="image" />   
                                <v-icon size="150" v-if="!$store.state.image" style="border:solid 1px green;border-radius:50px">mdi-account-circle</v-icon>
                                <div class="middle">
                                    <div class="text"><v-icon  @click="dialog_update_image = true">mdi mdi-camera</v-icon> Update Photo</div>
                                </div>  
                                <div class="updating" v-if="updating">                 
                                    <div class="text"> Updating... </div> 
                                </div> 
                                  
                            </div>        
                        </v-avatar>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-text-field
                               :disabled="isViewOnly"
                                v-model="user.first_Name"
                                label="First Name"
                            ></v-text-field>
                            <v-text-field
                                :disabled="isViewOnly"
                                v-model="user.middle_Name"
                                label="Middle Name"
                            ></v-text-field>
                            <v-text-field
                                :disabled="isViewOnly"
                                v-model="user.last_Name"
                                label="Last Name"
                            ></v-text-field>
                            <v-text-field
                                :disabled="isViewOnly"
                                v-model="user.contact_Info1"
                                label="Contact Info 1"
                            ></v-text-field>
                            <v-text-field
                                :disabled="isViewOnly"
                                v-model="user.contact_Info2"
                                label="Contact Info 2"
                            ></v-text-field>
                            <v-text-field
                                :disabled="true"
                                v-model="user.job_Title"
                                label="Job Title"
                            ></v-text-field>
                            <v-text-field
                                :disabled="true"
                                v-model="user.email"
                                label="Email"
                            ></v-text-field>
                            <v-checkbox
                                :disabled="true"
                                v-model="user.status"
                                label="Activate?"
                            ></v-checkbox>

                            <v-select
                               :disabled="isViewOnly"
                                v-model="user.shift_Schedule_ID"
                                :items="getShiftSchedules"
                                item-value="id"
                                label=" Shift Schedule"
                                item-text="shift_Code"
                                required
                                style="height: 50px !important"
                            ></v-select>

                            <v-select
                                :disabled="true"
                                v-model="user.roleID"
                                :items="getRoles"
                                item-value="id"
                                label="Role"
                                item-text="name"
                                required
                                style="height: 50px !important"
                            ></v-select>

                            <v-select
                                :disabled="true"
                                v-model="user.teamID"
                                :items="getTeams"
                                item-value="id"
                                label="Team"
                                item-text="name"
                                required
                                style="height: 50px !important"
                            ></v-select>
                            <v-select
                                :disabled="isViewOnly"
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
                        </v-container>
                    </v-card-text>

                    <v-card-actions class="justify-center">
                        <v-btn  @click="isViewOnly = true" color="blue darken-1" text>Cancel</v-btn>
                        <v-btn  type="submit" v-if="!isViewOnly" @click="updateUser" style="color:white" color="#4caf50">Update</v-btn>
                        <v-btn  type="submit" v-if="isViewOnly" @click="isViewOnly = false" style="color:white"  color="#FFA700">Change</v-btn>
                    </v-card-actions>
                </v-card>
                 <v-dialog v-model="dialog_update_image" hide-overlay persistent width="400">
                                <v-card
                                color="primary"
                                dark
                                >
                                <v-card-text style="text-align:center;padding-top:5px">
                                    <upload-image></upload-image>
                                </v-card-text>
                                <v-card-actions class="justify-center">
                                    <v-btn color="#4caf50" @click="done">Done</v-btn>
                                </v-card-actions>
                                </v-card>
                </v-dialog>
                <v-snackbar
                    v-model="snackbar"
                    :timeout="timeout"
                    centered
                    color="green"
                    class="padding-left:10px"
                    >
                    <v-layout align-center pr-4>
                        <v-layout column>
                        <div style="text-align:center">Profile Saved!</div>
                        </v-layout>
                    </v-layout>
                </v-snackbar>
    </div>
</template>
<script>
import SparrowService from "../../services/SparrowService.js";
import UploadImage from "./UploadImage.vue";
export default {
name:"UserProfile",
components: {
      UploadImage,
},
data(){
        return{
            user: this.createNewUser(),
            imageInfos:[],
            image:"",
            alt:"",
            dialog_update_image:false,
            updating:false,
            snackbar:false,
            timeout:2000,
            isViewOnly:true,
            }
            
    },
mounted(){       
    setTimeout(() => {
        if(this.$store.state.userInfo[0][0] !== 'undefined'){
            this.user = this.$store.state.userInfo[0][0]
        }else{
            this.user = []
        }
        
    }, 2000);
    
},
computed:{
    getWorldAreas(){
      return this.$store.state.world_areas[0];
    },
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
methods:{
 done(){
     this.dialog_update_image = false
     this.updating = true
     this.$store.dispatch('fetchUserProfilePicture',this.$store.state.userID).then(()=>{
         if(this.$store.state.image){
                this.create = false
                this.id = this.$store.state.profilePictureID
                this.updating = false
            }else if(!this.$store.state.image){
                this.create = true
            }
     })
     
 },
 updateUser(){
      let param ={
        id:this.$store.state.userID,
        first_Name: this.user.first_Name,
        middle_Name: this.user.middle_Name,
        last_Name: this.user.last_Name,
        contact_Info1: this.user.contact_Info1,
        contact_Info2: this.user.contact_Info2,
        job_Title:this.user.job_Title,
        email: this.user.email,
        status: this.user.status,
        shift_Schedule_ID: this.user.shift_Schedule_ID,
        roleID: this.user.roleID,
        teamID:this.user.teamID,
        worldAreaID:this.user.worldAreaID
      }
      SparrowService.putUsers(this.$store.state.userID,param).then(response =>{
        setTimeout(() => {
            SparrowService.getUser(this.$store.state.userID).then(response => {
             this.user = response.data[0]
             this.$store.state.userName = response.data[0].first_Name +" "+ response.data[0].last_Name
             this.$store.state.world_area_support = response.data[0].world_Area.abbreviation
             this.snackbar = true
             this.isViewOnly = true
            })  
        }, 1500);
      })
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
        status: "",
        shift_Schedule_ID: 0,
        roleID: 0,
        teamID:0,
        worldAreaID:0
      };
    },
}
}
</script>
<style scoped>
.container-img {
  position: relative;
}

.image {
  opacity: 1;
  transition: .5s ease;
  backface-visibility: hidden;
  width: 150px;
}

.middle {
  transition: .5s ease;
  opacity: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  text-align: center;
}
.updating{
  opacity: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  text-align: center;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
}
.container-img:hover .image {
  opacity: 0.3;
}

.container-img:hover .middle {
  opacity: 1;
  cursor: pointer;
}

.text {
  color: white;
  font-size: 16px;
  width: 150px;
}
</style>