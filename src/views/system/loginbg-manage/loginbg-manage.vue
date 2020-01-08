<style scoped>
  @import "_loginbg-manage.scss";
</style>
<!--登录背景管理-->
<template>
  <div class="loginbg-manage">
    <Card :bordered="false">
      <Row>
        <Col span="12">
          <Button type="primary" icon="ios-add" @click="handleSetBg()">新增背景</Button>
        </Col>
      </Row>
      <Card :bordered="false">
        <ul class="listul">
          <Row v-for="item in dataList">
            <li>
              <Col span="8">
                <video autoplay loop class="video">
                  <source :src="item.bgVideo" type="video/mp4"/>
                  浏览器不支持 video 标签，建议升级浏览器。
                </video>
              </Col>
              <Col span="8">
                <img width="400px" height="300px" :src="item.bgImg">
              </Col>
              <Col span="8" style="text-align: center;">
                <Button type="success" @click="setBg(item.id)">设置为背景</Button>
              </Col>
            </li>
          </Row>
        </ul>
      </Card>
    </Card>
    <Modal
      v-model="bgAddModal"
      title="新增背景"
      :closable="false"
      :mask-closable="false"
      :loading="addLoading"
      width="1000px"
      @on-ok="submitUpload()"
    >
      <Row>
        <Form ref="bgForm" :model="bgForm" style="text-align: center;">
          <Col span="8">
            <Card :padding="0" style="width:320px;height:320px;" :dis-hover="true">
              <video autoplay loop :v-show=this.videoShow class="video">
                <source :src="this.bgForm.bgVideo" type="video/mp4"/>
                您的浏览器不支持 video 视屏播放。
              </video>

            </Card>
            <Upload :action=this.uploadFileAction
                    :on-success="videoSeccess"
                    :max-size="2048000"
                    :format="['mp4']"
                    :on-format-error="handleVideoFormatError"
                    :on-exceeded-size="handleMaxSize">
              <br/>
              <Button icon="ios-cloud-upload-outline">上传MP4</Button>
            </Upload>
          </Col>
          <Col span="8">
            <Card :padding="0" style="width:320px;height:320px;">
              <div style="text-align:center">
                <img :src=this.bgForm.bgWebm :v-show=this.webmShow width="320px" height="320px">
              </div>
            </Card>
            <Upload :action=this.uploadFileAction :on-success="webmSeccess">
              <br/>
              <Button icon="ios-cloud-upload-outline">上传webm</Button>
            </Upload>
          </Col>
          <Col span="8">
            <Card :padding="0" style="width:320px;height:320px;">
              <div style="text-align:center">
                <img width="320px" height="320px" :src=this.bgForm.bgImg>
              </div>
            </Card>
            <Upload :action=this.uploadFileAction :on-success="imgSeccess">
              <br/>
              <Button icon="ios-cloud-upload-outline">上传图片</Button>
            </Upload>
          </Col>
        </Form>
      </Row>
    </Modal>
  </div>
</template>

<script>
  import { uploadFileAction } from '@/api/index'
  import { getAllBgList, saveBg, setBg } from '@/api/system/loginbg-manage'

  export default {
    props: {},
    data() {
      return {
        dataList: [],
        bgAddModal: false,
        addLoading: false,
        uploadFileAction: '',
        videoShow: false,
        webmShow: false,
        bgForm: {
          bgVideo: '',
          bgWebm: '',
          bgImg: ''
        },

        formItem: {
          input: '',
          select: '',
          radio: 'male',
          checkbox: [],
          switch: true,
          date: '',
          time: '',
          slider: [20, 50],
          textarea: ''
        }
      }
    },
    methods: {
      init() {
        this.getBgList()
      },
      getBgList() {
        getAllBgList().then(res => {
          this.dataList = res.data
        })
      },
      handleSetBg() {
        this.bgAddModal = true
        this.$refs.bgForm.resetFields();
      },

      submitUpload() {
        this.addLoading = true
        saveBg(this.bgForm).then(res => {
          this.$Message.success(res.message)
          this.addLoading = false
          this.init()
        })
      },
      async videoSeccess(res, file, fileList) {
        this.bgForm.bgVideo = res.data
        this.videoShow = true
      },
      async webmSeccess(res, file, fileList) {
        this.bgForm.bgWebm = res.data
      },
      async imgSeccess(res, file, fileList) {
        this.bgForm.bgImg = res.data
      },
      handleVideoFormatError(file) {
        this.$Notice.error({
          title: '文件格式不正确',
          desc: '文件 ' + file.name + ' 格式不正确，请上传mp4格式的视频。'
        })
      },
      handleMaxSize(file) {
        this.$Notice.warning({
          title: '超出文件大小限制',
          desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
        })
      },
      setBg(id) {
        setBg(id).then(res => {
          if (res.code === '5200') {
            this.$Message.success('设置成功')
          }
        }).catch(err => {
          reject(err.data)
        })
      }

    },
    mounted() {
      this.uploadFileAction = uploadFileAction
      this.init()
    }
  }
</script>
