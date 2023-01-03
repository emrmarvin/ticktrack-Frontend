<template>
  <div>
    <TicketsCount
    :TotalActiveTicket="$store.state.activeTickectsCount"
    :TotalCompletedTickets="$store.state.completedTickets"
    :TotalOverDueTickets="overdueTickets"
    :TotalOnGoingNonFunctional="$store.state.ongoingNonFunctional"
    
     class="mb-10" />
    <v-row class="mx-auto mt-12 mb-6">
      <v-row align="center" justify="end">

        
        <span class="subheading mr-2">View Options:</span>

        <v-btn @click="IsCardView()" class="mx-2" fab small color="green">
          <v-icon color="white"> mdi-card-bulleted-settings-outline </v-icon>
        </v-btn>

        <v-btn @click="IsTableView()" class="mx-2" fab small color="#F44336">
            <v-icon color="white"> mdi-table-check </v-icon>
        </v-btn>
      </v-row>
    </v-row>
    <v-btn
        class="primary"
        height="50px"
        @click="dialog = true"
        :disabled = disable_add_button
         >
       <v-icon style="background-color:white;border-radius:50px;margin-right:5px" color="primary">mdi-plus</v-icon>   Add New Ticket
    </v-btn>
    <v-btn
        class="primary ml-5"
        height="50px"
        @click="nf_dialog = true"
        :disabled = disable_add_button
         >
      <v-icon style="background-color:white;border-radius:50px;margin-right:5px" color="primary">mdi-plus</v-icon> Add New Non-Functional Activity
    </v-btn>
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
            @change="showTicketByFY(filter_fy)"
         >
      </v-select>
      <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-icon 
          v-bind="attrs"
          v-on="on"
          color="primary--text"
          style="height: 50px !important;max-width:300px;float:right;margin-right:10px"
          >
          mdi-information-outline
          </v-icon>
      </template>
      <span class="text-center">This is just to show your tickets from the previous FY, <br>The current FY that is set in the tool will not be change.</span>
    </v-tooltip>


    <v-divider
            class="ticket-divider mb-4 mt-4 mx-auto title blue-darken-3"
    ></v-divider>
    <v-row>
      <v-col cols="2">
          <h1 class="title">My Tickets</h1>
      </v-col>
      <v-col cols="10">
        <!--Period Filter-->
        <v-select
            v-if="$store.state.filterValue.toLowerCase() == 'completed' || $store.state.filterValue.toLowerCase() == 'closed' || $store.state.filterValue.toLowerCase() == 'done'"
            :items="$store.state.periods[0]"
            item-value="id"
            label="Period"
            item-text="label"
            required
            outlined
            :menu-props="{ maxHeight: '400',maxWidth:'400'}"
            multiple
            v-model="filter_period"
            style="height: 50px !important;max-width:300px;float:right;"
            no-data-text="No data to display"
            @change="filterCompletedTickets(filter_period)"
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
        <!---->
        <!-- Filters--> 
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                v-bind="attrs"
                v-on="on"
                style="float:right; height:55px!important;margin-right:5px"
              >
                <v-icon style="background-color:white;border-radius:50px;margin-right:5px;padding:3px" color="primary">mdi-filter</v-icon> Filter:{{$store.state.filterValue}}
              </v-btn>
            </template>
            <v-list>
              <v-list-item-group
                active-class="filter_options_active"
                color="indigo"
                class="primary--text text--darken-3"
                v-model="$store.state.filterValue"
              >
              <v-list-item
                v-for="(filter, index) in getStatusesByTeam"
                :key="index"
                :value="filter.status"
                 @click="filterTickets(filter.status)"
              >
                <v-list-item-title>{{ filter.status }}</v-list-item-title>
              </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-menu>
        <!---->        

        <DynamicExportReport
          :toExport="this.$store.state.userTickets[0]"
          :disabled="disabledExportButton"
          style="float:right;margin-right:2px"
        />
        <router-link to="/import"><v-btn :disabled = disable_add_button color="#FFA700" style="height:54px;float:right;margin-right:5px;color:white"><v-icon style="background-color:white;border-radius:50px;margin-right:5px" color="#FFA700">mdi-upload</v-icon>Import Data</v-btn></router-link>
      </v-col>
    </v-row>
    <v-row v-show="isCardView">
      <v-col style="padding-left:50%"  v-show="$store.state.ticket_loader">
        <!--Insert Loader-->
      </v-col>
      <v-col style="padding-left:45%;padding-top:50px" v-show="$store.state.no_ticket_data">
          No data to display
      </v-col>

      <v-col cols="12" md="6" v-for="(ticket,index) in this.$store.state.userTickets[0]" :key="ticket.id"> 
        <div>
        <v-card elevation="15" class="pa-4 ticket_card" v-if="index < limit_by" >
          <v-card-title class="title mb-3" v-bind:style="statusColor(ticket.ticket_Status.status)">
            {{ ticket.title}}
            <v-row align="center" justify="end" >
              <v-btn
                    fab
                    style="background-color:white"
                    small
                    class="mr-2"
                    @click="getTicketToUpdate(ticket.id)"
                  >
                    <v-icon color="primary"> mdi-clipboard-edit </v-icon>
              </v-btn>
              <v-btn
                    fab
                    color="red darken-3"
                    small
                    @click="getTicketToDelete(ticket.id,ticket.ticket_Status.status)"
                  >
                    <v-icon color="white"> mdi-delete </v-icon>
              </v-btn>
            </v-row>
  
          </v-card-title>
          <v-divider
            class="ticket-divider mb-2 mx-auto title blue-darken-3"
          ></v-divider>
          <!--Ticket Info to Display if On-Going-->
          <v-card-subtitle v-show="ticket.period == null" class="ticket-description mb-4 text_color--text">
            <b>Request Category : </b> {{ ticket.main_Category.label}} <br>
            <b>Request Type :</b> <span v-if="ticket.sub1_Category != null">{{ ticket.sub1_Category.label }} </span><br>
            <b>Classification : </b> {{ ticket.classification.label}} <br>
            <b>Due Date :</b> {{formatDisplayDate(ticket.actual_due_date) }} <br>
            <b>Service Level Agreement :</b> {{ticket.service_Level_Agreement}}(hrs)<br>
          </v-card-subtitle>
          <!------->
          
          <!--Ticket Info to Display if Completed-->
          <v-card-subtitle v-if="ticket.period != null" class="ticket-description mb-4 text_color--text">
            <b>Request Category : </b> {{ ticket.main_Category.label}} <br>
            <b>Classification : </b> {{ ticket.classification.label}} <br>
            <b>Period :</b> {{ticket.period.label}}<br>
            <b>Service Rating :</b> {{ticket.service_rating.toFixed(2)}}<br>
            <b>Service Level Agreement :</b> {{ticket.service_Level_Agreement}}(hrs)<br>
            <b>Actual Processing Time :</b> {{ticket.total_hrs}}<br>
            <span v-if="$store.state.showTimer"><b>Actual Time Spent :</b> {{ticket.running_time}}</span>
          </v-card-subtitle>
          <!------->

          <v-card-actions v-bind:style="statusColor(ticket.ticket_Status.status)">
            <v-list-item class="grow">
              <v-icon v-bind:style="statusColor(ticket.ticket_Status.status)" class="title mr-2"
                >mdi-progress-clock</v-icon>

              <v-list-item-content v-bind:style="statusColor(ticket.ticket_Status.status)">
                <v-list-item-title >{{
                  ticket.ticket_Status.status
                }}</v-list-item-title>
              </v-list-item-content>

            <Stopwatch 
               v-if="ifTicketnInProgress && $store.state.showTimer"
              :ticket_status="ticket.ticket_Status.status"
              :running_time="ticket.running_time"
              :ticket="ticket"
            />
            </v-list-item>
          </v-card-actions>
        </v-card>     
        </div>
      </v-col>
      <div v-if=" $store.state.totalTicketCount > default_limit" style="width:100%;text-align:center"><v-btn @click="ShowMore(default_limit, $store.state.totalTicketCount)">{{ limit_by >= $store.state.totalTicketCount?'Hide more': 'Show more'}}</v-btn></div>
    </v-row>



    <v-row v-show="isTableView">
      <v-col cols="12" md="12">
        <TicketsTable
          :Tickets="$store.state.userTickets[0]"
          :filterValue="$store.state.filterValue"
          :filter_period="filter_period"
          :update_ticket="getTicketToUpdate"
          :delete_ticket="getTicketToDelete"
          :show_delete="true"
         />
      </v-col>
    </v-row>

       <!--////////////////////////Non-Functional//////////////////////-->
    <v-divider class="mt-10"></v-divider>
    <v-row class="mx-auto mt-12 mb-6">
      <v-col cols="4">
          <h1 class="title">My Non-Functional Activities</h1>
      </v-col>
      <v-col cols="8">
        <v-select
              :items="$store.state.periods[0]"
              item-value="id"
              label="Period"
              item-text="label"
              required
              outlined
              v-if="nf_filterValue == false"
              :menu-props="{ maxHeight: '400',maxWidth:'400'}"
              multiple
              v-model="nf_filter_period"
              style="height: 50px !important;max-width:300px;float:right;"
              no-data-text="No data to display"
              @change="filterNonFunctionalActivitiesByperiod(nf_filter_period)"
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
      <!-- Filters--> 
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                v-bind="attrs"
                v-on="on"
                style="float:right; height:55px!important;margin-right:5px"
              >
                <v-icon style="background-color:white;border-radius:50px;margin-right:5px;padding:3px" color="primary">mdi-filter</v-icon> Filter: <span v-if="nf_filterValue==true">On-Going</span>
                <span v-if="nf_filterValue==false">Done</span>
              </v-btn>
            </template>
            <v-list>
              <v-list-item-group
                active-class="filter_options_active"
                color="indigo"
                class="primary--text text--darken-3"
                v-model="nf_filterValue"
              >
              <v-list-item
                v-for="(filter, index) in non_functional_status"
                :key="index"
                :value="filter.value"
                 @click="filterNonFunctionalActivitiesByStatus(filter.value)"
              >
                <v-list-item-title>{{ filter.label }}</v-list-item-title>
              </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-menu>
        <!---->   
      </v-col>
    </v-row>
      <v-row v-if="isCardView">
      <v-col style="padding-left:50%" v-show="$store.state.nf_loader">
        <!--Insert Loader-->
      </v-col>
      <v-col style="padding-left:45%" v-show="$store.state.no_nf_data">
          No data to display
      </v-col>
      <v-col cols="4" md="4" v-for="nf in $store.state.non_functional_tickets[0]" :key="nf.id">
        <v-card  elevation="15" class="pa-4 ticket_card">
          <v-card-title  class="title mb-3" v-bind:style="nf.status == true? 'background-color:rgb(255, 167, 0);color:white!important' : 'background-color:#4caf50;color:white!important'">
            {{ nf.title }}

            <v-row align="center" justify="end">
              <v-btn
                    fab
                    color="white"
                    small
                    class="mr-2"
                    v-if="nf.status == true"
                    @click="getNF_Activity(nf.id)"
                  >
                    <v-icon color="rgb(255, 167, 0)"> mdi-clipboard-edit </v-icon>
                  </v-btn>
                  <v-btn
                    fab
                    color="red darken-3"
                    small
                    v-if="nf.status == true"
                    @click="getNonFunctionalToDelete(nf.id)"
                  >
                    <v-icon color="white"> mdi-delete </v-icon>
                  </v-btn>
            </v-row>
          </v-card-title>
          <v-divider
            class="ticket-divider mb-2 mx-auto title green-darken-3"
          ></v-divider>
          <v-card-subtitle
            class="ticket-description mb-4 text_color--text"
          >
            <b>Description:</b> {{ nf.description }} <br>
            <b>Classification:</b> {{ nf.classification.title }} <br>
            <b>Time Spent:</b> {{formatTotalHours(nf.total_hrs) }} (HH:mm) <br>
            <span v-if="nf.period_ID != null"><b>Period:</b> {{nf.period.label}}</span>
          </v-card-subtitle>

          <v-card-actions v-bind:style="nf.status == true? 'background-color:rgb(255, 167, 0);color:white!important' : 'background-color:#4caf50;color:white!important'">
            <v-list-item class="grow">
              <v-icon style="color:white" class="title  mr-2"
                >mdi-progress-clock</v-icon
              >

              <v-list-item-content style="color:white">
                <v-list-item-title  v-if="nf.status == true">
                  On-Going
                </v-list-item-title>
                <v-list-item-title v-if="nf.status == false">
                  Done
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="isTableView">
      <v-col cols="12" md="12">
        <NonFunctionalTable
          :nf_activities="$store.state.non_functional_tickets[0]"
          :filterValue="$store.state.filterValue"
          :update_nf="getNF_Activity"
          :delete_nf="getNonFunctionalToDelete"
         />
      </v-col>
    </v-row>  
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
                            v-on:change="IsCompleted(ticket_Info.ticket_Status_ID)"
                            v-if="toUpdate"
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
                              v-if="isCompleted"
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
                          <v-row v-if="this.isCompleted">
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
                    <v-btn v-if="toSave" color="blue darken-1" text @click="addTicket">
                      Save
                    </v-btn>
                    <v-btn v-if="toUpdate" color="blue darken-1" text @click="updateTicket">
                      Update
                    </v-btn>
                  </v-card-actions>
                </v-card>
        </v-dialog>

        <!--Ticket Delete Dialog-->
        <v-dialog persistent v-model="delete_dialog" width="480">
              <v-card >
              <v-card-title class="headline justify-center" style="color:white;background-color:#004b8d">
                  Delete
              </v-card-title>
              <v-card-text>
                <div style="font-size:15px; padding-left:80px" class="mb-5 mt-5 text_color--text ">Are you sure you want to delete this one?</div>
                <div class="justify-center" style="padding-left:150px">
                  <v-btn type="submit" @click="deleteTicket"  style="color:white;" color="#004b8d">YES</v-btn>
                  <v-btn text @click="delete_dialog=false"  style="color:#004b8d;">NO</v-btn>
                </div>
              </v-card-text>
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

        <!--Non Functional Activity Form-->
        <v-dialog v-model="nf_dialog" persistent max-width="800px">
                <v-card>
                  <v-card-title>
                    <span class="headline">Non-Functional Activity</span>
                  </v-card-title>
                  <v-card-text v-if="isLoaded">
                    <v-container>
                      <v-row>
                        <v-row>
                          <v-col
                            cols="11"
                            sm="6"
                          >
                            <v-menu
                              ref="nf_menu2"
                              v-model="nf_menu2"
                              :close-on-content-click="false"
                              :return-value.sync="nf_start_date"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  label="Start Date"
                                  :value="formatNFStartDate"
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
                                v-model="nf_start_date"
                                no-title
                                scrollable
                              >
                                <v-spacer></v-spacer>
                                <v-btn text color="primary" @click="nf_menu2 = false">
                                  Cancel
                                </v-btn>
                                <v-btn
                                  text
                                  color="primary"
                                  @click="$refs.nf_menu2.save(nf_start_date)"
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
                                <input v-model="nf_start_date_time" class="time-text" type="time" id="meeting-time" name="meeting-time"  min="00:00" max="23:59">
                            </v-col>
                        </v-row>
                        <v-col cols="12" sm="12">
                          <v-select
                            v-model="non_functional.non_functional_classification_ID"
                            :items="$store.state.non_functional_classifications[0]"
                            item-value="id"
                            label="Activity"
                            item-text="title"
                            style="height: 50px !important"
                          >
                          <v-icon slot="prepend" class="required">
                              *
                           </v-icon>
                          </v-select>
                        </v-col>
                        <v-col cols="12" md="12">
                        <v-text-field
                              v-model="non_functional.title"
                              label="Title"
                         >
                         <v-icon slot="prepend" class="required">
                             *
                          </v-icon>
                         </v-text-field>
                        </v-col>
                        <v-col cols="12" md="12">
                          <v-textarea
                            outlined
                            name="input-7-4"
                            label="Description"
                            v-model="non_functional.description"
                          ></v-textarea>
                        </v-col>
                        <v-row>

                        </v-row >
                        <v-col cols="12" sm="12" v-if="nf_toUpdate == true">
                          <v-select
                            v-model="non_functional.status"
                            :items="non_functional_status"
                            item-value="value"
                            label="Status"
                            item-text="label"
                            style="height: 50px !important"
                          ></v-select>
                        </v-col>
                      <!-- Date Completed -->
                        <v-col cols="12" sm="12" v-if="non_functional.status == false">
                          <v-row>
                              <v-col
                                cols="11"
                                sm="6"
                              >
                                <v-menu
                                  ref="nf_menu3"
                                  v-model="nf_menu3"
                                  :close-on-content-click="false"
                                  :return-value.sync="nf_date_completed"
                                  transition="scale-transition"
                                  offset-y
                                  min-width="auto"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                      label="Date Completed"
                                      :value="formatNFDateCompleted"
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
                                    v-model="nf_date_completed"
                                    no-title
                                    scrollable
                                  >
                                    <v-spacer></v-spacer>
                                    <v-btn text color="primary" @click="nf_menu3 = false">
                                      Cancel
                                    </v-btn>
                                    <v-btn
                                      text
                                      color="primary"
                                      @click="$refs.nf_menu3.save(nf_date_completed)"
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
                                   <input v-model="nf_date_completed_time" class="time-text" type="time" id="meeting-time" name="meeting-time"  min="00:00" max="23:59">
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

                            v-for="errors in non_functional_formErrors" :key="errors"
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
                    <v-btn color="blue darken-1" text @click="close_nf()">
                      Close
                    </v-btn>
                    <v-btn v-if="nf_toSave" color="blue darken-1" text @click="addNF_Activity">
                      Save
                    </v-btn>
                    <v-btn v-if="nf_toUpdate" color="blue darken-1" text @click="updateNF_Activity">
                      Update
                    </v-btn>
                  </v-card-actions>
                </v-card>
        </v-dialog>

        <!--Saving and Deleting NFA loader--->     
        <v-dialog v-model="dialog_saving_nfa" hide-overlay persistent width="300">
                      <v-card
                        color="primary"
                        dark
                      >
                        <v-card-text style="text-align:center;padding-top:5px">
                          {{dialog_saving_nfa_text}}
                          <v-progress-linear
                            indeterminate
                            color="white"
                            class="mb-0 mt-2"
                          ></v-progress-linear>
                        </v-card-text>
                      </v-card>
        </v-dialog>

        <!--Non-Funtional Delete Dialog-->
        <v-dialog persistent v-model="delete_dialog_nf" width="480">
              <v-card >
              <v-card-title class="headline" style="color:white;background-color:#004b8d">
                  Delete
              </v-card-title>
              <v-card-text>
                <div style="font-size:15px" class="mb-5 mt-5 text_color--text">Are you sure you want to delete this one?</div>
                <v-btn type="submit" @click="deleteNonFunctional"  style="color:white;" color="#004b8d">YES</v-btn>
                <v-btn text @click="delete_dialog_nf=false"  style="color:#004b8d;">NO</v-btn>
              </v-card-text>
              </v-card>
        </v-dialog>
  </div>
