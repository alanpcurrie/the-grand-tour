<template>
<div>
    <div class="saturn">
        <div class="planet bottom planet--bg"></div>
        <div class="rings"></div>
        <div class="planet top planet--bg"></div>
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
  margin: auto;
  width: 400px;
  height: 400px;
  transform: rotateZ(-55deg);
}

.planet {
  position: absolute;
  top: 110px;
  left: 110px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: var(--color-dune-blue);

  &--bg {
    background: var(--color-dune-blue);
  }
}

.top {
  clip: rect(0px, 180px, 90px, 0px);
}

.bottom {
  clip: rect(90px, 180px, 180px, 0px);
}

.rings {
  position: relative;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    ellipse at center,
    rgba(24, 19, 25, 0) 0%,
    rgba(53, 52, 51, 0) 34%,
    rgba(251, 166, 49, 1) 36%,
    rgba(251, 166, 49, 1) 37%,
    rgba(251, 166, 49, 1) 38%,
    rgba(251, 166, 49, 1) 39%,
    rgba(251, 166, 49, 1) 40%,
    rgba(251, 166, 49, 1) 41%,
    rgba(118, 28, 89, 1) 42%,
    rgba(118, 28, 89, 1) 44%,
    rgba(118, 28, 89, 1) 46%,
    rgba(118, 28, 89, 1) 48%,
    rgba(118, 28, 89, 1) 49%,
    rgba(118, 28, 89, 1) 51%,
    rgba(118, 28, 89, 1) 52%,
    rgba(118, 28, 89, 1) 53%,
    rgba(118, 28, 89, 1) 54%,
    rgba(118, 28, 89, 1) 55%,
    rgba(118, 28, 89, 1) 56%,
    rgba(118, 28, 89, 1) 58%,
    rgba(198, 33, 50, 1) 60%,
    rgba(198, 33, 50, 1) 61%,
    rgba(198, 33, 50, 1) 62%,
    rgba(198, 33, 50, 1) 63%,
    rgba(198, 33, 50, 1) 65%,
    rgba(198, 33, 50, 1) 67%,
    rgba(198, 33, 50, 1) 68%,
    rgba(198, 33, 50, 1) 69%,
    rgba(198, 33, 50, 1) 70%,
    rgba(198, 33, 50, 0) 71%,
    rgba(77, 72, 76, 0) 72%,
    rgba(198, 33, 50, 0) 100%
  );
  transform: rotateX(80deg);
}
</style>
