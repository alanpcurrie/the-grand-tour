<template>
  <div class="footer">
    <p class="intro-text">A ONCE IN A LIFETIME GETAWAY</p>
    <h1 class="title-text">THE GRAND TOUR</h1>
    <hr class="title-text__underline">
    <div>
      <p class="planet-text">JUPITER / SATURN / URANUS / NEPTUNE </p>
      <p class="tourist-text">EXPERIENCE THE GHARM OF GRAVITY ASSISTS </p>
      <P class="arrow-label-text">EVERY 173 YEARS</P>
      <P class="boarding-label-text">NOW BOARDING</P>
    </div>
  </div>
</template>

<script>
export default {
  name: "TitleText",
  props: {
    text: String
  }
};
</script>

<style scoped lang="scss">

.footer {
  grid-area: footer;
}

</style>
