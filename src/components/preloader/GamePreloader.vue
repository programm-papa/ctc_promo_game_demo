<script setup lang="ts">
import { usePreloaderCondition } from '@/stores/index'
// import DogLoaderBG from '@/assets/loaders/DogLoaderBG.mp4'
import { Vue3Lottie } from 'vue3-lottie'

const preloaderCondition = usePreloaderCondition()

function doAfterEndedPreloader(): void {
  preloaderCondition.setNextLoader()
}
</script>

<template>
  <div class="preloader" :class="preloaderCondition.currentLoader?.class">
    <template v-for="loader in preloaderCondition.listLoaderTypes" :key="loader.loaderType">
      <template v-if="loader.loaderType === preloaderCondition.currentLoader?.loaderType">
        <div
          class="close-preloader"
          v-if="
            preloaderCondition.currentLoader &&
            preloaderCondition.currentLoader.controll &&
            preloaderCondition.isFinishPreloader &&
            preloaderCondition.isTutorialCompleted
          "
          @click="preloaderCondition.setNextLoader()"
        >
          <img v-if="loader.color" :src="`/interfaceImg/${loader.color}_close.webp`" alt="" />
        </div>
        <Vue3Lottie
          :animationData="loader.lottieUrl"
          :speed="loader.speed"
          :loop="false"
          @onComplete="doAfterEndedPreloader"
        />
        <!-- <div :class="loader.class">
          <video
            autoplay
            muted
            playsinline
            class="loader-dog__special-bg"
            v-if="loader.loaderType === 'DogLoader'"
          >
            <source :src="DogLoaderBG" />
          </video>
          <video autoplay muted playsinline @ended="doAfterEndedVideo">
            <source :src="loader.videoUrl" />
          </video>
        </div> -->
      </template>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.preloader {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;

  height: 100vh;
  height: 100dvh;
  width: 100vw;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: rgb(202, 233, 255);

  audio {
    display: none;
  }

  &.loader-first {
    background-color: #000;
    padding: 10%;
  }

  &.loader-dog {
    // padding: 20px;
    // margin: 20px;
    padding: 0 20px;
    .lottie-animation-container {
      height: fit-content;
      display: flex;
      border: 1px solid #000;
      border-radius: 14rem;
    }
  }
  &.loader-tutorial {
    padding: 0 20px;
    .lottie-animation-container {
      height: fit-content;
      display: flex;
      border: 1px solid #000;
      border-radius: 14rem;
    }
  }

  .close-preloader {
    width: 40rem;
    height: 40rem;
    border-radius: 100%;

    position: absolute;
    z-index: 2;
    right: 10px;
    top: 10px;

    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
