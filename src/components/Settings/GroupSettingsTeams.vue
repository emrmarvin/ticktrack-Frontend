<template>
  <v-data-table
    :headers="headers"
    :items="teams"
    item-key="id"
    :loading="loading"
    :items-per-page="10"
    class="elevation-0"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Teams</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="blue" dark class="mb-2" v-bind="attrs" v-on="on">
              New Team
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{title}}</span>
            </v-card-title>
              <v-card-text  v-if="isLoaded">
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="team.name"
                        label="Team Name"
                      ></v-text-field>
                      <v-text-field
                        v-model="team.description"
                        label="Description"
                      ></v-text-field>
                      <v-checkbox
                        v-model="team.status"
                        label="Activate Team"
                      ></v-checkbox>
                      <v-autocomplete
                        v-model="team.team_Lead_User_ID"
                        :items="$store.state.users[0]"
                        item-value="id"
                        label="Team Lead"
                        item-text="email"
                        required
                        style="height: 50px !important"
                      >
                      </v-autocomplete>
                      <v-autocomplete
                        v-model="team.supervisor_User_ID"
                        :items="$store.state.users[0]"
                        item-value="id"
                        label="Supervisor"
                        item-text="email"
                        required
                        style="height: 50px !important"
                      >
                      </v-autocomplete>
                      <v-autocomplete
                        v-model="team.manager_User_ID"
                        :items="$store.state.users[0]"
                        item-value="id"
                        label="Manager"
                        item-text="email"
                        required
                        style="height: 50px !important"
                      >
                      </v-autocomplete>
                    </v-col>
                  </v-row>
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
                                    Getting Team Data
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
                <v-btn type="submit" v-if="toAdd" @click="addTeam" color="blue">Submit</v-btn>
                <v-btn type="submit" v-if="toUpdate" @click="updateTeam" color="blue">Update</v-btn>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog dark persistent v-model="delete_dialog" width="480">
          <v-card-title class="headline blue lighten-2">
              Delete
          </v-card-title>
          <v-card-text>
            <div style="font-size:15px" class="mb-5 mt-5">Are you sure you want to delete this one?</div>
            <v-btn type="submit" @click="deleteTeam" color="blue">YES</v-btn>
            <v-btn text @click="delete_dialog=false" color="blue darken-1">NO</v-btn>
          </v-card-text>
        </v-dialog>

      </v-toolbar>
    </template>
    <template v-slot:body="{ items }">
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.team_Lead.email }}</td>   
          <td>{{ item.showTimer | boolean }}</td>    
          <td>{{ item.status | boolean }}</td>
          <td>
            <v-icon small class="mr-2" @click="getTeam(item.id)"> mdi-pencil </v-icon>
            <v-icon color="grey lighten-1" @click="getTeamToDelete(item.id)">mdi-delete</v-icon>
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
  name: "GroupSettingsBU",
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
          text: "Name",
          value: "name",
        },
        {
          text: "Team Lead",
          value: "",
        },
        {
          text: "Show Timer?",
          value: "showTimer",
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
      teams: [],
      editedIndex: -1,
      team: this.createNewTeam(),

      toAdd:true,
      toUpdate:false,
      title:"Add New Team",
      isLoaded:true,
      team_Promise:[],
      team_id:0,
      delete_dialog:false
    };
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  created() {
    SparrowService.getTeams()
      .then((response) => {
        this.loading = false;
        this.teams = response.data;
      })
      .catch((error) => {
        console.log(error.response);
      });
  },
  methods: {
    addTeam() {
      this.$store
        .dispatch("addTeam", this.team)
        .then(() => {
          setTimeout(() => {
            SparrowService.getTeams()
              .then(response => {
                  this.teams = response.data
              })
          },1000);
          this.team = this.createNewTeam();
          this.dialog = false;
        })
        .catch(() => {
          console.log("There was a problem creating your Team");
        });
    },
    getTeam(id){
      this.toUpdate = true
      this.toAdd = false
      this.isLoaded=false
      this.title="Update Team"  
      this.team_Promise.push(
        SparrowService.getTeam(id).then(response => {
          this.team_id = response.data[0].id
          this.team.name = response.data[0].name
          this.team.description = response.data[0].description
          this.team.status = response.data[0].status
          this.team.team_Lead_User_ID = response.data[0].team_Lead_User_ID
          this.team.supervisor_User_ID = response.data[0].supervisor_User_ID
          this.team.manager_User_ID = response.data[0].manager_User_ID
        })
      ) 
      Promise.all(this.team_Promise).then(()=>{
        this.isLoaded = true
      })
      this.dialog = true
    },
    updateTeam(){
      let params ={
        id:this.team_id,
        name:this.team.name,
        description: this.team.description,
        status:this.team.status,
        business_Units:[],
        team_Lead_User_ID:this.team.team_Lead_User_ID,
        supervisor_User_ID:this.team.supervisor_User_ID,
        manager_User_ID:this.team.manager_User_ID,
      }
      SparrowService.putTeam(this.team_id, params).then(()=>{
          setTimeout(() => {
            SparrowService.getTeams().then(response => {
              this.teams = response.data;
              this.dialog = false;
              this.toUpdate = false;
              this.toAdd = true;
              this.title = "Add New Team";
              this.team = this.createNewTeam();
            })
        }, 1500);
      })
    },
    getTeamToDelete(id){
      this.delete_dialog = true
      this.team_id = id
    },
    deleteTeam(){
      SparrowService.deleteTeam(this.team_id).then(()=>{
        this.delete_dialog = false
        setTimeout(() => {
            SparrowService.getTeams().then(response => {
              this.teams = response.data;
            })
        }, 1500);
      })
    },
    close() {
      this.dialog = false;
      this.toUpdate = false
      this.toAdd = true
      this.title = "Add New Team"
      this.isLoaded = true
      this.team = this.createNewTeam()
    },
    createNewTeam() {
      return {
        name: "",
        description: "",
        status:"",
        business_Units:[],
        team_Lead_User_ID:0,
        supervisor_User_ID:0,
        manager_User_ID:0
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