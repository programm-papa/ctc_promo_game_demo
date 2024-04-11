<script setup lang="ts">
import { ref } from 'vue'
import { useUserCondition, useGameCondition } from '@/stores/index'

import GameDialog from './GameDialog.vue'
import fetchData from '@/utils/fetch'

const userCondition = useUserCondition()
const gameCondition = useGameCondition();

const generatedName = ref<any>('')

function registerUser() {
  fetchData('/api/generate-name', 'GET', userCondition.fingerprint)
    .then((response) => {
      if (!response.ok) {
        throw new Error()
      }
      return response.json()
    })
    .then((responseObject) => {
      generatedName.value = responseObject.data;
    })
    .catch((err) => {
      console.log(err)
    })
}

async function approveName() {
  await gameCondition.setStartLvl();
  await gameCondition.setEndtLvl();
  gameCondition.isShowRegistration = false;
  userCondition.isUserRegistrationRedy = true;
  gameCondition.closeRegistration();
}

registerUser();
</script>

<template>
  <GameDialog />
  <div class="game-registration">
    <!-- <div class="game-registration__title"></div> -->
    <img
      class="game-registration__title"
      src="/registrarion/game-registration__title.webp"
      alt=""
    />
    <div class="game-registration__name">
      {{ generatedName }}
    </div>
    <div class="game-registration__control">
      <img
        src="/registrarion/game-registration__control-regenerate.webp"
        alt=""
        class="game-registration__control-regenerate"
        @click="registerUser"
      />
      <img
        src="/registrarion/game-registration__control-approve.webp"
        alt=""
        class="game-registration__control-approve"
        @click="approveName"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.game-registration {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  height: 100%;
  width: 100%;
  padding: 0 10rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20rem;
  img {
    height: 100%;
  }

  &__title {
    width: 50%;
    height: auto !important;
  }
  &__name {
    width: 90%;
    height: 70rem;
    background: url('/registrarion/input-bg.webp') center center no-repeat;
    background-size: cover;

    display: flex;
    align-items: center;
    justify-content: center;
    // Стили текста
    font-size: 30rem;
    text-align: center;
    // text-wrap: nowrap;
    
  }

  &__control {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 90%;
  }
  &__control-regenerate,
  &__control-approve {
    width: 45%;
    height: auto !important;
  }
}
</style>
