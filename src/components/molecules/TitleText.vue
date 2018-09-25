<template>
  <div class="footer">
    <div class="section__title-text">
      <p class="intro-text">A ONCE IN A LIFETIME GETAWAY</p>
      <h1 class="title-text">THE GRAND TOUR</h1>
      <hr class="title-text__underline">
    </div>
    <div class="footer__bottom">
      <div class="section__left-text">
        <p class="planet-text">JUPITER  <span class="planet-text__slash">/</span> SATURN   <span class="planet-text__slash">/</span>   URANUS   <span class="planet-text__slash">/</span>   NEPTUNE </p>
        <p class="tourist-text">EXPERIENCE THE GHARM OF GRAVITY ASSISTS </p>
      </div>
       <div class="section__center-text">
         <P class="arrow-label-text">EVERY <span class="arrow-label-text--oval">173</span> YEARS</P>
      </div>
        <div class="section__right-text">
           <P class="boarding-label-text">NOW BOARDING</P>
        </div>
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
@import "@/assets/styles/global.scss";
.footer {
  display: grid;

  &__bottom {
    padding: 1rem;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: calc(5px + 0.1vw);
    grid-template-areas: "footer";

    @include md {
      grid-template-areas: "footer footer footer";
    }
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

  &__center-text {
    padding: 1rem;
  }

  &__right-text {
    padding: 1rem;
  }
}

.intro-text {
  color: var(--color-space-suit-orange);
  letter-spacing: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
}

.title-text {
  font-size: calc(9rem + 1.5vw);
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

  &__slash {
    color: var(--color-yoda-green);
  }
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
  text-align: center;
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
    border-color: transparent var(--color-space-suit-orange) transparent
      transparent;
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
  text-align: center;
}
</style>
