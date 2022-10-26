<template>
  <div>
    <v-row>
      <v-col cols="4">
        <v-select
            v-model="team_member_id"
            :items="$store.state.users[0]"
            item-value="id"
            label="Team Member"
            style="height: 50px !important"
            no-data-text="No data to display"
            @change="getTickets()"
        >
        <template v-slot:selection="{ item }"> 
            {{item.first_Name}} {{item.last_Name}} 
        </template>
         <template v-slot:item="{ item }">
           {{item.first_Name}} {{item.last_Name}} 
         </template>
        </v-select>
      </v-col>
      <v-col cols="4">
        <v-select
            v-model="filter_period"
            :items="$store.state.periods[0]"
            item-value="id"
            label="Period"
            item-text="label"
            style="height: 50px !important"
            no-data-text="No data to display"
            required
            outlined
            :menu-props="{ maxHeight: '400',maxWidth:'400'}"
            multiple
            :disabled="team_member_id == 0"
            @change="getTickets()"
        >
          <template v-slot:selection="{item, index }">
                  <span style="margin-right:5px" v-if="index === 0">{{ item.label }}</span>
                  <span
                    v-if="index === 1"
                    class="grey--text text-caption"
                  >
                    (and {{ filter_period.length - 1 }} other period/s)
                  </span>
          </template>
        </v-select>
      </v-col>
      <v-col cols="4" class="justify-center" style="justify-content:center;display:flex">
        <!--FY Filter-->
        <v-select  
            :items="$store.state.fiscalYears[0]"
            item-value="label"
            label="Filter FY"
            item-text="label"
            required
            outlined
            :menu-props="{ maxHeight: '400',maxWidth:'400'}"
            v-model="filter_fy"
            style="height: 50px !important;max-width:300px;float:right;"
            no-data-text="No data to display"
            class="mr-5"
            :disabled="team_member_id == 0"
            @change="getTickets()"
         >
      </v-select>

        <DynamicExportReport
          :toExport="this.Tickets"
          :disabled="this.Tickets.length==0"
        />
      </v-col>
    </v-row>
    <div style="justify-content:center;display:flex;height:500px;padding-top:150px" v-if="loading">Loading...</div>
    <TicketsTable
          :Tickets="Tickets"
          :filter_period="filter_period"
          :update_ticket="getTicketToUpdate"
          :show_delete="false"
         />
