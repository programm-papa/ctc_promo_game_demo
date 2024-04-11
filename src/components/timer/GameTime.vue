<script setup lang="ts">
import { useTimerCondition } from '@/stores/index'

const timerCondition = useTimerCondition()
</script>

<template>
  <div class="game-timer" :class="{ 'game-timer_red': timerCondition.isTimerRed }">
    <!-- <img src="/interfaceImg/timer.png" alt="" /> -->
    <svg
      width="964"
      height="933"
      viewBox="0 0 964 933"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M454 598.5V282.5L559 278.5L561.5 293L563.5 477L736 475.5L733 585.5L727.5 590L454 598.5Z"
        fill="white"
      />
      <path
        d="M693.5 0C750.5 18.1667 884.4 82.8 964 196C949.667 205.667 912.3 234.1 877.5 270.5L842 238.5L809.5 277.5L664 160L682.5 125.5L638.5 100C648.833 75.5 674.3 21.2 693.5 0Z"
        fill="white"
      />
      <path
        d="M280 2.00096C222.667 14.8343 86.4 73.501 0 205.501C12.6667 218.167 48.2 250.1 89 276.5C94.5 268.667 110.9 249.9 132.5 237.5L169.5 283L314 156L299.5 116L333.5 98.5C328.833 82.3333 313.9 42.0002 291.5 10.001C290.667 6.66762 287.2 0.400955 280 2.00096Z"
        fill="white"
      />
      <circle cx="489.5" cy="519.5" r="348.5" stroke="white" stroke-width="130" />
    </svg>

    <span>{{ timerCondition.timerSecondsValueStr }}</span>
  </div>
</template>

<style lang="scss" scoped>
.game-timer {
  position: fixed;
  top: 10px;
  right: 10px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rem;

  // Стили текста
  font-family: 'CTCSans-ExtraBold';
  font-size: 30.5rem;
  color: #fff;

  span {
    width: 100rem;
  }

  svg {
    height: 32rem;
    width: auto;
  }

  &_red {
    color: rgb(170, 0, 0);
    animation: timerAnimation 1s;
    svg {
      path {
        fill: rgb(170, 0, 0);
      }
      circle {
        stroke: rgb(170, 0, 0);
      }
    }
  }

  @keyframes timerAnimation {
    0% {
      transform: scale(1.05);
    }
    10% {
      transform: scale(1);
    }
    20% {
      transform: scale(1.05);
    }
    30% {
      transform: scale(1);
    }
    40% {
      transform: scale(1.05);
    }
    50% {
      transform: scale(1);
    }
    60% {
      transform: scale(1.05);
    }
    70% {
      transform: scale(1);
    }
    80% {
      transform: scale(1.05);
    }
    90% {
      transform: scale(1);
    }
    100% {
      transform: scale(1.05);
    }
  }
}
</style>
