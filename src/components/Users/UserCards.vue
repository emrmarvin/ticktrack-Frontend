<template>
    <div style="margin-top:50px;margin-left:15px">  
      
    <v-row class="mx-auto mt-12 mb-6">
          <v-row style="background-color:#4caf50;border-radius:5px;height:70px!important;width:100%;padding-bottom:80px!important" class="mb-5"> 
            <v-col cols="6" style="color:white;font-size:20px;">
                <strong> Users List </strong>  <br>
                <div v-if="users_list != null"><h5> Number of Team Member/s : {{users_list.length}}</h5></div>
            </v-col>
            <v-col cols="2">
              <v-btn style="float:right;background-color:#4caf50;border:solid 1px white;color:white" v-show="$store.state.isAdmin == true" @click="dialog= true" class="mt-2" >
                      Add New User
              </v-btn> 
            </v-col>
            <v-col cols="2">
            <v-select
            :items="[{id:1,filter:'Name'},{id:2,filter:'Team'}]"
            item-value="filter"
            label="Search By"
            item-text="filter"
            required
            append-icon="mdi-filter"
            outlined
            color="text_color"
            :menu-props="{ maxHeight: '400',maxWidth:'400'}"
            v-model="filter_by"
            style="height: 50px !important;max-width:300px"
            no-data-text="No data to display"
            ></v-select>
            </v-col>
            <v-col cols="2" style="color:white">
            <v-text-field :disabled="!filter_by" filled color="text_color"  @input="filterUsers" v-model="search" label="Search People">
                    <v-icon slot="append" color="text_color">
                        mdi-account-search-outline
                    </v-icon>
            </v-text-field>
            </v-col>
        </v-row>
        <v-row v-if="filteredUsers.length == 0">
        <v-col style="padding-left:50%" v-if="!this.$store.state.users[0]">   
          <span>Loading...</span>
          
        </v-col>
        <!---Card--->
          <v-col cols="4" md="4" v-for="(user,index) in users_list" :key="user.id" v-show="index < limit_by">
            <v-card elevation="15"  class="pa-4 ticket_card" >
              <v-card-title class="title mb-3" style="background-color:#4caf50">
                <ProfilePictureDisplay
                  :imgscr="user.image"
                />
                <v-row align="center" justify="end" >
                  <v-btn
                        fab
                        style="background-color:white"
                        small
                        class="mr-2"
                        @click="getUserToUpdate(user.id)"
                      >
                        <v-icon color="primary"> mdi-clipboard-edit </v-icon>
                  </v-btn>
                </v-row>
      
              </v-card-title>
              <v-divider
                class="ticket-divider mb-2 mx-auto title blue-darken-3"
              ></v-divider>
              <v-card-subtitle class="ticket-description mb-4 text_color--text">
                <h2>{{ user.first_Name}} {{user.last_Name}}</h2><br>
                <b>Email:</b> {{user.email}}<br>
                <b>Position:</b> {{user.job_Title}}<br>
                <b>Role:</b> {{user.role.name}} <br>
                <span v-if="user.roleID != 3"><b>Team:</b> {{user.team.name}}</span>
              </v-card-subtitle>

              <v-card-actions>
                <v-list-item class="grow">
                  <span v-if="user.status == true"><v-icon  size="30" color="green" class="mr-2">mdi-check</v-icon>Active</span>
                  <span v-if="user.status == false"><v-icon  size="30" color="red" class="mr-2">mdi-close</v-icon>Deactived</span>
                </v-list-item>
              </v-card-actions>
            </v-card>
          </v-col>
          <div v-if="$store.state.users_count" style="width:100%;text-align:center"><v-btn @click="ShowMore(default_limit, users_list.length)">{{ limit_by >= users_list.length?'Hide more': 'Show more'}}</v-btn></div>
          <!---End Card---->
          <!---Card--->
        </v-row>
        <v-row v-if="filteredUsers.length != 0"> 
        <v-col style="padding-left:50%" v-if="!this.$store.state.users[0]">   
          <span>Loading...</span>
        </v-col>
          <v-col cols="4" md="4" v-for="(user,index) in filteredUsers" :key="user.id" v-show="index < limit_by">
            <v-card elevation="15"  class="pa-4 ticket_card" >
              <v-card-title class="title mb-3" style="background-color:#4caf50">
                <ProfilePictureDisplay
                  :imgscr="user.image"
                />
                <v-row align="center" justify="end" >
                  <v-btn
                        fab
                        style="background-color:white"
                        small
                        class="mr-2"
                        @click="getUserToUpdate(user.id)"
                      >
                        <v-icon color="primary"> mdi-clipboard-edit </v-icon>
                  </v-btn>
                </v-row>
      
              </v-card-title>
              <v-divider
                class="ticket-divider mb-2 mx-auto title blue-darken-3"
              ></v-divider>
              <v-card-subtitle class="ticket-description mb-4 text_color--text">
                <h2>{{ user.first_Name}} {{user.last_Name}}</h2><br>
                <b>Email:</b> {{user.email}}<br>
                <b>Position:</b> {{user.job_Title}}<br>
                <b>Role:</b> {{user.role.name}}<br>
                <span v-if="user.roleID != 3"><b>Team:</b> {{user.team.name}}</span>
              </v-card-subtitle>

              <v-card-actions>
                <v-list-item class="grow">
                  <span v-if="user.status == true"><v-icon  size="30" color="green" class="mr-2">mdi-check</v-icon>Active</span>
                  <span v-if="user.status == false"><v-icon  size="30" color="red" class="mr-2">mdi-close</v-icon>Deactivated</span>
                </v-list-item>
              </v-card-actions>
            </v-card>
          </v-col>
          <!---End Card---->
          <div v-if=" filteredUsers.length > default_limit" style="width:100%;text-align:center"><v-btn @click="ShowMore(default_limit, filteredUsers.length)">{{ limit_by >= filteredUsers.length?'Hide more': 'Show more'}}</v-btn></div>

        </v-row>
    </v-row>
           <v-row>
          <v-col>
          <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">{{title}}</span>
            </v-card-title>
              <v-card-text v-if="isLoaded">
                <v-container>
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
                      ></v-text-field>
                      <v-checkbox
                        v-model="user.status"
                        label="Activate?"
                      ></v-checkbox>

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
                        v-model="user.roleID"
                        :items="getRoles"
                        item-value="id"
                        label="Role"
                        item-text="name"
                        required
                        style="height: 50px !important"
                      ></v-select>

                      <v-select
                        v-model="user.teamID"
                        :items="getTeams"
                        item-value="id"
                        label="Team"
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
                </v-container>
              </v-card-text>
              
              <v-container v-if="!isLoaded" style="height: 400px;">
                  <v-row
                    class="fill-height"
                    align-content="center"
                    justify="center"
                  >
                    <v-col
                      class="subtitle-1 text-center"
                      cols="12"
                    >
                      Getting User Data
                      <br>
                      Wait lang po..
                    </v-col>
                    <v-col cols="6">
                      <v-progress-linear
                        color="deep-purple accent-4"
                        indeterminate
                        rounded
                        height="6"
                      ></v-progress-linear>
                    </v-col>
                  </v-row>
              </v-container>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn v-if="toAdd" @click="addUser" type="submit" color="blue">Submit</v-btn>
                <v-btn v-if="toUpdate" @click="updateUser" type="submit" color="blue">Update</v-btn>
              </v-card-actions>
          </v-card>
        </v-dialog>
          </v-col>
        </v-row>

    <!--Saving loader--->
   <v-dialog v-model="dialog_saving" hide-overlay persistent width="400">
                <v-card
                  color="primary"
                  dark
                >
                  <v-card-text style="text-align:center;padding-top:5px">
                    Updating User Info
                    <v-progress-linear
                      indeterminate
                      color="white"
                      class="mb-0 mt-2"
                    ></v-progress-linear>
                  </v-card-text>
                </v-card>
   </v-dialog>
    </div>
