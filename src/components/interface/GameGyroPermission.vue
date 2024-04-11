<script setup lang="ts">
import { useGyroCondition } from '@/stores/index'

const gyroCondition = useGyroCondition()

function permission() {
  (DeviceMotionEvent as any).requestPermission()
    .then((response: any) => {
      // (optional) Do something after API prompt dismissed.
      if (response == 'granted') {
        setDeviceMotionPermissionRes(true)
      } else {
        setDeviceMotionPermissionRes(false)
        sessionStorage.setItem('resGyroPermission', "false")
      }
    })
    .catch(console.error)
}

function setDeviceMotionPermissionRes(resValue: boolean): void {
  gyroCondition.resGyroPermission = resValue
}
</script>

<template>
  <div class="game-gyro-permission">
    <img src="/backgrounds/curtain.webp" alt="curtain" class="curtain" />
    <img src="/backgrounds/curtain.webp" alt="curtain" class="curtain curtain__inverted" />
    <img src="/backgrounds/curtain-top.webp" alt="top-curtain" class="curtain curtain__top" />
    <div class="game-gyro-permission__data">
      <img src="/backgrounds/gyro-permission.webp" alt="" class="game-gyro-permission__data-img" />
      <div class="game-gyro-permission__data-text">
        <div class="game-gyro-permission__data-confirm" @click="permission">
          <img
            src="/interfaceImg/gyro-approve-btn.webp"
            alt=""
            class="game-gyro-permission__data-confirm-background"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.game-gyro-permission {
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

  &__data {
    position: absolute;
    width: 90%;
  }

  &__data-text {
    position: absolute;
    bottom: 17%;
    width: 100%;
    padding: 0 10%;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10rem;
    p {
      font-size: 20rem;
      &.attention {
        font-size: 50rem;
      }
    }
  }

  &__data-confirm {
    margin-top: 10%;
    width: 90%;
    height: fit-content;
    display: flex;
    align-items: center;
    justify-content: center;
    &:active {
      opacity: 0.4;
    }
    p {
      position: absolute;
    }
  }
}
</style>
