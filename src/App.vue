<template>
  <v-app>
    <Navigation /> 
    
    <v-main :style="{ background: $vuetify.theme.themes[theme].background }">
      <v-container fluid>
        <MenuNotification />
        {{test}}
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Navigation from "@/components/Navigation/Navigation.vue";
import MenuNotification from "@/components/Navigation/MenuNotification.vue";

export default {
  name: "ProjectSparrow",
  data(){
    return{
      test:""
    }
  },
  components: {
    Navigation,
    MenuNotification
  },
  mounted(){
    this.$store.dispatch('fetchWorldAreas')
    this.$store.dispatch('fetchFY')
    this.$store.dispatch('fetchPeriods')  
    this.$store.dispatch('fetchTicketSub1Category')
    this.$store.dispatch('fetchTicketMainCategories')
    this.$store.dispatch('fetchTicketComplexities') 
    this.$store.dispatch('fetchTicketClassifications')
    this.$store.dispatch('fetchQualityRatings')
    this.$store.dispatch('fetchTicketStatus')
    this.$store.dispatch('fetchShiftSchedules')
    this.$store.dispatch('fetchRoles')
    this.$store.dispatch('fetchNonFunctionalClassifications')
    this.$store.dispatch('fetchUserInfo')
  },
  computed: {
    theme() {
      return this.$vuetify.theme.dark ? "dark" : "light";
    },
   
  },
  created(){
  },
  methods:{

  }
};
</script>
