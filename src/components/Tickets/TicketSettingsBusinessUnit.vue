<template>
  <v-card width="480" class="pa-5 mx-10">
    <v-list-item class="mb-2">
      <v-list-item-content>
        <v-list-item-title>Business Units</v-list-item-title>
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
              <span>Add Business Unit</span>
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
                  v-model="business_unit.name"
                  label="Business Unit Name"
                ></v-text-field>
                <v-text-field
                  v-model="business_unit.description"
                  label="Description"
                ></v-text-field>

                <v-btn type="submit" v-if="toAdd" @click="addBusinessUnit" color="primary">Submit</v-btn>
                <v-btn type="submit" v-if="toUpdate" @click="updateBusinessUnit"  color="blue">Update</v-btn>
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
            <v-btn type="submit" @click="deleteBU"  color="blue">YES</v-btn>
            <v-btn text @click="delete_dialog=false" color="blue darken-1">NO</v-btn>
          </v-card-text>
          </v-card>
        </v-dialog>


      </v-list-item-action>
    </v-list-item>

    <v-divider class="mb-2"></v-divider>

    <v-list-item
      v-for="business_unit in this.$store.state.business_units_by_team[0]"
      :key="business_unit.id"
      three-line
    >
      <v-list-item-content>
        <v-list-item-title
          >Name: {{ business_unit.name }}</v-list-item-title
        >
        <v-list-item-subtitle
          >Description: {{ business_unit.description }}</v-list-item-subtitle
        >
      </v-list-item-content>

      <v-list-item-action class="d-flex flex-row">
        <v-btn icon @click="getBusinessUnit(business_unit.id)">
          <v-icon color="grey lighten-1">mdi-pencil</v-icon>
        </v-btn>
        <!-- <v-btn icon  @click="getBUToDelete(business_unit.id)">
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
      business_units: [],
      business_unit: this.createNewBU(),
      title:"Add Business Unit",
      bu_id:0,
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
    businessUnits(){
      return this.$store.state.business_units_by_team[0]
    }
  },
  methods: {
    addBusinessUnit() {
      this.business_unit.teamID = this.$store.state.teamID
      this.$store
        .dispatch("addBusinessUnits", this.business_unit)
        .then(() => {
          setTimeout(() => {
            this.$store.dispatch('fetchBusinessUnitsByTeam',this.$store.state.teamID)
            SparrowService.getBusinessUnitByTeam(this.$store.state.teamID)
              .then(response => {
                  this.$store.state.business_units_by_team[0] = response.data
                  this.dialog = false;
                  this.toUpdate = false;
                  this.toAdd = true;
                  this.title = "Add Business Unit";
                  this.business_unit = this.createNewBU();
              })
          },1500);
        })
        .catch(() => {
          console.log("There was a problem creating your Business Unit");
        });
    },
    getBusinessUnit(id){
      let bu_promise=[]
      this.toUpdate = true
      this.toAdd = false
      this.isLoaded=false
      this.title="Update Business Unit"  
      bu_promise.push(
        SparrowService.getBusinessUnit(id).then(response => {
          this.bu_id = response.data.id
          this.business_unit.name = response.data.name
          this.business_unit.description = response.data.description
          this.business_unit.teamID = response.data.teamID
        })
      ) 
      Promise.all(bu_promise).then(()=>{
        this.isLoaded = true
      })
      this.dialog = true
    },

    updateBusinessUnit() {
      let params ={
        id:this.bu_id,
        name:this.business_unit.name,
        description: this.business_unit.description,
        teamID:this.business_unit.teamID
      }
      SparrowService.putBusinessUnit(this.bu_id, params).then(()=>{
          setTimeout(() => {
            this.$store.dispatch('fetchBusinessUnitsByTeam',this.$store.state.teamID)
             SparrowService.getBusinessUnitByTeam(this.$store.state.teamID).then(response => {
              this.$store.state.business_units_by_team[0] = response.data;
              this.dialog = false;
              this.toUpdate = false;
              this.toAdd = true;
              this.title = "Add Business Unit";
              this.business_unit = this.createNewBU();
            })
        }, 1500);
      })
    },
    getBUToDelete(id){
      this.delete_dialog = true
      this.bu_id = id
    },
    deleteBU(){
      SparrowService.deleteBusinessUnit(this.bu_id).then(()=>{
        setTimeout(() => {
             this.$store.dispatch('fetchBusinessUnitsByTeam',this.$store.state.teamID)
             SparrowService.getBusinessUnitByTeam(this.$store.state.teamID).then(response => {
              this.$store.state.business_units_by_team[0] = response.data;
              this.delete_dialog = false
              this.toUpdate= false
              this.toAdd = true
              this.title = "Add Business Unit";
              this.business_unit = this.createNewBU();
            })
        }, 1500);
      })
    },
    close() {
      this.toAdd =true
      this.toUpdate = false
      this.dialog = false;
      this.business_unit = this.createNewBU();
    },
    createNewBU() {
      return {
        name: "",
        description: "",
        teamID:0,
      };
    },
  },
};
</script>

<style scoped>
</style>