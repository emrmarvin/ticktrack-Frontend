<template>
  <v-card width="480" class="pa-5 mx-10">
    <v-list-item class="mb-2">
      <v-list-item-content>
        <v-list-item-title>Ticket Complexities</v-list-item-title>
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
              <span>Add Ticket Complexity</span>
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
                  v-model="complexity.abbreviation"
                  label="Abbreviation"
                  outlined
                >
                <v-icon slot="prepend" class="required">
                             *
                </v-icon>
                </v-text-field>
                <v-text-field
                  v-model="complexity.label"
                  label="Label"
                  outlined
                >
                <v-icon slot="prepend" class="required">
                             *
                </v-icon>
                </v-text-field>
                <v-text-field
                  v-model="complexity.description"
                  label="Description"
                  outlined
                ></v-text-field>               
                <v-text-field
                  v-model="complexity.no_of_hrs"
                  label="Number of Hours"
                  type="number"
                  outlined
                ></v-text-field> 
                
            </v-card-text>
            <div style="padding-left:15px">
            <span style="color:red;font-size:15px;" v-if="errors"><v-icon color="red">mdi-alert</v-icon> {{errors}}</span>
            </div>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn type="submit"  v-if="toAdd" @click="addComplexity" color="blue">Submit</v-btn>
                <v-btn type="submit"  v-if="toUpdate" @click="updateComplexity" color="blue">Update</v-btn>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

         <v-dialog persistent v-model="delete_dialog" width="480">
           <v-card>
          <v-card-title class="headline blue lighten-2">
              Delete
          </v-card-title>
          <v-card-text>
            <div style="font-size:15px" class="mb-5 mt-5">Are you sure you want to delete this one?</div>
            <v-btn type="submit" @click="deleteComplexity" color="blue">YES</v-btn>
            <v-btn text @click="delete_dialog=false" color="blue darken-1">NO</v-btn>
          </v-card-text>
          </v-card>
        </v-dialog>

      </v-list-item-action>
    </v-list-item>

    <v-divider class="mb-2"></v-divider>

    <v-list-item
      v-for="complexity in $store.state.complexitiesByTeam[0]"
      :key="complexity.id"
      three-line
    >
      <v-list-item-content>
        <v-list-item-title
          >{{ complexity.label }}</v-list-item-title
        >
        <v-list-item-subtitle
          >{{ complexity.team.name }}</v-list-item-subtitle
        >
        <v-list-item-subtitle
          >No. of Hours {{ complexity.no_of_hrs }}</v-list-item-subtitle
        >
      </v-list-item-content>

      <v-list-item-action class="d-flex flex-row">
        <v-btn icon @click="getComplexity(complexity.id)">
          <v-icon color="grey lighten-1">mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon @click="getComplexityToDelete(complexity.id)">
          <v-icon color="grey lighten-1">mdi-delete</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>
  </v-card>
</template>

<script>
import SparrowService from "@/services/SparrowService.js";

