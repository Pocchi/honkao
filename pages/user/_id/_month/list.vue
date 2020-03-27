<template lang="pug">
  .user-list
    .main-contents
      .meter-wrap
        h2.title 今月の予算達成度
        .meter(v-if="budget > 0")
          el-progress(:percentage="percentage" :stroke-width="12")
          .meter-text {{bought.toLocaleString()}}円(購入) / {{budget.toLocaleString()}}円(予算)
        .meter-else-text(v-else)
          p 予算が設定されていません
      p.title 今月買った本
      .books
        .book-wrap(v-for="(book, index) in books" :key="index")
          Book.small(:book="book")
          .price {{book.price.toLocaleString()}}円
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
  asyncData({ params }) {
    const month = params.month
    const uid = params.id
    return {
      month,
      uid
    }
  },
  data() {
    return {
      month: '',
      uid: ''
    }
  },
  computed: {
    books(): any {
      return this.$store.state.boughtBooks || []
    },
    budget(): number {
      const data: number = this.$store.state.monthData.budget || 0
      return data
    },
    bought(): number {
      let sum = 0
      this.books.forEach((book: any) => {
        sum += book.price
      })
      return sum
    },
    percentage(): number {
      if (this.budget > 0) {
        return (this.bought / this.budget) * 100
      } else {
        return 0
      }
    }
  },
  async mounted() {
    if (!this.$store.state.uid) this.$router.push('/user/login')
    try {
      if (
        this.$store.state.monthData &&
        this.$store.state.monthData.created_at &&
        this.$store.state.uid === this.uid
      ) {
        return
      }
      await this.$store.dispatch('getUserMonthData', {
        uid: this.uid,
        month: this.month
      })
    } catch (e) {
      console.error(e)
    }
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
  .meter-wrap {
    height: 120px;
  }
  .meter {
    margin-bottom: 15px;
  }
  .meter-text {
    text-align: right;
    font-weight: bold;
    margin: 10px 0 35px;
  }
}
</style>
