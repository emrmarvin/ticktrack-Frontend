<template>
  <div>
    <v-navigation-drawer
      app
      color="base"
      v-model="drawer"
      :mini-variant.sync="mini"
      :mini-variant-width="80"
      floating
      permanent
      expand-on-hover
      v-if="$store.state.isLogIn"
    >
      <v-toolbar color="base" class="mb-4" v-if="mini">
        <v-img
          alt="Emerson"
          class="image-center mx-auto pa-2"
          contain
          :src="require('../../assets/emerson-electric-helix.png')"
          transition="scale-transition"
          max-width="30"
        ></v-img>
      </v-toolbar>
      <v-toolbar color="base" class="mb-4" v-else height="100">
        <v-img
          v-if="$vuetify.theme.dark"
          alt="Emerson"
          class="image-center mx-auto pa-10"
          contain
          :src="require('../../assets/emerson-electric-logo2.png')"
          transition="scale-transition"
          max-width="140"
        ></v-img>
        <v-img
          v-else
          alt="Emerson"
          class="image-center mx-auto pa-10"
          contain
          :src="require('../../assets/emerson-electric-logo.png')"
          transition="scale-transition"
          max-width="140"
        ></v-img>
      </v-toolbar>

      <v-list-item>
        <v-list-item-title class="text-center primary--text font-weight-bold" style="font-size:20px">TickTrack</v-list-item-title>
      </v-list-item>

      <v-list-item>
        <v-switch
          color="primary"
          class="small"
          v-model="$vuetify.theme.dark"
          justify="center"
        >
        </v-switch><br>
        <v-list-item-title>Switch Theme</v-list-item-title>
      </v-list-item>
      <v-list-item link>
          <v-list-item-action>
            <a text @click="logout()">
               <v-icon>mdi mdi-logout</v-icon>
            </a>
          </v-list-item-action>
          <v-list-item-title @click="logout()">
            Sign Out
          </v-list-item-title>
        </v-list-item>
      <v-col class="mx-auto" md="10">
        <v-divider></v-divider>
      </v-col>

      <v-list dense>
        <!-- <v-list-item link text>
          <v-list-item-action>
            <a text>
              <router-link to="/"
                ><v-icon>mdi mdi-view-dashboard</v-icon></router-link
              >
            </a>
          </v-list-item-action>
          <v-list-item-title>
            <router-link to="/">Dashboard</router-link>
          </v-list-item-title>
        </v-list-item> -->

        <v-list-item link text v-show="!$store.state.isManager|| ($store.state.isSupervisor == true)">
          <v-list-item-action>
            <a text>
              <router-link to="/ticket-requests"
                ><v-icon>mdi mdi-file-settings</v-icon></router-link
              >
            </a>
          </v-list-item-action>
          <v-list-item-title>
            <router-link to="/ticket-requests">My Tickets</router-link>
          </v-list-item-title>
        </v-list-item>


        <v-list-item link text v-if="!$store.state.isManager|| ($store.state.isSupervisor == true)">
          <v-list-item-action>
            <a text>
              <router-link to="/change-shift"
                ><v-icon>mdi mdi-clock</v-icon></router-link
              >
            </a>
          </v-list-item-action>
          <v-list-item-title>
            <router-link to="/change-shift">Shift Adjustment/s</router-link>
          </v-list-item-title>
        </v-list-item>

        <v-list-item  link text v-if="$store.state.isTeamLead">
          <v-list-item-action>
            <a text>
              <router-link to="/tl-dashboard"
                ><v-icon>mdi mdi-view-dashboard</v-icon></router-link
              >
            </a>
          </v-list-item-action>
          <v-list-item-title>
            <router-link to="/tl-dashboard">My Team</router-link>
          </v-list-item-title>
        </v-list-item>

        <v-list-item  link text v-if="$store.state.isSupervisor">
          <v-list-item-action>
            <a text>
              <router-link to="/sup-dashboard"
                ><v-icon>mdi mdi-view-dashboard</v-icon></router-link
              >
            </a>
          </v-list-item-action>
          <v-list-item-title>
            <router-link to="/sup-dashboard">My Teams</router-link>
          </v-list-item-title>
        </v-list-item>

        <v-list-item link text v-if="$store.state.isTeamLead">
          <v-list-item-action>
            <a text>
              <router-link to="/ticket-settings"
                ><v-icon>mdi mdi-file-settings</v-icon></router-link
              >
            </a>
          </v-list-item-action>
          <v-list-item-title>
            <router-link to="/ticket-settings">Team Ticket Settings</router-link>
          </v-list-item-title>
        </v-list-item>

        <v-list-item link text v-if="$store.state.isAlsoTeamLead">
          <v-list-item-action>
            <a text>
              <router-link to="/sup-tl-ticket-settings"
                ><v-icon>mdi mdi-file-settings</v-icon></router-link
              >
            </a>
          </v-list-item-action>
          <v-list-item-title>
            <router-link to="/sup-tl-ticket-settings">Suprevisor/Team Lead <br> Ticket Settings</router-link>
          </v-list-item-title>
        </v-list-item>

        <v-list-item link text v-if="$store.state.isAdmin">
          <v-list-item-action>
            <a text>
              <router-link to="/group-management"
                ><v-icon>mdi mdi-view-carousel</v-icon></router-link
              >
            </a>
          </v-list-item-action>
          <v-list-item-title>
            <router-link to="/group-management">Admin</router-link>
          </v-list-item-title>
        </v-list-item>

        <v-list-item link text v-if="$store.state.isAdmin || $store.state.isTeamLead || $store.state.isSupervisor">
          <v-list-item-action>
            <a text>
              <router-link to="/users"
                ><v-icon>mdi mdi-account-group</v-icon></router-link
              >
            </a>
          </v-list-item-action>
          <v-list-item-title>
            <router-link to="/users">User Management</router-link>
          </v-list-item-title>
        </v-list-item>

        <!-- <v-list-item link text v-if="$store.state.isManager">
          <v-list-item-action>
            <a text>
              <router-link to="/manager-dashboard"
                ><v-icon>mdi mdi-view-dashboard</v-icon></router-link
              >
            </a>
          </v-list-item-action>
          <v-list-item-title>
            <router-link to="/manager-dashboard">Ops Group Dashboard</router-link>
          </v-list-item-title>
        </v-list-item> -->

      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  data: () => ({
    drawer: true,
    mini: true,
    default_dark:null
  }),
  created(){
  },
  computed:{
  },
  mounted(){
  },
  methods:{
    logout() {
      sessionStorage.clear();
      location.href = process.env.VUE_APP_POST_LOGOUT_REDIRECT_URI;
    },
  }
};
</script>

<style scoped>
.v-application a {
  color: #0079c1;
  text-decoration: none;
}

</style>