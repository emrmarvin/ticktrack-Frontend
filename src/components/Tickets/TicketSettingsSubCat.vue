<template>
  <v-card width="480" class="pa-5 mx-10">
    <v-list-item class="mb-2">
      <v-list-item-content>
        <v-list-item-title>Ticket Sub Categories</v-list-item-title>

        <v-select
            v-on:change="getTicketSub1CategoryByMainCategory(main_Category)"
            v-model="main_Category"
            :items="this.$store.state.main_Categories_by_team[0]"
            item-value="id"
            label="Main Category"
            item-text="label"
            required
            style="height: 50px !important"
        ></v-select>
      </v-list-item-content>
      <v-list-item-action>
        <v-dialog persistent v-model="dialog" width="480">
          <template #activator="{ on: dialog }">
            <v-tooltip top>
              <template #activator="{ on: tooltip }" >
                <v-btn
                  fab
                  small
                  color="blue"
                  v-on="{ ...tooltip, ...dialog }"
                  :disabled="main_Category == 0"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
              <span>Add Ticket Sub Category</span>
            </v-tooltip>
          </template>
          <v-card>
            <v-card-title class="headline blue lighten-2">
              {{title}}
            </v-card-title>

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
                <v-select
                        v-model="sub1_Category.main_CategoryID"
                        :items="this.$store.state.main_Categories_by_team[0]"
                        item-value="id"
                        label="Main Category"
                        item-text="label"
                        required
                        :disabled="true"
                        style="height: 50px !important"
                ></v-select>
                <v-text-field
                  v-model="sub1_Category.abbreviation"
                  label="Abbreviation"
                  outlined
                >
                <v-icon slot="prepend" class="required">
                             *
                </v-icon>
                </v-text-field>
                <v-text-field
                  v-model="sub1_Category.label"
                  label="Label"
                  outlined
                >
                <v-icon slot="prepend" class="required">
                             *
                </v-icon>
                </v-text-field>
                <v-text-field
                  v-model="sub1_Category.description"
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
                      Getting Sub Category Data
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
                <v-btn type="submit" v-if="toAdd" @click="addTicketSub1Category" color="blue">Submit</v-btn>
                <v-btn type="submit" v-if="toUpdate" @click="updateSubCategory" color="blue">Update</v-btn>
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
            <v-btn type="submit" @click="deleteSubCategory" color="blue">YES</v-btn>
            <v-btn text @click="delete_dialog=false" color="blue darken-1">NO</v-btn>
          </v-card-text>
          </v-card>
        </v-dialog>

      </v-list-item-action>
    </v-list-item>

    <v-divider class="mb-2"></v-divider>
    <div style="text-align:center;margin-top:30%" v-if="sub1_Categories.length == 0" >Select Main Category</div>
    <div class="category-list">
    <v-list-item
      v-for="sub1_Category in sub1_Categories"
      :key="sub1_Category.id"
      three-line
    >
      <v-list-item-content>
        <v-list-item-title
          >{{ sub1_Category.label }}</v-list-item-title
        >
        <v-list-item-subtitle
          >{{ sub1_Category.main_Category.label }}</v-list-item-subtitle
        >
        <v-list-item-subtitle
          >{{ sub1_Category.team.name }}</v-list-item-subtitle
        >
      </v-list-item-content>

      <v-list-item-action class="d-flex flex-row">
        <v-btn icon @click="getSubCategory(sub1_Category.id)">
          <v-icon color="grey lighten-1">mdi-pencil</v-icon>
        </v-btn>
        <!-- <v-btn icon @click="getSubCategoryToDelete(sub1_Category.id)">
          <v-icon color="grey lighten-1">mdi-delete</v-icon>
        </v-btn> -->
      </v-list-item-action>
    </v-list-item>
    </div>
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
      sub1_Categories_By_Team: [],
      sub1_Categories:[],
      sub1_Category: this.createSub1_Category(),
      main_Categories_by_team:[],
      main_Category:0,

      toAdd:true,
      toUpdate:false,
      title:"Add Sub Category",
      isLoaded:true,
      subcatPromise:[],
      subcat_id:0,
      errors:"",

      delete_dialog:false
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
    getMainCategories(){
      return this.$store.state.main_Categories_by_team[0]
    },
  },
  mounted(){
    setTimeout(() => {
      this.loading = false;
      SparrowService.getTicketSub1_CategoryByTeam(this.$store.state.teamID)
        .then((response) => {
          this.sub1_Categories_By_Team = response.data;
       })
    },1000);
  },
  methods: {
    validateMainCategory(){
      if(this.sub1_Category.abbreviation != "" && this.sub1_Category.label != ""){
        return true
      }else{
        this.errors = "Abbreviation and Label are required"
      }
    },
    getMainCategoriesbyteam(teamID){
      SparrowService.getTicketMain_CategoryByTeam(teamID)
        .then((response) => {
          this.main_Categories_by_team = response.data;
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
    getTicketSub1CategoryByMainCategory(id){
      this.sub1_Categories = []
      this.sub1_Category.main_CategoryID = id
      for(let i=0;i<this.sub1_Categories_By_Team.length; i++){
        if(this.sub1_Categories_By_Team[i].main_CategoryID == id){
          this.sub1_Categories.push(this.sub1_Categories_By_Team[i])
        }
      }
    },
    addTicketSub1Category() {
      if(this.validateMainCategory() == true){
        this.sub1_Category.created_By = this.$store.state.userID
        this.sub1_Category.teamID = this.$store.state.teamID
        this.$store
          .dispatch("addTicketSub1Category", this.sub1_Category)
          .then(() => {
            setTimeout(() => {
              SparrowService.getTicketSub1_CategoryByTeam(this.$store.state.teamID)
                .then((response) => {
                  this.sub1_Categories_By_Team = response.data;
                })
                .catch((error) => {
                  console.log(error.response);
                });
            }, 1500);
            this.sub1_Category = this.createSub1_Category();
            this.dialog = false;
            this.sub1_Categories = [] 
            this.main_Category = 0;
          })
          .catch((err) => {
            console.log("error posting", err);
          });
      }
    },
    getSubCategory(id){
      this.toUpdate = true
      this.toAdd = false
      this.isLoaded=false
      this.title="Update Sub Category"  
      this.subcatPromise.push(
        SparrowService.getTicketSub1_Category(id).then(response => {
          this.subcat_id = response.data[0].id
          this.sub1_Category.abbreviation = response.data[0].abbreviation
          this.sub1_Category.label = response.data[0].label
          this.sub1_Category.description = response.data[0].description
          this.sub1_Category.main_CategoryID = response.data[0].main_CategoryID
          this.sub1_Category.teamID = response.data[0].teamID
        })
      ) 
      Promise.all(this.subcatPromise).then(()=>{
        this.isLoaded = true
      })
      this.dialog = true
    },
    updateSubCategory(){
      let params ={
        id:this.subcat_id,
        abbreviation:this.sub1_Category.abbreviation,
        label: this.sub1_Category.label,
        description: this.sub1_Category.description,
        created_By:this.$store.state.userID,
        main_CategoryID:this.sub1_Category.main_CategoryID,
        teamID:this.sub1_Category.teamID
      }
      SparrowService.putTicketSub1Cat(this.subcat_id, params).then(()=>{
          setTimeout(() => {
            SparrowService.getTicketSub1_CategoryByTeam(this.$store.state.teamID).then(response => {
              this.sub1_Categories = response.data;
              this.$store.state.sub1_Categories_By_Team[0] = response.data;
              this.dialog = false;
              this.toUpdate = false;
              this.toAdd = true;
              this.title = "Add Sub Category";
              this.sub1_Category = this.createSub1_Category();
            })
        }, 1500);
      })
    },
    getSubCategoryToDelete(id){
      this.delete_dialog = true
      this.subcat_id = id
    },
    deleteSubCategory(){
      SparrowService.deleteTicketTicketSub1_Category(this.subcat_id).then(()=>{
        this.delete_dialog = false
        setTimeout(() => {
            SparrowService.getTicketSub1_CategoryByTeam(this.$store.state.teamID).then(response => {
              this.sub1_Categories = response.data;
            })
        }, 1500);
      })
    },
    close() {
      this.errors =""
      this.dialog = false;
      this.toUpdate = false
      this.toAdd = true
      this.title = "Add Sub Category"
      this.isLoaded = true
      this.sub1_Category = this.createSub1_Category();
    },
    createSub1_Category() {
      return {
        abbreviation: "",
        label: "",
        description: "",
        main_CategoryID:0,
        created_By:0,
        teamID:this.$store.state.teamID
      };
    },
  },
};
</script>

<style scoped>
.category-list{
  height:400px;/* or any height you want */
  overflow-y:auto
}
.required{
  color: red;
}
</style>