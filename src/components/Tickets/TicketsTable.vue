<template>
  <div>
    <v-row>
      <v-col>
        <v-container>
          <v-select
            :items="column"
            label="Add Column/s to display"
            filled
            chips
            multiple
          >
            <template v-slot:selection="{ item }">
              <v-chip color="primary" small>{{ item.text }}</v-chip>
            </template>
            <template v-slot:item="{ item, attrs, on }">
              <v-list-item
                v-on="on"
                v-bind="attrs"
                #default="{ active }"
                @click="columnsToDisplay(item.text, item.value)"
              >
                <v-list-item-action>
                  <v-checkbox
                    :disabled="true"
                    :id="item.value"
                    :input-value="active"
                  ></v-checkbox>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>
                    <v-row no-gutters align="center">
                      <span>{{ item.text }}</span>
                    </v-row>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-select>
        </v-container>
        <v-btn
          class="primary mb-5"
          height="50px"
          @click="isShowSelect = true"
          v-if="isShowSelect == false"
        >
          <v-icon color="white" class="mr-3"> mdi-select-multiple </v-icon>
          Select Multiple
        </v-btn>
        <v-btn
          class="primary mb-5"
          height="50px"
          @click="(isShowSelect = false), (selected = [])"
          v-if="isShowSelect == true"
        >
          <v-icon color="white" class="mr-3"> mdi-eye-off </v-icon> Hide
          Multiple Select
        </v-btn>
        <v-btn
          class="primary ml-5 mb-5"
          height="50px"
          color="error"
          @click="dialog_bulk_deletion = true"
          id="deleteall"
          v-if="selected.length != 0"
        >
          <v-icon color="white" class="mr-3"> mdi-delete </v-icon> Delete
          Selected {{ selected.length }} item(s)
        </v-btn>
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="Tickets"
          sort-by="calories"
          class="elevation-1"
          :show-select="isShowSelect"
          item-key="id"
        >
          <template v-slot:[`item.start_Date`]="{ item }">
            {{ formatDisplayDate(item.start_Date) }}
          </template>

          <template v-slot:[`item.actual_due_date`]="{ item }">
            {{ formatDisplayDate(item.actual_due_date) }}
          </template>

          <template v-slot:[`item.date_Completion`]="{ item }">
            {{ formatDisplayDate(item.date_Completion) }}
          </template>

          <template v-slot:[`item.world_area`]="{ item }">
            {{ getWorldArea(item.world_area) }}
          </template>

          <template v-slot:[`item.ticket_Status.status`]="{ item }">
            <v-chip v-bind:style="statusColor(item.ticket_Status.status)">{{
              item.ticket_Status.status
            }}</v-chip>
          </template>

          <template v-slot:[`item.service_rating`]="{ item }">
            <v-chip v-bind:style="ratingColor(item.service_rating)">{{
              item.service_rating
            }}</v-chip>
          </template>

          <template v-slot:[`item.classification.label`]="{ item }">
            <v-chip
              v-bind:style="classificationColor(item.classification.label)"
              >{{ item.classification.label }}</v-chip
            >
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="update_ticket(item.id)">
              mdi-pencil
            </v-icon>
            <v-icon
              v-if="show_delete == true"
              small
              @click="delete_ticket(item.id, item.ticket_Status.status)"
            >
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
     <!--Bulk Deletion Confirmation--->
    <v-dialog v-model="dialog_bulk_deletion" persistent width="480">
      <v-card>
        <v-card-title class="headline" style="color: white; background-color: #004b8d" >
          BULK DELETION
        </v-card-title>
        <v-card-text>
          <div style="font-size: 15px;text-align:center" class="mb-5 mt-5 text_color--text">
           Are you sure you want to delete your tickets?
          </div>
          
          <v-card-actions style="justify-content:center">
            <v-btn
            type="submit"
            @click="bulk_deletion()"
            style="color: white"
            color="#004b8d"
            >YES</v-btn
          >
          <v-btn text @click="dialog_bulk_deletion = false" style="color: #004b8d"
            >NO</v-btn
          >
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import SparrowService from "@/services/SparrowService.js";
import moment from "moment";

