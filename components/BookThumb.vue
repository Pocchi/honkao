<template lang="pug">
  .book(v-if="book")
    .book-image
      img(:src="book.volumeInfo.imageLinks.smallThumbnail")
    .book-texts
      p(v-text="book.volumeInfo.title")
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import bookData from '~/data/sample-book.json'
type Config = typeof bookData
export default Vue.extend({
  props: {
    book: {
      default: () => bookData,
      type: Object,
      require: false
    } as PropOptions<Config>
  }
})
</script>

<style lang="scss">
.book {
  margin: 0 auto;
  border: 1px solid #999;
  padding: 20px 10px;
  width: 200px;
  text-align: center;
  img {
    width: 100px;
  }
  .book-texts {
    margin-top: 5px;
  }
}
</style>
