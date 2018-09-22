<template>
  <div id="app">
    <Content></Content>
    <TitleText></TitleText>
  </div>
</template>

<script>
import Content from "@/components/organisms/Content";
import TitleText from "@/components/molecules/TitleText";

export default {
  name: "app",
  components: {
    Content,
    TitleText,
  }
};
</script>

<style lang="scss">
 @import '@/assets/styles/reset.scss';
  @import '@/assets/styles/colors.scss';

  #app {
    display: grid;
    width: 100vw;
    height: 100vh;
    background-color: var(--color-solar-sand);

    grid-template-columns: 1fr;
    grid-template-areas:
     "content"
     "footer";
  }

</style>
