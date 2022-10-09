<template>
  <v-row>
    <v-col cols="6">
            <download-excel
              class = "export-excel-wrapper"
              :data = "json_Data"
              :fields = "json_fields"
              :header="header"
              type="xlsx"
              :escapeCsv = true
              name = "KPI Dashboard.xlsx">
              <v-btn color="success"  @click="downKPIDashboardReport" :disabled="disabled" style="height:54px;"><v-icon style="background-color:white;border-radius:50px;margin-right:5px" color="success">mdi-download</v-icon>Export Data</v-btn>
          </download-excel>

    </v-col>
  </v-row>
</template>

<script>
import moment from 'moment'
export default {
  name: "ExportReport",
  props:["toExport","disabled",],
  components:{
    
  },
data() {
    return {
      header:["KPI Dashboard"," ","Ticket Details"],
      json_fields: {
         " ":" ",
         Period:"period.abbreviation", // support nested properties
         "Title": "title", // General Fields
         "Start Date": "start_Date",
         "Complexity":"complexity.label",
         "Service Level Agreement":"service_Level_Agreement",
         "Actual Due Date" : "actual_due_date",
         "Date Completed":"date_Completion",
         "Actual Processing Time":"total_hrs",
         "Actual Time (Pause/Play)":"running_time",
         "Service Rating": "service_rating",
         Quality_Rating:"quality_Rating.abbreviation",
         Request_Category:"main_Category.label",
         Request_Type:"sub1_Category.label",
         Classification:"classification.label",
         "Business Unit":"business_Unit",
         "World Area": "world_area"

      },
      json_Data:[],
    };
  },
  computed:{
  },
  methods:{
    downKPIDashboardReport(){
      let transactional = []
      let projects = []
      let TransactionalTitle = [{" ":"Transactional (80%)",start_Date:"",actual_due_date:"",date_Completion:"",world_area:""}] 
      let ProjectTitle = [{" ":"Projects (20%)",start_Date:"",actual_due_date:"",date_Completion:"",world_area:""}] 
      let ProjectsRows= []
      let TransactionalRows =[]
      for(var i = 0; i < this.toExport.length;i++){
        if(this.toExport[i].classification.label == "Transactional"){   
          transactional.push(this.toExport[i])
        }else{
          projects.push(this.toExport[i])
        }
      } 
        TransactionalRows = TransactionalTitle.concat(transactional)
        ProjectsRows = TransactionalRows.concat(ProjectTitle)
        this.json_Data = ProjectsRows.concat(projects)
        for(var i = 0; i < this.json_Data.length;i++){
          if(this.json_Data[i].service_Level_Agreement ==0){this.json_Data[i].service_Level_Agreement = "N/A"}
          if(this.json_Data[i].start_Date != ""){this.json_Data[i].start_Date = this.formatDisplayDate(this.json_Data[i].start_Date)}
          if(this.json_Data[i].actual_due_date != ""){this.json_Data[i].actual_due_date = this.formatDisplayDate(this.json_Data[i].actual_due_date)} 
          if(this.json_Data[i].date_Completion != ""){this.json_Data[i].date_Completion = this.formatDisplayDate(this.json_Data[i].date_Completion)}    
          if(this.json_Data[i].world_area != ""){ 
            this.json_Data[i].world_area = this.getWorldArea(this.json_Data[i].world_area)
          }else{
            this.json_Data[i].world_area = ""
          }    
        }
    },
    getWorldArea(world_area){
      let index = 0
      if(typeof world_area == "string"){
        index = this.$store.state.world_areas[0].findIndex(x => x.label === world_area);
      }else if(typeof world_area == "number"){
        index = this.$store.state.world_areas[0].findIndex(x => x.id === world_area);
      }
      return  this.$store.state.world_areas[0][index].label
    },
    formatDisplayDate(value){
       return moment(value).format("MMMM DD YYYY h:mm:ss a")
    },

  }
};
</script>

<style scoped>

.ct-major-second {
  height: 200px;
}
.ct-series-a .ct-bar,
.ct-series-a .ct-line,
.ct-series-a .ct-point,
.ct-series-a .ct-slice-donut {
  stroke: #1565c0;
}
.ct-series-b .ct-area,
.ct-series-b .ct-slice-donut-solid,
.ct-series-b .ct-slice-pie {
  fill: #4caf50;
}
.ct-series-a .ct-area,
.ct-series-a .ct-slice-donut-solid,
.ct-series-a .ct-slice-pie {
  fill: #1565c0;
}
input:disabled {
  background-color:red;
}
</style>