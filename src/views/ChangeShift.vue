
<template>
  <div id="csv-to-table" style="margin-top:50px;margin-left:15px">
    <router-link  to="/ticket-requests"><v-btn color="#FFA700" style="height:54px;margin-right:2px;color:white">
      <v-icon style="background-color:white;border-radius:50px;margin-right:5px" color="#FFA700">mdi-arrow-left-bold</v-icon> Back to my tickets</v-btn>
      </router-link>
    <v-spacer></v-spacer>
    <br>
    <form action>
      <div class="file-input">
        <label class="label">Change Shift/s</label>
        <v-btn class="button-save" @click="dialog=true"><v-icon>mdi-plus-circle</v-icon> Add Change Shift</v-btn>
      </div>
    </form>  
    <br>
      <v-data-table
          :headers="cs_headers"
          :items="this.$store.state.user_CS[0]"
          class="elevation-1"
        >
          <template v-slot:[`item.cS_Start_Time`]="{ item }">
              {{formatDisplayDate(item.cS_Start_Time)}}
          </template>
          <template v-slot:[`item.cS_End_Time`]="{ item }">
            {{formatDisplayDate(item.cS_End_Time)}}
         </template>

          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="getChangeShift(item.id)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="getChangeShiftToDelete(item.id)"> mdi-delete </v-icon>
          </template>
        </v-data-table>
         <v-dialog v-model="dialog" persistent max-width="400px">
                <v-card>
                  <v-card-title>
                    <span class="headline">Change Shift Details</span>
                  </v-card-title>  
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-row>
                          <v-col cols="11" sm="6">
                            <v-menu
                              ref="menu"
                              v-model="menu"
                              :close-on-content-click="false"
                              :return-value.sync="cs_start_date_time"
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
                                <v-icon slot="prepend" class="required">
                                    *
                                </v-icon>
                                </v-text-field>
                              </template>
                              <v-date-picker
                                v-model="cs_start_date_time"
                                no-title
                                scrollable
                              >
                                <v-spacer></v-spacer>
                                <v-btn text color="primary" @click="menu = false">
                                  Cancel
                                </v-btn>
                                <v-btn
                                  text
                                  color="primary"
                                  @click="$refs.menu.save(cs_start_date_time)"
                                >
                                  OK
                                </v-btn>
                              </v-date-picker>
                            </v-menu>
                           
                          </v-col>
                          <v-col
                              cols="11"
                              sm="6"
                            >
                              <input style="padding-top:15px"  v-model="cs_start_time" class="time-text" type="time"  min="00:00" max="23:59">
                          </v-col>

                          <!--End Date-->

                          <v-row style="padding-left:12px">
                           <v-col cols="11" sm="6">
                            <v-menu
                              ref="menu2"
                              v-model="menu2"
                              :close-on-content-click="false"
                              :return-value.sync="cs_end_date_time"
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
                                <v-icon slot="prepend" class="required">
                                    *
                                </v-icon>
                                </v-text-field>
                              </template>
                              <v-date-picker
                                v-model="cs_end_date_time"
                                no-title
                                scrollable
                              >
                                <v-spacer></v-spacer>
                                <v-btn text color="primary" @click="menu2 = false">
                                  Cancel
                                </v-btn>
                                <v-btn
                                  text
                                  color="primary"
                                  @click="$refs.menu2.save(cs_end_date_time)"
                                >
                                  OK
                                </v-btn>
                              </v-date-picker>
                            </v-menu>
                          </v-col>

                          <v-col
                              cols="11"
                              sm="6"
                            >
                              <input style="padding-top:15px"  v-model="cs_end_time" class="time-text" type="time"  min="00:00" max="23:59">
                            </v-col>
                          </v-row>
                        </v-row>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions class="justify-center">
                    <v-btn v-if="isToCreate == true" class="button-save" @click="saveChangeShift()">Save</v-btn>
                    <v-btn v-if="isToUpdate == true" class="button-save" @click="updateChangeShift()">Update</v-btn>
                    <v-btn @click="cancel()">Cancel</v-btn>
                  </v-card-actions>
                </v-card>
         </v-dialog>

  <!--Saving loader--->
   <v-dialog v-model="dialog_saving" hide-overlay persistent width="300">
                <v-card
                  color="primary"
                  dark
                >
                  <v-card-text style="text-align:center;padding-top:5px">
                    {{dialog_saving_text}}
                    <v-progress-linear
                      indeterminate
                      color="white"
                      class="mb-0 mt-2"
                    ></v-progress-linear>
                  </v-card-text>
                </v-card>
   </v-dialog>

  <!--Delete Dialog--->
   <v-dialog persistent v-model="dialogtoDelete" width="350">
              <v-card >
              <v-card-title class="headline" style="color:white;background-color:#04AA6D">
                  Delete
              </v-card-title>
              <v-card-text>
                <div style="font-size:15px" class="mb-5 mt-5 text_color--text">Are you sure you want to delete this one?</div>
                <v-btn type="submit" @click="deleteChangeShift"  style="color:white;" color="#04AA6D">YES</v-btn>
                <v-btn text @click="dialogtoDelete=false"  style="color:#04AA6D;">NO</v-btn>
              </v-card-text>
              </v-card>
        </v-dialog>
  </div>
