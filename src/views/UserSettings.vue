<template>
  <v-row class="mx-auto mt-12">
    <v-col>
      <v-card class="max-width mx-auto">
        <UserListSettings />
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import UserListSettings from "@/components/Users/UserListSettings";
export default {
  name: "UserManagement",
  components: {
    UserListSettings,
  },
  data: () => ({}),
};
</script>

<style scoped>
.max-width {
  max-width: 1020px;
}
</style>