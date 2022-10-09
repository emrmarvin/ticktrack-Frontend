<template>
  <v-data-table
    :headers="headers"
    :items="fiscal_years"
    item-key="id"
    :loading="loading"
    :items-per-page="12"
    class="elevation-0"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Fiscal Year</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              {{title}}
            </v-card-title>
              <v-card-text v-if="isLoaded">
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="fy.label"
                        label="Label"
                      ></v-text-field>
                      <v-checkbox
                        v-model="fy.active"
                        label="Activate"
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
                      Getting Period Data
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
                <v-btn type="submit" @click="updateFY" color="blue">Update</v-btn>
                <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
              </v-card-actions>
          </v-card>
        </v-dialog>

      </v-toolbar>
    </template>
    <template v-slot:body="{ items }">
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.label }}</td>
          <td>{{ item.active | boolean }}</td>
          <td>
            <v-icon small class="mr-2" @click="getFY(item.id)"> mdi-pencil</v-icon>
          </td>
        </tr>
      </tbody>
    </template>
  </v-data-table>
</template>

<script>
import SparrowService from "@/services/SparrowService.js";
import moment from 'moment'

const booleanFilter = function (value, trueText, falseText) {
  return value ? trueText || "Yes" : falseText || "No";
};

export default {
  name: "FYSettingsTab",
  filters: {
    boolean: booleanFilter,
  },
  data() {
    return {
      loading: true,
      dialog: false,
      headers: [
        {
          text: "Label",
          value: "label",
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
      fiscal_years: [],
      editedIndex: -1,
      fy: this.createNewFY(),

      title:"",
      isLoaded:true,
      fy_Promise:[],
      fy_id:0,

      menu_StartDate:null,
      start_date:"",

      menu_EndDate:null,
      end_date:"",

    };
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  created() {
    SparrowService.getFYs()
      .then((response) => {
        this.loading = false;
        this.fiscal_years =  response.data.sort(function(a, b) {
          var periodA = a.id;
          var periodB = b.id;
          return (periodA < periodB) ? -1 : (periodA > periodB) ? 1 : 0;
      });
        
      })
      .catch((error) => {
        console.log(error.response);
      });
  },
  computed:{
    formatStartDate(){
      return this.start_date
      ? moment(this.start_date).format('YYYY-MM-DD')
      : "";
    },
    formatEndDate(){
      return this.end_date
      ? moment(this.end_date).format('YYYY-MM-DD')
      : "";
    },
  },
  methods: {
    getFY(id){
      this.isLoaded=false
      this.title="Update Fiscal year"  
      this.fy_Promise.push(
        SparrowService.getFY(id).then(response => {
          this.fy_id = response.data.id
          this.fy.label = response.data.label
          this.fy.active = response.data.active
        })
      ) 
      Promise.all(this.fy_Promise).then(()=>{
        this.isLoaded = true
      })
      this.dialog = true
    },
    updateFY(){
      let params ={
        id:this.fy_id,
        label: this.fy.label,
        active:this.fy.active,
      }
      SparrowService.putFY(this.fy_id, params).then(()=>{
          setTimeout(() => {
            SparrowService.getFYs().then(response => {
              this.fiscal_years = response.data;
              this.dialog = false;
              this.fy = this.createNewFY();
            })
        }, 1500);
      })
    },
    close() {
      this.dialog = false;
      this.isLoaded = true
      this.fy = this.createNewFY()
    },
    createNewFY() {
      return {
        label: "",
        active:false
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