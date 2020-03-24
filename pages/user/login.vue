<template lang="pug">
  .user-login
    .main-contents
      el-form
        el-form-item(label="メールアドレス")
          el-input(v-model="mail")
        el-form-item(label="パスワード")
          el-input(v-model="password" type="password")
      el-button.button(type="primary" @click="login") ログイン
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    const data = {
      mail: '',
      password: ''
    }
    return data
  },
  methods: {
    async login() {
      try {
        await this.$store.dispatch('login', {
          mail: this.mail,
          password: this.password
        })
        this.$notify({
          type: 'success',
          title: 'ログイン成功',
          message: ''
        })
        this.$router.push(`/user/${this.$store.state.uid}/list`)
      } catch (e) {
        console.error(e)
        this.$notify.error({
          title: 'ログイン失敗',
          message: '不正なユーザーです'
        })
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.user-login {
  .button {
    text-align: center;
    margin: 0 auto;
    display: block;
    margin-top: 15px;
    width: 200px;
  }
}
</style>