</template>

<script>
import GraphService from "../../services/GraphService.js";
import SparrowService from "@/services/SparrowService.js";
import ProfilePictureDisplay from '@/components/Users/ProfilePictureDisplay'
export default {
    components:{
        ProfilePictureDisplay
    },
    data(){
        return{
            user: this.createNewUser(),
            filteredUsers:[],
            search:"",
            filter_by:"",
            loading: true,
            dialog: false,
            dialogEdit: false,
            toUpdate:false,
            toAdd:true, 
            isLoaded:true,
            title:"Add New User",
            userPromise:[],
            imageInfos:[],
            image:"",
            alt:"",
            default_limit: 6,
            limit_by: 6,
            dialog_saving:false
            }
            
    },
  mounted(){
   
  },


computed:{ 
   users_list:{
    get() {
      return this.$store.state.users[0]
    },
    // setter
    set(newValue) {
      this.filteredUsers =  newValue
    }
   },
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
created() {
    this.graphService = new GraphService();
  },
methods:{
   ShowMore(default_limit, filters_length) {
      if(this.limit_by === filters_length){
        this.limit_by = default_limit
      }else if(this.limit_by > filters_length){
        this.limit_by = default_limit
      }else if(this.limit_by < filters_length){
         this.limit_by += 6
      }
    },
   filterUsers(){
     let users = []
     let name = ""
     for(let i = 0; i < this.$store.state.users[0].length; i++){
       if(this.filter_by == "Name"){
         name = this.$store.state.users[0][i].first_Name + this.$store.state.users[0][i].last_Name
        if(name.toLowerCase().includes(this.search.toLowerCase())){
            users.push(this.$store.state.users[0][i])
        }
      }else if(this.filter_by == "Team"){
        if(this.$store.state.users[0][i].team.name.toLowerCase().includes(this.search.toLowerCase())){
            users.push(this.$store.state.users[0][i])
        }
      }
     }
     this.users_list = users
   },
    addUser() {
        this.$store
          .dispatch("addUser", this.user)
          .then(() => {
            this.users = [];
            setTimeout(() => {
              if(this.$store.state.isAdmin == true){
                   SparrowService.getUsers().then(response => {this.users_list = response.data})
              }
              else if(this.$store.state.isTeamLead == true){
                   SparrowService.getUserByTeam(this.$store.state.teamID).then(response=>{this.users_list = response.data})
              }        
            },1000);
            this.user = this.createNewUser();
            this.dialog = false;
          })
          .catch(() => {
            console.log("There was a problem creating your ticket");
          });
    },
    getUserToUpdate(id) {
      this.title = "Update User"
      this.toUpdate = true
      this.toAdd = false
      this.isLoaded=false,
      this.userPromise.push(
        SparrowService.getUser(id).then(response => {
          this.userID = response.data[0].id
          this.user.first_Name = response.data[0].first_Name
          this.user.middle_Name = response.data[0].middle_Name
          this.user.last_Name = response.data[0].last_Name
          this.user.contact_Info1 = response.data[0].contact_Info1
          this.user.contact_Info2 = response.data[0].contact_Info2
          this.user.job_Title = response.data[0].job_Title
          this.user.email = response.data[0].email
          this.user.status = response.data[0].status
          this.user.shift_Schedule_ID = response.data[0].shift_Schedule_ID
          this.user.roleID = response.data[0].roleID
          this.user.teamID = response.data[0].teamID
          this.user.worldAreaID = response.data[0].worldAreaID
        })
      )
      Promise.all(this.userPromise).then(()=>{
        this.isLoaded = true
      })
      this.dialog = true;
    },
    updateUser(){
      this.dialog_saving = true
      let param ={
        id:this.userID,
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
      SparrowService.putUsers(this.userID,param).then(response =>{
        setTimeout(() => {
          let appendImagePromise = [] 
          if(this.$store.state.isAdmin == true){
                   SparrowService.getUsers().then(response => {
                    for(let p = 0; p < response.data.length; p++){
                      appendImagePromise.push(
                        SparrowService.getProfile(response.data[p].id).then(res => {
                              if(res.data.length != 0){
                                response.data[p]["image"] = res.data[0].image
                              }
                        })
                      )
                    }
                    Promise.all(appendImagePromise).then(()=>{
                      this.users_list = response.data
                      this.$store.state.usersByTeam[0] = response.data
                      this.dialog = false;
                      this.toUpdate = false;
                      this.toAdd = true;
                      this.user = this.createNewUser();
                    })
                     
                    })
              }
              else if(this.$store.state.isTeamLead == true){
                   SparrowService.getUserByTeam(this.$store.state.teamID).then(response=>{
                     for(let p = 0; p < response.data.length; p++){
                      appendImagePromise.push(
                        SparrowService.getProfile(response.data[p].id).then(res => {
                              if(res.data.length != 0){
                                response.data[p]["image"] = res.data[0].image
                              }
                        })
                      )
                    }
                        Promise.all(appendImagePromise).then(()=>{
                        this.users_list = response.data
                        this.$store.state.usersByTeam[0] = response.data
                        this.dialog = false;
                        this.dialog_saving = false
                        this.toUpdate = false;
                        this.toAdd = true;
                        this.user = this.createNewUser();
                     })
                    })
              } 
        }, 1500);
      })
    },
    close() {
      this.dialog = false;
      this.toUpdate = false;
      this.toAdd = true;
      this.isLoaded = true
      this.user = this.createNewUser();
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
</style>