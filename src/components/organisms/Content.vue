<template>
  <div class="content">
    <Planet></Planet>
    <Planet></Planet>
    <Planet></Planet>
    <SpaceFleet></SpaceFleet>
    <Planet></Planet>
    <Planet></Planet>
    <Planet></Planet>
  </div>
</template>

<script>
import Planet from "@/components/atoms/Planet";
import SpaceFleet from "@/components/molecules/SpaceFleet";

export default {
  name: "app",
  components: {
    Planet,
    SpaceFleet
  }
};

</script>


<style lang="scss" scoped>

  .content {
    grid-area: content;
  }

</style>
