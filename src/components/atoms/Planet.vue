<template>
    <div class="planet"></div>
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

    .planet {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #555;
    }

</style>
