<!--https://coverr.co/-->
<template>
  <div class="homepage-hero-module">
    <loginWidget></loginWidget>
    <div class="video-container">
      <div :style="fixStyle" class="filter"></div>
      <video :style="fixStyle" autoplay loop class="fillWidth" v-on:canplay="canplay">
        <source :src="PATH_TO_MP4" type="video/mp4"/>
        浏览器不支持 video 标签，建议升级浏览器。
        <source :src="PATH_TO_WEBM" type="video/webm"/>
        浏览器不支持 video 标签，建议升级浏览器。
      </video>
      <div class="poster hidden" v-if="!vedioCanPlay">
        <img :style="fixStyle" :src="PATH_TO_JPEG" alt="">
      </div>
    </div>
  </div>
</template>

<script>
  import loginWidget from './loginWidget'
  import { getLoginBg } from '@/api/index'
  import { get,put} from '@/utils/cache'

  export default {
    name: 'mylogin',
    components: { loginWidget },
    data() {
      return {
        vedioCanPlay: false,
        fixStyle: '',
        PATH_TO_MP4: '',
        PATH_TO_WEBM: '',
        PATH_TO_JPEG: require("../../assets/images/bg.jpg")
      }
    },
    methods: {
      // async loginBg(){
      //   await getLoginBg().then(res => {
      //     put("bgVideo",res.data.bgVideo)
      //     put("bgWebm",res.data.bgWebm)
      //     put("bgImg",res.data.bgImg)
      //   })
      // },
      // init() {
      //   this.PATH_TO_MP4 = get("bgVideo")
      //   this.PATH_TO_WEBM = get("bgWebm")
      //   this.PATH_TO_JPEG = get("bgImg")
      //   this.canplay()
      // },
      canplay() {
        this.vedioCanPlay = true
      }
    },
    created: function() {
      // this.loginBg()
    },
    mounted: function() {
      window.onresize = () => {
        const windowWidth = document.body.clientWidth
        const windowHeight = document.body.clientHeight
        const windowAspectRatio = windowHeight / windowWidth
        let videoWidth
        let videoHeight
        if (windowAspectRatio < 0.5625) {
          videoWidth = windowWidth
          videoHeight = videoWidth * 0.5625
          this.fixStyle = {
            height: windowWidth * 0.5625 + 'px',
            width: windowWidth + 'px',
            'margin-bottom': (windowHeight - videoHeight) / 2 + 'px',
            'margin-left': 'initial'
          }
        } else {
          videoHeight = windowHeight
          videoWidth = videoHeight / 0.5625
          this.fixStyle = {
            height: windowHeight + 'px',
            width: windowHeight / 0.5625 + 'px',
            'margin-left': (windowWidth - videoWidth) / 2 + 'px',
            'margin-bottom': 'initial'
          }
        }
      }
      window.onresize()
      // this.init()
    }
  }
</script>

<style scoped>
  .homepage-hero-module,
  .video-container {
    position: relative;
    height: 100vh;
    overflow: hidden;
  }

  .video-container .poster img,
  .video-container video {
    z-index: 0;
    position: absolute;
  }

  .video-container .filter {
    z-index: 1;
    position: absolute;
    background: rgba(0, 0, 0, 0.4);
  }
</style>
