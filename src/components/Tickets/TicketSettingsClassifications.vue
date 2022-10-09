<template>
  <v-card width="480" class="pa-5 mx-10">
    <v-list-item class="mb-2">
      <v-list-item-content>
        <v-list-item-title>Ticket Classifications</v-list-item-title>
      </v-list-item-content>
      <v-list-item-action>
        <v-dialog v-model="dialog" width="480">
          <template #activator="{ on: dialog }">
            <v-tooltip top>
              <template #activator="{ on: tooltip }">
                <v-btn
                  fab
                  small
                  color="blue"
                  v-on="{ ...tooltip, ...dialog }"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
              <span>Add Ticket Classifications</span>
            </v-tooltip>
          </template>
          <v-card>
            <v-card-title class="headline grey lighten-2">
              Add Ticket Classifications
            </v-card-title>

            <v-card-text>
              <form @submit.prevent="addClassification">
                <v-text-field
                  v-model="classification.abbreviation"
                  label="Abbreviation"
                ></v-text-field>
                <v-text-field
                  v-model="classification.label"
                  label="Label"
                ></v-text-field>
                <v-text-field
                  v-model="classification.description"
                  label="Description"
                ></v-text-field>

                <v-btn type="submit" color="primary">Submit</v-btn>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
              </form>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-list-item-action>
    </v-list-item>

    <v-divider class="mb-2"></v-divider>

    <v-list-item
      v-for="classification in classifications"
      :key="classification.id"
      three-line
    >
      <v-list-item-content>
        <v-list-item-title
          >Label: {{ classification.label }}</v-list-item-title
        >
        <v-list-item-subtitle
          >Abbreviation: {{ classification.abbreviation }}</v-list-item-subtitle
        >
      </v-list-item-content>

      <v-list-item-action class="d-flex flex-row">
        <v-btn icon @click="selectSubCat(classification)">
          <v-icon color="grey lighten-1">mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon color="grey lighten-1">mdi-delete</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>
  </v-card>
</template>

<script>
import SparrowService from "@/services/SparrowService.js";

export default {
  name: "TicketSettings",
  data() {
    return {
      dialog: false,
      dialogEdit: false,
      editedIndex: -1,
      classifications: [],
      classification: this.createClassification(),
    };
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogEdit(val) {
      val || this.closeEdit();
    },
  },
  created() {
  },
  mounted(){
    setTimeout(() => {
      this.loading = false;
      this.classifications = this.$store.state.classifications[0]
    },1000);
  },
  methods: {
    addClassification() {
      this.classification.created_By = this.$store.state.userID
      this.$store
        .dispatch("addClassification", this.classification)
        .then(() => {
          setTimeout(() => {
            SparrowService.getTicketClassifications()
              .then(response => {
                  this.classifications = response.data
              })
          },1000);
          this.classification = this.createClassification();
          this.dialog = false;
        })
        .catch((err) => {
          console.log("error posting", err);
        });
    },
    editTicketSub1Category() {
      this.$store
        .dispatch("editTicketSub1Category", this.classification)
        .then(() => {
          this.sub1_Categories.push(this.classification);
          this.classification = this.createClassification();
          this.dialogEdit = false;
        })
        .catch((err) => {
          console.log("error posting", err);
        });
    },
    selectSubCat(classification) {
      this.editedIndex = this.classifications.indexOf(classification);
      this.classification = Object.assign({}, classification);
      this.dialogEdit = true;
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.classification = Object.assign({}, this.createClassification());
        this.editedIndex = -1;
      });
    },
    closeEdit() {
      this.dialogEdit = false;
      this.$nextTick(() => {
        this.classification = Object.assign({}, this.createClassification());
        this.editedIndex = -1;
      });
    },
    createClassification() {
      return {
        abbreviation: "",
        label: "",
        description: "",
        created_By:0,
      };
    },
  },
};
</script>

<style scoped>
</style>