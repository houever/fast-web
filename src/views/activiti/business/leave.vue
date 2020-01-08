<style lang="scss">
  textarea.ivu-input {
    max-width: 100%;
    height: auto;
    min-height: 32px;
    vertical-align: bottom;
    font-size: 12px;
  }
</style>
<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <p slot="title">
            <span v-if="type==0">新增请假申请</span>
            <span v-else-if="type==1">编辑请假申请</span>
            <span v-else>查看请假申请详情</span>
          </p>
          <Row>
            <Form
              ref="form"
              :model="form"
              :label-width="95"
              :rules="formValidate"
              style="position:relative"
            >
              <FormItem label="标题" prop="title">
                <Input v-model="form.title" style="width:550px"/>
              </FormItem>
              <FormItem label="类型" prop="type">
                <Select v-model="form.type" style="width:200px">
                  <Option v-for="item in leaveTypeList" :value="item.val" :key="item.val">{{ item.title }}</Option>
                </Select>
              </FormItem>
              <FormItem label="流程实例" prop="procDefId">
                <Select v-model="procDefId" style="width:200px">
                  <Option v-for="item in processList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
              </FormItem>
              <FormItem label="原因" prop="reason">
                <Input
                  type="textarea"
                  v-model="form.reason"
                  :rows="5"
                  placeholder="请输入详细情况"
                  style="width: 550px"
                />
              </FormItem>
              <FormItem label="请假时间范围" :error="errorMsg">
                <DatePicker
                  v-model="selectDate"
                  :options="options"
                  type="datetimerange"
                  format="yyyy-MM-dd HH:mm"
                  clearable
                  @on-change="selectDateRange"
                  placeholder="选择起始时间"
                  style="width: 550px"
                ></DatePicker>
              </FormItem>
              <Form-item class="br">
                <Button
                  type="primary"
                  :loading="submitLoading"
                  @click="handelSubmit"
                  v-if="type==0||type==1"
                >保存并关闭</Button>
                <Button @click="handelCancel">关闭</Button>
              </Form-item>
              <Spin size="large" fix v-if="loading"></Spin>
            </Form>
          </Row>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
  import {
    getLeaveData,
    addLeave,
    updateLeave,
    applyLeave
  } from "@/api/activiti/leave";
  import { getProcessAllDate } from '@/api/activiti/process-manage'
  import { getDictDataByType } from '@/api/system/dict-manage'
  export default {
    name: "leave",
    data() {
      return {
        type: 0,
        leaveTypeList:[],
        loading: false, // 表单加载状态
        modalVisible: false,
        selectDate: null,
        form: {
          // 添加或编辑表单对象初始化数据
          title: "",
          type:'',
          reason:'',
          startDate: "",
          endDate: ""
        },
        formValidate: {
          // 表单验证规则
          title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
          reason: [
            { required: true, message: "原因不能为空", trigger: "blur" }
          ]
        },
        errorMsg: "",
        submitLoading: false, // 添加或编辑提交状态
        processList: [],
        backRoute: "",
        procDefId: "",
        options: {
          shortcuts: [
            {
              text: "1 天",
              value() {
                const end = new Date();
                const start = new Date();
                end.setTime(start.getTime());
                return [start, end];
              }
            },
            {
              text: "2 天",
              value() {
                const end = new Date();
                const start = new Date();
                end.setTime(start.getTime() + 3600 * 1000 * 24 * 1);
                return [start, end];
              }
            },
            {
              text: "3 天",
              value() {
                const end = new Date();
                const start = new Date();
                end.setTime(start.getTime() + 3600 * 1000 * 24 * 2);
                return [start, end];
              }
            },
            {
              text: "1 周",
              value() {
                const end = new Date();
                const start = new Date();
                end.setTime(start.getTime() + 3600 * 1000 * 24 * 6);
                return [start, end];
              }
            },
            {
              text: "1 个月",
              value() {
                const end = new Date();
                const start = new Date();
                end.setTime(start.getTime() + 3600 * 1000 * 24 * 29);
                return [start, end];
              }
            }
          ]
        }
      };
    },
    methods: {
      init() {
        this.$refs.form.resetFields();
        this.selectDate = null;
        this.getLeaveTypeList();
        this.getProcessDataList();
      },
      getProcessDataList(){
        getProcessAllDate().then(res=>{
          this.processList = res.data;
        });
      },
      getLeaveTypeList(){
        getDictDataByType('leave').then(res => {
          if (res.success) {
            this.leaveTypeList = res.data
          }
        })
      },
      getData() {
        this.loading = true;
        getLeaveData(this.form.id).then(res => {
          this.loading = false;
          if (res.success === true) {
            // 转换null为""
            let v = res.data;
            for (let attr in v) {
              if (v[attr] === null) {
                v[attr] = "";
              }
            }
            let str = JSON.stringify(v);
            let data = JSON.parse(str);
            this.form = data;
            this.selectDate = [];
            this.selectDate[0] = data.startDate;
            this.selectDate[1] = data.endDate;
          }
        });
      },
      selectDateRange(v) {
        if (v) {
          this.form.startDate = v[0];
          this.form.endDate = v[1];
        }
      },
      handelSubmit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            if (this.selectDate[0] == "") {
              this.errorMsg = "请选择时间范围";
              return;
            } else {
              this.errorMsg = "";
            }
            this.submitLoading = true;
            if (this.type === 0) {
              // 添加 避免编辑后传入id等数据 记得删除
              delete this.form.id;
              this.form.procDefId = this.procDefId;
              addLeave(this.form).then(res => {
                this.submitLoading = false;
                if (res.success === true) {
                  this.$Message.success("操作成功");
                  this.closeCurrentPage();
                }
              });
            } else if (this.type === 1) {
              // 编辑
              updateLeave(this.form).then(res => {
                this.submitLoading = false;
                if (res.success === true) {
                  this.$Message.success("操作成功");
                  this.closeCurrentPage();
                }
              });
            }
          }
        });
      },
      handelCancel() {
        this.closeCurrentPage();
      },
      // 关闭当前页面
      closeCurrentPage() {
        this.$store.commit("removeTag", "leave");
        localStorage.pageOpenedList = JSON.stringify(
          this.$store.state.app.pageOpenedList
        );
        this.$router.push({
          name: this.backRoute
        });
      }
    },
    mounted() {
      this.init();
    },
    watch: {
      // 监听路由变化
      $route(to, from) {
        if (to.name == "leave") {
          this.type = this.$route.query.type;
          this.backRoute = this.$route.query.backRoute;
          this.procDefId = this.$route.query.procDefId;
          if (this.type != 0) {
            this.form.id = this.$route.query.id;
            this.getData();
          } else {
            this.$refs.form.resetFields();
            this.selectDate = null;
          }
        }
      }
    }
  };
</script>
