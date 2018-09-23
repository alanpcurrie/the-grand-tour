<template>
  <div class="footer">
    <span class="section__title-text">
      <p class="intro-text">A ONCE IN A LIFETIME GETAWAY</p>
      <h1 class="title-text">THE GRAND TOUR</h1>
      <hr class="title-text__underline">
    </span>
       <div class="footer__bottom">
      <span class="section__left-text">
        <p class="planet-text">JUPITER  /  SATURN  /  URANUS  /  NEPTUNE </p>
        <p class="tourist-text">EXPERIENCE THE GHARM OF GRAVITY ASSISTS </p>
      </span>
      <P class="arrow-label-text">EVERY <span class="arrow-label-text--oval">173</span> YEARS</P>
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

  &__bottom {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
}

.section {
  &__title-text {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }

  &__left-text {
    display: flex;
    flex-direction: column;
  }
}

.intro-text {
  color: var(--color-space-suit-orange);
  letter-spacing: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
}

.title-text {
  font-size: 10rem;
  font-family: Anton, sans-serif;

  &__underline {
    width: 92%;
    height: 2px;
    color: var(--color-mars-red);
  }
}

.planet-text {
  color: var(--color-dune-blue);
  font-weight: 600;
  font-size: 1rem;
  font-family: "Roboto", sans-serif;
  line-height: 2rem;
}

.tourist-text {
  color: var(--color-black);
  font-weight: 600;
  font-size: 1rem;
  font-family: "Old Standard TT", serif;
  line-height: 2rem;
}

.arrow-label-text {
  display: inline-flex;
  align-items: center;
  justify-content: space-around;
  padding: 0.8rem;
  width: 12rem;
  height: 2.5rem;
  background-color: var(--color-space-suit-orange);
  color: var(--color-solar-sand);

  &::before {
    position: relative;
    right: 2.1rem;
    z-index: 1;
    width: 0;
    height: 0;
    border-width: 42px 20px 42px 0;
    border-style: solid;
    border-color: transparent var(--color-space-suit-orange) transparent transparent;
    content: "";
  }

  &--oval {
    padding: 0.4rem;
    max-width: 160px;
    max-height: 80px;
    border-radius: 50%;
    background-color: var(--color-vader-black);
    color: var(--color-dune-blue);
  }
}

.boarding-label-text {
  padding: 1rem;
  border: 2px solid var(--color-dune-blue);
  font-size: 2rem;
}
</style>
