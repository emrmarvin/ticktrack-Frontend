<template>
  <v-card width="480" class="pa-5 mx-10">
    <v-list-item class="mb-2">
      <v-list-item-content>
        <v-list-item-title>Requesters</v-list-item-title>
      </v-list-item-content>
      <v-list-item-action>
        <v-dialog v-model="dialog" width="480">
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
              <span>Add Requesters</span>
            </v-tooltip>
          </template>
          <v-card>
            <v-card-title class="headline blue lighten-2">
             {{title}}
            </v-card-title>

            <v-card-text>
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
                  v-model="requester.name"
                  label="Requester Name"
                ></v-text-field>

                <v-btn type="submit" v-if="toAdd" @click="addRequester" color="primary">Submit</v-btn>
                <v-btn type="submit" v-if="toUpdate" @click="updateRequester"  color="blue">Update</v-btn>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
            </v-card-text>
          </v-card>
        </v-dialog>

        <v-dialog persistent v-model="delete_dialog" width="480">
          <v-card>
          <v-card-title class="headline blue lighten-2">
              Delete
          </v-card-title>
          <v-card-text>
            <div style="font-size:15px" class="mb-5 mt-5">Are you sure you want to delete this one?</div>
            <v-btn type="submit" @click="deleteRequester"  color="blue">YES</v-btn>
            <v-btn text @click="delete_dialog=false" color="blue darken-1">NO</v-btn>
          </v-card-text>
          </v-card>
        </v-dialog>


      </v-list-item-action>
    </v-list-item>

    <v-divider class="mb-2"></v-divider>

    <v-list-item
      v-for="requester in $store.state.requesters_by_team[0]"
      :key="requester.id"
      three-line
    >
      <v-list-item-content>
        <v-list-item-title
          >{{ requester.name }}</v-list-item-title
        >
      </v-list-item-content>

      <v-list-item-action class="d-flex flex-row">
        <v-btn icon @click="getRequester(requester.id)">
          <v-icon color="grey lighten-1">mdi-pencil</v-icon>
        </v-btn>
        <!-- <v-btn icon  @click="getRequesterToDelete(requester.id)">
          <v-icon color="grey lighten-1">mdi-delete</v-icon>
        </v-btn> -->
      </v-list-item-action>
    </v-list-item>
  </v-card>
</template>

<script>
import SparrowService from "@/services/SparrowService.js";

export default {
  name: "TicketSettings_BU",
  data() {
    return {
      dialog: false,
      dialogEdit: false,
      editedIndex: -1,
      requesters: [],
      requester: this.createNewRequester(),
      title:"Add Requesters",
      requester_id:0,
      toAdd:true,
      toUpdate:false,
      delete_dialog:false,
    };
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogEdit(val) {
      val || this.closeEdit();
    },
  },
  created() {
  },
  mounted(){
  },
  computed:{
    getTeams(){
      return this.$store.state.teams[0]
    },
  },
  methods: {
    addRequester() {
      this.requester.teamID = this.$store.state.teamID
      this.$store
        .dispatch("addRequester", this.requester)
        .then(() => {
          setTimeout(() => {
            this.$store.dispatch('fetchRequesterByTeam',this.$store.state.teamID)
            SparrowService.getRequesterByTeam(this.$store.state.teamID)
              .then(response => {
                  this.$store.state.requesters_by_team[0] = response.data
                  this.dialog = false;
                  this.toUpdate = false;
                  this.toAdd = true;
                  this.title = "Add Requester";
                  this.requester = this.createNewRequester();
              })
          },1500);
        })
        .catch(() => {
          console.log("There was a problem creating your Business Unit");
        });
    },
    getRequester(id){
      let requester_promise=[]
      this.toUpdate = true
      this.toAdd = false
      this.isLoaded=false
      this.title="Update Rquester"  
      requester_promise.push(
        SparrowService.getRequester(id).then(response => {
          this.requester_id = response.data.id
          this.requester.name = response.data.name
          this.requester.teamID = response.data.teamID
        })
      ) 
      Promise.all(requester_promise).then(()=>{
        this.isLoaded = true
      })
      this.dialog = true
    },

    updateRequester() {
      let params ={
        id:this.requester_id,
        name:this.requester.name,
        teamID:this.requester.teamID
      }
      SparrowService.putRequester(this.requester_id, params).then(()=>{
          setTimeout(() => {
            this.$store.dispatch('fetchRequesterByTeam',this.$store.state.teamID)
             SparrowService.getRequesterByTeam(this.$store.state.teamID).then(response => {
              this.$store.state.requesters_by_team[0] = response.data;
              this.dialog = false;
              this.toUpdate = false;
              this.toAdd = true;
              this.title = "Add Requester";
              this.requester = this.createNewRequester();
            })
        }, 1500);
      })
    },
    getRequesterToDelete(id){
      this.delete_dialog = true
      this.requester_id = id
    },
    deleteRequester(){
      SparrowService.deleteRequestert(this.requester_id).then(()=>{
        setTimeout(() => {
             this.$store.dispatch('fetchRequesterByTeam',this.$store.state.teamID)
             SparrowService.getRequesterByTeam(this.$store.state.teamID).then(response => {
              this.$store.state.requesters_by_team[0] = response.data;
              this.delete_dialog = false
              this.toUpdate= false
              this.toAdd = true
              this.title = "Add Requester";
              this.requester = this.createNewRequester();
            })
        }, 1500);
      })
    },
    close() {
      this.toAdd =true
      this.toUpdate = false
      this.dialog = false;
      this.requester = this.createNewRequester();
    },
    createNewRequester() {
      return {
        name: "",
        teamID:0,
      };
    },
  },
};
</script>

<style scoped>
</style>