<!--Ticket Form-->
<v-dialog v-model="dialog" persistent max-width="800px">
                <v-card>
                  <v-card-title>
                    <span class="headline">Ticket Details</span>
                  </v-card-title>  
                  <v-card-text v-if="isLoaded">
                    <v-container>
                      <v-row>
                        <v-row>
                          <v-col
                            cols="11"
                            sm="6
                            "
                          >
                            <v-menu
                              ref="menu2"
                              v-model="menu2"
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
                                <v-icon slot="prepend" class="required">
                                    *
                                </v-icon>
                                </v-text-field>
                              </template>
                              <v-date-picker
                                v-model="start_date"
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
                                  @click="$refs.menu2.save(start_date)"
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
                            <input v-model="start_date_time" class="time-text" type="time" id="meeting-time" name="meeting-time"  min="00:00" max="23:59">
                            </v-col>
                            
                        </v-row>
                        <v-col cols="12" md="12">
                          <v-text-field
                                v-model="ticket_Info.title"
                                label="Title"
                          >
                          <v-icon slot="prepend"  class="required">
                            *
                          </v-icon>
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" md="12">
                          <v-autocomplete
                              v-model="ticket_Info.requester"
                              :items="getRequesters"
                              item-value="name"
                              label="Requester"
                              item-text="name"
                              required
                              clearable
                              style="height: 50px !important"
                              no-data-text="No data to display"
                            >
                          </v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-select
                              v-model="ticket_Info.business_Unit"
                              :items="getBusinessUnits"
                              item-value="name"
                              label="Business Unit"
                              item-text="name"
                              required
                              style="height: 50px !important"
                              no-data-text="No data to display"
                            >
                          </v-select>
                        </v-col>
                        <v-col cols="12" md="6">
                         <v-select
                              v-model="ticket_Info.world_area"
                              :items="getWorldAreas"
                              item-value="id"
                              label="World Area"
                              item-text="label"
                              required
                              style="height: 50px !important"
                              no-data-text="No data to display"
                            >
                          </v-select>
                        </v-col>
                        <v-col cols="12" md="12">
                          <v-textarea
                            outlined
                            name="input-7-4"
                            label="Description"
                            v-model="ticket_Info.description"
                          ></v-textarea>
                        </v-col>
                        <v-row>

                        </v-row>
                        <v-col cols="12" sm="12">
                          <v-select
                            v-model="ticket_Info.classification_ID"
                            :items="getClassifications"
                            item-value="id"
                            label="Select WorkType"
                            item-text="label"
                            style="height: 50px !important"
                          >
                          <v-icon slot="prepend"  class="required">
                            *
                          </v-icon>
                          </v-select>
                        </v-col>
                        <v-col cols="12" sm="12" v-if="this.ticket_Info.classification_ID == 1">
                          <v-select 
                              v-model="ticket_Info.complexity_ID"
                              :items="getComplexities"
                              item-value="id"
                              label=" Select Ticket Complexity"
                              item-text="label"
                              style="height: 50px !important"
                            >
                            <v-icon slot="prepend"  class="required">
                              *
                            </v-icon>
                            </v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                          <v-row v-if="this.ticket_Info.classification_ID == 2">
                              <v-col
                                cols="11"
                                sm="6"
                              >
                                <v-menu
                                  ref="menu1"
                                  v-model="menu1"
                                  :close-on-content-click="false"
                                  :return-value.sync="actual_due_date"
                                  transition="scale-transition"
                                  offset-y
                                  min-width="auto"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                      label="Due Date"
                                      :value="formatActualDueDate"
                                      prepend-icon="mdi-calendar"
                                      readonly
                                      v-bind="attrs"
                                      v-on="on"
                                    >
                                    <v-icon slot="prepend"  class="required">
                                    *
                                  </v-icon>
                                    </v-text-field>
                                  </template>
                                  <v-date-picker
                                    v-model="actual_due_date"
                                    no-title
                                    scrollable
                                  >
                                    <v-spacer></v-spacer>
                                    <v-btn text color="primary" @click="menu1 = false">
                                      Cancel
                                    </v-btn>
                                    <v-btn
                                      text
                                      color="primary"
                                      @click="$refs.menu1.save(actual_due_date)"
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
                                  <input v-model="actual_due_date_time"  class="time-text" type="time"  min="00:00" max="23:59">
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <!-- {{ticket_Info.main_Category}} -->
                          <v-select
                            v-model="ticket_Info.main_Category_ID"
                            :items="getMainCategoryByTeam"
                            v-on:change="getSub1CategoriesByMainCategory(ticket_Info.main_Category_ID)"
                            item-value="id"
                            label=" Select Request Category"
                            item-text="label"
                            style="height: 50px !important"
                          >
                          <v-icon slot="prepend" class="required">
                            *
                          </v-icon>
                          </v-select>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-select
                                      v-model="ticket_Info.sub1_Category_ID"
                                      :disabled="ticket_Info.main_Category_ID == 0"
                                      :items="sub1_categories"
                                      item-value="id"
                                      label=" Select Request Type"
                                      item-text="label"
                                      style="height: 50px !important"
                              >
                              </v-select>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-select
                            v-model="ticket_Info.ticket_Status_ID"
                            :items="getStatusesByTeam"
                            item-value="id"
                            label="Status"
                            item-text="status"
                            style="height: 50px !important"
                            :disabled="ticket_Info.period_ID != null"
                            no-data-text="No data to display"
                          >
                          <v-icon slot="prepend" class="required">
                            *
                          </v-icon>
                          </v-select>
                        </v-col>
                        <v-col cols="12" sm="6">
                        <v-select
                              v-model="ticket_Info.quality_Rating_ID"
                              :items="getQualityRatings"
                              item-value="id"
                              label="Quality Rating"
                              item-text="label"
                              style="height: 50px !important"
                              no-data-text="No data to display"
                            >
                           <v-icon slot="prepend" class="required">
                            *
                          </v-icon> 
                          </v-select>
                        </v-col>

                      <!-- Date Completed -->
                        <v-col cols="12" sm="12">
                          <v-row>
                              <v-col
                                cols="11"
                                sm="6"
                              >
                                <v-menu
                                  ref="menu"
                                  v-model="menu3"
                                  :close-on-content-click="false"
                                  :return-value.sync="date_completed"
                                  transition="scale-transition"
                                  offset-y
                                  min-width="auto"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                      label="Date Completed"
                                      :value="formatDateCompleted"
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
                                    v-model="date_completed"
                                    no-title
                                    scrollable
                                  >
                                    <v-spacer></v-spacer>
                                    <v-btn text color="primary" @click="menu3 = false">
                                      Cancel
                                    </v-btn>
                                    <v-btn
                                      text
                                      color="primary"
                                      @click="$refs.menu.save(date_completed)"
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
                                  <input v-model="date_completed_time" class="time-text" type="time"  min="00:00" max="23:59">
                                </v-col>
                            </v-row>
                        </v-col>
                      </v-row>
                    </v-container>
                    <v-icon slot="prepend" style="margin-right:5px; font-size:30px!important" class="required"> * </v-icon> <b>Indicates that the field is required.</b> <br/>
                    <v-chip
                            class="ma-2"
                            label 
                            color="red"
                            text-color="white"

                            v-for="errors in formErrors" :key="errors"
                          >
                            <v-icon left>
                              mdi-alert
                            </v-icon>
                            {{errors}}
                    </v-chip>
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
                                        KALMA ...
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
                      Close
                    </v-btn>
                    <v-btn  color="blue darken-1" text  @click="updateTicket">
                      Update
                    </v-btn>
                  </v-card-actions>
                </v-card>
