<template>
  <v-card class="mx-auto" max-width="344" outlined>
    <v-list-item
      v-for="classification in classifications"
      :key="classification.id"
    >
      <v-list-item-content>
        <div class="overline mb-4">{{ classification.id }}</div>
        <div class="overline mb-4">{{ classification.abbreviation }}</div>
        <div class="overline mb-4">{{ classification.label }}</div>
        <div class="overline mb-4">{{ classification.description }}</div>
        <div class="overline mb-4">{{ classification.status }}</div>
        <div class="overline mb-4">{{ classification.created_By }}</div>
        <div class="overline mb-4">{{ classification.teamID }}</div>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
import SparrowService from "@/services/SparrowService.js";

export default {
  data: () => ({
    classifications: [],
  }),
  created() {
    SparrowService.getTicketClassifications()
      .then((response) => {
        this.classifications = response.data;
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error.response);
      });
  },
};
</script>