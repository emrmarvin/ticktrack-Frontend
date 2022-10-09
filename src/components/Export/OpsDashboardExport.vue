<template>
  <v-row>
    <v-col cols="6">
            <download-excel
              class = "export-excel-wrapper"
              :data = "json_Data"
              :fields = "json_fields"
              :header="header"
              type="xls"
              :escapeCsv = false
              name = "KPI Dashboard.xls">
              <v-btn color="success"  @click="downKPIDashboardReport" :disabled="disabled" style="height:54px;"><v-icon style="background-color:white;border-radius:50px;margin-right:5px" color="success">mdi-download</v-icon>Export Dashboard</v-btn>
          </download-excel>

    </v-col>
  </v-row>
</template>

<script>
import moment from 'moment'
export default {
  name: "OpsDashboardExport",
  props:["toExport","disabled","toExport_transactionals","toExport_projects","teamID"],
  components:{
    
  },
data() {
    return {
      header:["KRAs"],
      json_fields: {
        " ":" ",
        "Period":"period",
        "Service Performance":"Service_Performance",
        "Service Performance - Met SLAs":"Count_Met_SLA",
        "Service Performance - Unmet SLAs":"Count_UnMet_SLA",   
        "Service Performance - Total Volume":"Service_Performance_Total_Volume",
        "     ":"spacer1",
        "     ":"spacer2",
        "Quality Performance":"Quality_Performance",
        "Quality Performance - Met SLAs":"Quality_Count_Met_SLA",
        "Quality Performance - Unmet SLAs":"Quality_Count_UnMet_SLA",
        "Quality Performance - Total Volume":"Quality_Performance_Total_Volume",
   
      },
      json_Data:[
        
      ],
    };
  },
  computed:{
    teamName(){
      var team_name = ""
      if(this.teamID){
        var index = this.$store.state.opsManagerTeams.findIndex(x => x.id === this.teamID);
        team_name =  this.$store.state.opsManagerTeams[index].name
      }
      return team_name
    }
  },
  methods:{
    downKPIDashboardReport(){
      this.header.push([this.teamName])
      let projects = []
      let transactional = []
      let ProjectsRows= []
      let TransactionalRows =[]
      let TransactionalTitle = [{" ":"Transactional"}]
      let ProjectTitle = [{" ":"Project"}]
      for(var i = 0; i < this.toExport_transactionals.length;i++){
           transactional.push(this.toExport_transactionals[i])
      } 
      for(var i = 0; i < this.toExport_projects.length;i++){  
           projects.push(this.toExport_projects[i])
      } 
      
      for(var i = 0; i < transactional.length;i++){
        transactional[i]["spacer1"] =  " "
        transactional[i]["spacer2"] =  " "
        transactional[i]["Service_Performance"] =  this.percentage(transactional[i].Count_Met_SLA / transactional[i].Total_volume)
        transactional[i]["Quality_Performance"] =  this.percentage(transactional[i].Quality_Count_Met_SLA / transactional[i].Total_volume)
        transactional[i]["Service_Performance_Total_Volume"] = transactional[i].Total_volume
        transactional[i]["Quality_Performance_Total_Volume"] = transactional[i].Total_volume
      }
      for(var i = 0; i < projects.length;i++){
        projects[i]["spacer1"] =  " "
        projects[i]["spacer2"] =  " "
        projects[i]["Service_Performance"] =  this.percentage(projects[i].Count_Met_SLA / projects[i].Total_volume)
        projects[i]["Quality_Performance"] =  this.percentage(projects[i].Quality_Count_Met_SLA / projects[i].Total_volume)
        projects[i]["Service_Performance_Total_Volume"] = projects[i].Total_volume
        projects[i]["Quality_Performance_Total_Volume"] = projects[i].Total_volume
      }
      TransactionalRows = TransactionalTitle.concat(transactional)
      ProjectsRows = TransactionalRows.concat(ProjectTitle)
      this.json_Data = ProjectsRows.concat(projects)
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
    percentage(dec){
      var value = ""
      if (dec <= 1) {
          value = dec * 100
          return parseInt(value).toFixed(2)  + "%";
       }
       return "0%"
    }

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