<template>

  <div class="planetoid"></div>

</template>

<script>
export default {
  name: "Planet",
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
  position: absolute;
  top: 500px;
  left: 580px;
  width: 360px;
  height: 360px;
  border-radius: 50%;
  z-index: 2;
  background: var(--color-space-suit-orange);
}

</style>
