<template>
  <div id="app">
    <div class="hero">
      <span>vue</span>
      <span>It works.</span>
      <span>ლ(⁰⊖⁰ლ)</span>
    </div>
    {{#router}}
    <router-view/>
    {{else}}
    <HelloWorld/>
    {{/router}}
  </div>
</template>

<script>
{{#unless router}}
import HelloWorld from './HelloWorld'

{{/unless}}
export default {
  name: 'app'{{#router}}{{else}},
  components: {
    HelloWorld
  }{{/router}}
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

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
    background: url(~@/assets/images/logo.png);
    background-size: contain;
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
</style>
