<template lang="pug">
  .book-camera
    .main-contents
      h2.title 本を登録する
      .book-camera-contents
        el-input.input-with-select(v-model="input")
          el-select(v-model="select" slot="prepend" placeholder="select")
            el-option(label="ISBN" value="ISBN")
          el-button(slot="append" icon="el-icon-search" @click="search")
        el-button.camera-button(type="primary" @click="modalShow = !modalShow") カメラを起動する
      .book-searched(v-if="book && book.volumeInfo")
        p 検索結果:
        .book-wrap
          Book(:book="book")
        .book-searched-input
          el-form
            el-form-item(label="価格入力")
              el-input(v-model="price")
                template(slot="append") 円
            .book-searched-buttons
              el-button(@click="onClickWant") 買いたい本に登録
              el-button(@click="onClickBought") 買った本に登録
    .modal(v-if="modalShow")
      .modal-camera
        .camera-area(ref="camera")
        .detect-area(ref="detect-area")
      el-button.camera-button(type="primary" @click="modalShow = !modalShow") カメラを閉じる
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment'
import Book from '~/components/BookThumb.vue'
import bookData from '~/data/sample-book.json'
type Config = typeof bookData

export default Vue.extend({
  components: {
    Book
  },
  data() {
    let Quagga: any
    const data = {
      Quagga,
      modalShow: false,
      select: 'ISBN',
      input: '9784873116211',
      book: {},
      price: 0
    }
    return data
  },
  computed: {
    budget(): number {
      const data: number = this.$store.state.monthData.budget || 0
      return data
    },
    books(): any {
      return this.$store.state.boughtBooks || []
    },
    bought(): number {
      let sum = 0
      this.books.forEach((book: any) => {
        sum += book.price
      })
      return sum
    }
  },
  watch: {
    modalShow() {
      this.$nextTick(() => {
        if (this.modalShow) {
          this.initQuagga()
        } else if (this.Quagga) {
          this.Quagga.stop()
        }
      })
    }
  },
  destroyed() {
    if (this.Quagga) this.Quagga.stop()
  },
  async mounted() {
    if (!this.$store.state.uid) this.$router.push('/user/login')
    try {
      if (this.$store.state.monthData) {
        return
      }
      await this.$store.dispatch('getUserMonthData', {
        uid: this.$store.state.uid,
        month: this.$store.state.month
      })
    } catch (e) {
      console.error(e)
    }
  },
  methods: {
    async onClickBought() {
      try {
        await this.$store.dispatch('setBoughtBook', {
          book: this.book,
          price: this.price,
          isbn: this.input
        })
        this.$notify({
          type: 'success',
          title: '登録成功',
          message: ''
        })
        const newBought: number = this.bought + Number(this.price)
        this.book = {}
        this.price = 0
        if (newBought >= this.budget) {
          // 100%超えた場合
          this.$router.push(
            `/user/${this.$store.state.uid}/${moment().format(
              'YYYYMM'
            )}/complete`
          )
        } else {
          // 100%超えない場合
          this.$router.push(
            `/user/${this.$store.state.uid}/${moment().format('YYYYMM')}/list`
          )
        }
      } catch (e) {
        this.$notify.error({
          title: '登録失敗',
          message: ''
        })
      }
    },
    async onClickWant() {
      try {
        await this.$store.dispatch('setWantBook', {
          book: this.book,
          price: this.price,
          isbn: this.input
        })
        this.$notify({
          type: 'success',
          title: '登録成功',
          message: ''
        })
        this.book = {}
        this.price = 0
        this.$router.push(
          `/user/${this.$store.state.uid}/${moment().format('YYYYMM')}/list`
        )
      } catch (e) {
        this.$notify.error({
          title: '登録失敗',
          message: ''
        })
      }
    },
    async search() {
      try {
        const res = await this.$axios.$get(
          `https://www.googleapis.com/books/v1/volumes?q=isbn:${this.input}`
        )
        console.log(res)
        if (res && res.items.length > 0) {
          this.book = res.items[0]
        }
      } catch (e) {
        console.error(e)
      }
    },
    initQuagga(): void {
      this.Quagga = require('quagga')
      // バーコード解析中の処理
      this.Quagga.onProcessed(this.onProcessed)
      // バーコード検出時の処理
      this.Quagga.onDetected(this.onDetected)
      const config = {
        inputStream: {
          type: 'LiveStream',
          target: this.$refs.camera,
          constraints: { facingMode: 'environment' },
          area: { top: '30%', right: '0%', left: '0%', bottom: '30%' }
        },
        numOfWorkers: navigator.hardwareConcurrency || 4,
        locate: true,
        decoder: { readers: ['ean_reader'] },
        src: null
      }
      this.Quagga.init(config, this.onInitilize)
    },
    onInitilize(error: any): void {
      if (error) {
        console.error(`Error: ${error}`, error)
        return
      }
      console.log('Initialization finished. Ready to start')
      this.Quagga.start()
    },
    onDetected(success: any): void {
      const isbn = success.codeResult.code
      this.input = isbn
      this.modalShow = !this.modalShow
    },
    onProcessed(data: any) {
      const ctx = this.Quagga.canvas.ctx.overlay
      const canvas = this.Quagga.canvas.dom.overlay
      if (!data) return
      // 認識したバーコードを囲む
      if (data.boxes) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        const hasNotRead = (box: any) => box !== data.box
        data.boxes.filter(hasNotRead).forEach((box: any) => {
          this.Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, ctx, {
            color: 'green',
            lineWidth: 2
          })
        })
      }
      // 読み取ったバーコードを囲む
      if (data.box) {
        this.Quagga.ImageDebug.drawPath(data.box, { x: 0, y: 1 }, ctx, {
          color: 'blue',
          lineWidth: 2
        })
      }
      // 読み取ったバーコードに線を引く
      if (data.codeResult && data.codeResult.code) {
        this.Quagga.ImageDebug.drawPath(data.line, { x: 'x', y: 'y' }, ctx, {
          color: 'red',
          lineWidth: 3
        })
      }
    }
  }
})
</script>

<style lang="scss">
.book-camera {
  position: relative;
  .camera-button {
    margin: 20px auto;
    display: block;
  }
  .el-select .el-input {
    width: 110px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
}
.modal {
  position: absolute;
  top: 0;
  padding: 0;
  width: 400px;
  height: 400px;
  box-sizing: border-box;
  left: 50%;
  border: 1px solid #ddd;
  background: #fff;
  transform: translateX(-50%);
  .modal-camera {
    position: relative;
  }
  .camera-area {
    position: relative;
    width: 300px;
    height: 300px;
    top: 0%;
    left: 50%;
    transform: translateX(-50%);
  }
  video,
  canvas {
    position: absolute;
    width: 300px;
    height: 300px;
  }
  .detect-area {
    position: absolute;
    border: 2px solid #0000ff;
    top: 0;
  }
  .drawingBuffer {
    position: absolute;
    top: 0;
    left: 0;
    width: 300px;
    height: 300px;
  }
}
.book-searched {
  width: 400px;
  margin: 0 auto;
  p {
    text-align: center;
    margin-bottom: 5px;
  }
  .book-searched-buttons {
    margin-top: 15px;
    display: flex;
    justify-content: center;
  }
  .book-wrap {
    display: flex;
    justify-content: center;
  }
}
.book-searched-input {
  margin-top: 10px;
  padding: 0 50px;
}
</style>
