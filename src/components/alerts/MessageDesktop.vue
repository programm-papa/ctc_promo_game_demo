<template>
  <div class="message-desctop">
    <div class="message-desctop__content">
      <img src="/alerts/desktop.webp" alt="" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.message-desctop {
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  padding: 20rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(202, 233, 255);
  &__content {
    width: auto;
    max-width: 960px;
    height: auto;
    // object-fit: contain;
    border-radius: 15px;
    overflow: hidden;
    border: 1px solid #000;
  }

  @media screen and (max-width: 768px) {
    display: none;
  }
}
</style>
