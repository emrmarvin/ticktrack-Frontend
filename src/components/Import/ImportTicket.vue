
<template>
  <div id="csv-to-table" style="margin-top:50px;margin-left:15px">
    <router-link  to="/ticket-requests"><v-btn color="#FFA700" style="height:54px;margin-right:2px;color:white">
      <v-icon style="background-color:white;border-radius:50px;margin-right:5px" color="#FFA700">mdi-arrow-left-bold</v-icon> Back to my tickets</v-btn>
      </router-link>
      <div style="border:solid 1px #04AA6D;width:550px;float:right;padding:10px;border-radius:5px;position:absolute;top:80px;right:5px">
        <label><b>Reminders!</b></label>
        <ul>
          <li>Remove all Comma "," in your import file</li>
          <li>SLA is required for Transactional Ticket</li>
          <li><b style="color:green">New!!</b>  Actual Due Date is not required for Transactional Tickets</li>
        </ul>
      </div>
    <v-spacer></v-spacer>
    <br>
    <form action>
      <div class="file-input">
        <label class="label">Import KPI Dashboard</label>
        <download-csv
        class="template-button"
        encoding=""
        :data="templateExport"
        :labels="template_headers"
        :fields="template_fields"
        :name="'KPI Dashboard Template.csv'"
        style="color:white;cursor:pointer;font-size:15px;float:right" >
        <v-icon style="background-color:white;border-radius:50px;margin-right:5px" color="success">mdi-download</v-icon>Download KPI Dashboard Template.csv
        </download-csv>
        <v-btn width="100px" class="button-save" :disabled="disabled" @click="saveTickets">Save</v-btn>
        <span class="file-name">Filename: {{fileName}}</span>
        <input class="file" type="file" @change="uploaded" />
      </div>
    </form>  
    <br>
    <v-chip
         class="ma-2"
         label 
         color="red"
         text-color="white"
         v-for="errors in removeDuplicates()" :key="errors"
         style="margin-left: 0px!important;"
    >
     <v-icon left>
          mdi-alert
     </v-icon>
           {{errors}}
      </v-chip>
  <section style="margin-top:5px" class="table-container">
    <table class="table-scroll">
      <thead>
        <tr v-for="(row, rowIndex) in csvHeader" v-bind:key="rowIndex">
          <th v-for="(data, colIndex) in row" v-bind:key="colIndex">
            {{ data }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in csvBody" v-bind:key="rowIndex">
          <td v-for="(data, colIndex) in row" v-bind:key="colIndex">
            {{ data }}
          </td>
        </tr>
      </tbody>
    </table>
  </section>

  <!--Post Saving confirmation-->
  <v-dialog persistent v-model="post_saving_dialog" width="480">
              <v-card >
              <v-card-title class="headline justify-center" v-bind:style="dialogHeaderColor()">
                  {{post_saving_dialog_text}}
              </v-card-title>
              <v-card-text style="padding-top:10px;text-align:center">
                <span v-show="upload_errors.length != 0"><b>Kindly fix the error(s) before saving again.</b></span>
                <span v-show="upload_errors.length == 0">Number of ticket/s saved : <b style="color:green">{{this.ticket_saved_count}}</b></span>
              </v-card-text>
              <v-card-actions class="justify-center">
                <v-btn v-show="upload_errors.length == 0" type="submit"  style="color:white;" @click="addMore" color="#04AA6D">Add More</v-btn>

                <v-btn text v-show="upload_errors.length == 0" @click="goToMyTicket" style="margin-left:5px;color:#04AA6D;border:solid 1px #04AA6D">Go to My Tickets</v-btn>

                <v-btn color="#04AA6D" v-bind:style="dialogHeaderColor()" style="color:white" v-show="upload_errors.length != 0" @click="post_saving_dialog = false">Got It</v-btn>
              </v-card-actions>
              </v-card>
   </v-dialog>

  <!--Saving loader--->
   <v-dialog v-model="dialog_saving" hide-overlay persistent width="400">
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

   <!--Announcement--->
   <v-dialog v-model="dialog_announcement" persistent width="600">
                <v-card>
                <v-card-title class="headline justify-center" style="color:white;background-color:#004b8d">Import Update/s</v-card-title>
                  <v-card-text style="padding-top:5px">
                    <div class="mb-5 mt-5 text_color--text" >
                      <ul>
                        <li>
                          <b style="color:green">Actual Due Date</b> is <b style="color:red">not</b> required for <b style="color:green">Transactional</b> Tickets, <br>The Due date will now be automatically computed based on the "SLA" provided.
                        </li>
                        <li>
                          You can now input the number of hours consumed on your  <b style="color:green">Non-Functional Activity</b> in the "<b style="color:green">Adjust SLA (No. of hrs.)</b>" column.
                        </li>
                      </ul>
                    
                    </div>
                    <v-btn style="margin-left:235px" @click="dialog_announcement = false">Ok</v-btn>
                  </v-card-text>
                </v-card>   
   </v-dialog>
  </div>
</template>

<script>
import Encoding from "encoding-japanese";
import SparrowService from "@/services/SparrowService.js";
import Computations from "@/services/Computations.js";
import moment from 'moment'
export default {
  name: "CsvLoader",
  props: {
    defaultHeaderRowCount: {
      type: Number,
      default: 1,
      required: false
    },
    headerRowCountLabelText: {
      type: String,
      default: "Header Rows count",
      required: false
    },
    uploadButtonLabelText: {
      type: String,
      default: "CSV file",
      required: false
    },
    uploadButtonText: {
      type: String,
      default: "Choose file...",
      required: false
    }
  },
  created: function() {
    this.headerRowCount = this.defaultHeaderRowCount;
  },
  data() {
    return {
      headerRowCount: 1,
      labelHeaderRowCount: "",
      fileName: " ",
      showCheckbox: true,
      csvHeader: [],
      csvBody: [],
      sub1_categories:[],
      sub_categoryID:0,
      disabled:true,
      upload_errors:[],
      post_saving_dialog:false,
      dialog_saving:false,
      dialog_saving_text:"",
      post_saving_dialog_text:"",
      dialog_announcement:true,
      ticket_saved_count : 0,
      templateExport:[
        {
        "period_ID" :"P10",
        "title" :"Sample lang ito delete mo nalang.",
        "start_Date":"5/21/2021  11:27:00 PM",
        "complexity_ID" : "Standard",
        "service_Level_Agreement" : "9",
        "actual_due_date":"",
        "date_Completion" :"5/21/2021  11:53:00 PM",
        "quality_Rating_ID" :"3",
        "main_Category_ID" : "SharePoint",
        "sub1_Category_ID" : "Webpage Creation",
        "classification_ID" :"Transactional",
        "world_area":"Global",
        "requester":"Karsanbhai Lal",
        "adjust_SLA":"5",
        "FY":"FY22"
      },
      {
        "period_ID" :"P10",
        "title" :"Sample lang ito delete mo nalang.",
        "start_Date":"5/21/2021  11:27:00 PM",
        "complexity_ID" : "Standard",
        "service_Level_Agreement" : "",
        "actual_due_date":"5/22/2021  11:27:00 PM",
        "date_Completion" :"5/21/2021  11:53:00 PM",
        "quality_Rating_ID" :"3",
        "main_Category_ID" : "TopCat",
        "sub1_Category_ID" : "User Management",
        "classification_ID" :"Project",
        "world_area":"Global",
        "requester":"Karsanbhai Lal",
        "adjust_SLA":"",
        "FY":"FY22"
      },
      {
        "period_ID" :"",
        "title" :"",
        "start_Date":"",
        "complexity_ID" : "",
        "service_Level_Agreement" : "",
        "actual_due_date":"",
        "date_Completion" :"",
        "quality_Rating_ID" :"",
        "main_Category_ID" : "",
        "sub1_Category_ID" : "",
        "classification_ID" :"",
        "world_area":"",
        "requester":"",
        "adjust_SLA":"",
        "FY":""
      }
      ],
      template_headers:{
        period_ID :"Period",
        title :"Title",
        start_Date:"Start Date",
        complexity_ID : "Complexity",
        service_Level_Agreement : "SLA",
        actual_due_date:"Actual Due Date",
        date_Completion :"Date Completed",
        quality_Rating_ID :"Quality Rating",
        main_Category_ID : "Request Category",
        sub1_Category_ID : "Request Type",
        classification_ID :"Classification",
        world_area:"World Area",
        requester:"Requester",
        adjust_SLA:"Non-Functional (No. of Hrs)",
        FY:"FY"
        
      },
      template_fields:[
        "period_ID",
        "title",
        "start_Date",
        "complexity_ID",
        "service_Level_Agreement",
        "actual_due_date",
        "date_Completion",
        "quality_Rating_ID",
        "main_Category_ID",
        "sub1_Category_ID",
        "classification_ID",
        "world_area",
        "requester",
        "adjust_SLA",
        "FY"
      ]
    };
  },
  methods: {
    loadSuccess: function(result) {
      this.csvHeader = result.csvHeader;
      this.csvBody = result.csvBody;
    },
    uploaded: function(e) {
      const file = e.target && e.target.files && e.target.files[0];
      if (file) {
        this.fileName = file.name;
        this.loadCsv(file, sjisData => {
          const lineArray = sjisData.split("\r");
          const itemArray = [];
          let header = [];
          let body = [];
          for (let i = 0; i < lineArray.length; i++) {
            itemArray[i] = lineArray[i].split(",");
          }
          if (this.headerRowCount > 0) {
            header = itemArray.slice(0, this.headerRowCount);
            body = itemArray.slice(this.headerRowCount, itemArray.length - 1);
          } else {
            body = itemArray;
          }
          this.$emit("loadSuccess", {
            csvHeader: header,
            csvBody: body
          });
            this.csvHeader = header;
            this.csvBody = body;
            this.disabled = false
            this.upload_errors = []
        });
      }
    },
    loadCsv: function(file, callBack) {
      const reader = new FileReader();
      reader.onerror = function() {
        alert(`${file}の読み込みに失敗しました。`);
      };
      reader.onload = () => {
        const str = String.fromCharCode.apply(
          "",
          new Uint8Array(reader.result)
        );
        const sjisData = Encoding.convert(str, {
          to: "UNICODE",
          from: "AUTO"
        });
        callBack(sjisData);
      };
      reader.readAsArrayBuffer(file);
    },
    getFYID(fy){
      let id = 0
      for(let p = 0; p < this.$store.state.fiscalYears[0].length; p++){
          if(this.$store.state.fiscalYears[0][p].label.toLowerCase() == fy.toLowerCase()){
            id = this.$store.state.fiscalYears[0][p].id
            return this.$store.state.fiscalYears[0][p].id
          }
      }
      if(id == 0){this.upload_errors.push(fy + " in FY column is not defined")}
    },
    getPeriodID(period){
      period = period.substr(1,4)
      let id = 0
      for(let p = 0; p < this.$store.state.periods[0].length; p++){
          if(this.$store.state.periods[0][p].abbreviation.toLowerCase() == period.toLowerCase()){
            id = this.$store.state.periods[0][p].id
            return this.$store.state.periods[0][p].id
          }
      }
      if(id == 0){this.upload_errors.push(period + " in Period column is not defined")}
    },
    getQualityID(quality){
      let id = 0
      for(let p = 0; p < this.$store.state.qualityRatings[0].length; p++){
          if(this.$store.state.qualityRatings[0][p].abbreviation.toLowerCase() == quality.toLowerCase()){
            id = this.$store.state.qualityRatings[0][p].id
            return this.$store.state.qualityRatings[0][p].id
          }
      }
      if(id == 0){this.upload_errors.push(quality + " in Quality column is not defined")}
    },
    getComplexityID(complexity){
      let id = 0
      for(let c = 0; c < this.$store.state.complexitiesByTeam[0].length; c++){
        if(this.$store.state.complexitiesByTeam[0][c].label.toLowerCase() == complexity.toLowerCase()){
          id = this.$store.state.complexitiesByTeam[0][c].id;
          return this.$store.state.complexitiesByTeam[0][c].id;
        }
      }
      if(id == 0 && complexity != ""){this.upload_errors.push(complexity + " in Complexity column is not defined")}   
    },
    getClassificationID(classification){
      let id = 0
      for(let c = 0; c < this.$store.state.classifications[0].length; c++){
        if(this.$store.state.classifications[0][c].label.toLowerCase() == classification.toLowerCase()){
          id = this.$store.state.classifications[0][c].id;
          return this.$store.state.classifications[0][c].id;
        }
      }  
      if(id == 0){this.upload_errors.push(classification + " in Classification column is not defined")}
    },
    getMainCategoryID(main_category){
      let id = 0
      for(let m = 0; m < this.$store.state.main_Categories_by_team[0].length; m++){
        if(this.$store.state.main_Categories_by_team[0][m].label.toLowerCase() == main_category.toLowerCase()){  
          id = this.$store.state.main_Categories_by_team[0][m].id;
          return this.$store.state.main_Categories_by_team[0][m].id;
        }
      } 
      if(id == 0){this.upload_errors.push(main_category + "in Request Category column is not defined")}
    },
    getWorldAreaID(world_area){
      let id = 0
      for(let wa = 0; wa < this.$store.state.world_areas[0].length; wa++){
        if(this.$store.state.world_areas[0][wa].label.toLowerCase() == world_area.toLowerCase() || this.$store.state.world_areas[0][wa].abbreviation.toLowerCase() == world_area.toLowerCase()){ 
          id =  this.$store.state.world_areas[0][wa].id;    
          return this.$store.state.world_areas[0][wa].id;
        }
      } 
      if(id == 0){this.upload_errors.push(world_area + " in World Area column is not defined")}
    },
    removeDuplicates() {
      let errors = [ ...new Set(this.upload_errors) ]
      return errors;
    },
    saveTickets(){
      let ticketsToSave = []
      let ticketsToSave_Promise = []
      let savingTicket_Promise = []
      this.upload_errors = []
      this.dialog_saving = true
      this.dialog_saving_text = "Validating your data"
      for(let ticket = 0; ticket < this.csvBody.length; ticket++){    
        let sub1_id = null 
        let id = 0
        let sla = 0
        if(this.getMainCategoryID(this.csvBody[ticket][8])){
        ticketsToSave_Promise.push(
                  SparrowService.getTicketSub1_CategoryByMainCategory(this.getMainCategoryID(this.csvBody[ticket][8]))
                    .then((response) => {
                        for(let s = 0; s < response.data.length; s++){
                          if(response.data[s].label.toLowerCase() == this.csvBody[ticket][9].toLowerCase()){
                            id = response.data[s].id
                            sub1_id = response.data[s].id
                          }
                        }
                        if(id == 0 && this.csvBody[ticket][9] != ""){this.upload_errors.push(this.csvBody[ticket][9] + " is not defined")}
                        if(this.getClassificationID(this.csvBody[ticket][10]) == 2){
                          //Project
                          sla = this.SLAComputation(this.csvBody[ticket][2],this.csvBody[ticket][5])
                          if(moment(this.csvBody[ticket][6]).format('YYYY-MM-DDTHH:mm:ss') < moment(this.csvBody[ticket][2]).format('YYYY-MM-DDTHH:mm:ss') ){
                                this.upload_errors.push("The date completion of '" + this.csvBody[ticket][1] +"' is less than the date it was started.")
                          }
                        }else if(this.getClassificationID(this.csvBody[ticket][10]) == 1){
                          //Transactional
                          //sla = this.csvBody[ticket][4]
                          if(this.csvBody[ticket][4] == ""){
                                  this.upload_errors.push("SLA should not be empty for transactional tickets")
                          }
                          else{
                            if(this.csvBody[ticket][13] != ""){
                              sla = parseInt(this.csvBody[ticket][4]) + parseInt(this.csvBody[ticket][13])
                            }else{
                              sla = this.csvBody[ticket][4]
                            } 
                          }
                          if(moment(this.csvBody[ticket][6]).format('YYYY-MM-DDTHH:mm:ss') < moment(this.csvBody[ticket][2]).format('YYYY-MM-DDTHH:mm:ss') ){
                                this.upload_errors.push("The date completion of '" + this.csvBody[ticket][1] +"' is less than the date it was started.")
                          }
                        }
                        ticketsToSave.push({
                            title :this.csvBody[ticket][1],
                            actual_due_date:this.ActualDueDate(this.csvBody[ticket][2],sla) ,                 
                            service_rating:Computations.serviceRatingComputation(Computations.TimeSpentCalculation(this.csvBody[ticket][2],this.csvBody[ticket][6]),sla),
                            start_Date :this.csvBody[ticket][2],
                            date_Completion : this.csvBody[ticket][6],
                            total_hrs : Computations.TimeSpentCalculation(this.csvBody[ticket][2],this.csvBody[ticket][6]) ,
                            service_Level_Agreement : sla,
                            adjusted_Service_Level_Agreement:parseInt(this.csvBody[ticket][13]),
                            classification_ID :this.getClassificationID(this.csvBody[ticket][10]),
                            complexity_ID : this.getComplexityID(this.csvBody[ticket][3]),
                            period_ID :this.getPeriodID(this.csvBody[ticket][0]),
                            main_Category_ID : this.getMainCategoryID(this.csvBody[ticket][8]),
                            sub1_Category_ID : sub1_id,
                            quality_Rating_ID :this.getQualityID(this.csvBody[ticket][7]),
                            world_area:this.getWorldAreaID(this.csvBody[ticket][11]),
                            requester:this.csvBody[ticket][12],
                            ticket_Owner_ID : this.$store.state.userID,
                            ticket_Status_ID : this.$store.state.completedID,
                            fy_ID: this.getFYID(this.csvBody[ticket][14])
                        })
                    })
          )
      }
      };
      setTimeout(() => {
          Promise.all(ticketsToSave_Promise).then(()=>{
            if(this.upload_errors.length == 0){   
              this.dialog_saving_text = "Calculating and Saving your data"   
              if(ticketsToSave.length == this.csvBody.length)
                for(let t = 0; t < ticketsToSave.length; t++){
                  savingTicket_Promise.push(
                    new Promise((resolve)=>{
                      this.$store.dispatch("addTicket", ticketsToSave[t]).then(() => {
                        this.ticket_saved_count += 1
                        resolve({
                          //
                          Done:"Done"
                          
                        })
                      })
                    })                
                  )
              }
              setTimeout(() => {
                Promise.all(savingTicket_Promise).then((Done)=>{   
                  this.$store.dispatch("fetchUserTickets",this.$store.state.userID).then(()=>{
                    if(this.ticket_saved_count == this.csvBody.length){
                      this.post_saving_dialog = true
                      this.post_saving_dialog_text = "Tickets saved!"
                      this.dialog_saving = false
                    } 
                  })     
                  
                })  
              }, 5000);
                  
            }else{
              this.disabled = true
              this.dialog_saving = false
              this.post_saving_dialog = true
              this.post_saving_dialog_text = "Oooopss..."
            }
          })
        }, 2000);
    },
    addMore(){
       location.reload()
    },
    goToMyTicket(){
      location.replace(process.env.VUE_APP_BASED_URL);
    },
    dialogHeaderColor(){
      var backgroundColor = ""
      var color =""
      if(this.upload_errors.length == 0){
         color = 'white'
         backgroundColor = '#04AA6D'
      }else if(this.upload_errors.length != 0){
         color = 'white'
         backgroundColor = '#F44336'
      }
      return {
        color:color,
        background:backgroundColor
      };
    },
    SLAComputation(start,end){
       let project_SLA = null
       let formatStartDate = moment(start).format("YYYY-MM-DD HH:mm:ss")
       let formatEndDate = moment(end).format("YYYY-MM-DD HH:mm:ss")

       var ms =  moment(formatEndDate,"YYYY/MM/DD HH:mm").diff(moment(formatStartDate,"YYYY/MM/DD HH:mm"));
       var d = moment.duration(ms);
       var working_hours = Math.round(d.asHours())
       var consumed_hours = 0

       // GETTING 9 HOURS / DAY 
        if(Math.floor(working_hours) >= 24){
          consumed_hours = Math.floor(working_hours) - ((Math.floor(working_hours)/24)*15)
          consumed_hours = consumed_hours + (this.$store.state.user_shift.end_Time - parseInt(moment(formatStartDate).format('HH')))
        }else if(Math.floor(working_hours) >= 9){
          consumed_hours = Math.floor(working_hours) - 15
        }else{
          consumed_hours = Math.floor(working_hours)
        } 

        var duration = Math.floor(consumed_hours) + moment.utc(ms).format(":mm");
        let hours_and_min = duration.substr(0,5)
        var hoursMinutes  = hours_and_min.split(/[.:]/);
        var hours = parseInt(hoursMinutes [0], 10);
        var minutes = hoursMinutes [1] ? parseInt(hoursMinutes [1], 10) : 0;
        project_SLA = hours + minutes/60
        
        return parseFloat(project_SLA.toFixed(1));
    },
    ActualDueDate(start_Date,sla){
      let number_of_days_to_work = 0
      let initial_sla = null
                  if(sla >= 9){
                        number_of_days_to_work = sla/9
                        let hours_to_add =  sla%9
                        initial_sla = moment(start_Date).add(number_of_days_to_work, 'days').format('YYYY-MM-DDTHH:mm:ss');

                        if(hours_to_add != 0){
                          initial_sla = moment(initial_sla).add(hours_to_add, 'hours').format('YYYY-MM-DDTHH:mm:ss');
                        }

                      }else if(sla < 9){
                        var time = start_Date.substr(9, 19)
                        var hoursMinutes = time.split(/[.:]/);
                        var hours = parseInt(hoursMinutes[0], 10);
                        var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
                        var converted_time = hours + minutes / 60;         
                        let time_remaining_in_shift = this.$store.state.user_shift.end_Time - converted_time.toFixed(2)
                        if (time_remaining_in_shift < sla){
                          initial_sla = moment(start_Date).add(15 + sla, 'hours').format('YYYY-MM-DDTHH:mm:ss');
                        }else{
                          initial_sla = moment(start_Date).add(sla, 'hours').format('YYYY-MM-DDTHH:mm:ss');
                        }

                      }

                //Adjusting due dates for weekends
                for(let i = 0 ; i < number_of_days_to_work ;i++){
                  if(this.$store.state.world_area_support == "MEA"){
                      if(moment(start_Date).add(i+1, 'days').format('dddd') == "Friday" || moment(start_Date).add(i+1, 'days').format('dddd') == "Saturday")
                        {      
                          initial_sla = moment(initial_sla).add(2, 'days').format('YYYY-MM-DDTHH:mm:ss');
                           break;
                        } 
                  }else{                   
                      if(moment(start_Date).add(i+1, 'days').format('dddd') == "Saturday" || moment(start_Date).add(i+1, 'days').format('dddd') == "Sunday" )
                        {
                          initial_sla = moment(initial_sla).add(2, 'days').format('YYYY-MM-DDTHH:mm:ss');
                          break;
                        } 
                  }
                }
                return initial_sla;
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
