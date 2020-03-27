<template>
  <div class="container"></div>
</template>

<script>
export default {
  asyncData({ redirect }) {
    redirect('/user/login')
  }
}
</script>