</template>

<script>
import SparrowService from "@/services/SparrowService.js";
import moment from 'moment'
export default {
  name: "ChangeShift",
  props: {

  },
  created: function() {
    this.headerRowCount = this.defaultHeaderRowCount;
  },
  computed:{
    cs_headers () {
        return [
          {
            text: 'Start of Change Shift',
            align: 'start',
            sortable: false,
            value: 'cS_Start_Time',
          },
          {
            text: 'End of Change Shift',
            value: 'cS_End_Time',
          },
          { text: 'No. of Hrs', value: 'cS_No_of_hrs' },
          { text: "Actions", value: "actions", sortable: false },
        ]
      },
      formatStartDate(){
        return this.cs_start_date_time
        ? moment(this.cs_start_date_time).format('YYYY-MM-DD')
        : "";
      },
      formatEndDate(){
        return this.cs_end_date_time
        ? moment(this.cs_end_date_time).format('YYYY-MM-DD')
        : "";
      },
  },
  data() {
    return {
        change_shift:[
          {
            cs_start_time: 'Frozen Yogurt',
            cs_end_time: 159,
            cs_no_of_hrs: 6.0,
          },
           {
            cs_start_time: 'Frozen Yogurt',
            cs_end_time: 159,
            cs_no_of_hrs: 6.0,
          },
           {
            cs_start_time: 'Frozen Yogurt',
            cs_end_time: 159,
            cs_no_of_hrs: 6.0,
          },
           {
            cs_start_time: 'Frozen Yogurt',
            cs_end_time: 159,
            cs_no_of_hrs: 6.0,
          },
           {
            cs_start_time: 'Frozen Yogurt',
            cs_end_time: 159,
            cs_no_of_hrs: 6.0,
          },
        ],
        dialog:false,
        dialogtoDelete:false,
        cs_start_date_time:"",
        cs_end_date_time:null,
        cs_start_time:"00:00",
        cs_end_time:"00:00",
        menu:false,
        menu2:false,
        dialog_saving:false,
        dialog_saving_text:"Saving",
        change_shift_info:this.createChangeShift(),
        isToCreate : true,
        isToUpdate :false,
        cS_ID:0

    
    };
  },
  methods: {
    saveChangeShift(){
      let add_promise = []
      this.change_shift_info.cS_Start_Time = this.formatStartDate +"T"+ this.cs_start_time
      this.change_shift_info.cS_End_Time = this.formatEndDate +"T"+ this.cs_end_time 
      this.change_shift_info.user_ID = this.$store.state.userID
      let timespent = moment(this.change_shift_info.cS_End_Time,"YYYY/MM/DD HH:mm").diff(moment(this.change_shift_info.cS_Start_Time,"YYYY/MM/DD HH:mm"));
      let duration_timespent_difference = moment.duration(timespent);
      let number_of_hours = duration_timespent_difference.asHours();
      let temp = []
      this.change_shift_info.cS_No_of_hrs = number_of_hours
      this.dialog_saving = true
      setTimeout(() => {
        this.$store.dispatch("addChangeShift",this.change_shift_info).then(()=>{
          setTimeout(() => {
          add_promise.push(
            SparrowService.getChangeShiftByUser(this.$store.state.userID).then(response=>{
              temp =  response.data.sort(function(a, b) {
                    var CSA2 = a.id;
                    var CSB2 = b.id;
                    return (CSA2 < CSB2) ? -1 : (CSA2 > CSB2) ? 1 : 0;
              });
             
            })
          )
          Promise.all(add_promise).then(()=>{  
            this.change_shift_info["id"] = temp.at(-1).id
            this.$store.state.user_CS[0].push(this.change_shift_info)
            this.$store.state.user_CS[0] =  this.$store.state.user_CS[0].sort(function(a, b) {
                var CSA = a.cS_Start_Time;
                var CSB = b.cS_Start_Time;
                return (CSA < CSB) ? -1 : (CSA > CSB) ? 1 : 0;
            });
  
            this.change_shift_info = this.createChangeShift();
            this.cs_start_date_time = ""
            this.cs_end_date_time = ""
            this.cs_start_time = "00:00"
            this.cs_end_time = "00:00"
            this.dialog = false
            this.dialog_saving = false
          })
         }, 3000);
        })
      }, 2000);
      
    } ,
    getChangeShift(id){
      this.dialog = true;
      this.isToCreate = false
      this.isToUpdate = true
      let cs_promise=[];
        cs_promise.push(
          SparrowService.getChangeShift(id).then((response)=>{
              this.cS_ID = id
              this.cs_start_date_time = response.data.cS_Start_Time.substr(0, 10)
              this.cs_end_date_time = response.data.cS_End_Time.substr(0, 10)
              this.cs_start_time= response.data.cS_Start_Time.substr(11, 19)
              this.cs_end_time = response.data.cS_End_Time.substr(11, 19)
          })
        )

    },
    updateChangeShift(){
      this.dialog_saving = true
      this.change_shift_info.cS_Start_Time = this.formatStartDate +"T"+ this.cs_start_time +":00"
      this.change_shift_info.cS_End_Time = this.formatEndDate +"T"+ this.cs_end_time +":00"

      let update_promise=[]
      let timespent = moment(this.change_shift_info.cS_End_Time,"YYYY/MM/DD HH:mm").diff(moment(this.change_shift_info.cS_Start_Time,"YYYY/MM/DD HH:mm"));
      let duration_timespent_difference = moment.duration(timespent);
      let number_of_hours = duration_timespent_difference.asHours()
      let cs_param = {
        id:this.cS_ID,
        cS_Start_Time:this.formatStartDate +"T"+ this.cs_start_time ,
        cS_End_Time:this.formatEndDate +"T"+ this.cs_end_time, 
        cS_No_of_hrs : number_of_hours,
        user_ID : this.$store.state.userID
      }
      console.log("cs_param",cs_param)
      update_promise.push(
        SparrowService.putChangeShift(this.cS_ID,cs_param).then(response=>{
          let objIndex = this.$store.state.user_CS[0].findIndex((obj => obj.id == this.cS_ID));
          setTimeout(() => {
            this.$store.state.user_CS[0][objIndex].cS_Start_Time = cs_param.cS_Start_Time
            this.$store.state.user_CS[0][objIndex].cS_End_Time = cs_param.cS_End_Time
            this.$store.state.user_CS[0][objIndex].cS_No_of_hrs = cs_param.cS_No_of_hrs
          }, 1000);
        })
      )
      setTimeout(() => {
        Promise.all(update_promise).then(()=>{
          this.change_shift_info = this.createChangeShift();
          this.cs_start_date_time = ""
          this.cs_end_date_time = ""
          this.cs_start_time = "00:00"
          this.cs_end_time = "00:00"
          this.dialog = false
          this.dialog_saving = false
          this.isToCreate = true
          this.isToUpdate = false
        })
      }, 5000);
      
    },
    getChangeShiftToDelete(id){
      this.dialogtoDelete = true;
      this.cS_ID = id
    },
    deleteChangeShift(){
      let delete_promise=[]
      delete_promise.push(
        SparrowService.deleteChangeShift(this.cS_ID).then(()=>{
          let objIndex = this.$store.state.user_CS[0].findIndex((obj => obj.id == this.cS_ID)); 
          this.$store.state.user_CS[0].splice(objIndex,1)
        })
      )
      Promise.all(delete_promise).then(()=>{
        this.dialogtoDelete = false;
      })
    },
    formatDisplayDate(value){
       return moment(value).format("MMMM DD YYYY, h:mm:ss a")
    },
    cancel(){
      this.change_shift_info = this.createChangeShift()
      this.cs_start_date_time = ""
      this.cs_end_date_time = ""
      this.cs_start_time = "00:00"
      this.cs_end_time = "00:00"
      this.dialog = false
      this.isToCreate = true
      this.isToUpdate = false
    },
     createChangeShift() {
      return {
        cS_Start_Time: "",
        cS_End_Time: "",
        cS_No_of_hrs:"",
        user_ID:0, 
      };
    }, 
  }
};
</script>

