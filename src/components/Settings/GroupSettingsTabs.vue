<template>
  <div>
    <v-tabs background-color="base" grow v-model="tab" centered >
      <v-tabs-slider></v-tabs-slider>

      <v-tab href="#tab-3" v-if="$store.state.isAdmin">
        <v-icon class="pr-3">mdi-face-recognition</v-icon>
        Role
      </v-tab>

      <v-tab href="#tab-5" v-if="$store.state.isAdmin">
        <v-icon class="pr-3">mdi-account-group</v-icon>
        Team
      </v-tab>

      <v-tab href="#tab-6" v-if="$store.state.isAdmin">
        <v-icon class="pr-3">mdi-calendar</v-icon>
        Period
      </v-tab>

      <v-tab href="#tab-7" v-if="$store.state.isAdmin">
        <v-icon class="pr-3">mdi-calendar</v-icon>
        Fiscal Year
      </v-tab>

    </v-tabs>

    <v-tabs-items v-model="tab">

      <v-tab-item value="tab-3">
        <v-card flat color="base">
          <v-card-text>
            <GroupSettingsRoles />
          </v-card-text>
        </v-card>
      </v-tab-item>

      <v-tab-item value="tab-5">
        <v-card flat>
          <v-card-text><GroupSettingsTeams /></v-card-text>
        </v-card>
      </v-tab-item>

       <v-tab-item value="tab-6">
        <v-card flat>
          <v-card-text><PeriodSettingsTab /></v-card-text>
        </v-card>
      </v-tab-item>

       <v-tab-item value="tab-7">
        <v-card flat>
          <v-card-text><FYSettingsTab /></v-card-text>
        </v-card>
      </v-tab-item>

    </v-tabs-items>
  </div>
</template>

<script>
import GroupSettingsRoles from "@/components/Settings/GroupSettingsRoles";;
import GroupSettingsTeams from "@/components/Settings/GroupSettingsTeams";
import PeriodSettingsTab from "@/components/Settings/PeriodSettingsTab"
import FYSettingsTab from "@/components/Settings/FYSettingsTab"

export default {
  name: "GroupSettingsTabs",
  components: {
    GroupSettingsRoles,
    GroupSettingsTeams,
    PeriodSettingsTab,
    FYSettingsTab

  },
  data: () => ({
    tab: null,
  }),
};
</script>

<style>
</style>