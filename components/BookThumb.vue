<template lang="pug">
  .book
    .book-image
    .book-texts
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import bookData from '~/data/sample-book.json'
type Config = typeof bookData
export default Vue.extend({
  props: {
    book: {
      default: bookData,
      type: Object,
      require: false
    } as PropOptions<Config>
  }
})
</script>

<style lang="scss">
.book {
  width: 100px;
  height: 100px;
}
</style>
