<template>
  <v-row class="mx-auto mt-12">
    <v-col>
      <v-card width="520" class="pa-5 mx-auto">
        <form @submit.prevent="addComplexity">
          <v-text-field
            v-model="complexity.abbreviation"
            label="Abbreviation"
          ></v-text-field>
          <v-text-field v-model="complexity.label" label="Label"></v-text-field>
          <v-text-field
            v-model="complexity.description"
            label="Description"
          ></v-text-field>
          <v-text-field
            type="number"
            v-model.number="complexity.created_By"
            label="Created_By"
          ></v-text-field>
          <v-text-field
            type="number"
            v-model.number="complexity.teamID"
            label="TeamID"
          ></v-text-field>

          <v-btn type="submit" color="primary">Submit</v-btn>
        </form>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "TicketSettings",

  data() {
    return {
      complexity: this.createComplexity(),
    };
  },
  methods: {
    addComplexity() {
      this.$store
        .dispatch("addComplexity", this.complexity)
        .then(() => {
          this.complexity = this.createComplexity();
        })
        .catch((err) => {
          console.log("error posting", err);
        });
    },
    createComplexity() {
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
.max-width {
  max-width: 1020px;
}
</style>