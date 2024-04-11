<template>
  <GameDialog>
    <div class="message-iphone-lose-gyro">
      <img class="message-iphone-lose-gyro__bg" src="/backgrounds/game-result.webp" alt="" />
      <img class="message-iphone-lose-gyro__text" src="/backgrounds/gyro-permission-lose.webp" alt="" />
    </div>
  </GameDialog>
</template>

<script setup lang="ts">
import GameDialog from '@/components/interface/GameDialog.vue'
</script>

<style lang="scss" scoped>
.message-iphone-lose-gyro {
  position: relative;
  width: 90%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  &__text {
    position: absolute;
    width: 80%;
    height: auto;
  }
}
</style>
