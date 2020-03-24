<template lang="pug">
  .user-setting
    .main-contents
      el-form
        el-form-item(label="予算入力" :rules="rules")
          el-input(v-model="price")
            template(slot="append") 円
      el-button.button(type="primary" @click="onClickPriceButton") 登録
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    const data = {
      price: 0,
      rules: {
        price: [
          {
            required: true,
            message: '入力してください。'
          },
          {
            max: 7,
            message: '7桁以内で入力してください。'
          },
          {
            min: 3,
            message: '3桁以上で入力してください。'
          },
          {
            type: 'number',
            message: '数値で入力してください。'
          }
        ]
      }
    }
    return data
  },
  methods: {
    onClickPriceButton(): void {
      if (Number.isNaN(this.price)) {
        console.log(this.price)
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
