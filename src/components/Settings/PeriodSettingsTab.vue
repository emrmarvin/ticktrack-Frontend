<template>
  <v-data-table
    :headers="headers"
    :items="periods"
    item-key="id"
    :loading="loading"
    :items-per-page="12"
    class="elevation-0"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Periods</v-toolbar-title>
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
                        v-model="period.abbreviation"
                        label="Abbreviation"
                      ></v-text-field>
                      <v-text-field
                        v-model="period.label"
                        label="Label"
                      ></v-text-field>
                      <v-checkbox
                        v-model="period.active"
                        label="Activate"
                      ></v-checkbox>
                      <v-menu
                              ref="menu_StartDate"
                              v-model="menu_StartDate"
                              :close-on-content-click="false"
                              :return-value.sync="start_date"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                            
                              <template v-slot:activator="{ on, attrs }">
                                
                                <v-text-field
                                  label="Start Date"
                                  :value="formatStartDate"
                                  prepend-icon="mdi-calendar"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                >
                                </v-text-field>
                              </template>
                              <v-date-picker
                                v-model="start_date"
                                no-title
                                scrollable
                              >
                                <v-spacer></v-spacer>
                                <v-btn text color="primary" @click="menu_StartDate = false">
                                  Cancel
                                </v-btn>
                                <v-btn
                                  text
                                  color="primary"
                                  @click="$refs.menu_StartDate.save(start_date)"
                                >
                                  OK
                                </v-btn>
                              </v-date-picker>
                            </v-menu>

                            <v-menu
                              ref="menu_EndDate"
                              v-model="menu_EndDate"
                              :close-on-content-click="false"
                              :return-value.sync="end_date"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                            
                              <template v-slot:activator="{ on, attrs }">
                                
                                <v-text-field
                                  label="End Date"
                                  :value="formatEndDate"
                                  prepend-icon="mdi-calendar"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                >
                                </v-text-field>
                              </template>
                              <v-date-picker
                                v-model="end_date"
                                no-title
                                scrollable
                              >
                                <v-spacer></v-spacer>
                                <v-btn text color="primary" @click="menu_EndDate = false">
                                  Cancel
                                </v-btn>
                                <v-btn
                                  text
                                  color="primary"
                                  @click="$refs.menu_EndDate.save(end_date)"
                                >
                                  OK
                                </v-btn>
                              </v-date-picker>
                            </v-menu>
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
                <v-btn type="submit" @click="updatePeriod" color="blue">Update</v-btn>
                <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
              </v-card-actions>
          </v-card>
        </v-dialog>

      </v-toolbar>
    </template>
    <template v-slot:body="{ items }">
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.abbreviation }}</td>
          <td>{{ item.label }}</td>
          <td>{{ item.active | boolean }}</td>
          <td>
            <v-icon small class="mr-2" @click="getPeriod(item.id)"> mdi-pencil</v-icon>
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
  name: "PeriodSettingsTab",
  filters: {
    boolean: booleanFilter,
  },
  data() {
    return {
      loading: true,
      dialog: false,
      headers: [
        {
          text: "Abbreviation",
          value: "abbreviation",
        },
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
      periods: [],
      editedIndex: -1,
      period: this.createNewPeriod(),

      title:"",
      isLoaded:true,
      period_Promise:[],
      period_id:0,

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
    SparrowService.getPeriods()
      .then((response) => {
        this.loading = false;
        this.periods =  response.data.sort(function(a, b) {
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
    getPeriod(id){
      this.isLoaded=false
      this.title="Update Period"  
      this.period_Promise.push(
        SparrowService.getPeriod(id).then(response => {
          this.period_id = response.data.id
          this.period.abbreviation = response.data.abbreviation
          this.period.label = response.data.label
          this.start_date = response.data.start_Date.substr(0, 10)
          this.end_date = response.data.end_Date.substr(0, 10)
          this.period.active = response.data.active
        })
      ) 
      Promise.all(this.period_Promise).then(()=>{
        this.isLoaded = true
      })
      this.dialog = true
    },
    updatePeriod(){
      let params ={
        id:this.period_id,
        abbreviation:this.period.abbreviation,
        label: this.period.label,
        active:this.period.active,
        start_Date:this.formatStartDate,
        end_Date:this.formatEndDate
      }
      SparrowService.putPeriod(this.period_id, params).then(()=>{
          setTimeout(() => {
            SparrowService.getPeriods().then(response => {
              this.periods = response.data;
              this.dialog = false;
              this.period = this.createNewPeriod();
            })
        }, 1500);
      })
    },
    close() {
      this.dialog = false;
      this.isLoaded = true
      this.period = this.createNewPeriod()
    },
    createNewPeriod() {
      return {
        abbreviation: "",
        label: "",
        start_Date: "",
        end_Date:"",
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