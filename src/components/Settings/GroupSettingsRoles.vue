<template>
  <v-data-table
    :headers="headers"
    :items="roles"
    item-key="id"
    :loading="loading"
    :items-per-page="10"
    class="elevation-0"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Roles</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="blue" dark class="mb-2" v-bind="attrs" v-on="on">
              New Role
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{title}}</span>
            </v-card-title>
              <v-card-text v-if="isLoaded">
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="role.name"
                        label="Role"
                      ></v-text-field>
                      <v-text-field
                        v-model="role.description"
                        label="Description"
                      ></v-text-field>
                      <v-checkbox
                        v-model="role.status"
                        label="Activate Role"
                      ></v-checkbox>
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
                                    Getting Role Data
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
                <v-btn type="submit" v-if="toAdd" @click="addRole" color="blue">Submit</v-btn>
                <v-btn type="submit" v-if="toUpdate" @click="updateTeam" color="blue">Update</v-btn>
              </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog dark persistent v-model="delete_dialog" width="480">
          <v-card-title class="headline blue lighten-2">
              Delete
          </v-card-title>
          <v-card-text>
            <div style="font-size:15px" class="mb-5 mt-5">Are you sure you want to delete this one?</div>
            <v-btn type="submit" @click="deleteRole" color="blue">YES</v-btn>
            <v-btn text @click="delete_dialog=false" color="blue darken-1">NO</v-btn>
          </v-card-text>
        </v-dialog>

      </v-toolbar>
    </template>
    <template v-slot:body="{ items }">
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.status | boolean }}</td>
          <td>
            <v-icon small class="mr-2" @click="getRole(item.id)"> mdi-pencil</v-icon>
            <v-icon color="grey lighten-1" @click="getRoleToDelete(item.id)">mdi-delete</v-icon>
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
  name: "GroupSettingsRoles",
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
          text: "Active?",
          value: "status",
        },
        {
          text: "Actions",
          value: "actions",
        },
      ],
      roles: [],
      editedIndex: -1,
      role: this.createNewRole(),

      toAdd:true,
      toUpdate:false,
      title:"Add New Role",
      isLoaded:true,
      role_Promise:[],
      role_id:0,
      delete_dialog:false
    };
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  created() {
    SparrowService.getRoles()
      .then((response) => {
        this.loading = false;
        this.roles = response.data;
      })
      .catch((error) => {
        console.log(error.response);
      });
  },
  methods: {
    addRole() {
      this.$store
        .dispatch("addRole", this.role)
        .then(() => {
          setTimeout(() => {
            SparrowService.getRoles()
              .then(response => {
                  this.roles = response.data
              })
          },1000);
          this.role = this.createNewRole();
          this.dialog = false;
        })
        .catch(() => {
          console.log("There was a problem creating your role");
        });
    },

    getRole(id){
      this.toUpdate = true
      this.toAdd = false
      this.isLoaded=false
      this.title="Update Role"  
      this.role_Promise.push(
        SparrowService.getRole(id).then(response => {
          this.role_id = response.data.id
          this.role.name = response.data.name
          this.role.description = response.data.description
          this.role.status = response.data.status
        })
      ) 
      Promise.all(this.role_Promise).then(()=>{
        this.isLoaded = true
      })
      this.dialog = true
    },
    updateTeam(){
      let params ={
        id:this.role_id,
        name:this.role.name,
        description: this.role.description,
        status:this.role.status,
      }
      SparrowService.putRole(this.role_id, params).then(()=>{
          setTimeout(() => {
            SparrowService.getRoles().then(response => {
              this.roles = response.data;
              this.dialog = false;
              this.toUpdate = false;
              this.toAdd = true;
              this.title = "Add New Role";
              this.role = this.createNewRole();
            })
        }, 1500);
      })
    },
    getRoleToDelete(id){
      this.delete_dialog = true
      this.role_id = id
    },
    deleteRole(){
      SparrowService.deleteRole(this.role_id).then(()=>{
        this.delete_dialog = false
        setTimeout(() => {
            SparrowService.getRoles().then(response => {
              this.roles = response.data;
            })
        }, 1500);
      })
    },
    close() {
      this.dialog = false;
    },
    createNewRole() {
      return {
        name: "",
        description: "",
        status: "",
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