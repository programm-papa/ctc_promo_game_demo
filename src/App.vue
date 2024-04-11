<script setup>
import { ref } from 'vue'
import Fingerprint2 from 'fingerprintjs2'
// Попапы и лоадеры
import GamePreloader from './components/preloader/GamePreloader.vue'
import GameGyroPermission from './components/interface/GameGyroPermission.vue'
// Стор с состоянием приложения
import {
  useGameCondition,
  useUserCondition,
  usePreloaderCondition,
  useGyroCondition,
  useLevelCondition,
  useTimerCondition
} from '@/stores/index'
// Уровни
import GameLevelOne from '@/components/levels/GameLevelOne.vue'
import GameLevelTwo from './components/levels/GameLevelTwo.vue'
import GameLevelThree from './components/levels/GameLevelThree.vue'
import GameLevelFour from './components/levels/GameLevelFour.vue'
// Интерфейс (таймеры, отсчеты и тп)
import StartGameСounting from '@/components/timer/StartGameСounting.vue'
import GameTime from '@/components/timer/GameTime.vue'
import PenaltyTime from '@/components/timer/PenaltyTime.vue'
import GameResult from '@/components/interface/GameResult.vue'
import GameRegistration from '@/components/interface/GameRegistration.vue'
import GameReloadLevel from '@/components/interface/GameReloadLevel.vue'
// Заглушки и предупреждения
import MessageIphoneLoseGyro from './components/alerts/MessageIphoneLoseGyro.vue'
import MessageDesktop from '@/components/alerts/MessageDesktop.vue'
import MessageRotatePhone from '@/components/alerts/MessageRotatePhone.vue'

// Объединение сторов
const gameCondition = useGameCondition()
const preloaderCondition = usePreloaderCondition()
const gyroCondition = useGyroCondition()
const userCondition = useUserCondition()
const levelCondition = useLevelCondition()
const timerCondition = useTimerCondition()

// Создание фингерпринта
Fingerprint2.get(function (components) {
  const values = components.map(function (component, index) {
    if (index === 0) {
      // Replace the network of UA's WiFi or 4G in the WeChat browser, otherwise switching the network will not be the same
      return component.value.replace(/\bNetType\/\w+\b/, '')
    }
    return component.value
  })
  // Generate the final ID Murmur
  const murmur = Fingerprint2.x64hash128(values.join(''), 31)
  userCondition.fingerprint = murmur
  userCondition.loadUserData() // Загружаем данные о юзере после получения фингерпринт
})

// Загрузка фонов
const listPreloadBg = ref([])
listPreloadBg.value.push(new Image('/backgrounds/background.webp'))
listPreloadBg.value.push(new Image('/backgrounds/background_2.webp'))
listPreloadBg.value.push(new Image('/backgrounds/background_3.webp'))
listPreloadBg.value.push(new Image('/backgrounds/background_4.webp'))
</script>

<template>
  <GamePreloader v-if="preloaderCondition.isShowPreloader" />
  <GameGyroPermission
    v-if="
      gyroCondition.isNeedReqGyroPermission &&
      !gyroCondition.isDeviseHasGyro &&
      gyroCondition.resGyroPermission !== false
    "
  />
  <GameReloadLevel v-if="levelCondition.showReloadBtn" />
  <!-- TODO: сделать заглушку на отсутствие гироскопа -->
  <!-- TODO: сделать заглушку на отключенный гироскоп -->
  <div
    :class="`game-bg_${gameCondition.currentLevel}`"
    v-if="gyroCondition.isDeviseHasGyro && !levelCondition.isLevelFinished"
  >
    <GameLevelOne v-if="gameCondition.currentLevel === 1" />
    <GameLevelTwo v-if="gameCondition.currentLevel === 2" />
    <GameLevelThree v-if="gameCondition.currentLevel === 3" />
    <GameLevelFour v-if="gameCondition.currentLevel === 4" />
  </div>
  <StartGameСounting
    v-if="
      !levelCondition.isLevelFinished &&
      levelCondition.isReadyToStartLevel &&
      !levelCondition.isGameRunnin
    "
  />
  <GameTime v-if="timerCondition.isTimerStart || gameCondition.isShowLevelTutorial" />
  <PenaltyTime v-for="item in timerCondition.listPenaltyTime" :key="item.id" :itemId="item.id" />
  <GameRegistration v-if="gameCondition.isShowRegistration" />
  <!-- <GameResult v-if="true" /> -->
  <GameResult v-if="gameCondition.isShowGameResult" />

  <!-- <MessageIphoneLoseGyro v-if="true"/> -->
  <MessageIphoneLoseGyro
    v-if="gyroCondition.isNeedReqGyroPermission && gyroCondition.resGyroPermission === false"
  />
  <MessageRotatePhone />
  <MessageDesktop />
</template>

<style lang="scss" scoped>
</style>