</template>

<!--====================================-->

<script>
import SparrowService from "@/services/SparrowService.js";
import Computations from "@/services/Computations.js";
import TicketsTable from "@/components/Tickets/TicketsTable";
import NonFunctionalTable from "@/components/Tickets/NonFunctionalTable";
import TicketsCount from "@/components/Tickets/TicketsCount";
import DynamicExportReport from  "@/components/Export/DynamicExportReport"
import Stopwatch from "@/components/Tickets/Stopwatch";
import VueTimepicker from 'vue2-timepicker/src/vue-timepicker.vue'
import moment from 'moment'


export default {
  data() {
    return {  
      default_limit: 5,
      limit_by: 5,
      menu: false,
      show:false,
      nf_menu: false,
      selected:"",
      nf_menu2:false,
      menu1:false,
      menu2: false,
      menu3:false,
      nf_menu3:false,
      dialog: false,
      nf_dialog:false,
      dialog2: false,
      nf_dialog2: false,
      dialog3:false,
      nf_dialog3:false,
      tickets:[],

      classifications:[],
      complexities:[],
      main_categories:[],
      sub1_categories:[],

      ticket_Info: this.createTicket_Info(),
      non_functional:this.createNon_Functional_Activity(),

      actual_due_date:null,
      actual_due_date_time: "00:00",
      actual_due_date_time_modal: false,


      nf_start_date:null,
      nf_start_date_time: "00:00",
      nf_start_date_time_modal: false,
      dialog_saving_nfa:false,
      dialog_saving_nfa_text:"",
      nf_filter_period:[],
      nf_filterValue:true,

      start_date:null,
      start_date_time: "00:00",
      start_date_time_modal: false,

      nf_date_completed:null,
      nf_date_completed_time:"00:00",
      nf_date_completed_time_modal:false,

      date_completed:null,
      date_completed_time:"00:00",
      date_completed_time_modal:false,

      toUpdate:false,
      toSave:true,

      nf_toUpdate:false,
      nf_toSave:true,

      isCompleted:false,

      ticketID:0,
      nf_ID:0,

      inderOfTicket:0,
      isStop:false,
      isStart:true,


      isCardView:true,
      isTableView:false,

      activeTickets:0,
      completeTickets:0,
      overdueTickets:0,


      non_funtional_activities:[],
      non_functional_status:[{id:1,label:"On-Going", value:true},{id:2,label:"Done", value:false}],
      isLoaded:true,
      loader_ticket:true,
      loader_nf:true,
      no_data_ticket:false,
      no_data_nf:false,
      non_functional_to_delete:null,
      delete_dialog_nf:false,

      sla:"",
      actual_time_spent:"",

      formErrors:[],
      non_functional_formErrors:[],
      update_alert:false,
      filterValue:"",
      filter_period:[],
      filter_fy:"",
      disabledExportButton:true,

      ticketToDelete:[],
      delete_dialog:false,
      dialog_saving:false,
      dialog_saving_text:"",
      status:"",
      ifTicketnInProgress:true,
      ticketLength:0,
      disable_add_button:false,

      number_of_leave:0
    };
  },
  components:{
    TicketsTable,
    TicketsCount,
    NonFunctionalTable,
    Stopwatch,
    DynamicExportReport
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    nf_dialog(val) {
      val || this.close_nf();
    }
  },
  created() {   
;
    this.filter_fy = this.$store.state.activeFY.label 
    setTimeout(() => {
      this.show =true
    }, 3000);
    setTimeout(() => {    
      if(this.$store.state.userTickets[0] != null){
          this.ticketLength = this.$store.state.userTickets[0].length
          for(let i = 0;i<this.$store.state.userTickets[0].length; i++){
            this.$store.state.userTickets[0][i].actual_due_date = this.formatDisplayDate(this.$store.state.userTickets[0][i].actual_due_date)
            this.$store.state.userTickets[0][i].start_Date = this.formatDisplayDate(this.$store.state.userTickets[0][i].start_Date)            
        }
      }
    }, 1000);
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
     formatNFStartDate(){
      return this.nf_start_date
      ? moment(this.nf_start_date).format('YYYY-MM-DD')
      : "";
    },

    formatNFStartDate_TimeSpent(){
      return this.nf_start_date
      ? moment(this.nf_start_date).format('DD/MM/YYYY')
      : "";
    },
    formatDateCompleted_TimeSpent(){
      return this.nf_date_completed
      ? moment(this.nf_date_completed).format('DD/MM/YYYY')
      : "";
    },

    formatNFDateCompleted(){
      return this.nf_date_completed
      ? moment(this.nf_date_completed).format('YYYY-MM-DD')
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
    getSub2Categories(){
      return [] // Temporary
    },
  },
  mounted(){
    this.filter_fy = this.$store.state.activeFY.label 
  },

  methods: {
    handler() {
      window.alert("Sure ka na?")
    },
    ShowMore(default_limit, filters_length) {
      if(this.limit_by === filters_length){
        this.limit_by = default_limit
      }else if(this.limit_by > filters_length){
        this.limit_by = default_limit
      }else if(this.limit_by < filters_length){
         this.limit_by += 5
      }
    },
    statusColor(status){
      var backgroundColor = ""
      var color =""
      if(status.toLowerCase() === "in-progress" || status.toLowerCase() === "in progress" || status.toLowerCase() === "started" || status.toLowerCase() === "current"){
         color = 'white'
         backgroundColor = '#004b8d'
         this.ifTicketnInProgress = true
      }else if(status.toLowerCase() == "completed" || status.toLowerCase() == "closed" || status.toLowerCase() == "done"){
         color = 'white'
         backgroundColor = '#4caf50'
         this.ifTicketnInProgress = false
      }else{
        color = 'white'
        backgroundColor ='#FFA700'
        this.ifTicketnInProgress = false
      }
      return {
        color:color,
        background:backgroundColor
        };
    },
    IsCardView(){
      this.isCardView = true;
      this.isTableView = false
    },
    IsTableView(){
      this.isCardView = false;
      this.isTableView = true
    },
    IsCompleted(id) {
      if(this.$store.state.completedID == id){
        this.isCompleted = true
      }else{
        this.isCompleted = false
      }
    },
    filterTickets(status){
      if(status.toLowerCase() == "in-progress" ||
         status.toLowerCase() == "in progress" || 
         status.toLowerCase() == "started" || 
         status.toLowerCase() == "current")
      {
        this.disabledExportButton = true
      }
      this.filter_period = []
      this.$store.dispatch("filterTickets",status)
    },
    filterCompletedTickets(periods){
      this.$store.dispatch("filterCompletedTickets",periods).then(()=>{
        if(this.$store.state.userTickets[0].length != 0){
          this.disabledExportButton = false
        }else{
          this.disabledExportButton = true
        }
      })
    },
    showTicketByFY(fy_label){
      if(fy_label !== this.$store.state.activeFY.label){
        this.disable_add_button = true
      }else{
        this.disable_add_button = false
      }
      this.dialog_saving = true
      this.dialog_saving_text = "Getting your data, Please wait..."
      let get_ticket_promise = []
      get_ticket_promise.push(
        this.$store.dispatch({type:'fetchUserTickets', UserId:this.$store.state.userID,FY:fy_label}),
        this.$store.dispatch({type:'fetchNonFunctionalActivities', id:this.$store.state.userID,fy:fy_label})
      )
      Promise.all(get_ticket_promise).then(()=>{
        this.$store.state.filterValue = this.$store.state.inProgressStatus
        this.filter_period = []
        this.nf_filterValue = true
        this.nf_filter_period = []

        setTimeout(() => {
        this.dialog_saving = false
        }, 1500);
      })
      

    },

    // TICKET METHODS
    addTicket() {  
       var tickets = []
       var add_promise = []
        if(this.validateTicketInfoData() == true){
            let initial_sla = null 
            this.ticket_Info.fY_ID = this.$store.state.activeFY.id
            this.ticket_Info.ticket_Owner_ID = this.$store.state.userID
            this.ticket_Info.ticket_Status_ID = this.$store.state.inProgressID
            this.ticket_Info.running_time = "00:00",
            this.ticket_Info.start_Date = this.formatStartDate +"T"+ this.start_date_time +":00"
            if(this.ticket_Info.classification_ID == "2"){
              //Project
              this.ticket_Info.actual_due_date = this.formatActualDueDate +"T"+ this.actual_due_date_time +":00"
              this.ticket_Info.service_Level_Agreement = Computations.ProjectSLAComputation(this.formatStartDate +"T"+ this.start_date_time +":00",this.formatActualDueDate +"T"+ this.actual_due_date_time +":00")
            }else{
              //Transactional
              //Loop to get the SLA of the ticket
              let number_of_days_to_work = 0
              for(let i =0 ; i <this.$store.state.complexitiesByTeam[0].length; i++){
                
                  if(this.$store.state.complexitiesByTeam[0][i].id == this.ticket_Info.complexity_ID){
                      this.ticket_Info.service_Level_Agreement = this.$store.state.complexitiesByTeam[0][i].no_of_hrs
                      if(this.ticket_Info.service_Level_Agreement >= 9){
                        number_of_days_to_work = this.ticket_Info.service_Level_Agreement/9
                        let hours_to_add =  this.ticket_Info.service_Level_Agreement%9
                        initial_sla = moment(this.ticket_Info.start_Date).add(number_of_days_to_work, 'days').format('YYYY-MM-DDTHH:mm:ss');

                        if(hours_to_add != 0){
                          initial_sla = moment(initial_sla).add(hours_to_add, 'hours').format('YYYY-MM-DDTHH:mm:ss');
                        }

                      }else if(this.ticket_Info.service_Level_Agreement < 9){
                        var time = this.start_date_time
                        var hoursMinutes = time.split(/[.:]/);
                        var hours = parseInt(hoursMinutes[0], 10);
                        var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
                        var converted_time = hours + minutes / 60;         
                        let time_remaining_in_shift = this.$store.state.user_shift.end_Time - converted_time.toFixed(2)
                        if (time_remaining_in_shift < this.ticket_Info.service_Level_Agreement){
                          initial_sla = moment(this.ticket_Info.start_Date).add(15 + this.ticket_Info.service_Level_Agreement, 'hours').format('YYYY-MM-DDTHH:mm:ss');
                        }else{
                          initial_sla = moment(this.ticket_Info.start_Date).add(this.ticket_Info.service_Level_Agreement, 'hours').format('YYYY-MM-DDTHH:mm:ss');
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
                       this.ticket_Info.actual_due_date = initial_sla  
                  }
              }
            }
            this.$store
              .dispatch("addTicket", this.ticket_Info)
              .then(() => {   
                this.dialog_saving = true
                this.dialog_saving_text = "Saving your ticket"
                setTimeout(() => {
                  add_promise.push(
                    SparrowService.getTicketsByUser(this.$store.state.userID,this.$store.state.activeFY.label)
                      .then(response => {
                        this.dialog_saving = false
                        this.$store.state.no_ticket_data = false
                        this.$store.state.allTickets = response.data
                        for(let i = 0 ; i < response.data.length; i++){
                            if(response.data[i].ticket_Status.status.toLowerCase() == this.$store.state.inProgressStatus.toLowerCase())
                            {
                              tickets.push(response.data[i])
                            }
                              this.$store.state.ticket_loader = false                     
                              this.$store.state.runningTickets.push(
                                      {"id":response.data[i].id,
                                      "time":response.data[i].running_time + ":00",
                                      "isStarted":true,
                                      "isStopped":false,
                                      "counter":0,
                                      "runClock":null,
                                      "save_Ticket":null,
                                      "hour":"00",
                                      "minute":"00",
                              })
                          }  
                          this.$store.state.activeTickets = tickets
                          this.$store.state.userTickets[0] = tickets                    
                          this.$store.state.totalTicketCount = tickets.length
                          this.$store.state.activeTickectsCount = tickets.length
                      })
                  )
                },2000);
                Promise.all(add_promise).then(()=>{                  
                  this.start_Date = ""
                  this.start_date_time = "00:00"
                  this.actual_due_date = ""
                  this.actual_due_date_time = "00:00"
                  this.date_completed = ""
                  this.date_completed_time = "00:00"
                  this.ticket_Info = this.createTicket_Info();
                  this.dialog = false;
                  this.$store.state.filterValue = this.$store.state.inProgressStatus
                  this.disabledExportButton = true
                })
                
              })
              .catch((err) => {
                console.log("error posting", err);
              });
        }
    },
    getTicketToUpdate(id){
        this.dialog = true;
        this.toUpdate = true;
        this.toSave = false;
        this.isLoaded=false;
        let ticket_promise=[];
        ticket_promise.push(
            SparrowService.getTicket(id)
                    .then(response => {
                      this.IsCompleted(response.data.ticket_Status_ID)
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
    updateRequest(ticket_param){
      var activetickets = []
      this.$store.state.activeTickectsCount = 0
      this.$store.state.completedTickets = 0
      this.$store.state.activeTickets = []
        SparrowService.putTicket(this.ticketID,ticket_param).then(()=>{
              this.dialog_saving = true
              this.dialog_saving_text = "Updating your ticket"
              setTimeout(() => {
                  SparrowService.getTicketsByUser(this.$store.state.userID,this.$store.state.activeFY.label)
                        .then(response => {
                          this.$store.state.allTickets = response.data
                          for(let i = 0;i < response.data.length; i++){
                            response.data[i].actual_due_date = this.formatDisplayDate(response.data[i].actual_due_date)
                            response.data[i].start_Date = this.formatDisplayDate(response.data[i].start_Date)
                            if(this.$store.state.filterValue != ""){
                               if(response.data[i].ticket_Status.status.toLowerCase() == this.$store.state.filterValue.toLowerCase()){
                                 activetickets.push(response.data[i])
                               }
                               if(response.data[i].ticket_Status.status.toLowerCase() == this.$store.state.inProgressStatus.toLowerCase())
                                {
                                  this.$store.state.activeTickectsCount += 1
                                  this.$store.state.activeTickets.push(response.data[i])
                                }
                              else if(
                                 response.data[i].ticket_Status.status.toLowerCase() == this.$store.state.completedStatus.toLowerCase())
                                {
                                  this.$store.state.completedTickets += 1
                                }
                            }
                                              
                          }
                          setTimeout(() => {         
                              this.dialog_saving = false             
                              this.$store.state.userTickets[0] = activetickets
                              if(this.$store.state.filterValue.toLowerCase() == this.$store.state.completedStatus.toLowerCase())
                              {
                                this.$store.dispatch("filterCompletedTickets",this.filter_period)
                              }                          
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
              },1500);
        })

    },
    updateTicket(){
      if(this.validateTicketInfoData() == true){
          let update_promise=[]
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
            ticket_Owner_ID: this.$store.state.userID,
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
                        var time = this.start_date_time
                        var hoursMinutes = time.split(/[.:]/);
                        var hours = parseInt(hoursMinutes[0], 10);
                        var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
                        var converted_time = hours + minutes / 60;         
                        let time_remaining_in_shift = this.$store.state.user_shift.end_Time - converted_time.toFixed(2)
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
          if(this.isCompleted == true){
            if(localStorage.getItem(this.ticketID)){
              localStorage.removeItem(this.ticketID)
            }
            let date_completion = this.formatDateCompleted +"T"+ this.date_completed_time
            ticket_param.period_ID =  SparrowService.pickPeriod(this.$store.state.periods[0], date_completion)
            setTimeout(() => {
                if(this.ticket_Info.classification_ID == 2){
                //Project              
                  let SLA = 0

                  if(this.ticket_Info.adjusted_Service_Level_Agreement != null && this.ticket_Info.adjusted_Service_Level_Agreement > ticket_param.service_Level_Agreement)
                    {
                      SLA = this.ticket_Info.adjusted_Service_Level_Agreement 
                    }else{
                      SLA = ticket_param.service_Level_Agreement
                    }
                  
                  this.actual_time_spent = Computations.TimeSpentCalculation(this.formatStartDate +"T"+ this.start_date_time,this.formatDateCompleted +"T"+ this.date_completed_time)
                  ticket_param.total_hrs = parseFloat(this.actual_time_spent).toFixed(2)
                  ticket_param.date_Completion = this.formatDateCompleted +"T"+ this.date_completed_time              
                  ticket_param.service_rating = Computations.serviceRatingComputation(parseFloat(this.actual_time_spent).toFixed(2),SLA).toFixed(2)
                  this.updateRequest(ticket_param)
              }else if(this.ticket_Info.classification_ID == 1){
                // Transactional            
                  let SLA = 0
                  if(this.ticket_Info.adjusted_Service_Level_Agreement != null)
                    {SLA = this.ticket_Info.adjusted_Service_Level_Agreement 
                  }else{
                    SLA = ticket_param.service_Level_Agreement
                  }

                  this.actual_time_spent = Computations.TimeSpentCalculation(this.formatStartDate +"T"+ this.start_date_time,this.formatDateCompleted +"T"+ this.date_completed_time)
                  ticket_param.total_hrs = parseFloat(this.actual_time_spent).toFixed(2)
                  ticket_param.date_Completion = this.formatDateCompleted +"T"+ this.date_completed_time +":00"
                  ticket_param.service_rating = Computations.serviceRatingComputation(parseFloat(this.actual_time_spent).toFixed(2),SLA).toFixed(2)
                  this.updateRequest(ticket_param)
              }  
            }, 3000);
                   

          }else if(this.isCompleted == false){
            this.updateRequest(ticket_param)
          }
      }
    },
    getTicketToDelete(id,status){
      this.ticketToDelete[0] = id
      this.ticketToDelete[1] = status.toLowerCase()
      this.delete_dialog = true
    },
    deleteTicket(){
      var tickets = []
      this.delete_dialog = false
      SparrowService.deleteTicket(this.ticketToDelete[0]).then(()=>{
        if(localStorage.getItem(this.ticketToDelete[0])){
            localStorage.removeItem(this.ticketToDelete[0])
        }
        
        this.dialog_saving = true
        this.dialog_saving_text = "Deleting your ticket"
        setTimeout(() => {
            SparrowService.getTicketsByUser(this.$store.state.userID,this.$store.state.activeFY.label)
                    .then(response => {          
                      if(this.ticketToDelete[1] == this.$store.state.inProgressStatus.toLowerCase())
                        {     
                          for(let i = 0 ; i < response.data.length; i++){
                            if(response.data[i].ticket_Status.status.toLowerCase() == this.$store.state.inProgressStatus.toLowerCase())
                              {  
                                tickets.push(response.data[i])                              
                              }
                            }  
                            this.$store.state.userTickets[0] = tickets
                            this.$store.state.activeTickectsCount = tickets.length  
                            this.$store.state.allTickets = response.data
                            this.dialog_saving = false
                            this.$store.state.filterValue = this.ticketToDelete[1]
                            this.filter_period = []
                            
                            this.disabledExportButton = true
                        }else if(this.ticketToDelete[1] == this.$store.state.completedStatus.toLowerCase())
                        {
                          for(let i = 0 ; i < response.data.length; i++){
                            if(response.data[i].ticket_Status.status.toLowerCase()  == this.$store.state.completedStatus.toLowerCase())
                              {  
                                tickets.push(response.data[i])                              
                              }
                            }  
                            this.$store.state.userTickets[0] = tickets
                            this.$store.state.completedTickets = tickets.length
                            this.$store.state.allTickets = response.data
                            this.$store.dispatch("filterCompletedTickets",this.filter_period)
                            this.dialog_saving = false
                            this.disabledExportButton = true
                        }   
                      })
                      
        }, 1500);
      })
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
    formatDisplayDate(value){
       return moment(value).format("MMMM DD YYYY, h:mm:ss a")
    },
    formatTotalHours(time){
      return moment.utc(moment.duration(time, 'h').asMilliseconds()).format('HH:mm')
    },
    close() {
      this.toUpdate = false;
      this.toSave = true;
      this.isCompleted = false;
      this.formErrors = []
      this.start_Date = ""
      this.start_date_time = "00:00"
      this.actual_due_date = ""
      this.actual_due_date_time = "00:00"
      this.date_completed = ""
      this.date_completed_time = "00:00"
      this.ticket_Info = this.createTicket_Info();
      this.dialog = false;
      this.update_alert = false
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
                   if(moment(this.formatDateCompleted +"T"+ this.date_completed_time).format('YYYY-MM-DDTHH:mm:ss') > moment(this.formatStartDate +"T"+ this.start_date_time).format('YYYY-MM-DDTHH:mm:ss') ){
                        return true
                    }
                }
              }else{
                return true;
              }
            }
          }else if(this.ticket_Info.classification_ID == "2"){
            if(this.formatActualDueDate && this.actual_due_date_time){
               if(this.isCompleted){
                if(this.ticket_Info.quality_Rating_ID && this.formatDateCompleted && this.date_completed_time){
                  if(moment(this.formatDateCompleted +"T"+ this.date_completed_time).format('YYYY-MM-DDTHH:mm:ss') > moment(this.formatStartDate +"T"+ this.start_date_time).format('YYYY-MM-DDTHH:mm:ss') ){
                        return true
                    }
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
        if(moment(this.formatDateCompleted +"T"+ this.date_completed_time).format('YYYY-MM-DDTHH:mm:ss') < moment(this.formatStartDate +"T"+ this.start_date_time).format('YYYY-MM-DDTHH:mm:ss') ){
            this.formErrors.push("Date completion is less than date it was started.")
        }

        if(this.isCompleted && !this.date_completed_time){
          this.formErrors.push("Completed Time is required.")
        } 
      }

    },

    //// NON FUNCTIONAL METHODS
    validateNonFunctionalData(){
      this.non_functional_formErrors = []
      if(this.non_functional.title && this.formatNFStartDate && this.nf_start_date_time && this.non_functional.non_functional_classification_ID){
          if(this.non_functional.status == false){
            if(this.formatNFDateCompleted && this.nf_date_completed_time){
              return true
            }
          }else{
              return true
          }
      }

      if(!this.non_functional.title){
        this.non_functional_formErrors.push("Title is required")
      }
      if(!this.formatNFStartDate){
        this.non_functional_formErrors.push("Date Started is required")
      }
      if(!this.nf_start_date_time){
        this.non_functional_formErrors.push("Start Time is required")
      }
      if(!this.non_functional.non_functional_classification_ID){
        this.non_functional_formErrors.push("Activity is required")
      }

      if(this.non_functional.status == false){
        if(!this.formatNFDateCompleted){
          this.non_functional_formErrors.push("Date Completed is required")
        }
        if(!this.nf_date_completed_time){
            this.non_functional_formErrors.push("Time Completed is required")
        }
      }
    },
    addNF_Activity() {
      let activeNonFunctional = []
      let addNF_Activity_promise = []
      if(this.validateNonFunctionalData() == true){
      let start_date = this.formatNFStartDate +"T"+ this.nf_start_date_time +":00"
      this.non_functional.status = true
      this.non_functional.ticket_Owner_ID = this.$store.state.userID
      this.non_functional.start_Date = this.formatNFStartDate +"T"+ this.nf_start_date_time
      this.non_functional.period_ID = null
      
      this.non_functional.fY_ID = this.$store.state.activeFY.id
      this.dialog_saving = true
      this.dialog_saving_text = "Saving your activity"
      // addNF_Activity_promise = new Promise((resolve, reject)=>{
      //    setTimeout(resolve, 100, SparrowService.pickPeriod(this.$store.state.periods[0], start_date));
      // })
        
          setTimeout(() => {
          this.$store.dispatch('addNonFunctionalActivities',this.non_functional)
          .then(() => {    
            setTimeout(() => {        
                  SparrowService.getNonFunctionalTickets(this.$store.state.userID,this.$store.state.activeFY.label)
                    .then(response => {
                      let activeNonFunctional =[]
                      this.$store.state.ongoingNonFunctional = 0
                      for(let i = 0;i < response.data.length; i++){
                        if(response.data[i].status == true){
                              this.$store.state.ongoingNonFunctional +=1
                              activeNonFunctional.push(response.data[i])
                          }
                      }
                      this.$store.state.non_functional_tickets[0] = activeNonFunctional
                      this.$store.state.no_nf_data = false
                      this.dialog_saving = false
                    })
              }, 2000);
                this.$store.dispatch({type:'fetchNonFunctionalActivities',id:this.$store.state.userID,fy:this.$store.state.activeFY.label})
                this.nf_filterValue=true
                this.nf_filter_period = []
                this.nf_start_date ="" 
                this.nf_date_completed = ""
                this.nf_start_date_time ="00:00"
                this.nf_date_completed_time="00:00"
                this.non_functional = this.createNon_Functional_Activity();
                this.nf_dialog = false;
          })
          .catch((err) => {
            console.log("error posting", err);
          });
          
        }, 3000);
      
      
      }
    },
    getNF_Activity(id){
      this.nf_dialog = true
      this.nf_toSave = false;
      this.nf_toUpdate = true
      this.isLoaded=false;
      let nf_promise=[];
      nf_promise.push(
          SparrowService.getNonFunctionalTicket(id)
                  .then(response => {
                    this.nf_ID = response.data.id
                    this.non_functional.title = response.data.title
                    this.non_functional.status = response.data.status
                    this.non_functional.non_functional_classification_ID = response.data.non_Functional_Classification_ID
                    this.non_functional.description = response.data.description
                    this.non_functional.period_ID = response.data.period_ID
                    this.non_functional.fY_ID = response.data.fY_ID
                    this.nf_start_date = response.data.start_Date.substr(0, 10)
                    this.nf_start_date_time = response.data.start_Date.substr(11, 19)
                    if(response.data.date_Completion != null){
                      this.nf_date_completed = response.data.date_Completion.substr(0, 10)
                      this.nf_date_completed_time = response.data.date_Completion.substr(11, 19)
                    }else{
                      this.nf_date_completed = null
                      this.nf_date_completed_time = "00:00"
                    }
          })
      )
        Promise.all(nf_promise).then(()=>{
          this.isLoaded = true
        })
    },
    updateNF_Activity(){
      let NF_Activity_promise = []
      if(this.validateNonFunctionalData() == true){ 
        this.dialog_saving_nfa = true
        var ts_hours = null
        var ts_minutes = null
        this.dialog_saving_nfa_text = "Updating your activity"
          let nf_param ={
            id:this.nf_ID,
            title: this.non_functional.title,
            description: this.non_functional.description ,
            start_Date:this.formatNFStartDate +"T"+ this.nf_start_date_time, // Date Recieved 
            date_Completion:null,  // Submission Date
            total_hrs:0, // null upon ticket creation
            period_ID:this.non_functional.period_ID,
            fY_ID:this.non_functional.fY_ID,
            ticket_Owner_ID: this.$store.state.userID,
            status: this.non_functional.status,
            non_Functional_Classification_ID:this.non_functional.non_functional_classification_ID
          }

          //  NF_Activity_promise = new Promise((resolve, reject)=>{
          //     setTimeout(resolve, 100, SparrowService.pickPeriod(this.$store.state.periods[0], this.formatNFStartDate));
          //  })

          
          if(this.non_functional.status == false){
            nf_param.period_ID = SparrowService.pickPeriod(this.$store.state.periods[0], this.formatNFStartDate)
            
            let start_date = this.formatNFStartDate_TimeSpent +" "+ this.nf_start_date_time
            let completion_date = this.formatDateCompleted_TimeSpent +" "+ this.nf_date_completed_time
            let timespent = moment.utc(moment(completion_date,"DD/MM/YYYY hh:mm:ss").diff(moment(start_date,"DD/MM/YYYY hh:mm:ss")))
            let timespent_duration = moment.duration(timespent)
            let timespent_formatted = moment().hour(timespent_duration._data.hours).minute(timespent_duration._data.minutes).format("HH:mm")
            var ts_hoursMinutes  = timespent_formatted.split(/[.:]/);
            ts_hours = parseInt(ts_hoursMinutes [0], 10);
            ts_minutes = ts_hoursMinutes [1] ? parseInt(ts_hoursMinutes [1], 10) : 0;
            var actual_time_spent = ts_hours + ts_minutes/60    
            nf_param.date_Completion = this.formatNFDateCompleted +"T"+ this.nf_date_completed_time
            nf_param.total_hrs = parseFloat(actual_time_spent).toFixed(2)
            this.updateInPorgressTickets(ts_hours,ts_minutes,parseFloat(actual_time_spent).toFixed(2))
            this.$store.state.ongoingNonFunctional -= 1
          }
          SparrowService.putNonFunctionalTickets(this.nf_ID,nf_param).then(()=>{ 
                    setTimeout(() => {                    
                      SparrowService.getNonFunctionalTickets(this.$store.state.userID,this.$store.state.activeFY.label)
                        .then(response => {    
                            let activeNonFunctional = []   
                              for(let i = 0 ; i < response.data.length;i++){
                                if(response.data[i].status == true){
                                      activeNonFunctional.push(response.data[i])
                                    }
                                }              
                                this.$store.state.non_functional_tickets[0] = activeNonFunctional               
                        })
                    },1000);
                      this.$store.dispatch({type:'fetchNonFunctionalActivities',id:this.$store.state.userID,fy:this.$store.state.activeFY.label})
                      this.nf_start_date ="" 
                      this.nf_date_completed = ""
                      this.nf_start_date_time ="00:00"
                      this.nf_date_completed_time="00:00"
                      this.non_functional = this.createNon_Functional_Activity();
                      this.nf_dialog = false;
                      this.dialog_saving_nfa = false                      
            })
      }
    },

    //Update all due dates of running tickets
    updateInPorgressTickets(addHours,addMinutes,nf_time_spent){
       let initial_due_date = ""
       let end_shift = 0
       let ticket_param =null
       let get_ticket_promise = []
       let activetickets = []
       this.dialog_saving_nfa = true
       this.dialog_saving_nfa_text = "Adjusting the Due date of your on-ging tickets"
      for(let i = 0; i < this.$store.state.activeTickets.length; i++){     
        get_ticket_promise.push(
          SparrowService.getTicket(this.$store.state.activeTickets[i].id).then(response => {  

                        initial_due_date = moment(response.data.actual_due_date).add(addHours, 'hours').add(addMinutes, 'minutes').format('YYYY-MM-DDTHH:mm:ss');

                        if(this.$store.state.user_shift.end_Time = 24){end_shift = 0}else{end_shift = this.$store.state.user_shift.end_Time}


                        if(this.$store.state.world_area_support == "MEA"){
                          if(moment(initial_due_date).format('dddd') == "Friday")
                            {
                              initial_due_date = moment(initial_due_date).add(2, 'days').format('YYYY-MM-DDTHH:mm:ss');
                            }
                            else if(moment(initial_due_date).format('dddd') == "Saturday"){
                              initial_due_date = moment(initial_due_date).add(1, 'days').format('YYYY-MM-DDTHH:mm:ss');
                            } 
                        }else{
                          if(moment(initial_due_date).format('dddd') == "Saturday" || moment(initial_due_date).format('dddd') == "Sunday")
                            {
                              initial_due_date = moment(initial_due_date).add(2, 'days').format('YYYY-MM-DDTHH:mm:ss');
                            } 
                            else if(moment(initial_due_date).format('dddd') == "Sunday"){
                              initial_due_date = moment(initial_due_date).add(1, 'days').format('YYYY-MM-DDTHH:mm:ss');
                            }
                        }

                        if(parseInt(moment(initial_due_date).format('HH')) < this.$store.state.user_shift.start_Time && 
                           parseInt(moment(initial_due_date).format('HH')) > end_shift )
                           {
                              initial_due_date = moment(initial_due_date).add(15, 'hours').format('YYYY-MM-DDTHH:mm:ss');
                           }
                      
                        

                ticket_param ={
                  id:response.data.id,
                  title: response.data.title,
                  description: response.data.description ,
                  actual_due_date: initial_due_date,
                  service_rating:0, // null upon ticket creation
                  start_Date:response.data.start_Date, // Date Recieved 
                  date_Completion:null,  // Submission Date
                  total_hrs:0, // null upon ticket creation
                  running_time:response.data.running_time,
                  requester: response.data.requester,
                  world_area: response.data.world_area,
                  service_Level_Agreement: response.data.service_Level_Agreement,
                  adjusted_Service_Level_Agreement: parseFloat(response.data.service_Level_Agreement) + parseFloat(nf_time_spent),
                  classification_ID:response.data.classification_ID,
                  complexity_ID:response.data.complexity_ID,
                  period_ID:response.data.period_ID,
                  main_Category_ID: response.data.main_Category_ID,
                  sub1_Category_ID: response.data.sub1_Category_ID,
                  fY_ID:response.data.fY_ID,
                  sub2_Category_ID: null,
                  quality_Rating_ID:response.data.quality_Rating_ID, // null upon ticket creation
                  ticket_Owner_ID: response.data.ticket_Owner_ID,
                  ticket_Status_ID: response.data.ticket_Status_ID
                }
                console.log("test",ticket_param.adjusted_Service_Level_Agreement)
               SparrowService.putTicket(ticket_param.id,ticket_param)
            })
          )
      }
      Promise.all(get_ticket_promise).then(()=>{
          setTimeout(() => {
             this.$store.state.userTickets[0] = []
                SparrowService.getTicketsByUser(this.$store.state.userID,this.$store.state.activeFY.label)
                      .then(response => {
                        for(let i = 0;i < response.data.length; i++){
                          response.data[i].actual_due_date = this.formatDisplayDate(response.data[i].actual_due_date)
                          response.data[i].start_Date = this.formatDisplayDate(response.data[i].start_Date)
                          if(response.data[i].ticket_Status.status.toLowerCase() == this.$store.state.inProgressStatus.toLowerCase()){
                                 activetickets.push(response.data[i])
                                 this.$store.state.activeTickets.push(response.data[i])
                          }
                          }
                        setTimeout(() => {
                            this.$store.state.userTickets[0] = activetickets    
                            this.$store.state.filterValue = this.$store.state.inProgressStatus                  
                            this.actual_due_date  = ""
                            this.actual_due_date_time =""
                            this.start_date ="" 
                            this.start_date_time =""
                            this.dialog = false; 
                            this.dialog_saving_nfa = false
                        }, 1000);
                                
                        })
            },1000);
      })

    },
    getNonFunctionalToDelete(id){
      this.non_functional_to_delete = id
      this.delete_dialog_nf = true
    },
    deleteNonFunctional(){
      let promise =[]
      let activeNonFunctional = []
      this.$store.state.ongoingNonFunctional = 0
      SparrowService.deleteNonFunctionalTicketsA(this.non_functional_to_delete).then(()=>{
        setTimeout(() => {
          promise.push(
            SparrowService.getNonFunctionalTickets(this.$store.state.userID,this.$store.state.activeFY.label)
              .then(response => {       
                this.$store.state.ongoingNonFunctional = 0
                for(let i = 0;i < response.data.length; i++){
                  response.data[i].start_Date = this.formatDisplayDate(response.data[i].start_Date)
                  if(response.data[i].status == true){      
                      this.$store.state.ongoingNonFunctional += 1         
                      activeNonFunctional.push(response.data[i])
                    }
                }  
              })
          )
          Promise.all(promise).then(()=>{
              this.$store.state.non_functional_tickets[0] = activeNonFunctional
              this.$store.dispatch({type:'fetchNonFunctionalActivities',id:this.$store.state.userID,fy:this.$store.state.activeFY.label})
          })
          },1000);
                 
                 this.$store.state.no_nf_data = false            
                 this.delete_dialog_nf = false
      })
    },
    filterNonFunctionalActivitiesByStatus(status){
      this.nf_filter_period = []
      this.$store.dispatch('filterNonFunctionalActivitiesByStatus',status)
    },
    filterNonFunctionalActivitiesByperiod(periods){
        this.$store.dispatch("filterNonFunctionalActivitiesByperiod",periods)
    },


    //Close Non-Funtional Dialog Box
    close_nf(){
      this.nf_dialog = false
      this.nf_toUpdate = false
      this.nf_toSave= true
      this.nf_start_date_time ="00:00"
      this.nf_date_completed_time="00:00"
      this.non_functional_formErrors = []
      this.non_functional = this.createNon_Functional_Activity();
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

    //Non-Functional Activities
    createNon_Functional_Activity() {
      return {
        title: "",
        description: "",
        start_Date:"", // Date Recieved 
        date_Completion:null, // null upon ticket creation  // Submission Date
        total_hrs:0, // null upon ticket creation
        non_functional_classification_ID:null,
        ticket_Owner_ID: 0,
        period_ID:null,
        fY_ID:null,
        status:true // Set to In-Progress upon Ticket Creation
      };
    },
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
  color: white;
}
.required{
  color: red;
}
.ticket_card{
    -webkit-animation-name: fade-in;
    -webkit-animation-duration: 1s;
    animation-name: fade-in;
    animation-duration: 1s;
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
.filter_options_active {
  background-color: #004b8d !important;
  color : white !important;
}
.filter_options{
  background-color: white !important;
}
.filter_options :hover{
  background-color: #004b8d !important;
  color : white !important;
}
.time-text{
  color: black;
  background-color: white;
}
@-webkit-keyframes fade-in {
    0% { opacity: 0; top:50px;}
    100% { opacity: 1; top:0; }
}
@keyframes fade-in {
    0% { opacity: 0; top:50px;}
    100% { opacity: 1; top:0;}
}
</style>