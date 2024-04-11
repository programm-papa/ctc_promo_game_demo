import { defineStore } from "pinia";
import { ref, computed } from "vue";

import { usePreloaderCondition } from "./usePreloaderCondition";
import { useGyroCondition } from "./useGyroCondition";

export const useLevelCondition = defineStore('useLevelCondition', () => {
  const preloaderCondition = usePreloaderCondition();
  const gyroCondition = useGyroCondition();
  /*
    * СОСТОЯНИЕ ИГРОВОГО ПОЛЯ И УРОВНЯ
  */
  // Игровое поле готово
  const isGameMapReady = ref<boolean>(false);
  //  Уровень готов к старту
  const isReadyToStartLevel = computed(() => {
    return isGameMapReady.value && !preloaderCondition.isShowPreloader && gyroCondition.isDeviseHasGyro;
  })
  // Уровень/игра запущена
  const isGameRunnin = ref<boolean>(false);
  const isLevelFinished = ref<boolean>(false);
  const levelStatus = ref<boolean>(false);

  const showReloadBtn = ref<boolean>(false);
  const endLvl = ref<boolean>(false);
  const win = ref<boolean>(false);
  const fail = ref<boolean>(false);

  function startGameRunnin() {
    // console.log('startGameRunnin')
    isGameRunnin.value = true;
  }

  function stopGame() {
    isGameRunnin.value = false;
  }

  function setLevelStatus(status: boolean) {
    levelStatus.value = status;
  }

  function finishLevel() {
    // console.log('finishLevel')
    isGameMapReady.value = false;
    isLevelFinished.value = true;
  }

  function resetLevelStatus() {
    isLevelFinished.value = false
    levelStatus.value = false
    resetLevel();
  }

  function resetLevel() {
    endLvl.value = false;
    win.value = false;
    fail.value = false;
    showReloadBtn.value = false;
  }

  return {
    isGameMapReady,
    isReadyToStartLevel,
    isGameRunnin,
    isLevelFinished,
    levelStatus,
    showReloadBtn,
    endLvl,
    win,
    fail,
    startGameRunnin,
    stopGame,
    finishLevel,
    resetLevelStatus,
    setLevelStatus
  }
})