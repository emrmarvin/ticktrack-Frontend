<template>
  <div class="pa-10 mt-12">
    <TicketsList />
  </div>
</template>

<script>
import TicketsList from "@/components/Tickets/TicketsList"
import DashboardStaff from "@/components/Dashboards/DashboardStaff.vue"
import TicketsCount from "@/components/Tickets/TicketsCount";
import moment from "moment";
export default {
  name: "Home",
  components: {
    TicketsList,
    DashboardStaff,
    TicketsCount
  },
  mounted(){
    console.log(this.$store.state.userTickets[0])
  },
  data () {
      return {
        show_delete:false,
        selected: [],
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
      }
    },
    methods:{
      formatDisplayDate(value) {
      return moment(value).format("MM/DD/YYYY HH:mm");
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
    }
};
</script>