export default {
  name: "SupTL_TicketSettingsComplex",
  props:['teamID'],
  data() {
    return {
      dialog: false,
      dialogEdit: false,
      editedIndex: -1,
      complexities: [],
      complexity: this.createComplexity(),

      toAdd:true,
      toUpdate:false,
      title:"Add Ticket Complexity",
      isLoaded:true,
      complexitysPromise:[],
      complexity_id:0,
      errors : "",
      delete_dialog:false
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
  computed:{
    getTeams(){
      return this.$store.state.teams[0]
    }
  },
  mounted(){
    setTimeout(() => {
      this.loading = false;
      SparrowService.getTicketComplexitiesbyTeam(this.$store.state.teamID)
              .then(response => {
                  this.complexities = response.data
              })
    },1000);
  },
  methods: {
    validateMainCategory(){
      if(this.complexity.abbreviation != "" && this.complexity.label != ""){
        return true
      }else{
        this.errors = "Abbreviation and Label are required"
      }
    },

    addComplexity() {
      if(this.validateMainCategory() == true){
        let complexities = []
        let complexity_promise = []
        this.complexity.created_By = this.$store.state.userID
        this.complexity.teamID = this.teamID
        this.$store
          .dispatch("addComplexity", this.complexity)
          .then(() => {
            setTimeout(() => {
              complexity_promise.push(
                SparrowService.getTicketComplexitiesbyTeam(this.teamID)
                .then(response => {
                   complexities = response.data
                })
              )
              Promise.all(complexity_promise).then(()=>{
                 this.$store.dispatch('fetchTicketComplexitiesbyTeam',this.teamID)
                 this.$store.state.complexitiesByTeam[0] = complexities
                 this.complexity = this.createComplexity();
                 this.dialog = false
              })
            },1500);
            ;
          })
          .catch((err) => {
            console.log("error posting", err);
          });
      }
    },

     getComplexity(id){
      this.toUpdate = true
      this.toAdd = false
      this.isLoaded=false
      this.title="Update Ticket Complexity"  
      this.complexitysPromise.push(
        SparrowService.getTicketComplexity(id).then(response => {
          this.complexity_id = response.data[0].id
          this.complexity.abbreviation = response.data[0].abbreviation
          this.complexity.label = response.data[0].label
          this.complexity.no_of_hrs = response.data[0].no_of_hrs
          this.complexity.description = response.data[0].description
          this.complexity.teamID = response.data[0].teamID
        })
      ) 
      Promise.all(this.complexitysPromise).then(()=>{
        this.isLoaded = true
      })
      this.dialog = true
    },
    updateComplexity(){
      let complexities = []
      let complexity_promise = []
      let params ={
        id:this.complexity_id,
        abbreviation:this.complexity.abbreviation,
        label: this.complexity.label,
        description: this.complexity.description,
        no_of_hrs:this.complexity.no_of_hrs,
        created_By:this.$store.state.userID,
        teamID:this.complexity.teamID
      }
      SparrowService.putTicketComplexity(this.complexity_id, params).then(()=>{
          setTimeout(() => {
            complexity_promise.push(
              SparrowService.getTicketComplexitiesbyTeam(this.teamID).then(response => {
                complexities = response.data;
              })
            )
            Promise.all(complexity_promise).then(()=>{
              this.$store.dispatch('fetchTicketComplexitiesbyTeam',this.teamID)
              this.$store.state.complexitiesByTeam[0] = complexities
              this.dialog = false;
              this.toUpdate = false;
              this.toAdd = true;
              this.title = "Add Ticket Complexity";
              this.complexity = this.createComplexity();
            })
            
        }, 1500);
      })
    },
    getComplexityToDelete(id){
      this.delete_dialog = true
      this.complexity_id = id
    },

    deleteComplexity(){
      let complexities = []
      let complexity_promise = []
      SparrowService.deleteTicketComplexity(this.complexity_id).then(()=>{       
        setTimeout(() => {
          complexity_promise.push(
            SparrowService.getTicketComplexitiesbyTeam(this.teamID).then(response => {
              complexities = response.data;
            })
          )
          Promise.all(complexity_promise).then(()=>{
                 this.$store.dispatch('fetchTicketComplexitiesbyTeam',this.teamID)
                 this.$store.state.complexitiesByTeam[0] = complexities
                 this.complexity = this.createComplexity();
                 this.delete_dialog = false
            })    
        }, 1500);
      })
    },

    close() {
      this.errors = ""
      this.dialog = false;
      this.toUpdate = false;
      this.toAdd = true;
      this.title = "Add Ticket Complexity";
      this.complexity = this.createComplexity();
    },
    createComplexity() {
      return {
        abbreviation: "",
        label: "",
        description: "",
        no_of_hrs:0,
        created_By:0,
        teamID:this.$store.state.teamID
      };
    },
  },
};
</script>

<style scoped>
.required{
  color: red;
}
</style>