<template>
  <v-row class="mx-auto mt-12">
    <v-col>
      <v-card class="max-width mx-auto">
        <GroupSettingsTabs />
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import GroupSettingsTabs from "@/components/Settings/GroupSettingsTabs";
export default {
  name: "GroupsSettings",
  components: {
    GroupSettingsTabs,
  },
  data: () => ({}),
};
</script>

<style scoped>
.max-width {
  max-width: 1020px;
}
</style>