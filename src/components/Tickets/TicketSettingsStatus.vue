<template>
  <v-card width="480" class="pa-5 mx-10">
    <v-list-item class="mb-2">
      <v-list-item-content>
        <v-list-item-title>Ticket Status</v-list-item-title>
      </v-list-item-content>
      <v-list-item-action>
        <v-dialog persistent v-model="dialog" width="480">
          <template #activator="{ on: dialog }">
            <v-tooltip top>
              <template #activator="{ on: tooltip }">
                <v-btn
                  fab
                  small
                  color="blue"
                  v-on="{ ...tooltip, ...dialog }"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
              <span>Add Ticket Status</span>
            </v-tooltip>
          </template>
          <v-card>
            <v-card-title class="headline blue lighten-2">
              {{title}}
            </v-card-title>
            <v-card-text v-if="isLoaded">
              <br>
              Note: Please make sure to use "In-Progress" for in progress status
              <v-select
                        v-model="$store.state.teamID"
                        :items="getTeams"
                        item-value="id"
                        label="Team"
                        item-text="name"
                        required
                        style="height: 50px !important"
                        :disabled="true"
                ></v-select>
                <v-text-field
                  v-model="status.status"
                  label="Label"
                ></v-text-field>
                <v-text-field
                  v-model="status.description"
                  label="Description"
                ></v-text-field>

                <v-btn type="submit" v-if="toAdd" @click="addTicketStatus" color="blue">Submit</v-btn>
                <v-btn type="submit" v-if="toUpdate" @click="updateStatus" color="blue">Update</v-btn>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
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
                      Getting Main Category Data
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
          </v-card>
        </v-dialog>

        <v-dialog persistent v-model="delete_dialog" width="480">
          <v-card>
          <v-card-title class="headline blue lighten-2">
              Delete
          </v-card-title>
          <v-card-text>
            <div style="font-size:15px" class="mb-5 mt-5">Are you sure you want to delete this one?</div>
            <v-btn type="submit" @click="deleteStatus" color="blue">YES</v-btn>
            <v-btn text @click="delete_dialog=false" color="blue darken-1">NO</v-btn>
          </v-card-text>
          </v-card>
        </v-dialog>

      </v-list-item-action>
    </v-list-item>

    <v-divider class="mb-2"></v-divider>

    <v-list-item
      v-for="status in statuses"
      :key="status.id"
      three-line
    >
      <v-list-item-content>
        <v-list-item-title
          > {{ status.status }}</v-list-item-title
        >
        <v-list-item-subtitle
          >{{ status.team.name }}</v-list-item-subtitle
        >
      </v-list-item-content>

      <v-list-item-action class="d-flex flex-row">
        <v-btn icon @click="getStatus(status.id)">
          <v-icon color="grey lighten-1">mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon @click="getStatusToDelete(status.id)">
          <v-icon color="grey lighten-1">mdi-delete</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>

  </v-card>
</template>

<script>
import SparrowService from "@/services/SparrowService.js";

export default {
  name: "TicketSettings",
  data() {
    return {
      dialog: false,
      dialogEdit: false,
      editedIndex: -1,
      statuses: [],
      status: this.createStatus(),

      toAdd:true,
      toUpdate:false,
      title:"Add Ticket Status",
      isLoaded:true,
      statusPromise:[],
      status_id:0,

      delete_dialog:false
    };
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  created() {
    this.statuses = this.$store.state.ticket_Status_by_team[0]
  },
  computed:{
    getTeams(){
      return this.$store.state.teams[0]
    }
  },
  mounted(){
    setTimeout(() => {
      SparrowService. getTicketTicket_Status_By_Team(this.$store.state.teamID)
        .then(response => {
            this.statuses = response.data
        })
    },1000);
  },
  methods: {
    addTicketStatus() {
      this.status.teamID = this.$store.state.teamID
      this.$store
        .dispatch("addTicketStatus", this.status)
        .then(() => {
          setTimeout(() => {
            SparrowService. getTicketTicket_Status_By_Team(this.$store.state.teamID)
              .then(response => {
                  this.statuses = response.data
              })
          },1000);
          this.status = this.createStatus();
          this.dialog = false;
        })
        .catch((err) => {
          console.log("error posting", err);
        });
    },
    getStatus(id){
      this.toUpdate = true
      this.toAdd = false
      this.isLoaded=false
      this.title="Update Ticket Status"  
      this.statusPromise.push(
        SparrowService.getTicketTicket_Status(id).then(response => {
          this.status_id = response.data[0].id
          this.status.status = response.data[0].status
          this.status.description = response.data[0].description
          this.status.teamID = response.data[0].teamID
        })
      ) 
      Promise.all(this.statusPromise).then(()=>{
        this.isLoaded = true
      })
      this.dialog = true
    },
    updateStatus(){
      let params ={
        id:this.status_id,
        status:this.status.status,
        description: this.status.description,
        teamID:this.status.teamID
      }
      SparrowService.putTicketTicket_Status(this.status_id, params).then(()=>{
          setTimeout(() => {
            SparrowService.getTicketTicket_Status_By_Team(this.$store.state.teamID).then(response => {
              this.statuses = response.data;
              this.$store.state.ticket_Status_by_team[0] = response.data;
              this.dialog = false;
              this.toUpdate = false;
              this.toAdd = true;
              this.title = "Add Ticket Status";
              this.status = this.createStatus();
            })
        }, 1500);
      })
    },
    getStatusToDelete(id){
      this.delete_dialog = true
      this.status_id = id
    },
    deleteStatus(){
      SparrowService.deleteTicketTicket_Status(this.status_id).then(()=>{
        this.delete_dialog = false
        setTimeout(() => {
            SparrowService.getTicketTicket_Status_By_Team(this.$store.state.teamID).then(response => {
              this.statuses = response.data;
            })
        }, 1500);
      })
    },
    close() {
      this.dialog = false;
      this.toUpdate = false
      this.toAdd = true
      this.title = "Add Ticket Status"
      this.isLoaded = true
      this.status = this.createStatus();
    },
    createStatus() {
      return {
        status: "",
        description: "",
        teamID:this.$store.state.teamID
      };
    },
  },
};
</script>

<style scoped>
</style>