<style scoped>
a{
  text-decoration: none;
}
input#headerRowCount {
  width: 4em;
}
.button-save{
float:right;
margin-right:5px;
background-color: #04AA6D!important;
color: white !important;;
border: solid white 1px;
box-shadow: none;
}
.template-button{
float:right;
background-color: #04AA6D!important;
color: white !important;;
border: solid white 1px;
height:35px;
margin-right:5px;
border-radius: 5px;
padding:5px ;
box-shadow: none;
}
.label{
font-size: 20px;
}
.file-name{
  float: right;
  padding:5px;
  margin-right: 5px;
  border: solid white 1px ;
  border-radius: 0px 5px 5px 0px;
}
.file-input {
  display: block;
  width: 100%;
  height: 50px;
  font-weight: bold;
  text-align: left;
  background-color: #04AA6D;
  color: white;
  padding-left: 10px;
  padding-top: 10px;
  padding-bottom:45px!important;
  border-radius: 5px;
}

.file {
  color: transparent;
  width: 90px;
  float: right;
}
.file::-webkit-file-upload-button {
  visibility: hidden;
}
.file::before{
  content: 'Select file';
  display: inline-block;
  color:#04AA6D ;
  background-color: white;
  border-radius: 5px 0px 0px 5px;
  padding: 6px 10px;
  outline: none;
  white-space: nowrap;
  cursor: pointer;
  text-shadow: 1px 1px #fff;
  font-weight: 700;
}
.file:hover::before {
  border-color: white;
}
.file:active::before {
  background: -webkit-linear-gradient(top, #e3e3e3, #f9f9f9);
}
table, th, td {
  border-collapse: collapse;
}
th {
  padding-left: 10px;
  padding-right: 10px;
  text-align: center;
  background-color: #04AA6D;
  color: white;
  border: 1px  black;
}
tr:hover {background-color: rgb(173, 171, 171);}
tr {
  text-align: center;
}
td, th {
  border: 1px solid rgba(145, 144, 144, 0.867);
  padding: 5px;
}
.table-scroll{
  /*width:100%; */
  display: block;
  empty-cells: show;
  
  /* Decoration */
  border-spacing: 0;
}
</style>
