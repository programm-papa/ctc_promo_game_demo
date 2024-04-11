<template>
    <img src="/interfaceImg/reload.webp" alt="" class="reload-level" @click="reloadGame">
</template>

<script setup lang="ts">
import { useLevelCondition, useTimerCondition } from '@/stores';

const levelCondition = useLevelCondition();
const timerCondition = useTimerCondition();

function reloadGame() {
    timerCondition.stopTimer()
    levelCondition.endLvl = true;
    levelCondition.fail = true;
}
</script>

<style lang="scss" scoped>
.reload-level {
    position: absolute;
    top: 10px;
    left: 10rem;
    width: 32rem;
    height: 32rem;
    animation: reloadLevelAnim .5s ease-in-out both;
    @keyframes reloadLevelAnim {
        0% {
            transform: rotate(0deg);
        } 100% {
            transform: rotate(360deg);
        }
    }
}
</style>