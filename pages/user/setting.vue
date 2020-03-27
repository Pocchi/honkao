<template lang="pug">
  .user-setting
    .main-contents
      h2.title 予算を入力する
      el-form
        el-form-item(label="予算")
          el-input(v-model="price")
            template(slot="append") 円
      el-button.button(type="primary" @click="onClickPriceButton") 登録
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    const data = {
      price: 0
    }
    return data
  },
  async mounted() {
    try {
      if (this.$store.state.monthData) {
        this.price = this.$store.state.monthData.budget
        return
      }
      await this.$store.dispatch('getUserMonthData', {
        uid: this.$store.state.uid,
        month: this.$store.state.month
      })
      this.price = this.$store.state.monthData.budget
    } catch (e) {
      console.error(e)
    }
  },
  methods: {
    async onClickPriceButton() {
      try {
        await this.$store.dispatch('setBudget', this.price)
        this.$notify({
          type: 'success',
          title: '登録成功',
          message: ''
        })
      } catch (e) {
        console.error(e)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.user-setting {
  .button {
    text-align: center;
    margin: 0 auto;
    display: block;
    margin-top: 15px;
    width: 200px;
  }
}
</style>
