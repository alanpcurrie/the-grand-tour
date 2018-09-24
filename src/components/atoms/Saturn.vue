<template>
 <div class="saturn__wrapper">
    <div class="saturn">
        <div class="planet planet__bottom planet--bg"></div>
        <div class="saturn__rings"></div>
        <div class="planet planet__top planet--bg"></div>
      </div>
  </div>
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
.saturn {
  position: relative;
  margin: 0 auto;
  width: 1600px;
  height: 1600px;
  transform: rotateZ(-55deg);

  &__wrapper {
    position: relative;
    overflow: hidden;
    bottom: -188px
  }

  &__rings {
    position: relative;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      ellipse at center,
      rgba(24, 19, 25, 0) 0%,
      rgba(53, 52, 51, 0) 34%,
      rgba(251, 166, 49, 1) 34%,
      rgba(251, 166, 49, 1) 37%,
      rgba(251, 166, 49, 1) 38%,
      rgba(251, 166, 49, 1) 39%,
      rgba(251, 166, 49, 1) 40%,
      rgba(251, 166, 49, 1) 42%,
      rgba(118, 28, 89, 1) 42%,
      rgba(118, 28, 89, 1) 43%,
      rgba(118, 28, 89, 1) 44%,
      rgba(118, 28, 89, 1) 45%,
      rgba(118, 28, 89, 1) 46%,
      rgba(118, 28, 89, 1) 47%,
      rgba(118, 28, 89, 1) 48%,
      rgba(118, 28, 89, 1) 49%,
      rgba(118, 28, 89, 1) 51%,
      rgba(118, 28, 89, 1) 52%,
      rgba(118, 28, 89, 1) 53%,
      rgba(118, 28, 89, 1) 54%,
      rgba(118, 28, 89, 1) 55%,
      rgba(118, 28, 89, 1) 56%,
      rgba(118, 28, 89, 1) 60%,
      rgba(198, 33, 50, 1) 60%,
      rgba(198, 33, 50, 1) 61%,
      rgba(198, 33, 50, 1) 62%,
      rgba(198, 33, 50, 1) 63%,
      rgba(198, 33, 50, 1) 65%,
      rgba(198, 33, 50, 1) 67%,
      rgba(198, 33, 50, 1) 68%,
      rgba(198, 33, 50, 1) 69%,
      rgba(198, 33, 50, 1) 71%,
      rgba(198, 33, 50, 0) 71%,
      rgba(77, 72, 76, 0) 72%,
      rgba(198, 33, 50, 0) 100%
    );
    transform: rotateX(80deg);
  }
}

.planet {
  position: absolute;
  top: 440px;
  left: 440px;
  width: 720px;
  height: 720px;
  border-radius: 50%;
  background: var(--color-dune-blue);

  &__top {
    clip: rect(0px, 720px, 360px, 0px);
  }

  &__bottom {
    clip: rect(360px, 720px, 720px, 0px);
  }

  &--bg {
    background: var(--color-dune-blue);
  }
}
</style>
