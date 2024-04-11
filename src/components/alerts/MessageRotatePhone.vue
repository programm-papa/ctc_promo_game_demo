<template>
  <div class="message-rotate-phone">
    <div class="message-rotate-phone__content">
      <img src="/alerts/rotate_phone.webp" alt="" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.message-rotate-phone {
  display: none;
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  padding: 20px;
  background-color: rgb(202, 233, 255);
  &__content {
    width: 100%;
    height: 100%;
    border: 1px solid #000;
    border-radius: 15rem;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  @media (orientation: landscape) and (hover: none) {
    display: block;
    z-index: 1001;
  }
}
</style>
