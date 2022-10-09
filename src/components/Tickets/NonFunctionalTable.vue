<template>
  <div>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="nf_activities"
          sort-by="calories"
          class="elevation-1"
        >
        <template v-slot:[`item.start_Date`]="{ item }">
            {{formatDisplayDate(item.start_Date)}}
         </template>
        <template v-slot:[`item.status`]="{ item }">
            {{ item.status? 'On-Going' : 'Done' }}
        </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" v-if="item.status == true" @click="update_nf(item.id)" >
              mdi-pencil
            </v-icon>
            <v-icon v-if="item.status == true" small @click="delete_nf(item.id)"> mdi-delete </v-icon>
            <span v-if="item.status == false">No Action</span>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

  </div>
</template>

<script>
import SparrowService from "@/services/SparrowService.js";
import moment from 'moment'

export default {
  props: {
    nf_activities:{type:Array},
    filterValue:{type:String},
    update_nf: { type: Function },
    delete_nf:{type: Function},
  },
  data() {
    return{
   dialogDelete: false,
    headers: [
      { text: "Classification", value: "classification.title" },
      { text: "Title", value: "title" },
      { text: "Date/Time Started", value: "start_Date" },
      { text: "Status", value: "status" },
      { text: "Time Spent (HH.mm)", value: "total_hrs" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    }
  },

  components: {
  },
  computed: {

  },

  created() {
  },
  computed:{
  },
  methods: {
 //// NON FUNCTIONAL METHODS
    formatDisplayDate(value){
       return moment(value).format("MM/DD/YYYY HH:mm")
    },
  }
};
</script>

<style scoped>
.max-width {
  max-width: 1020px;
}
.v-application a {
  text-decoration: none;
}
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
