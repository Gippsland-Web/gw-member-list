<template>
  <div id="app">

    <MembersLoop></MembersLoop>

    
  </div>
</template>

<script>
import Hello from './components/Hello'
import MembersLoop from './components/MembersLoop'


export default {
  name: 'app',
  components: {
    MembersLoop
    
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height:100%;
}
</style>
