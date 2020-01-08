<style lang="scss">
  @import "apply-manage";
</style>
<template>
  <div class="apply-manage">
    <Row>
      <Col>
        <Card>
          <Row>
            <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
              <Form-item label="标题" prop="title">
                <Input
                  type="text"
                  v-model="searchForm.title"
                  placeholder="请输入"
                  clearable
                  style="width: 200px"
                />
              </Form-item>
              <Form-item label="状态" prop="status">
                <Select
                  v-model="searchForm.status"
                  placeholder="请选择"
                  clearable
                  style="width: 200px"
                >
                  <Option value="0">草稿</Option>
                  <Option value="1">处理中</Option>
                  <Option value="1">已结束</Option>
                </Select>
              </Form-item>
              <span v-if="drop">
                <Form-item label="结果" prop="result">
                  <Select
                    v-model="searchForm.result"
                    placeholder="请选择"
                    clearable
                    style="width: 200px"
                  >
                    <Option value="0">未提交</Option>
                    <Option value="1">处理中</Option>
                    <Option value="2">通过</Option>
                    <Option value="3">驳回</Option>
                  </Select>
                </Form-item>
                <Form-item label="创建时间">
                  <DatePicker
                    v-model="selectDate"
                    type="daterange"
                    format="yyyy-MM-dd"
                    clearable
                    @on-change="selectDateRange"
                    placeholder="选择起始时间"
                    style="width: 200px"
                  ></DatePicker>
                </Form-item>
              </span>
              <Form-item style="margin-left:-35px;" class="br">
                <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                <Button @click="handleReset">重置</Button>
                <a class="drop-down" @click="dropDown">
                  {{dropDownContent}}
                  <Icon :type="dropDownIcon"></Icon>
                </a>
              </Form-item>
            </Form>
          </Row>
          <Row class="operation">
            <Button @click="add" type="primary" icon="md-add">新增申请</Button>
            <Button @click="delAll" icon="md-trash">批量删除</Button>
            <Button @click="getDataList" icon="md-refresh">刷新</Button>
            <circleLoading v-if="operationLoading"/>
          </Row>
          <Row>
            <Alert show-icon>
              已选择
              <span class="select-count">{{selectCount}}</span> 项
              <a class="select-clear" @click="clearSelectAll">清空</a>
            </Alert>
          </Row>
          <Row>
            <Table
              :loading="loading"
              border
              :columns="columns"
              :data="data"
              sortable="custom"
              @on-selection-change="showSelect"
              ref="table"
            ></Table>
          </Row>
          <Row type="flex" justify="end" class="page">
            <Page
              :current="searchForm.current"
              :total="total"
              :page-size="searchForm.size"
              @on-change="changePage"
              @on-page-size-change="changePageSize"
              :page-size-opts="[10,20,50]"
              size="small"
              show-total
              show-elevator
              show-sizer
            ></Page>
          </Row>
        </Card>
      </Col>
    </Row>
    <!-- Drawer抽屉式选择流程 -->
    <Drawer title="选择申请" closable v-model="processModalVisible" width="800">
      <div class="apply-operation">
        <div>
          <Form
            ref="searchProcessForm"
            :model="searchProcessForm"
            inline
            :label-width="65"
            class="search-form"
          >
            <Form-item label="流程名称" prop="name">
              <Input
                type="text"
                v-model="searchProcessForm.name"
                clearable
                placeholder="请输入流程名"
                style="width: 200px"
              />
            </Form-item>
            <Form-item style="margin-left:-35px;" class="br">
              <Button @click="getProcessList" type="primary" icon="ios-search">搜索</Button>
              <Button @click="handleResetProcess">重置</Button>
            </Form-item>
          </Form>
        </div>
        <div>
          <RadioGroup v-model="showType" type="button">
            <Radio title="缩略图" label="thumb">
              <Icon type="ios-apps" style="margin-bottom:3px;"></Icon>
            </Radio>
            <Radio title="列表" label="list">
              <Icon type="md-list" style="margin-bottom:3px;"></Icon>
            </Radio>
          </RadioGroup>
        </div>
      </div>
      <div class="process-wrapper" v-if="showType=='thumb'">
        <Card v-for="(item, i) in processData" :key="i" class="process-card">
          <div class="content" @click="chooseProcess(item)">
            <div class="other">
              <div class="name">{{i+1}}. {{item.name}}</div>
              <div class="key">{{item.description}}</div>
              <div class="info">版本：v.{{item.version}} 所属分类：{{item.categoryTitle}}</div>
            </div>
          </div>
        </Card>
        <Spin fix v-if="processLoading"/>
      </div>
      <Table
        :loading="processLoading"
        border
        :columns="processColumns"
        :data="processData"
        ref="processTable"
        v-if="showType=='list'"
      ></Table>
    </Drawer>

    <Modal title="提交申请" v-model="modalVisible" :mask-closable="false" :width="500">
      <Form ref="form" :model="form" :label-width="85" :rules="formValidate">
        <FormItem label="选择审批人" prop="assignee" style="position:relative">
          <Select
            v-model="form.assignee"
            placeholder="请选择或输入搜索"
            filterable
            clearable
            :loading="userLoading"
          >
            <Option v-for="(item, i) in assigneeList" :key="i" :value="item.id">{{item.username}}</Option>
          </Select>
        </FormItem>
        <FormItem label="优先级" prop="priority">
          <Select v-model="form.priority" placeholder="请选择" clearable>
            <Option v-for="(item, i) in dictPriority" :key="i" :value="item.val">{{item.title}}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="handelCancel">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="handelSubmit">提交</Button>
      </div>
    </Modal>

    <Modal
      title="确认撤回"
      v-model="modalCancelVisible"
      :mask-closable="false"
      :width="500"
    >
      <Form ref="delForm" v-model="cancelForm" :label-width="70">
        <FormItem label="撤回原因" prop="reason">
          <Input type="textarea" v-model="cancelForm.reason" :rows="4"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="modalCancelVisible=false">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="handelSubmitCancel">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {
    getProcessDataList,
    getBusinessDataList,
    applyBusiness,
    deleteBusiness,
    cancelApply
  } from '@/api/activiti/activiti'
  import { getFirstNode } from '@/api/activiti/process-ins-manage'
  import { getDictDataByType } from '@/api/system/dict-manage'
  import circleLoading from '../../../my-components/circle-loading.vue'

  export default {
    name: 'apply-manage',
    components: {
      circleLoading
    },
    data() {
      return {
        loading: true, // 表单加载状态
        operationLoading: false, // 操作加载状态
        leaveModal: false,//请假对话框
        processModalVisible: false,
        searchProcessForm: {
          showLatest: true,
          name: '',
          status: '1', // 激活状态
          current: 1, // 当前页数
          size: 1000, // 页面大小
          sort: 'createTime', // 默认排序字段
          order: 'desc' // 默认排序方式
        },
        cancelForm: {
          reason: ''
        },
        modalCancelVisible: false,
        processLoading: false,
        processColumns: [
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '名称',
            key: 'name',
            width: 150,
            sortable: true
          },
          {
            title: '备注描述',
            key: 'description',
            width: 150,
            sortable: true
          },
          {
            title: '所属分类',
            key: 'categoryTitle',
            width: 150,
            sortable: true
          },
          {
            title: '版本',
            key: 'version',
            align: 'center',
            sortable: true,
            render: (h, params) => {
              let re = ''
              if (params.row.version) {
                re = 'v.' + params.row.version
              }
              return h('div', re)
            }
          },
          {
            title: '操作',
            key: 'action',
            width: 135,
            align: 'center',
            fixed: 'right',
            render: (h, params) => {
              return h('div', [
                h(
                  'Button',
                  {
                    props: {
                      type: 'info',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.chooseProcess(params.row)
                      }
                    }
                  },
                  '选择该流程'
                )
              ])
            }
          }
        ],
        processData: [],
        showType: 'thumb',
        selectCount: 0, // 多选计数
        selectList: [], // 多选数据
        drop: false, // 搜索展开标识
        dropDownContent: '展开', // 搜索展开标识文字
        dropDownIcon: 'ios-arrow-down', //搜索展开图标
        searchForm: {
          // 搜索框对应data对象
          title: '',
          status: '',
          result: '',
          startDate: '',
          endDate: '',
          current: 1, // 当前页数
          size: 10 // 页面大小

        },
        userLoading: false,
        modalVisible: false, // 添加或编辑显示
        selectDate: null,
        form: {
          procDefId: '',
          assignee: '',
          priority: '0'
        },
        formValidate: {
          // 表单验证规则
          procDefId: [{ required: true, message: '不能为空', trigger: 'blur' }],
          assignee: [{ required: true, message: '不能为空', trigger: 'blur' }],
          priority: [{ required: true, message: '不能为空', trigger: 'blur' }]
        },
        submitLoading: false, // 添加或编辑提交状态
        columns: [
          // 表头
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '标题',
            key: 'title',
            width: 150,
            sortable: true
          },
          {
            title: '所属流程',
            key: 'processName',
            width: 150,
            tooltip: true
          },
          {
            title: '当前审批环节',
            key: 'currTaskName',
            width: 150,
            tooltip: true
          },
          {
            title: '状态',
            key: 'status',
            align: 'center',
            width: 120,
            sortable: true,
            render: (h, params) => {
              let text = '未知',
                color = ''
              if (params.row.status == 0) {
                text = '草稿'
                color = 'default'
              } else if (params.row.status == 1) {
                text = '处理中'
                color = 'orange'
              } else if (params.row.status == 2) {
                text = '已结束'
                color = 'blue'
              }
              return h('div', [
                h(
                  'Tag',
                  {
                    props: {
                      color: color
                    }
                  },
                  text
                )
              ])
            }
          },
          {
            title: '结果',
            key: 'result',
            align: 'center',
            width: 200,
            sortable: true,
            render: (h, params) => {
              let text = '未知',
                color = ''
              if (params.row.result == 0) {
                text = '未提交'
                color = 'default'
              } else if (params.row.result == 1) {
                text = '处理中'
                color = 'orange'
              } else if (params.row.result == 2) {
                text = '已通过'
                color = 'green'
              } else if (params.row.result == 3) {
                text = '已驳回'
                color = 'red'
              }
              return h('div', [
                h(
                  'Tag',
                  {
                    props: {
                      color: color
                    }
                  },
                  text
                )
              ])
            }
          },
          {
            title: '创建时间',
            key: 'createTime',
            width: 180,
            sortType: 'desc',
            sortable: true
          },
          {
            title: '提交申请时间',
            key: 'applyTime',
            width: 180,
            sortable: true
          },
          {
            title: '修改时间',
            key: 'updateTime',
            width: 180,
            sortType: 'desc',
            sortable: true
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            width: 265,
            fixed: 'right',
            render: (h, params) => {
              let re = ''
              if (params.row.status == 0) {
                re = [
                  h(
                    'Button',
                    {
                      props: {
                        type: 'primary',
                        size: 'small'
                      },
                      style: {
                        marginRight: '5px'
                      },
                      on: {
                        click: () => {
                          this.apply(params.row)
                        }
                      }
                    },
                    '提交申请'
                  ),
                  h(
                    'Button',
                    {
                      props: {
                        size: 'small'
                      },
                      style: {
                        marginRight: '5px'
                      },
                      on: {
                        click: () => {
                          this.edit(params.row)
                        }
                      }
                    },
                    '编辑'
                  ),
                  h(
                    'Button',
                    {
                      props: {
                        type: 'error',
                        size: 'small'
                      },
                      on: {
                        click: () => {
                          this.remove(params.row)
                        }
                      }
                    },
                    '删除'
                  )
                ]
              } else if (params.row.status == 1) {
                re = [
                  h(
                    'Button',
                    {
                      props: {
                        size: 'small',
                        type: 'warning',
                        icon: 'ios-redo'
                      },
                      style: {
                        marginRight: '5px'
                      },
                      on: {
                        click: () => {
                          this.cancel(params.row)
                        }
                      }
                    },
                    '撤回申请'
                  ),
                  h(
                    'Button',
                    {
                      props: {
                        size: 'small',
                        type: 'info'
                      },
                      style: {
                        marginRight: '5px'
                      },
                      on: {
                        click: () => {
                          this.history(params.row)
                        }
                      }
                    },
                    '查看进度'
                  ),
                  h(
                    'Button',
                    {
                      props: {
                        size: 'small'
                      },
                      style: {
                        marginRight: '5px'
                      },
                      on: {
                        click: () => {
                          this.detail(params.row)
                        }
                      }
                    },
                    '表单数据'
                  )
                ]
              } else if (params.row.status == 2 && params.row.result == 3) {
                re = [
                  h(
                    'Button',
                    {
                      props: {
                        type: 'primary',
                        size: 'small'
                      },
                      style: {
                        marginRight: '5px'
                      },
                      on: {
                        click: () => {
                          this.apply(params.row)
                        }
                      }
                    },
                    '重新申请'
                  ),
                  h(
                    'Button',
                    {
                      props: {
                        size: 'small'
                      },
                      style: {
                        marginRight: '5px'
                      },
                      on: {
                        click: () => {
                          this.edit(params.row)
                        }
                      }
                    },
                    '编辑'
                  ),
                  h(
                    'Button',
                    {
                      props: {
                        size: 'small',
                        type: 'info'
                      },
                      style: {
                        marginRight: '5px'
                      },
                      on: {
                        click: () => {
                          this.history(params.row)
                        }
                      }
                    },
                    '审批历史'
                  )
                ]
              } else {
                re = [
                  h(
                    'Button',
                    {
                      props: {
                        size: 'small',
                        type: 'info'
                      },
                      style: {
                        marginRight: '5px'
                      },
                      on: {
                        click: () => {
                          this.history(params.row)
                        }
                      }
                    },
                    '审批历史'
                  )
                ]
              }

              return h('div', re)
            }
          }
        ],
        data: [], // 表单数据
        total: 0, // 表单数据总数
        assigneeList: [],
        dictPriority: []
      }
    },
    methods: {
      init() {
        this.getDataList()
        //this.getProcessList();
        this.getDictDataType()
      },
      getDictDataType() {
        getDictDataByType('priority').then(res => {
          if (res.success) {
            this.dictPriority = res.data
          }
        })
      },
      getProcessList() {
        this.processLoading = true
        getProcessDataList(this.searchProcessForm).then(res => {
          this.processLoading = false
          if (res.success) {
            this.processData = res.data.records
          }
        })
      },
      dropDown() {
        if (this.drop) {
          this.dropDownContent = '展开'
          this.dropDownIcon = 'ios-arrow-down'
        } else {
          this.dropDownContent = '收起'
          this.dropDownIcon = 'ios-arrow-up'
        }
        this.drop = !this.drop
      },
      handleResetProcess() {
        this.$refs.searchProcessForm.resetFields()
        // 重新加载数据
        this.getProcessList()
      },
      changePage(v) {
        this.searchForm.current = v
        this.getDataList()
        this.clearSelectAll()
      },
      changePageSize(v) {
        this.searchForm.size = v
        this.getDataList()
      },
      selectDateRange(v) {
        if (v) {
          this.searchForm.startDate = v[0]
          this.searchForm.endDate = v[1]
        }
      },
      getDataList() {
        this.loading = true
        // 避免后台默认值
        if (!this.searchForm.status) {
          this.searchForm.status = ''
        }
        if (!this.searchForm.result) {
          this.searchForm.result = ''
        }
        getBusinessDataList(this.searchForm).then(res => {
          this.loading = false
          if (res.success) {
            this.data = res.data.records
            this.total = res.data.total
          }
        })
      },
      handleSearch() {
        this.searchForm.current = 1
        this.searchForm.size = 10
        this.getDataList()
      },
      handleReset() {
        this.$refs.searchForm.resetFields()
        this.searchForm.current = 1
        this.searchForm.size = 10
        this.selectDate = null
        this.searchForm.startDate = ''
        this.searchForm.endDate = ''
        // 重新加载数据
        this.getDataList()
      },
      handelCancel() {
        this.modalVisible = false
      },
      handelSubmit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.submitLoading = true
            applyBusiness(this.form).then(res => {
              this.submitLoading = false
              if (res.success === true) {
                this.$Message.success('操作成功')
                this.getDataList()
                this.modalVisible = false
              }
            })
          }
        })
      },
      add() {
        //this.processModalVisible = true;
        this.$router.push({
          name: 'leave'
        })
      },
      chooseProcess(v) {
        if (!v.routeName) {
          this.$Message.error('该流程信息未完善，暂时无法申请')
          return
        }
        this.processModalVisible = false
        let query = { type: 0, backRoute: this.$route.name, procDefId: v.id }
        this.$router.push({
          name: v.routeName,
          query: query
        })
      },
      edit(v) {
        let query = { type: 1, id: v.tableId, backRoute: this.$route.name }
        this.$router.push({
          name: 'leave',
          query: query
        })
      },
      detail(v) {
        let query = { type: 2, id: v.tableId, backRoute: this.$route.name }
        this.$router.push({
          name: 'leave',
          query: query
        })
      },
      apply(v) {
        this.form.id = v.id
        this.form.tableId = v.id
        this.form.procDefId = v.procDefId
        this.form.title = v.title
        // 加载审批人
        this.userLoading = true
        getFirstNode(v.procDefId).then(res => {
          this.userLoading = false
          if (res.success) {
            this.assigneeList = res.data.users
          }
        })
        this.modalVisible = true
      },
      cancel(v) {
        this.cancelForm.id = v.id
        this.cancelForm.procInsId = v.procInsId
        this.modalCancelVisible = true
      },
      handelSubmitCancel() {
        this.submitLoading = true
        cancelApply(this.cancelForm).then(res => {
          this.submitLoading = false
          if (res.success === true) {
            this.$Message.success('操作成功')
            this.getDataList()
            this.modalCancelVisible = false
          }
        })
      },
      history(v) {
        if (!v.procInsId) {
          this.$Message.error('流程实例ID不存在')
          return
        }
        let query = { id: v.procInsId, backRoute: this.$route.name }
        this.$router.push({
          name: 'historic_detail',
          query: query
        })
      },
      remove(v) {
        this.$Modal.confirm({
          title: '确认删除',
          // 记得确认修改此处
          content: '您确认要删除 ' + v.title + ' ?',
          onOk: () => {
            // 删除
            this.operationLoading = true
            deleteBusiness(v.id).then(res => {
              this.operationLoading = false
              if (res.success === true) {
                this.$Message.success('操作成功')
                this.getDataList()
              }
            })
          }
        })
      },
      showSelect(e) {
        this.selectList = e
        this.selectCount = e.length
      },
      clearSelectAll() {
        this.$refs.table.selectAll(false)
      },
      delAll() {
        if (this.selectCount <= 0) {
          this.$Message.warning('您还未选择要删除的数据')
          return
        }
        this.$Modal.confirm({
          title: '确认删除',
          content: '您确认要删除所选的 ' + this.selectCount + ' 条数据?',
          onOk: () => {
            let ids = ''
            this.selectList.forEach(function(e) {
              ids += e.id + ','
            })
            ids = ids.substring(0, ids.length - 1)
            // 批量删除
            this.operationLoading = true
            deleteBusiness(ids).then(res => {
              this.operationLoading = false
              if (res.success === true) {
                this.$Message.success('操作成功')
                this.clearSelectAll()
                this.getDataList()
              }
            })
          }
        })
      }
    },
    mounted() {
      this.init()
    },
    watch: {
      // 监听路由变化
      $route(to, from) {
        if (to.name == 'apply-manage') {
          this.getDataList()
        }
      }
    }
  }
</script>
