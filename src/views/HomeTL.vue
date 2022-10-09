<template>
  <div class="pa-10 mt-12">
    <DashboardLeadTable class="mb-5" />
  </div>
</template>

<script>
import DashboardLeadTable from "@/components/Dashboards/DashboardLeadTable";

export default {
  name: "Home",
  components: {
    DashboardLeadTable,
  },
};
</script>
