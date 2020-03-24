<template lang="pug">
  .user-list
    .main-contents
      .meter-wrap
        p.title 今月の予算達成度
        .meter
          el-progress(percentage="50" :stroke-width="12")
        .meter-text 5,000円(購入) / 10,000円(予算)
      p.title 今月買った本
      .books
        .book-wrap(v-for="(book, index) in books" :key="index")
          Book.small(:book="book")
          .price 2,200円
</template>

<script lang="ts">
import Vue from 'vue'
import Book from '~/components/BookThumb.vue'
import bookData from '~/data/sample-book.json'
type Config = typeof bookData

export default Vue.extend({
  components: {
    Book
  },
  data() {
    const data = {
      books: [bookData, bookData, bookData, bookData, bookData, bookData]
    }
    return data
  }
})
</script>

<style lang="scss" scoped>
.user-list {
  .books {
    flex-wrap: wrap;
    display: flex;
  }
  .book-wrap {
    display: inline-block;
    width: calc(100% / 4);
    margin-bottom: 10px;
  }
  .price {
    text-align: center;
  }
  .meter {
    margin-bottom: 15px;
  }
  .meter-text {
    text-align: right;
    font-weight: bold;
    margin-bottom: 35px;
  }
}
</style>
