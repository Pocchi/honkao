<template lang="pug">
  .user-complete
    .main-contents
      .meter-wrap
        .meter-image
          img(src="~/assets/images/post-ogp.png")
        .twitter-share
          a.twitter-share-button(href="https://twitter.com/share?ref_src=twsrc%5Etfw"
            :data-text="text"
            :data-url="url"
            data-hashtags="honkao, ほんかお"
            data-show-count="false"
            data-size="large"
            data-lang="ja"
            )
            | ツイート
        .meter(v-if="budget > 0")
          .meter-text {{bought.toLocaleString()}}円(購入) / {{budget.toLocaleString()}}円(予算)
      h2.title 今月買った本
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
    url(): string {
      return `${process.env.host}/user/${this.uid}/${this.month}/complete`
    },
    text(): string {
      return `今月の本の購入予算を達成しました！`
    },
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
  },
  head() {
    return {
      title: `honkao - 本の購入管理`,
      meta: [
        { hid: 'description', name: 'description', content: `予算達成！` },
        { hid: 'og:type', property: 'og:type', content: 'article' },
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'honkao - 本の購入管理'
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: `${process.env.host}/assets/images/post-image.png`
        },
        {
          hid: 'twitter:card',
          name: 'twitter:card',
          content: 'summary_large_image'
        },
        { hid: 'twitter:site', name: 'twitter:site', content: '@_P0cChi_' },
        { hid: 'twitter:player', name: 'twitter:player', content: '@_PocChi_' },
        {
          hid: 'twitter:image',
          property: 'twitter:image',
          content: `${process.env.host}/static/post-image.png`
        },
        { hid: 'twitter:description', name: 'twitter:description', content: '' }
      ],
      script: [
        {
          src: 'https://platform.twitter.com/widgets.js',
          async: true,
          charset: 'utf-8'
        }
      ]
    }
  }
})
</script>

<style lang="scss" scoped>
.user-complete {
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
    margin: 10px 0 35px;
  }
  .meter-image {
    width: 100%;
    img {
      width: 100%;
    }
  }
  .twitter-share {
    text-align: center;
  }
}
</style>
