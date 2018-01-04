<template>
  <div class="hello">
    <div class="hero">
      <span>vue</span>
      <span>{{ msg }}</span>
      <span>ლ(⁰⊖⁰ლ)</span>
    </div>
    <div class="further">
      <h1>Welcome to Vue</h1>
      <h2>Essential Links</h2>
      <ul>
        <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
        <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
        <li><a href="https://chat.vuejs.org" target="_blank">Community Chat</a></li>
        <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
        <br>
        <li><a href="http://vuejs-templates.github.io/webpack/" target="_blank">Docs for This Template</a></li>
      </ul>
      <h2>Ecosystem</h2>
      <ul>
        <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
        <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
        <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
        <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'It works.'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.hero {
  display: inline-block;
  position: relative;
  width: 300px;
  height: 200px;
  margin: 0 auto;
  margin-top: 100px;
  color: #2C3E50;
  font-size: 2.5em;
  vertical-align: middle;
  &:before {
    content: "";
    display: inline-block;
    width: 0;
    height: 100%;
    vertical-align: middle;

  }
  span:first-child {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 50px;
    height: 50px;
    margin: -35px 0 0 -20px;
    text-indent: 100%;
    background: url('data:image/png;base64,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') no-repeat center center;
    overflow: hidden;
  }
  span:first-child + span {
    position: absolute;
    left: 0;
    transform: translate(0, 0);
    animation: shake 1s ease-in-out 0s infinite;
    backface-visibility: hidden;
  }
  span:last-child {
    position: relative;
  }
}

@keyframes shake {
  10%,
  90% {
    transform: translate(-1px, 3px);
    opacity: 0.8;
    -webkit-filter: blur(0);
  }
  20%,
  80% {
    transform: translate(2px, 2px);
    opacity: 0.6;
    -webkit-filter: blur(1px);
  }
  30%,
  50%,
  70% {
    transform: translate(-3px, 0);
    opacity: 1;
    -webkit-filter: blur(0);
  }
  40%,
  60% {
    transform: translate(3px, -1px);
    opacity: 0.5;
    -webkit-filter: blur(2px);
  }
}

.further {
  h1, h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
}
</style>
