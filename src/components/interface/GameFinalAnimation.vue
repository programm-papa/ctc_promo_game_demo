<template>
  <Vue3Lottie
    class="finish-animation"
    :animationData="gameFinalAnimJson"
    :speed="2"
    :loop="true"
  />
</template>

<script setup lang="ts">
import gameFinalAnimJson from '@/assets/loaders/GameFinalAnimation.json'

//@onComplete="doAfterEndedPreloader"
</script>

<style lang="scss" scoped>
.finish-animation {
position: fixed;
left: 0;
top: 0;
z-index: 101;
height: 100%;
padding: 0rem;
background-color: #000;
image {
  height: 100vh !important;
  width: auto !important;
}
}
</style>
