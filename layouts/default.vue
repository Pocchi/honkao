<template lang="pug">
  .wrapper
    header
      .logo
        img(src="~/assets/images/logo@2x.png")
      nav
        ul
          li
            nuxt-link(to="/book/") 本の登録
          li
            nuxt-link(to="/user/setting") 予算登録
          li(v-if="uid")
            nuxt-link(:to="`/user/${uid}/${month}/list`") 買った本
    nuxt
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  computed: {
    uid(): string {
      return this.$store.state.uid
    },
    month(): string {
      return this.$store.state.month
    }
  }
})
</script>

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
  li {
    &:not(:first-child) {
      margin-left: 10px;
    }
  }
}
</style>
