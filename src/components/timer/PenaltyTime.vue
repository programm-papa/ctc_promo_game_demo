<script setup lang="ts">
import { useTimerCondition } from '@/stores/index'
import { onMounted, ref } from 'vue'

interface IPenaltyTimeProps {
  itemId: number
}

const props = defineProps<IPenaltyTimeProps>()

const timerCondition = useTimerCondition()
const penaltyTimeItem = ref()

onMounted(() => {
  penaltyTimeItem.value.addEventListener('animationend', () => {
    timerCondition.removePenaltyTimeObject(props.itemId)
  })
})
</script>

<template>
  <div class="penalty-time" ref="penaltyTimeItem">
    <img src="/interfaceImg/penaltyTime.webp" alt="" />
  </div>
</template>

<style lang="scss" scoped>
.penalty-time {
  position: fixed;
  right: 0;
  top: 0;
  z-index: 3;
  width: 10vw;
  height: 10vw;
  transform: translate(-45vw, calc(50vh - 5vw)) scale(4);

  animation: penaltyTimeAnim ease-in-out 0.7s;

  @keyframes penaltyTimeAnim {
    0% {
      transform: translate(-45vw, calc(50vh - 5vw)) scale(4);
    }
    99% {
      transform: translate(-50%, 10%) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, 10%) scale(1);
      opacity: 0;
    }
  }
}
</style>
