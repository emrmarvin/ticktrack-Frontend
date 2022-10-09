<template>
  <v-card width="480" class="pa-5 mx-10">
    <v-list-item class="mb-2">
      <v-list-item-content>
        <v-list-item-title>Ticket Main Categories</v-list-item-title>
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
              <span>Add Ticket Main Category</span>
            </v-tooltip>
          </template>
          
          <v-card>
            <v-card-title class="headline blue lighten-2">
              {{title}}
            </v-card-title >
            <v-card-text v-if="isLoaded">
                 <v-select
                        v-model="$store.state.teamID"
                        :items="getTeams"
                        item-value="id"
                        label="Team"
                        item-text="name"
                        required
                        :disabled="true"
                        style="height: 50px !important"
                ></v-select>
                <v-text-field
                  v-model="main_Category.abbreviation"
                  label="Abbreviation"
                  outlined
                >
                <v-icon slot="prepend" class="required">
                             *
                </v-icon>
                </v-text-field>
                <v-text-field
                  v-model="main_Category.label"
                  label="Label"
                  outlined
                >
                <v-icon slot="prepend" class="required">
                             *
                </v-icon>
                </v-text-field>
                <v-text-field
                  v-model="main_Category.description"
                  label="Description"
                  outlined
                ></v-text-field>
            </v-card-text>
            <div style="padding-left:15px">
            <span style="color:red;font-size:15px;" v-if="errors"><v-icon color="red">mdi-alert</v-icon> {{errors}}</span>
            </div>
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

            <v-card-actions>
              <v-spacer></v-spacer>
                <v-btn type="submit" v-if="toAdd" @click="addTicketMainCategory" color="blue">Submit</v-btn>
                <v-btn type="submit" v-if="toUpdate" @click="updateMainCategory" color="blue">Update</v-btn>
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
            <v-btn type="submit" @click="deleteMainCategory" color="blue">YES</v-btn>
            <v-btn text @click="delete_dialog=false" color="blue darken-1">NO</v-btn>
          </v-card-text>
          </v-card>
        </v-dialog>

      </v-list-item-action>
    </v-list-item>

    <v-divider class="mb-2"></v-divider>

    <v-list-item
      v-for="main_Category in $store.state.main_Categories_by_team[0]"
      :key="main_Category.id"
      three-line
    >
      <v-list-item-content>
        <v-list-item-title
          >{{ main_Category.label }}</v-list-item-title
        >
        <v-list-item-subtitle
          >{{ main_Category.abbreviation }}</v-list-item-subtitle
        >
        <v-list-item-subtitle
          >{{ main_Category.team.name }}</v-list-item-subtitle
        >
      </v-list-item-content>

      <v-list-item-action class="d-flex flex-row">
        <v-btn icon @click="getMainCategory(main_Category.id)">
          <v-icon color="grey lighten-1">mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon @click="getMainCategoryToDelete(main_Category.id)">
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
  props:['main_categories','teamID'],
  data() {
    return {
      dialog: false,
      dialogEdit: false,
      editedIndex: -1,
      main_Categories: [],
      main_Category: this.createMain_category(),
      toAdd:true,
      toUpdate:false,
      title:"Add Main Category",
      isLoaded:true,
      maincatPromise:[],
      maincat_id:0,
      delete_dialog:false,
      errors:"",

    };
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  created() {
  },
  computed:{
    getTeams(){
      return this.$store.state.teams[0]
    },
  },
  mounted(){
  },
  methods: {
    validateMainCategory(){
      if(this.main_Category.abbreviation != "" && this.main_Category.label != ""){
        return true
      }else{
        this.errors = "Abbreviation and Label are required"
      }
    },
    addTicketMainCategory() {
      if(this.validateMainCategory() == true){
        let main_categories = []
        let main_cat_promise = []
        this.main_Category.created_By = this.$store.state.userID
        this.main_Category.teamID = this.teamID
        this.$store
          .dispatch("addTicketMainCategory", this.main_Category)
          .then(() => {
            setTimeout(() => {
              main_cat_promise.push(
                SparrowService.getTicketMain_CategoryByTeam(this.teamID)
                  .then(response => {
                      main_categories = response.data
                  })
                )            
              Promise.all(main_cat_promise).then(()=>{
                this.$store.dispatch('fetchTicketMainCategoriesByTeam',this.teamID)
                this.$store.state.main_Categories_by_team[0] = main_categories
                setTimeout(() => {
                  this.main_Category = this.createMain_category();
                  this.dialog = false;
                }, 1500);
              })
            },1500)          

          })
          .catch((err) => {
            console.log("error posting", err);
          });
      }
    },
    getMainCategory(id){
      this.toUpdate = true
      this.toAdd = false
      this.isLoaded=false
      this.title="Update Main Category"  
      this.maincatPromise.push(
        SparrowService.getTicketMain_Category(id).then(response => {
          this.maincat_id = response.data[0].id
          this.main_Category.abbreviation = response.data[0].abbreviation
          this.main_Category.label = response.data[0].label
          this.main_Category.description = response.data[0].description
          this.main_Category.teamID = response.data[0].teamID
        })
      ) 
      Promise.all(this.maincatPromise).then(()=>{
        this.isLoaded = true
      })
      this.dialog = true
    },
    updateMainCategory(){
      let main_categories = []
      let main_cat_promise = []
      let params ={
        id:this.maincat_id,
        abbreviation:this.main_Category.abbreviation,
        label: this.main_Category.label,
        description: this.main_Category.description,
        created_By:this.$store.state.userID,
        teamID:this.main_Category.teamID
      }
      SparrowService.putTicketMain_Category(this.maincat_id, params).then(()=>{
          setTimeout(() => {
            main_cat_promise.push(
              SparrowService.getTicketMain_CategoryByTeam(this.teamID).then(response => {
                main_categories = response.data;
                
              })
            )
            Promise.all(main_cat_promise).then(()=>{
               this.$store.dispatch('fetchTicketMainCategoriesByTeam',this.teamID)
               this.$store.state.main_Categories_by_team[0] = main_categories;
               this.dialog = false;
               this.toUpdate = false;
               this.toAdd = true;
               this.title = "Add Main Category";
               this.main_Category = this.createMain_category();
            })           
        }, 1500);
      })
    },
    getMainCategoryToDelete(id){
      this.delete_dialog = true
      this.maincat_id = id
    },
    deleteMainCategory(){
      let main_categories = []
      let main_cat_promise = []
      SparrowService.deleteTicketTicketMain_Category(this.maincat_id).then(()=>{
        setTimeout(() => {
            main_cat_promise.push(
                SparrowService.getTicketMain_CategoryByTeam(this.teamID)
                  .then(response => {
                      main_categories = response.data
                  })
                ) 
            Promise.all(main_cat_promise).then(()=>{
                this.$store.dispatch('fetchTicketMainCategoriesByTeam',this.teamID)
                this.$store.state.main_Categories_by_team[0] = main_categories
                setTimeout(() => {
                  this.main_Category = this.createMain_category();
                  this.delete_dialog = false;
                }, 1500);
              })
        }, 1500);
      })
    },
    close() {
      this.dialog = false;
      this.toUpdate = false
      this.toAdd = true
      this.title = "Add Main Category"
      this.isLoaded = true
      this.main_Category = this.createMain_category()
      this.errors = ""
    },
    closeEdit() {
      this.dialogEdit = false;
      this.$nextTick(() => {
        this.main_Category = Object.assign({}, this.createMain_category());
        this.editedIndex = -1;
      });
    },
    createMain_category() {
      return {
        abbreviation: "",
        label: "",
        description: "",
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