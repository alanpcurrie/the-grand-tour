<template>
 <div class="saturn__wrapper">
    <div class="saturn">

        <div class="planet"></div>
        <div class="planet--semi"> </div>
        <div class="planet__eclipse--four"></div>
        <div class="planet__eclipse--four--semi"> </div>
        <div class="planet__eclipse--three"></div>
        <div class="planet__eclipse--three--semi"> </div>
        <div class="planet__eclipse--two"></div>
        <div class="planet__eclipse--two--semi"> </div>
        <div class="planet__eclipse--one"></div>
         <div class="planet bottom planet--bg"></div>
         <div class="planet planet__top planet--bg"></div>
         <div class="saturn__rings"></div>
      </div>
  </div>
</template>

<script>
import Planetoid from "@/components/atoms/Planetoid";

export default {
  name: "Saturn",
  components: {
    Planetoid
  },
  props: {
    size: String,
    color: String,
    opacity: String,
    tail: String
  }
};
</script>


<style lang="scss" scoped>
//  multiplication factors for converting saturn element sizes
// 2.2222
//  1.636366364
.saturn {
  position: relative;
  margin: 0 auto;
  width: 100vw;
  height: 100vw;
  transform: rotateZ(-55deg);

  &__wrapper {
    position: relative;
    overflow: hidden;
    bottom: -21vh;
    right: 7vw;
  }

  &__rings {
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      ellipse at center,
      rgba(24, 19, 25, 0) 0%,
      rgba(53, 52, 51, 0) 34%,
      rgba(251, 166, 49, 1) 34%,
      rgba(251, 166, 49, 1) 42%,
      rgba(118, 28, 89, 1) 42%,
      rgba(118, 28, 89, 1) 60%,
      rgba(198, 33, 50, 1) 60%,
      rgba(198, 33, 50, 1) 71%,
      rgba(198, 33, 50, 0) 71%,
      rgba(198, 33, 50, 0) 100%
    );
    transform: rotateX(82deg);
  }
  &::after {
    content: "";
    z-index: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      ellipse at center,
      rgba(24, 19, 25, 0) 0%,
      rgba(53, 52, 51, 0) 34%,
      rgba(53, 52, 51, 0) 34%,
      rgba(53, 52, 51, 0) 42%,
      rgba(118, 28, 89, 1) 42%,
      rgba(118, 28, 89, 1) 60%,
      rgba(53, 52, 51, 0) 60%,
      rgba(53, 52, 51, 0) 71%,
      rgba(198, 33, 50, 0) 71%,
      rgba(198, 33, 50, 0) 100%
    );
    transform: rotateX(82deg);
  }
}

.planet {
  position: absolute;
  z-index: 0;
  top: 27.5vw;
  left: 27.5vw;
  width: 45vw;
  height: 45vw;
  border-radius: 50%;
  background: rgba(#00817b, 0.5);

  &__top {
    clip-path: rect(0px, 45vw, 22.5vw, 0px);
  }

  &--semi {
    position: absolute;
    top: 27vw;
    left: 27vw;
    height: 22vw;
    width: 45vw;
    border-radius: 64vw 64vw 0 0;
    z-index: 0;
    background: rgba(#00817b, 0.8);
    transform: rotate(359deg);
    overflow: hidden;
  }

  &__eclipse {
    &--one {
      position: absolute;
      top: 30.5vw;
      left: 35.5vw;
      width: 22.5vw;
      height: 22.5vw;
      border-radius: 50%;
      z-index: 0;
      background: rgba(#003823, 0.7);
    }

    &--two {
      position: absolute;
      top: 28.3vw;
      left: 32vw;
      height: 32vw;
      width: 32vw;
      border-radius: 50%;
      z-index: 0;
      background: rgba(#006740, 0.9);

      &--semi {
        position: absolute;
        top: 28.3vw;
        left: 32vw;
        height: 19vw;
        width: 31.5vw;
        border-radius: 64vw 64vw 0 0;
        z-index: 0;
        background: rgba(#006740, 0.6);
        transform: rotate(358deg);
        overflow: hidden;
      }
    }

    &--three {
      position: absolute;
      top: 27.5vw;
      left: 29.5vw;
      width: 38vw;
      height: 38vw;
      border-radius: 50%;
      z-index: 20;
      background: #007444;

      &--semi {
        position: absolute;
        top: 27.3vw;
        left: 29.2vw;
        height: 19.7vw;
        width: 38vw;
        border-radius: 64vw 64vw 0 0;
        z-index: 12;
        background: rgba(#007444, 0.7);
        transform: rotate(359deg);
        overflow: hidden;
      }
    }

    &--four {
      position: absolute;
      top: 27.5vw;
      left: 28.5vw;
      width: 42vw;
      height: 42vw;
      border-radius: 50%;
      z-index: 20;
      background: #00989a;

      &--semi {
        position: absolute;
        top: 27.3vw;
        left: 28vw;
        height: 22vw;
        width: 42vw;
        border-radius: 64vw 64vw 0 0;
        z-index: 12;
        background: rgba(#0198ad, 0.1);
        transform: rotate(358deg);
        overflow: hidden;
      }
    }
  }
}
</style>
