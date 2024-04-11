<script setup lang="ts">
interface ISatietyConditionProps {
  eated: number
  foodNumberToWin: number
}

const props = defineProps<ISatietyConditionProps>()
</script>

<template>
  <div
    class="satiety-condition"
    :class="{ 'satiety-condition_big': props.foodNumberToWin / 2 > 5 }"
  >
    <!-- <img src="/interfaceImg/low.webp" alt="" /> -->
    <div
      v-for="foodCounterIndex in props.foodNumberToWin / 2"
      :key="`satiety-condition__food-counter${foodCounterIndex}`"
      class="satiety-condition__food-counter"
      :class="{
        'satiety-condition__food-counter_full-partial': props.eated + 1 >= foodCounterIndex * 2,
        'satiety-condition__food-counter_full': props.eated >= foodCounterIndex * 2
      }"
    ></div>
    <!-- <div class="satiety-condition__food-counter satiety-condition__food-counter_full"></div>
    <div class="satiety-condition__food-counter satiety-condition__food-counter_full-partial"></div>
    <div class="satiety-condition__food-counter"></div> -->
    <!-- <img src="/interfaceImg/full.webp" alt="" /> -->
  </div>
</template>

<style lang="scss" scoped>
.satiety-condition {
  position: fixed;
  right: 10rem;
  top: 50%;
  // transform: translateY(50%);
  width: 9vw;
  height: fit-content;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &_big {
    top: calc(50% - 9vw * 3);
  }

  &__food-counter {
    width: 9vw;
    height: 3vw;
    border-radius: 1.4vw;
    border: 0.5vw solid rgba(255, 255, 255, 1);
    // border: 5px solid rgba(255, 255, 255, 1)
    // height: 6vw;
    border: 1.5px solid #fff;
    &.satiety-condition__food-counter_full-partial {
      background: rgba(255, 255, 255, 0.55);
      animation: foodCounterAnim .7s ease-in-out;
      @keyframes foodCounterAnim {
      0% {
        transform: scale(1);
      }
      25% {
        transform: scale(1.2);
      }
      50% {
        transform: scale(1);
      }
      75% {
        transform: scale(1.2);
      }
      100% {
        transform: scale(1);
      }
    }
    }
    &.satiety-condition__food-counter_full {
      background-color: rgba(255, 255, 255, 1);
      animation: foodCounterAnimFull .7s ease-in-out;
      @keyframes foodCounterAnimFull {
      0% {
        transform: scale(1);
      }
      25% {
        transform: scale(1.2);
      }
      50% {
        transform: scale(1);
      }
      75% {
        transform: scale(1.2);
      }
      100% {
        transform: scale(1);
      }
    }
    }

    
  }

  img {
    &:first-of-type {
      position: absolute;
      bottom: 0;
      transform: translateY(100%);
    }
    &:last-of-type {
      position: absolute;
      top: 0;
      transform: translateY(-110%);
    }
  }
}
</style>
