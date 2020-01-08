<template>
  <div>
    <Menu mode="horizontal" :theme="theme1" active-name="1">
      <menu-item name="1" @click.native="info">
        <Icon type="ios-paper"/>
        内容管理
      </menu-item>
    </Menu>
  </div>
</template>
<script>
  import {chartsRouters} from "@/utils/changemenu";
  export default {
    data() {
      return {
        theme1: 'light'
      }
    },
    methods:{
      info () {
        this.$Message.info('这是一条普通的提醒');
        chartsRouters()
      }
    }
  }
</script>
