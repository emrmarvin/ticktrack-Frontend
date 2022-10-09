<template>
  <div class="pa-5">
    <TicketsList />
  </div>
</template>

<script>
import TicketsList from "@/components/Tickets/TicketsList";


export default {
  name: "Tickets",
  components: {
    TicketsList
  },
};
</script>

<style scoped>
.max-width {
  max-width: 1020px;
}
</style> 