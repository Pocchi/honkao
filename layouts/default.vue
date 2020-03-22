<template lang="pug">
  .wrapper
    header
      .logo
        img(src="~/assets/images/logo@2x.png")
      nav
        ul
          li
            nuxt-link(to="/book/") 本の登録
    nuxt
</template>

<style lang="scss" scoped>
header {
  padding: 12px 10px;
  height: 70px;
  width: 100%;
  box-sizing: border-box;
  background: $main;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .logo {
    height: 100%;
  }
  img {
    height: 100%;
  }
}
.wrapper {
  height: 100vh;
  width: 100%;
  background: #f8fbf9;
}
nav {
  ul {
    display: flex;
    list-style: none;
  }
}
</style>
