<template>
  <v-card width="480" class="pa-5 mx-10">
    <v-list-item class="mb-2">
      <v-list-item-content>
        <v-list-item-title>Ticket SLA's</v-list-item-title>
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
                <v-text-field
                  v-model="sla.no_Of_hrs"
                  type="number"
                  label="No. of Hours"
                ></v-text-field>
                <v-text-field
                  v-model="sla.label"
                  label="Label"
                ></v-text-field>
                <v-text-field
                  v-model="sla.description"
                  label="Description"
                ></v-text-field>
                
                <v-select
                        v-model="sla.teamID"
                        :items="getTeams"
                        item-value="id"
                        label="Team"
                        item-text="name"
                        required
                ></v-select>
                 <v-select
                       v-on:change="getTicketSub1CategoryByMainCategory(sla.main_CategoryID)"
                        v-model="sla.main_CategoryID"
                        :items="getMainCategory"
                        item-value="id"
                        label="Main Category"
                        item-text="label"
                        required
                ></v-select>
                 <v-select
                        v-model="sla.sub1_CategoryID"
                        :items="sub1_Categories"
                        item-value="id"
                        label="Sub Category"
                        item-text="label"
                        required
                ></v-select>
                 <v-select
                        v-model="sla.complexityID"
                        :items="getComplexity"
                        item-value="id"
                        label="Complexity"
                        item-text="label"
                        required
                ></v-select>
                <v-select
                        disabled
                        v-model="sla.classificationID"
                        :items="getClassification"
                        item-value="id"
                        label="Classification"
                        item-text="label"
                        required
                ></v-select>

                <v-btn type="submit" v-if="toAdd" @click="addSLAInfo" color="blue">Submit</v-btn>
                <v-btn type="submit" v-if="toUpdate" @click="updateSLA" color="blue">Update</v-btn>
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
                      Getting SLA Data
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
        <v-dialog persistent v-model="delete_dialog" width="480" style="background-color:white!important">
          <v-card>
            <v-card-title class="headline blue lighten-2">
                Delete
            </v-card-title>
            <v-card-text>
              <div style="font-size:15px" class="mb-5 mt-5">Are you sure you want to delete this one?</div>
              <v-btn type="submit" @click="deleteTicket_SLA" color="blue">YES</v-btn>
              <v-btn text @click="delete_dialog=false" color="blue darken-1">NO</v-btn>
            </v-card-text>
           </v-card>
        </v-dialog>
      </v-list-item-action>
    </v-list-item>

    <v-divider class="mb-2"></v-divider>

    <v-list-item
      v-for="sla in SLAs"
      :key="sla.id"
      three-line
    >
      <v-list-item-content>
        <v-list-item-title
          > {{ sla.label }}
          </v-list-item-title>
        <v-list-item-subtitle
          >{{ sla.description }}
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          Number of Hours: {{ sla.no_Of_hrs }}
        </v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-action class="d-flex flex-row">
        <v-btn icon @click="getSLA(sla.id)">
          <v-icon color="grey lighten-1">mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon @click="getSLAToDelete(sla.id)">
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
      SLAs: [],
      sla: this.createSLA(),

      toAdd:true,
      toUpdate:false,
      title:"Add Ticket SLA",
      isLoaded:true,
      slaPromise:[],
      sla_id:0,

      delete_dialog:false,
      sub1_Categories:[],
      sub1_Categories_By_Team:[]
    };
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  created() {
    SparrowService.getTicketSub1_CategoryByTeam(this.$store.state.teamID)
      .then((response) => {
        this.sub1_Categories_By_Team = response.data;
      })
      .catch((error) => {
        console.log(error.response);
      });
  },
  computed:{
    getTeams(){
      return this.$store.state.teams[0]
    },
    getMainCategory(){
      return this.$store.state.main_Categories_by_team[0]
    },
    getSubCategory(){
      return this.$store.state.teams[0]
    },
    getComplexity(){
      return this.$store.state.complexitiesByTeam[0]
    },
    getClassification(){
      return this.$store.state.classifications[0]
    },
  },
  mounted(){
    this.SLAs = this.$store.state.SLAByTeam[0]
  },
  methods: {
    addSLAInfo() {
      this.sla.created_By = this.$store.state.userID
      this.$store
        .dispatch("addSLAInfo", this.sla)
        .then(() => {
          setTimeout(() => {
            SparrowService.getTicketSLAbyTeam(this.$store.state.teamID)
              .then(response => {
                  this.SLAs = response.data
              })
          },1000);
          this.sla = this.createSLA();
          this.dialog = false;
        })
        .catch((err) => {
          console.log("error posting", err);
        });
    },
    getSLA(id){
      this.toUpdate = true
      this.toAdd = false
      this.isLoaded=false
      this.title="Update Ticket SLA"  
      this.slaPromise.push(
        SparrowService.getTicketSLA(id).then(response => {
          this.getTicketSub1CategoryByMainCategory(response.data.main_CategoryID)
          this.sla_id = response.data.id
          this.sla.no_Of_hrs = response.data.no_Of_hrs
          this.sla.label = response.data.label
          this.sla.description = response.data.description
          this.sla.teamID = response.data.teamID
          this.sla.classificationID = 1
          this.sla.complexityID = response.data.complexityID
          this.sla.main_CategoryID = response.data.main_CategoryID
          this.sla.sub1_CategoryID = response.data.sub1_CategoryID
        })
      ) 
      Promise.all(this.slaPromise).then(()=>{
        this.isLoaded = true
      })
      this.dialog = true
    },
    updateSLA(){
      let params ={
        id:this.sla_id,
        no_Of_hrs:this.sla.no_Of_hrs,
        label: this.sla.label,
        description:this.sla.description,
        teamID: this.sla.teamID,
        classificationID: 1,
        complexityID: this.sla.complexityID,
        main_CategoryID:this.sla.main_CategoryID,
        sub1_CategoryID: this.sla.sub1_CategoryID, 
      }
      SparrowService.putTicketSLA(this.sla_id, params).then(()=>{
          setTimeout(() => {
            SparrowService.getTicketSLAbyTeam(this.$store.state.teamID).then(response => {
              this.SLAs = response.data;
              this.dialog = false;
              this.toUpdate = false;
              this.toAdd = true;
              this.title = "Add Ticket SLA";
              this.sla = this.createSLA();
            })
        }, 1500);
      })
    },
    getSLAToDelete(id){
      this.delete_dialog = true
      this.sla_id = id
    },
    deleteTicket_SLA(){
      SparrowService.deleteTicket_SLA(this.sla_id).then(()=>{
        this.delete_dialog = false
        setTimeout(() => {
           SparrowService.getTicketSLAbyTeam(this.$store.state.teamID).then(response => {
              this.SLAs = response.data;
            })
        }, 1500);
      })
    },
    getTicketSub1CategoryByMainCategory(id){
      this.sub1_Categories = []
      for(let i=0;i<this.sub1_Categories_By_Team.length; i++){
        if(this.sub1_Categories_By_Team[i].main_CategoryID == id){
          this.sub1_Categories.push(this.sub1_Categories_By_Team[i])
        }
      }
    },
    close() {
      this.dialog = false;
      this.toUpdate = false
      this.toAdd = true
      this.title = "Add Ticket Status"
      this.isLoaded = true
      this.sla = this.createSLA();
    },
    createSLA() {
      return {
        no_Of_hrs: "",
        label: "",
        description:"",
        created_By: "",
        teamID: "",
        classificationID: 1,
        complexityID: "",
        main_CategoryID: "",
        sub1_CategoryID: "",        
      };
    },
  },
};
</script>

<style scoped>
</style>