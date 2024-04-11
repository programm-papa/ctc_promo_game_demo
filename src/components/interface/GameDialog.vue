<template>
    <div class="game-dialog">
      <img src="/backgrounds/curtain.webp" alt="curtain" class="curtain" />
      <img src="/backgrounds/curtain.webp" alt="curtain" class="curtain curtain__inverted" />
      <img src="/backgrounds/curtain-top.webp" alt="top-curtain" class="curtain curtain__top" />
      <div class="game-dialog__data">
        <slot />
      </div>
    </div>
  </template>
  
  <script setup lang="ts"></script>
  
  <style lang="scss" scoped>
  .game-dialog {
    position: fixed;
    z-index: 50;
    top: 0;
    left: 0;
  
    height: 100vh;
    height: 100dvh;
    width: 100vw;
  
    display: flex;
    align-items: center;
    justify-content: center;
  
    background-color: #000;
    background: url('/backgrounds/background.webp') center center no-repeat;
    background-size: cover;
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: #000;
      opacity: 0.5;
    }
  
    img.curtain {
      position: absolute;
      top: 0;
      height: 100%;
      width: 100%;
      object-fit: cover;
      transform: translateX(-10%);
  
      &.curtain__inverted {
        transform: scale(-1, 1) translateX(-10%);
      }
      &.curtain__top {
        transform: translateX(0);
      }
    }
  
    // &__data {
    //   position: absolute;
    //   width: 90%;
    // }
  }
  </style>
  