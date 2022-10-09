<template>
  <v-data-table
    :headers="headers"
    :items="users"
    item-key="id"
    :loading="loading"
    :items-per-page="10"
    class="elevation-0"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>User List</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="blue" dark class="mb-2" v-bind="attrs" v-on="on">
              New User
            </v-btn>
          </template>
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
      </v-toolbar>
    </template>
    <template v-slot:body="{ items }">
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.email }}</td>
          <td>{{ item.first_Name }}</td>
          <td>{{ item.last_Name }}</td>
          <td>{{ item.role.name }}</td>
          <td>{{ item.team.name }}</td>
          <td>{{ item.status | boolean }}</td>
          <td>
            <v-icon small class="mr-2" @click="getUserToUpdate(item.id)">
              mdi-pencil
            </v-icon>
          </td>
        </tr>
      </tbody>
    </template>
  </v-data-table>
</template>

<script>
import SparrowService from "@/services/SparrowService.js";

const booleanFilter = function (value, trueText, falseText) {
  return value ? trueText || "Yes" : falseText || "No";
};

export default {
  name: "UserListSettingsAdmin",
  filters: {
    boolean: booleanFilter,
  },
  data() {
    return {
      loading: true,
      dialog: false,
      dialogEdit: false,
      headers: [
        {
          text: "Email",
          value: "Email",
        },
        {
          text:"First Name",
          value:"first_Name"

        },
        {
          text:"Last Name",
          value:"last_Name"

        },
        {
          text: "Role",
          value: "Role",
        },
        {
          text: "Team",
          value: "",
        },
        {
          text: "Active?",
          value: "status",
        },
        {
          text: "Actions",
          value: "actions",
        },
      ],
      users: [],
      editedIndex: -1,
      user: this.createNewUser(),
      toUpdate:false,
      toAdd:true, 
      isLoaded:true,
      title:"Add New User",
      userPromise:[]
    };
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
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
  created() {
    // SparrowService.getUsers()
    //   .then((response) => {
    //     this.loading = false;
    //     this.users = response.data;
    //   })
    //   .catch((error) => {
    //     console.log(error.response);
    //   });
  },
  mounted(){
    setTimeout(() => {
      this.loading = false;
      this.users = this.$store.state.users[0]
    },1000);
  },
  methods: {
    addUser() {
      this.$store
        .dispatch("addUser", this.user)
        .then(() => {
           this.users = [];
          setTimeout(() => {
            SparrowService.getUsers()
              .then(response => {
                  this.users = response.data
              })
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
        })
      )
      Promise.all(this.userPromise).then(()=>{
        this.isLoaded = true
      })
      this.dialog = true;
    },
    updateUser(){
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
        teamID:this.user.teamID
      }
      SparrowService.putUsers(this.userID,param).then(response =>{
        setTimeout(() => {
            SparrowService.getUserByTeam(this.$store.state.teamID).then(response => {
              this.users = response.data
              this.$store.state.usersByTeam[0] = response.data
              this.dialog = false;
              this.toUpdate = false;
              this.toAdd = true;
              this.user = this.createNewUser();
            })
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
        teamID:0
      };
    },
  },
};
</script>

<style>
.rowSize thead tr {
  height: 50px !important;
}
.rowSize tbody tr td {
  padding: 15px !important;
  width: 20px;
  height: 100px !important;
}
.actions-size {
  width: 50px !important;
}
</style>