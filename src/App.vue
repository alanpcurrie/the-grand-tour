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
 @import '@/assets/styles/global.scss';

 body {
    background-color: var(--color-solar-sand);
 }

   #app {
     display: grid;
     max-width: 80vw;
     margin: 0 auto;
     background-color: var(--color-solar-sand);
   }

</style>
