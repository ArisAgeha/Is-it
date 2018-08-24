<template>
  <div id="app">
      <Header></Header>
      <div class="headerSticky"></div>
      <router-view></router-view>
      <Hinter></Hinter>
      <QuestionEditor></QuestionEditor>
  </div>
</template>

<script>
import Hinter from './components/Hinter.vue'
import Header from './components/Header.vue'
import Index from './components/Index.vue'
import QuestionEditor from './components/QuestionEditor.vue'

export default {
    components: {
        Hinter,
        Header,
        Index,
        QuestionEditor
    }
}
</script>

<style>
* {border: 0; margin: 0; box-sizing: border-box;}
li {list-style: none;}
a {text-decoration: none; color: inherit;}
button {cursor: pointer;}
body {
    font-family: -apple-system,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Microsoft YaHei,Source Han Sans SC,Noto Sans CJK SC,WenQuanYi Micro Hei,sans-serif;
    font-size: 15px;
    color: #1a1a1a;
    background: #f6f6f6;
    -webkit-tap-highlight-color: rgba(26,26,26,0);
    min-height: 100vh;
}
.headerSticky {
    height: 52px;
}
</style>

