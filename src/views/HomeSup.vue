<template>
  <div class="pa-10 mt-12">
    <DashboardSuperVisorTable class="mb-5" />
  </div>
</template>

<script>
import DashboardSuperVisorTable from "@/components/Dashboards/DashboardSuperVisorTable";

export default {
  name: "Home",
  components: {
    DashboardSuperVisorTable,
  },
};
</script>