</v-dialog>
<!--Saving and Deleting Ticket loader--->
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
</div>
</template>
<script>
import SparrowService from "@/services/SparrowService.js";
import Computations from "@/services/Computations.js";
import moment from 'moment';
import TicketsTable from "@/components/Tickets/TicketsTable";
import DynamicExportReport from  "@/components/Export/DynamicExportReport"
export default {
  name:"GetTicketByTeamMember",
  components:{TicketsTable,DynamicExportReport},
  data() {
    return {
      team_member_id:0,
      filter_period:[],
      headers:[
      { text: "Title", value: "title" },
      { text: "Request Category", value: "main_Category.label" },
      { text: "Request Type", value: "sub1_Category.label" },
      { text: "Status", value: "ticket_Status.status" },
      { text: "Actions", value: "actions", sortable: false },
      ],
      column:[
      { text: "Classification", value: "classification.label" },
      { text: "Complexity", value: "complexity.label" },
      { text: "Period", value: "period.abbreviation" },
      { text: "Quality Rating", value: "quality_Rating.abbreviation" },
      { text: "Date Start", value: "start_Date" },
      { text: "Due Date", value: "actual_due_date" },
      { text: "Date Completion", value: "date_Completion" },
      { text: "Service Rating", value: "service_rating" },
      { text: "Actual Processing Time", value: "total_hrs" },
      { text: "Requester", value: "requester" },
      { text: "Date Start", value: "start_Date" },
      { text: "Actual Time Spent", value: "running_time" },
      { text: "SLA", value: "service_Level_Agreement" },
      ],
      status:"",
      Tickets:[],
      loading:false,
      disableItem:true,
      ticket_Info: this.createTicket_Info(),
      actual_due_date:null,
      actual_due_date_time: "00:00",
      actual_due_date_time_modal: false,
      start_date:null,
      start_date_time: "00:00",
      start_date_time_modal: false,
      date_completed:null,
      date_completed_time:"00:00",
      date_completed_time_modal:false,
      ticketID:0,
      classifications:[],
      complexities:[],
      main_categories:[],
      sub1_categories:[],
      dialog:false,
      isLoaded:true,
      formErrors:[],
      menu1:false,
      menu2: false,
      menu3:false,
      dialog_saving:false,
      dialog_saving_text:"",
      delete_dialog:false,
      filter_fy:this.$store.state.activeFY
    };
  },
  computed:{
    formatStartDate(){
        return this.start_date
        ? moment(this.start_date).format('YYYY-MM-DD')
        : "";
      },
    formatActualDueDate() {
    return this.actual_due_date
      ? moment(this.actual_due_date).format('YYYY-MM-DD')
      : "";
    },
    formatDateCompleted(){
      return this.date_completed
      ? moment(this.date_completed).format('YYYY-MM-DD')
      : "";
    },
    getWorldAreas(){
      return this.$store.state.world_areas[0];
    },
    getBusinessUnits(){
      return this.$store.state.business_units_by_team[0];
    },
    getRequesters(){
      return this.$store.state.requesters_by_team[0];
    },
    getClassifications(){
      return this.$store.state.classifications[0]
    },
    getComplexities(){
      return this.$store.state.complexitiesByTeam[0]
    },
    getMainCategoryByTeam(){
      return this.$store.state.main_Categories_by_team[0]
    },
    getUserTickets(){
      return this.$store.state.userTickets[0]
    },
    getQualityRatings(){
      return this.$store.state.qualityRatings[0]
    },
    getStatusesByTeam(){
      return this.$store.state.ticket_Status_by_team[0];
    },
  },
  methods:{
    getTickets(){
        this.loading=true
        this.Tickets = []
        SparrowService.getTicketsByUser(this.team_member_id,this.filter_fy).then(response=>{
          if(this.filter_period.length == 0){
            this.loading = false
            this.Tickets = response.data
          }else{
            this.filterCompletedTickets(this.filter_period,response.data)  
          }
             
        })
    },
    filterCompletedTickets(periods,tickets){
         for (let p = 0; p < periods.length; p++) {
            for (let t = 0; t < tickets.length; t++) {
               if (tickets[t] != null) {
                  if (tickets[t].period != null) {
                     if (tickets[t].period.id == periods[p]) {
                        this.Tickets.push(tickets[t])
                     }
                  }
               } else {
                  this.Tickets = []
               }
            }
         }
        this.loading = false
    },
    statusColor(status){
        var backgroundColor = ""
        if(status.toLowerCase() === "in-progress" || status.toLowerCase() === "in progress" || status.toLowerCase() === "started" || status.toLowerCase() === "current"){
          backgroundColor = '#004b8d'
        }else if(status.toLowerCase() == "completed" || status.toLowerCase() == "closed" || status.toLowerCase() == "done"){
          backgroundColor = '#4caf50'
        }else{
          backgroundColor ='#FFA700'
        }
        return {
          background:backgroundColor
          };
    },
    ratingColor(rating){
      var backgroundColor = ""
      if(rating > 3.0){
        backgroundColor = 'red'
      }else if(rating > 2.00){
        backgroundColor ='#FFA700'
      }else if(rating >= 1.00){
        backgroundColor = '#4caf50'
      }
      return {
        background:backgroundColor
      };
    },
    columnsToDisplay(text,value){
      var checkBox = document.getElementById(value);
      if(checkBox.checked == false){      
        this.headers.splice(3,0,{text:text, value: value})
      }else if(checkBox.checked == true){
        const index = this.headers.findIndex((element, index) => {
          if(element){
            if (element.value === value) {
              this.headers.splice(index,1)
            }
          }
        })
      }
  
    },
    formatDisplayDate(value){
       return moment(value).format("MM/DD/YYYY HH:mm")
    },
    getTicketToUpdate(id){
        this.dialog = true;
        this.isLoaded=false;
        let ticket_promise=[];
        ticket_promise.push(
            SparrowService.getTicket(id)
                    .then(response => {
                      this.ticketID = response.data.id
                      this.getSub1CategoriesByMainCategory(response.data.main_Category_ID)
                      this.ticket_Info.title = response.data.title
                      this.ticket_Info.description = response.data.description
                      this.ticket_Info.classification_ID = response.data.classification_ID
                      this.ticket_Info.complexity_ID = response.data.complexity_ID
                      this.ticket_Info.main_Category_ID = response.data.main_Category_ID
                      this.ticket_Info.sub1_Category_ID = response.data.sub1_Category_ID
                      this.ticket_Info.running_time = response.data.running_time
                      this.ticket_Info.requester = response.data.requester
                      this.ticket_Info.business_Unit = response.data.business_Unit
                      this.ticket_Info.world_area = response.data.world_area
                      this.ticket_Info.period_ID = response.data.period_ID
                      this.ticket_Info.service_Level_Agreement = response.data.service_Level_Agreement
                      this.ticket_Info.adjusted_Service_Level_Agreement = response.data.adjusted_Service_Level_Agreement
                      this.start_date = response.data.start_Date.substr(0, 10)
                      this.start_date_time = response.data.start_Date.substr(11, 19)
                      this.actual_due_date = response.data.actual_due_date.substr(0, 10)
                      this.actual_due_date_time = response.data.actual_due_date.substr(11, 19)
                      this.ticket_Info.ticket_Status_ID = response.data.ticket_Status_ID
                      this.ticket_Info.quality_Rating_ID = response.data.quality_Rating_ID
                      this.ticket_Info.fY_ID = response.data.fY_ID
                      this.ticket_Info.ticket_Owner_ID = response.data.ticket_Owner_ID
                      if(response.data.date_Completion != null){
                        this.date_completed = response.data.date_Completion.substr(0, 10)
                        this.date_completed_time = response.data.date_Completion.substr(11, 19)
                      }else{
                        this.date_completed = null
                        this.date_completed_time ="00:00"
                      }
            })
        )
        Promise.all(ticket_promise).then(()=>{
          this.isLoaded = true
        })     
    },
    updateTicket(){
      let user_shift_end_Time = 0
      if(this.validateTicketInfoData() == true){
          let ticket_param ={
            id:this.ticketID,
            title: this.ticket_Info.title,
            description: this.ticket_Info.description ,
            actual_due_date:this.formatActualDueDate +"T"+ this.actual_due_date_time,
            service_rating:0, // null upon ticket creation
            start_Date:this.formatStartDate +"T"+ this.start_date_time, // Date Recieved 
            date_Completion:null,  // Submission Date
            total_hrs:0, // null upon ticket creation
            running_time:this.ticket_Info.running_time,
            requester: this.ticket_Info.requester,
            business_Unit:this.ticket_Info.business_Unit,
            world_area: this.ticket_Info.world_area,
            service_Level_Agreement:this.ticket_Info.service_Level_Agreement,
            adjusted_Service_Level_Agreement:this.ticket_Info.adjusted_Service_Level_Agreement,
            classification_ID:this.ticket_Info.classification_ID,
            complexity_ID:this.ticket_Info.complexity_ID,
            period_ID:this.ticket_Info.period_ID, // null upon ticket creation
            main_Category_ID: this.ticket_Info.main_Category_ID,
            sub1_Category_ID: this.ticket_Info.sub1_Category_ID,
            sub2_Category_ID: null,
            quality_Rating_ID:this.ticket_Info.quality_Rating_ID, // null upon ticket creation
            ticket_Owner_ID: this.ticket_Info.ticket_Owner_ID,
            ticket_Status_ID: this.ticket_Info.ticket_Status_ID,
            fy_ID:this.ticket_Info.fY_ID
          }
            /////
            //Project
            if(this.ticket_Info.classification_ID == 2){
              ticket_param.service_Level_Agreement = Computations.ProjectSLAComputation(this.formatStartDate +"T"+ this.start_date_time ,this.formatActualDueDate +"T"+ this.actual_due_date_time)
            }else{
              //Transactional
              //Loop to get the SLA of the ticket
              let number_of_days_to_work = 0
              let initial_sla = null
              for(let i =0 ; i <this.$store.state.complexitiesByTeam[0].length; i++){ 
                  if(this.$store.state.complexitiesByTeam[0][i].id == this.ticket_Info.complexity_ID){
                      ticket_param.service_Level_Agreement = this.$store.state.complexitiesByTeam[0][i].no_of_hrs
                      if(this.$store.state.complexitiesByTeam[0][i].no_of_hrs >= 9){
                        number_of_days_to_work = ticket_param.service_Level_Agreement/9
                        let hours_to_add =  ticket_param.service_Level_Agreement%9
                        initial_sla = moment(ticket_param.start_Date).add(number_of_days_to_work, 'days').format('YYYY-MM-DDTHH:mm:ss');

                        if(hours_to_add != 0){
                          initial_sla = moment(initial_sla).add(hours_to_add, 'hours').format('YYYY-MM-DDTHH:mm:ss');
                        }

                      }else if(this.$store.state.complexitiesByTeam[0][i].no_of_hrs < 9){
                        SparrowService.getUser(this.ticket_Info.ticket_Owner_ID).then(response=>{
                           user_shift_end_Time = response.data.shift_Schedule
                           console.log("user_shift_end_Time",user_shift_end_Time)
                        })
                        var time = this.start_date_time
                        var hoursMinutes = time.split(/[.:]/);
                        var hours = parseInt(hoursMinutes[0], 10);
                        var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
                        var converted_time = hours + minutes / 60;         
                        let time_remaining_in_shift = user_shift_end_Time - converted_time.toFixed(2)
                        if (time_remaining_in_shift < ticket_param.service_Level_Agreement){
                          initial_sla = moment(ticket_param.start_Date).add(15 + ticket_param.service_Level_Agreement, 'hours').format('YYYY-MM-DDTHH:mm:ss');
                        }else{
                          initial_sla = moment(ticket_param.start_Date).add(ticket_param.service_Level_Agreement, 'hours').format('YYYY-MM-DDTHH:mm:ss');
                        }

                      }

                      //Adjusting due dates for weekends
                      for(let i = 0 ; i < number_of_days_to_work ;i++){
                        if(this.$store.state.world_area_support == "MEA"){
                          if(moment(this.formatStartDate).add(i+1, 'days').format('dddd') == "Friday" || moment(this.formatStartDate).add(i+1, 'days').format('dddd') == "Saturday")
                            {
                              
                              initial_sla = moment(initial_sla).add(2, 'days').format('YYYY-MM-DDTHH:mm:ss');
                              break;
                            } 
                        }else{                   
                          if(moment(this.formatStartDate).add(i+1, 'days').format('dddd') == "Saturday" || moment(this.formatStartDate).add(i+1, 'days').format('dddd') == "Sunday" )
                            {
                              initial_sla = moment(initial_sla).add(2, 'days').format('YYYY-MM-DDTHH:mm:ss');
                              break;
                            } 
                        }
                      }
                       ticket_param.actual_due_date = initial_sla  
                  }
              }
            }
            ////
            let date_completion = this.formatDateCompleted +"T"+ this.date_completed_time
            ticket_param.period_ID =  SparrowService.pickPeriod(this.$store.state.periods[0], date_completion)
            setTimeout(() => {
                if(this.ticket_Info.classification_ID == 2){
                //Project              
                  let start_date = this.formatStartDate +" "+ this.start_date_time
                  let due_date = this.formatActualDueDate +" "+ this.actual_due_date_time
                  let SLA = 0

                  if(this.ticket_Info.adjusted_Service_Level_Agreement != null && this.ticket_Info.adjusted_Service_Level_Agreement > ticket_param.service_Level_Agreement)
                    {
                      SLA = this.ticket_Info.adjusted_Service_Level_Agreement 
                    }else{
                      SLA = ticket_param.service_Level_Agreement
                    }
                  
                  this.actual_time_spent = this.TimeSpentCalculation(this.formatStartDate +"T"+ this.start_date_time,this.formatDateCompleted +"T"+ this.date_completed_time)
                  ticket_param.total_hrs = parseFloat(this.actual_time_spent).toFixed(2)
                  ticket_param.date_Completion = this.formatDateCompleted +"T"+ this.date_completed_time              
                  ticket_param.service_rating = Computations.serviceRatingComputation(parseFloat(this.actual_time_spent).toFixed(2),SLA).toFixed(2)
                  this.updateRequest(ticket_param)
              }else if(this.ticket_Info.classification_ID == 1){
                // Transactional            
                  // let start_date = this.formatStartDate +" "+ this.start_date_time
                  // let due_date = this.formatActualDueDate +" "+ this.actual_due_date_time
                  let SLA = 0
                  if(this.ticket_Info.adjusted_Service_Level_Agreement != null)
                    {SLA = this.ticket_Info.adjusted_Service_Level_Agreement 
                  }else{
                    SLA = ticket_param.service_Level_Agreement
                  }

                  this.actual_time_spent = this.TimeSpentCalculation(this.formatStartDate +"T"+ this.start_date_time,this.formatDateCompleted +"T"+ this.date_completed_time)
                  ticket_param.total_hrs = parseFloat(this.actual_time_spent).toFixed(2)
                  ticket_param.date_Completion = this.formatDateCompleted +"T"+ this.date_completed_time +":00"
                  ticket_param.service_rating = Computations.serviceRatingComputation(parseFloat(this.actual_time_spent).toFixed(2),SLA).toFixed(2)
                  this.updateRequest(ticket_param)
              }  
            }, 3000);
      }
    },
    updateRequest(ticket_param){
      var activetickets = []
      this.$store.state.activeTickectsCount = 0
      this.$store.state.completedTickets = 0
      this.$store.state.activeTickets = []
        SparrowService.putTicket(this.ticketID,ticket_param).then(()=>{
              this.dialog_saving = true
              this.dialog_saving_text = "Updating your ticket"
              setTimeout(() => {         
                              this.dialog_saving = false             
                              SparrowService.getTicketsByUser(this.team_member_id,this.$store.state.activeFY.label).then(response=>{
                              this.Tickets = []
                              if(this.filter_period.length == 0){
                                this.loading = false
                                this.Tickets = response.data
                              }else{
                                this.filterCompletedTickets(this.filter_period,response.data)  
                              }
                              })
                       
                              this.start_Date = ""
                              this.start_date_time = "00:00"
                              this.actual_due_date = ""
                              this.actual_due_date_time = "00:00"
                              this.date_completed = ""
                              this.date_completed_time = "00:00"
                              this.ticket_Info = this.createTicket_Info();
                              this.dialog = false; 
                          }, 2000);
        })

    },
    validateTicketInfoData(){
      this.formErrors = []
      if(this.formatStartDate && 
         this.start_date_time && 
         this.ticket_Info.title && 
         this.ticket_Info.classification_ID &&
         this.ticket_Info.main_Category_ID
         )
         {
          if(this.ticket_Info.classification_ID == "1"){
            if(this.ticket_Info.complexity_ID){            
              if(this.isCompleted){
                if(this.ticket_Info.quality_Rating_ID && this.formatDateCompleted && this.date_completed_time){
                  return true
                }
              }else{
                return true;
              }
            }
          }else if(this.ticket_Info.classification_ID == "2"){
            if(this.formatActualDueDate && this.actual_due_date_time){
               if(this.isCompleted){
                if(this.ticket_Info.quality_Rating_ID && this.formatDateCompleted && this.date_completed_time){
                  return true
                }
              }else{
                return true;
              }
            }
          }
         }
         
      if(!this.formatStartDate){
        this.formErrors.push("Start Date is required.")
      }
      if(!this.start_date_time){
        this.formErrors.push("Start Time is required.")
      }

      if(!this.ticket_Info.title){
        this.formErrors.push("Title is required.")
      }

      if(!this.ticket_Info.classification_ID){
        this.formErrors.push("Work Type is required.")
      }

      if(!this.ticket_Info.main_Category_ID){
        this.formErrors.push("Request Category is required.")
      }

      if(this.ticket_Info.classification_ID == "1"){
        if(!this.ticket_Info.complexity_ID){
           this.formErrors.push("Complexity is required.")
        }
      }else if(this.ticket_Info.classification_ID == "2"){
        if(!this.formatActualDueDate){
          this.formErrors.push("Due Date is required.")
        }
        if(!this.actual_due_date_time){
          this.formErrors.push("Due Date Time is required.")
        }
      } 

      if(this.isCompleted){
        if(this.isCompleted && !this.ticket_Info.quality_Rating_ID){
          this.formErrors.push("Quality Rating is required.")
        }
        
        if(this.isCompleted && !this.formatDateCompleted){
          this.formErrors.push("Date Completed is required.")
        }

        if(this.isCompleted && !this.date_completed_time){
          this.formErrors.push("Completed Time is required.")
        } 
      }

    },
    getSub1CategoriesByMainCategory(maincatID){
      SparrowService.getTicketSub1_CategoryByMainCategory(maincatID)
        .then((response) => {
          this.sub1_categories = response.data;
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
    TimeSpentCalculation(date_started,date_completed){
    let formatStartDate= moment(date_started).format("YYYY-MM-DD HH:mm:ss")
    let formatCompletedDate = moment(date_completed).format("YYYY-MM-DD HH:mm:ss")
    let timespent = 0
    let working_hours = 0
    let working_days = 0
    let duration_timespent_difference = 0
    let shift_start_time_when_ticket_is_completed = 0
    let shift_end_time_when_ticket_is_completed = 0
    let shift_start_time_when_ticket_is_started = 0
    let shift_end_time_when_ticket_is_started = 0
    let start_time = 0
    let wa_support = ""
    let default_start_shift = 0 
    let default_end_shift = 0 

    SparrowService.getUser(this.ticket_Info.ticket_Owner_ID).then(response=>{
        default_start_shift = response.data[0].shift_Schedule.start_Time
        default_end_shift = response.data[0].shift_Schedule.end_Time   
        wa_support = response.data[0].world_Area.abbreviation
    })
    // If the User Changed Shift when the ticket is started
    SparrowService.getChangeShiftByUser(this.ticket_Info.ticket_Owner_ID).then(response=>{    
      let cs_start_shift = response.data.findIndex((obj => obj.cS_Start_Time.substr(0, 10) == moment(date_started).format("YYYY-MM-DD")));
      if(response.data[cs_start_shift] == null){
            shift_start_time_when_ticket_is_started = default_start_shift
            shift_end_time_when_ticket_is_started = default_end_shift
      }else{
            shift_start_time_when_ticket_is_started = response.data[cs_start_shift].cS_Start_Time
            shift_end_time_when_ticket_is_started = response.data[cs_start_shift].cS_End_Time
      }  

      // If the User Changed Shift when the ticket is closed
      let cs_end_shift = response.data.findIndex((obj => obj.cS_End_Time.substr(0, 10) == moment(date_completed).format("YYYY-MM-DD")));
      if(response.data[cs_end_shift] == null){
            shift_start_time_when_ticket_is_completed = default_start_shift
            shift_end_time_when_ticket_is_completed = default_end_shift
      }else{
            shift_start_time_when_ticket_is_completed = parseInt(response.data[cs_end_shift].cS_Start_Time.substr(11, 13))
            shift_end_time_when_ticket_is_completed = parseInt(response.data[cs_end_shift].cS_End_Time.substr(11, 13))
      }
    })

    // If ticket is received on weekend (Add 2 days)
    if(wa_support == "MEA"){
            if(moment(formatStartDate).format('dddd') == "Friday")
              {
              formatStartDate =  moment(formatStartDate).add(2,'days')
              formatCompletedDate =  moment(formatCompletedDate).add(2,'days')
              } 
            else if(moment(formatStartDate).format('dddd') == "Saturday")
              {  
              formatStartDate =  moment(formatStartDate).add(1,'days')
              formatCompletedDate =  moment(formatCompletedDate).add(1,'days')
              }
    }else{
            if(moment(formatStartDate).format('dddd') == "Saturday")
              {
                formatStartDate =  moment(formatStartDate).add(2,'days')
                formatCompletedDate =  moment(formatCompletedDate).add(2,'days')
              } 
            else if(moment(formatStartDate).format('dddd') == "Sunday")
              {
                formatStartDate =  moment(formatStartDate).add(1,'days')
                formatCompletedDate =  moment(formatCompletedDate).add(1,'days')
              }
    }

    // Get Initial time difference
    formatStartDate= moment(formatStartDate).format("YYYY-MM-DD HH:mm:ss")
    formatCompletedDate = moment(formatCompletedDate).format("YYYY-MM-DD HH:mm:ss")
    timespent = moment(formatCompletedDate).diff(moment(formatStartDate));
    duration_timespent_difference = moment.duration(timespent);
    working_days = duration_timespent_difference.asDays()
    console.log("formatStartDate",formatStartDate);
    console.log("formatCompletedDate",formatCompletedDate);
    console.log("date_started",date_started);
    console.log("date_completed",date_completed);
    // Initial Time (Hours) Difference Between Start and End date of Ticket
    working_hours = duration_timespent_difference.asHours()
    console.log("working_hours",working_hours);
    if(parseInt(moment(formatStartDate).format('HH')) == 0 )
      {
        start_time = 24
      }else{
        start_time = parseInt(moment(formatStartDate).format('HH'))
      }

    // If ticket is opened/closed the same shift 
    if(working_hours <= 9)
    {  
        // If ticket is received prior to start of shift (adjust the Start time to the start of shift schedule)
        if(start_time <= shift_start_time_when_ticket_is_started && start_time >= shift_end_time_when_ticket_is_started)
        { 
          let hours_to_adjust = shift_start_time_when_ticket_is_started - parseInt(moment(formatStartDate).format('HH'))
          working_hours = working_hours - hours_to_adjust
        }       
    }
    // If ticket is consumed more than 1 shift
    else if(working_hours > 9){
        // If ticket is received prior to start of shift (adjust the Start time to the start of shift schedule)
        if(start_time <= shift_start_time_when_ticket_is_started && start_time >= shift_end_time_when_ticket_is_started)
        { 
          let hours_to_adjust = shift_start_time_when_ticket_is_started - parseInt(moment(formatStartDate).format('HH'))
          working_hours = working_hours - hours_to_adjust
        } 

        // Take off Non_Working Hours (-15 in every 24 hours to get 9hrs shift only)
        working_hours = working_hours - ((working_hours/24)*15)

        // Take off the Weekends 
          for(let i = 0 ; i < working_days ;i++){
            if(wa_support == "MEA"){
              
              if(moment(formatStartDate).add(i+1, 'days').format('dddd') == "Friday" || moment(formatStartDate).add(i+1, 'days').format('dddd') == "Saturday")
                {
                  working_hours = working_hours - 9
                } 
            }else{
              if(moment(formatStartDate).add(i+1, 'days').format('dddd') == "Saturday" || moment(formatStartDate).add(i+1, 'days').format('dddd') == "Sunday")
                {
                if(moment(formatCompletedDate).format('YYYY/MM/DD') > moment(formatStartDate).add(i+1, 'days').format('YYYY/MM/DD')){
                    working_hours = working_hours - 9       
                } 
                } 
            }
          }
    }
    return parseFloat(working_hours.toFixed(1));
  },
    //Ticket info
    createTicket_Info() {
      return {
        title: "",
        description: "",
        actual_due_date:"",
        service_rating:0, // null upon ticket creation
        start_Date:"08/24/1995", // Date Recieved 
        date_Completion:null, // null upon ticket creation  // Submission Date
        total_hrs:0, // null upon ticket creation
        running_time:"00:00",
        requester: "",
        world_area: 0,
        business_Unit:"",
        service_Level_Agreement:0,
        adjusted_Service_Level_Agreement: null,
        classification_ID:null,
        complexity_ID:null,
        period_ID:null, // null upon ticket creation
        main_Category_ID: 0,
        sub1_Category_ID: null,
        sub2_Category_ID: null,
        quality_Rating_ID:null, // null upon ticket creation
        ticket_Owner_ID: 0,
        ticket_Status_ID:0, // Set to In-Progress upon Ticket Creation
        fY_ID:0 
      };
    },
    close() {
      this.start_Date = ""
      this.start_date_time = "00:00"
      this.actual_due_date = ""
      this.actual_due_date_time = "00:00"
      this.date_completed = ""
      this.date_completed_time = "00:00"
      this.ticket_Info = this.createTicket_Info();
      this.dialog = false;
    },
  },
}
</script>
<style scoped>
.time-text{
  color: black;
  background-color: white;
}
input[type=time], select {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
</style>