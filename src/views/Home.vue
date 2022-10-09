<template>
  <div class="pa-10 mt-12">
    <TicketsList />
  </div>
</template>

<script>
import TicketsList from "@/components/Tickets/TicketsList"

export default {
  name: "Home",
  components: {
    TicketsList
  },
};
</script>
