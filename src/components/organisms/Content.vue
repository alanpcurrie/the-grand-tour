<template>
  <div class="content">

    <div class="planet-1">
        <planetoid></planetoid>
    </div>

    <div class="planet-2">

    </div>

      <div class="planet-3">
         <Saturn></Saturn>
      </div>

       <div class="planet-4">

      </div>

  </div>
</template>

<script>
import Saturn from "@/components/atoms/Saturn";
import Planetoid from "@/components/atoms/Planetoid";

export default {
  name: "app",
  components: {
    Saturn,
    Planetoid
  }
};
</script>


<style lang="scss" scoped>
.content {
  display: grid;
  grid-gap: -1rem;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  margin: 0 auto;
}

.planet {
  &-1 {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
  }

  &-2 {
    grid-column: 2 / 3;
    grid-row: 1 / 2;
  }

  &-3 {
    grid-column: 3 / 4;
    grid-row: 1 / 2;
    position: absolute;
  }

  &-4 {
    grid-column: 4 / 5;
    grid-row: 1 / 2;
  }
}
</style>
