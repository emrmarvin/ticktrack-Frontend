<template>
  <v-card width="480" class="pa-5 mx-10">
    <v-list-item class="mb-2">
      <v-list-item-content>
        <v-list-item-title>Ticket Sub Categories Layer 2</v-list-item-title>
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
              <span>Add Ticket Sub Category</span>
            </v-tooltip>
          </template>
          <v-card>
            <v-card-title class="headline blue lighten-2">
              Add Ticket Sub 2 Category
            </v-card-title>

            <v-card-text>
              <form @submit.prevent="addTicketMainCategory">
                <v-text-field
                  v-model="sub1_Category.abbreviation"
                  label="Abbreviation"
                ></v-text-field>
                <v-text-field
                  v-model="sub1_Category.label"
                  label="Label"
                ></v-text-field>
                <v-text-field
                  v-model="sub1_Category.description"
                  label="Description"
                ></v-text-field>
                <v-text-field
                  type="number"
                  v-model.number="sub1_Category.created_By"
                  label="Created_By"
                ></v-text-field>
                <v-text-field
                  type="number"
                  v-model.number="sub1_Category.main_Category_ID"
                  label="main_Category_ID"
                ></v-text-field>
                <v-text-field
                  type="number"
                  v-model.number="sub1_Category.teamID"
                  label="TeamID"
                ></v-text-field>

                <v-btn type="submit" color="blue">Submit</v-btn>
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

    <v-list-item>
      <v-list-item-content>
        <v-list-item-title>Optional Sub Category Level</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-dialog v-model="dialogEdit" width="480px">
      <v-card>
        <v-card-title>
          <span class="headline">Sub Category</span>
        </v-card-title>

        <v-card-text>
          <form @submit.prevent="editTicketSub1Category">
            <v-text-field
              v-model="sub1_Category.abbreviation"
              label="Abbreviation"
            ></v-text-field>
            <v-text-field
              v-model="sub1_Category.label"
              label="Label"
            ></v-text-field>
            <v-text-field
              v-model="sub1_Category.description"
              label="Description"
            ></v-text-field>
            <v-text-field
              type="number"
              v-model.number="sub1_Category.created_By"
              label="Created_By"
            ></v-text-field>
            <v-text-field
              type="number"
              v-model.number="sub1_Category.main_Category_ID"
              label="main_Category_ID"
            ></v-text-field>
            <v-text-field
              type="number"
              v-model.number="sub1_Category.teamID"
              label="TeamID"
            ></v-text-field>

            <v-btn type="submit" color="primary">Submit</v-btn>
            <v-btn color="blue darken-1" text @click="closeEdit">
              Cancel
            </v-btn>
          </form>
        </v-card-text>
      </v-card>
    </v-dialog>
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
      sub1_Categories: [],
      sub1_Category: this.createSub1_Category(),
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
    SparrowService.getTicketSub1_Categories()
      .then((response) => {
        this.sub1_Categories = response.data;
      })
      .catch((error) => {
        console.log(error.response);
      });
  },
  methods: {
    addTicketSub1Category() {
      this.$store
        .dispatch("addTicketSub1Category", this.sub1_Category)
        .then(() => {
          this.sub1_Categories.push(this.sub1_Category);
          this.sub1_Category = this.createSub1_Category();
          this.dialog = false;
        })
        .catch((err) => {
          console.log("error posting", err);
        });
    },
    editTicketSub1Category() {
      this.$store
        .dispatch("editTicketSub1Category", this.sub1_Category)
        .then(() => {
          this.sub1_Categories.push(this.sub1_Category);
          this.sub1_Category = this.createSub1_Category();
          this.dialogEdit = false;
        })
        .catch((err) => {
          console.log("error posting", err);
        });
    },
    selectSubCat(sub1_Category) {
      this.editedIndex = this.sub1_Categories.indexOf(sub1_Category);
      this.sub1_Category = Object.assign({}, sub1_Category);
      this.dialogEdit = true;
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.sub1_Category = Object.assign({}, this.createSub1_Category());
        this.editedIndex = -1;
      });
    },
    closeEdit() {
      this.dialogEdit = false;
      this.$nextTick(() => {
        this.sub1_Category = Object.assign({}, this.createSub1_Category());
        this.editedIndex = -1;
      });
    },
    createSub1_Category() {
      return {
        abbreviation: "",
        label: "",
        description: "",
      };
    },
  },
};
</script>

<style scoped>
</style>