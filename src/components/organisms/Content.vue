<template>
  <div class="content">
      <Saturn></Saturn>
    <SpaceFleet></SpaceFleet>
  </div>
</template>

<script>
import Saturn from "@/components/atoms/Saturn";
import SpaceFleet from "@/components/molecules/SpaceFleet";

export default {
  name: "app",
  components: {
    Saturn,
    SpaceFleet
  }
};

</script>


<style lang="scss" scoped>

  .content {
    grid-template-areas: content;
  }

</style>
