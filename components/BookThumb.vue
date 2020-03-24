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

<style lang="scss" scoped>
.book {
  width: 200px;
  box-sizing: border-box;
  border: 1px solid #999;
  padding: 20px 10px;
  text-align: center;
  img {
    width: 100px;
  }
  .book-texts {
    margin-top: 5px;
  }
  &.small {
    max-width: 120px;
    width: 100%;
    padding: 10px 5px;
    img {
      width: calc(100% - 20px);
    }
  }
}
</style>
