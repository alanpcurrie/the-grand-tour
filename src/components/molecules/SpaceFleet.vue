<template>
  <div class="content">
    <SpaceShip></SpaceShip>
    <SpaceShip></SpaceShip>
    <SpaceShip></SpaceShip>
    <SpaceShip></SpaceShip>
    <SpaceShip></SpaceShip>
  </div>
</template>

<script>
import SpaceShip from "@/components/atoms/SpaceShip";

export default {
  name: "app",
  components: {
    SpaceShip,
    props: {
    size: String,
    color: String,
    opacity: String,
  }
  }
};

</script>


<style lang="scss" scoped>

</style>
