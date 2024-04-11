<script setup lang="ts">
import { watch, onMounted, ref } from 'vue'
import {
  useUserCondition,
  useGameCondition,
  useLevelCondition,
  useTimerCondition
} from '@/stores/index'
import fetchData from '@/utils/fetch'

import GameDialog from './GameDialog.vue'
import GameFinalAnimation from './GameFinalAnimation.vue'

const userCondition = useUserCondition()
const gameCondition = useGameCondition()
const levelCondition = useLevelCondition()
const timerCondition = useTimerCondition()

const isShowFinalAnimation = ref(true)
const liderboard = ref<Array<any>>([])
const userTime = ref<string>('');

function loadLevelLiderboard() {
  fetchData(
    '/api/get-leaderboard',
    'GET',
    userCondition.fingerprint,
    undefined,
    gameCondition.currentLevel,
    3
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error()
      }
      return response.json()
    })
    .then((responseObject) => {
      liderboard.value = responseObject.data
    })
    .catch((err) => {
      console.log(err)
    })
}

const isInLiderboard = ref(false)
const inLiderbordTime = ref(false)

watch(
  liderboard,
  () => {
    isInLiderboard.value = !!liderboard.value.filter((item) => {
      return item.fingerprint === userCondition.fingerprint
    }).length

    inLiderbordTime.value =
      liderboard.value.filter((item) => {
        return item.fingerprint === userCondition.fingerprint
      })[0]?.play_time === timerCondition.getSeconds
  },
  { once: true }
)

onMounted(() => {
  userTime.value = timerCondition.timerSecondsValueStr;
})
// const isInLiderboard = computed(() => {
//   return !!liderboard.value.filter((item) => {
//     return item.fingerprint === userCondition.fingerprint
//   }).length
// })

// const inLiderbordTime = computed(() => {
//   return liderboard.value.filter((item) => {
//     return item.fingerprint === userCondition.fingerprint
//   })[0]?.play_time
// })

// TODO вынести работу со временем в отдельную утилиту
function time(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  const hDisplay = hours > 0 ? hours + ':' : ''
  const mDisplay = minutes < 10 ? '0' + minutes : minutes
  const sDisplay = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds

  return hDisplay + mDisplay + ':' + sDisplay
}

onMounted(() => {
  loadLevelLiderboard()
  setTimeout(() => {
    isShowFinalAnimation.value = false
  }, 10000)
})
</script>

<template>
  <GameFinalAnimation
    v-if="gameCondition.currentLevel === 4 && levelCondition.levelStatus && isShowFinalAnimation"
  />
  <GameDialog>
    <div class="game-liderboard">
      <img class="game-liderboard__bg" src="/backgrounds/game-result.webp" alt="" />
      <div class="game-liderboard__list">
        <img
          class="game-liderboard__list-title"
          :src="
            isInLiderboard && inLiderbordTime
              ? '/interfaceImg/in_top_text.webp'
              : '/interfaceImg/top_text.webp'
          "
          alt=""
        />
        <template v-for="(lider, index) in liderboard" :key="lider.fingerprint">
          <div
            class="game-liderboard__list-gamer"
            :class="{
              'game-liderboard__list-gamer_u': userCondition.fingerprint === lider.fingerprint
            }"
          >
            <p class="game-liderboard__list-gamer-name">{{ index + 1 + '. ' + lider.user_name }}</p>
            <p class="game-liderboard__list-gamer-time">{{ time(lider.play_time) }}</p>
          </div></template
        >
      </div>
    </div>
  </GameDialog>
  <div class="game-your-time">
    <img src="/backgrounds/your_time.webp" alt="" />
    <p class="game-your-time__value">
      {{ userTime }}
    </p>
  </div>
  <div class="game-controller">
    <img src="/interfaceImg/reload_yellow.webp" alt="" @click="gameCondition.restartLevel" />
    <img
      :src="
        gameCondition.currentLevel === 4
          ? '/interfaceImg/next_text.webp'
          : '/interfaceImg/next_yellow.webp'
      "
      alt=""
      v-if="levelCondition.levelStatus"
      @click="gameCondition.nextLevel"
    />
  </div>
</template>

<style lang="scss" scoped>
.game-liderboard {
  position: relative;
  width: 90%;
  margin: 0 auto;
  &__list {
    position: absolute;
    top: 5%;
    left: 10%;
    width: 80%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10rem;
    animation: fadeInAnimation 0.1s 0.1s ease-in-out both;
  }

  @keyframes fadeInAnimation {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  &__list-title {
    margin-bottom: 5%;
  }
  &__list-gamer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: rgb(170, 0, 0);
    // animation: fadeInAnimation 0.1s 0.2s ease-in-out both;
    &_u {
      animation: yourTopAnimation 0.7s infinite;
      @keyframes yourTopAnimation {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
        100% {
          transform: scale(1);
        }
      }
    }
  }

  &__list-gamer-name {
    position: relative;
    font-size: 18rem;
    text-wrap: nowrap;
    text-transform: uppercase;
    text-align: center;
  }
  &__list-gamer-time {
    font-size: 30rem;
  }
}

.game-your-time {
  position: fixed;
  bottom: 0;
  left: calc(30%);
  z-index: 100;
  width: 40%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  transform: translateY(100%);
  animation: gameYourTimeAnimation 0.7s 1s ease both;

  @keyframes gameYourTimeAnimation {
    0% {
      transform: translateY(100%);
    }
    100% {
      transform: translateY(0%);
    }
  }
  // transform: translateY(100%);
  img {
    width: 100%;
    height: auto;
    // animation: gameYourTimeAnimation 0.7s 1s ease both;

    // @keyframes gameYourTimeAnimation {
    //   0% {
    //     transform: translateY(100%);
    //   }
    //   100% {
    //     transform: translateY(0%);
    //   }
    // }
  }

  &__value {
    position: absolute;
    top: 25%;
    // Стили текста
    font-size: 30rem;
    text-wrap: nowrap;
    text-transform: uppercase;
    text-align: center;
    color: rgb(170, 0, 0);
    // animation: gameYourTimeAnimation 0.7s 1s ease both;
    // @keyframes gameYourTimeValueAnimation {
    //   0% {
    //     transform: translateY(100%);
    //   }
    //   100% {
    //     transform: translateY(0%);
    //   }
    // }
  }
}

.game-controller {
  position: fixed;
  z-index: 100;
  bottom: 5%;
  left: 0;
  height: 10%;
  width: 100%;
  padding: 0 10rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  img {
    height: 100%;
    width: 25%;
    object-fit: contain;
  }
}
</style>
