<template>
  <div id="app">
      <Header></Header>
  </div>
</template>

<script>
import Header from './components/Header.vue'
import indexCard from './components/indexCard.vue'

export default {
    components: {
        Header,
        indexCard
    }
}
</script>

<style>
* {border: 0; margin: 0; box-sizing: border-box;}
li {list-style: none;}
a {text-decoration: none; color: inherit;}
body {
    font-family: -apple-system,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Microsoft YaHei,Source Han Sans SC,Noto Sans CJK SC,WenQuanYi Micro Hei,sans-serif;
    font-size: 15px;
    color: #1a1a1a;
    background: #f6f6f6;
    -webkit-tap-highlight-color: rgba(26,26,26,0);
}
</style>

