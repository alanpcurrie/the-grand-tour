<template>

  <div class="planetoid planetoid--striped"></div>

</template>

<script>
export default {
  name: "Planetoid",
  props: {
    size: String,
    color: String,
    opacity: String,
    tail: String
  }
};
</script>


<style lang="scss" scoped>
.planetoid {
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: var(--color-xenomorph-green);

  &--striped {
    background: repeating-linear-gradient(
      to bottom,
      var(--color-sunshine-yellow),
      var(--color-flare-orange) 50%,
      var(--color-sunshine-yellow) 50%,
      var(--color-flare-orange)
    );
    background-size: 100% 40px;

    &::after {
      content: "";
      position: absolute;
      top: 26px;
      right: 26px;
      width: 150px;
      height: 150px;
      border-radius: 50%;
      background: rgba(#006740, 0.4);
    }
  }
}
</style>
