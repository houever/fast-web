<!--原文：https://github.com/bitkylin/ClusterDeviceControlPlatform-Web/blob/8727f60c17/src/views/login/loginWidget.vue-->
<style lang="scss" scoped>
  @import "login.scss";
</style>
<template>
  <div id="login-container">
    <div class="hold-space-div"/>
    <Row class="header">
      <div class="description">Fast-cloud</div>
    </Row>
    <div id="login-form">
      <Form ref="loginForm" :model="loginForm" :rules="loginRules">
        <FormItem prop="username">
          <Input
            v-model="loginForm.username"
            prefix="ios-contact"
            size="large"
            clearable
            placeholder="请输入用户名"
            autocomplete="off"/>
        </FormItem>
        <FormItem prop="password">
          <Input
            v-model="loginForm.password"
            type="password"
            prefix="ios-lock"
            size="large"
            clearable
            placeholder="请输入密码"
            autocomplete="off"
            @keyup.enter.native="handleLogin"/>
        </FormItem>
        <FormItem>
          <Captcha
            id="Captcha"
            scene="Login"
            type="TencentCaptcha"
            :parm="captchaOption"
            @callback="captchaNotice"
            :url=this.verifyCaptchaUrl
          >
            <Button id="Captcha" type="primary" long :loading="loading">登录</Button>
          </Captcha>
        </FormItem>
        <div id="login_reg">
          <span>
            其他方式登陆
          </span>
          <span>
            <a href="regist">注册账户</a>
          </span>
        </div>
        <div id="tips">
          <span v-if="IsNormal==='待获取'">服务器状态：<span :style="{'font-weight':'bold'}">待获取</span></span>
          <span v-else-if="IsNormal">服务器状态：<span :style="{color:'#00ff00', 'font-weight':'bold'}">正常</span></span>
          <span v-else>服务器状态：<span :style="{color:'#ff0000', 'font-weight':'bold'}">异常</span></span>
          <span>延迟：<span :style="{'font-weight':'bold'}">{{ getCommDelay }}</span></span>
        </div>
      </Form>
    </div>
    <div class="hold-space-div"/>
    <div v-if="elegantSentences" id="elegant-sentences">
      <div id="elegant-sentences-content">
        {{ elegantSentences.content }}
      </div>
      <div id="elegant-sentences-inscribe">
        —— {{ elegantSentences.name }}
      </div>
    </div>
  </div>
</template>

<script>
  import { isvalidUsernameOrPassword } from '@/utils/validate'
  import { setTimer,stopTimer, touchError } from '@/utils/timer'
  import { chooseElegantSentencesLogin } from '@/utils/chooseElegantSentences'
  import { verifyCaptchaUrl, serverAttach } from '@/api/index'

  export default {
    name: 'LoginWidget',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!isvalidUsernameOrPassword(value)) {
          callback(new Error('只能输入字母和数字，且长度在 1 - 20 个字符之间'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (!isvalidUsernameOrPassword(value)) {
          callback(new Error('只能输入字母和数字，且长度在 1 - 20 个字符之间'))
        } else {
          callback()
        }
      }
      return {
        loading: false,
        elegantSentences: null,
        commDelay: '待获取',
        dataBeforeTime: 0,
        IsNormal: '待获取',
        loginForm: {
          username: '',
          password: ''
        },
        captchaFlag: '0',
        loginRules: {
          username: [{ required: true, trigger: 'blur', validator: validateUsername }],
          password: [{ required: true, trigger: 'blur', validator: validatePassword }]
        },
        pwdType: 'password',
        captchaOption: {
          // 各平台的参数，具体请参阅个平台文档
          // 以下为腾讯验证码的参数
          appid: '2084090782'
          // 以下为极验验证码的参数
          //product: 'bind',
        },
        verifyCaptchaUrl: ''
      }
    },
    computed: {
      getCommDelay() {
        if (this.commDelay === '待获取') {
          return this.commDelay
        } else {
          return this.commDelay + 'ms'
        }
      }
    },
    mounted: function() {
      this.verifyCaptchaUrl = verifyCaptchaUrl
      this.elegantSentences = chooseElegantSentencesLogin()
      setTimer(this.serverAttachTest, 1000)

    },
    methods: {
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },
      handleLogin() {
        this.loading = true
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            stopTimer()
            this.loading = true
            this.$store.dispatch('Login', this.loginForm).then(() => {
              this.loading = false
              this.$router.push({ path: '/' })
            }).catch(() => {
              this.loading = false
            })
          } else {
            return false
          }
        })
      },
      // 服务器可接入测试
      serverAttachTest() {
        this.dataBeforeTime = new Date().getTime()
        // 调取HTTP API获取数据
        serverAttach().then(response => {
          const code = response.code
          this.IsNormal = code === '5200'
          this.commDelay = new Date().getTime() - this.dataBeforeTime
        }).catch(error => {
          touchError(this, this.serverAttachTest, error)
        })
      },
      // 回调监听
      // status: 1成功,2验证中,0失败
      // res: 三方返回的原始数据
      captchaNotice(status, res) {
        if (res.code === '5200') {
          this.loading = true
          this.$refs.loginForm.validate(valid => {
            if (valid) {
              this.loading = true
              this.$store.dispatch('Login', this.loginForm).then(() => {
                this.loading = false
                this.$router.push({ path: '/' })
              }).catch(() => {
                this.loading = false
              })
            } else {
              return false
            }
          })
        }
      }
    }
  }
</script>
