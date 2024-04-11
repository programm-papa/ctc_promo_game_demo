<script setup lang="ts">
import { onMounted } from 'vue'

import { useGameStarCounterCondition, useGameCondition } from '@/stores/index'

// Состояние игры
const gameCondition = useGameCondition()
const gameStarCounterCondition = useGameStarCounterCondition()

onMounted(() => {
  // console.log('StartGameСounting')
  gameStarCounterCondition.startGameCounter()
})
</script>

<template>
  <div class="game-level-tutorial" v-if="gameCondition.isShowLevelTutorial">
    <img class="game-level-tutorial__time" src="/tutorial/time.webp" alt="" />
    <img class="game-level-tutorial__water" src="/tutorial/water.webp" alt="" />
    <img class="game-level-tutorial__food" src="/tutorial/food.webp" alt="" />
  </div>
  <div v-else class="game-counter">
    <img
      :src="`/numbers/${imgNumber}.webp`"
      alt=""
      class="game-counter__number-img"
      v-for="imgNumber in 3"
      :key="`game-counter__number-img${imgNumber}`"
      v-show="imgNumber === gameStarCounterCondition.startCounterValue"
    />
  </div>
</template>

<style lang="scss" scoped>
.game-level-tutorial {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.1);
  &__time {
    position: absolute;
    right: 50rem;
    top: 30rem;
    width: 40%;
    animation: tutorialFadeIn 0.5s 0.5s ease-in-out both;
  }
  &__food {
    position: absolute;
    top: calc(50% - 1.5vw);
    height: 27vw;
    right: 15vw;
    animation: tutorialFadeIn 0.5s 1s ease-in-out both;
  }
  &__water {
    position: absolute;
    right: 10rem;
    bottom: 30rem;
    width: 30%;
    animation: tutorialFadeIn 0.5s 1.5s ease-in-out both;
  }

  @keyframes tutorialFadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
}
.game-counter {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.1);
  // &::after {
  //   content: '';
  //   position: absolute;
  //   left: 0;
  //   top: 0;
  //   width: 100%;
  //   height: 100%;
  //   background: #000;
  //   opacity: 0.1;
  // }
  &__number-img {
    width: 50%;
    position: relative;
    z-index: 1;
  }
}
</style>
