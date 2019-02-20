<template>
  <div class="logo">
    <transition name="fade">
      <span v-if="asCollapse" key="0" :class="{'is-text':!type,'is-img':type}" class="logo_title is-bold ">
        <template v-if="type">
          <img src="" width="40" height="40" >
        </template>
        <template v-else>
          N
        </template>
      </span>
    </transition>
    <transition-group name="fade">
      <template v-if="!asCollapse">
        <span key="1" class="logo_title is-bold">抽奖后台</span>
        <span key="2" class="logo_subtitle">&nbsp;</span>
      </template>
    </transition-group>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
export default {
  name: 'Logo',
  props: {
    asCollapse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  computed: {
    // ...mapGetters(['website']),
    type: function(val) {
      return false
    }
  },
  created() {},
  methods: {}
}
</script>

<style scoped="scoped" lang="scss">
  .fade-leave-active {
    transition: opacity 0.2s;
  }
  .fade-enter-active {
    transition: opacity 2.5s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
  .logo {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    // width: 230px;
    height: 64px;
    line-height: 64px;
    background: #1b2531;
    color: #fdfdfd;
    text-align: center;
    font-size: 20px;
    font-weight: 600;
    overflow: hidden;
    box-sizing: border-box;
  }
  .logo_title {
    padding: 0 5px 0 0;
    color: #42b983;
    font-size: 20px;
    &.is-bold {
      font-weight: 700;
    }
  }
  .is-text {
    position: absolute;
    top: 0;
    // left: 20px;
  }
  .is-img {
    position: absolute;
    top: 10px;
    left: 10px;
  }
  .logo_subtitle {
    font-size: 16px;
    padding-top: 5px;
  }
</style>