export default {
  props: {
    update_ticket: { type: Function },
    delete_ticket: { type: Function },
    Tickets: { type: Array },
    filterValue: { type: String },
    filter_period: { type: Array },
    bulk_delete: { type: Function },
    show_delete: { type: Boolean },
  },
  data() {
    return {
      selected: [],
      isShowSelect: false,
      headers: [
        { text: "Period", value: "period.abbreviation" },
        { text: "Title", value: "title" },
        { text: "Date Start", value: "start_Date" },
        { text: "Complexity", value: "complexity.label" },
        { text: "SLA", value: "service_Level_Agreement" },
        { text: "Due Date", value: "actual_due_date" },
        { text: "Date Completion", value: "date_Completion" },
        { text: "Service Rating", value: "service_rating" },
        { text: "Quality_Rating", value: "quality_Rating.abbreviation" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      column: [
        { text: "Classification", value: "classification.label" },
        { text: "Actual Processing Time", value: "total_hrs" },
        { text: "Status", value: "ticket_Status.status" },
        { text: "Request_Category", value: "main_Category.label" },
        { text: "Request_Type", value: "sub1_Category.label" },
        { text: "Requester", value: "requester" },
        { text: "Actual Time Spent", value: "running_time" },
        { text: "World Area", value: "world_area" },
        { text: "Requester", value: "requester" },
        { text: "Business Unit", value: "business_Unit" },
        { text: "Description", value: "description" },
        { text: "Ticket Owner", value: "ticket_Owner.email" },
      ],
      status: "",
      dialog_bulk_deletion:false
    };
  },
  created() {
    this.dynamicExportHeaders();
  },
  methods: {
    bulk_deletion(){
      this.bulk_delete('Table', this.selected)
      setTimeout(() => {
        this.dialog_bulk_deletion = false
        this.selected = []
      },3000);
    },
    dynamicExportHeaders() {
      this.$store.state.dynamicExportReport[" "] = " ";
      for (let i = 0; i < this.headers.length; i++) {
        if (this.headers[i].text !== "Actions") {
          this.$store.state.dynamicExportReport[this.headers[i].text] =
            this.headers[i].value;
        }
      }
    },
    statusColor(status) {
      var backgroundColor = "";
      if (
        status.toLowerCase() === "in-progress" ||
        status.toLowerCase() === "in progress" ||
        status.toLowerCase() === "started" ||
        status.toLowerCase() === "current"
      ) {
        backgroundColor = "#004b8d";
      } else if (
        status.toLowerCase() == "completed" ||
        status.toLowerCase() == "closed" ||
        status.toLowerCase() == "done"
      ) {
        backgroundColor = "#4caf50";
      } else {
        backgroundColor = "#FFA700";
      }
      return {
        background: backgroundColor,
      };
    },
    ratingColor(rating) {
      var backgroundColor = "";
      if (rating > 3.0) {
        backgroundColor = "red";
      } else if (rating > 2.0) {
        backgroundColor = "#FFA700";
      } else if (rating >= 1.0) {
        backgroundColor = "#4caf50";
      }
      return {
        background: backgroundColor,
      };
    },
    columnsToDisplay(text, value) {
      var checkBox = document.getElementById(value);
      if (checkBox.checked == false) {
        this.headers.splice(this.headers.length - 1, 0, {
          text: text,
          value: value,
        });
        this.dynamicExportHeaders();
      } else if (checkBox.checked == true) {
        const index = this.headers.findIndex((element, index) => {
          if (element) {
            if (element.value === value) {
              this.headers.splice(index, 1);
              this.dynamicExportHeaders();
            }
          }
        });
      }
    },
    formatDisplayDate(value) {
      return moment(value).format("MM/DD/YYYY HH:mm");
    },
    classificationColor(classification) {
      var backgroundColor = "";
      if (classification == "Transactional") {
        backgroundColor = "#4caf50";
      } else {
        backgroundColor = "#FFA700";
      }
      return {
        background: backgroundColor,
      };
    },
    getWorldArea(world_area) {
      let WA = "";
      switch (world_area) {
        case 1:
          WA = "Global";
          break;
        case 2:
          WA = "North America";
          break;
        case 3:
          WA = "Middle East and Africa";
          break;
        case 4:
          WA = "Asia Pacific";
          break;
        case 5:
          WA = "Europe";
          break;
        case 6:
          WA = "Manila";
          break;
        case 7:
          WA = "Latin America";
          break;
        default:
          WA = " ";
      }
      return WA;
    },
  },
};
</script>

<style scoped>
.max-width {
  max-width: 1020px;
}
.v-application a {
  text-decoration: none;
}
.time-text {
  color: black;
  background-color: white;
}
input[type="time"],
select {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
</style>