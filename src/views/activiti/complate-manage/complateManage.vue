<style lang="scss">
  @import "complate-manage";
</style>
<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <Row>
            <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
              <Form-item label="任务名称" prop="name">
                <Input
                  type="text"
                  v-model="searchForm.name"
                  placeholder="请输入"
                  clearable
                  style="width: 200px"
                />
              </Form-item>
              <Form-item style="margin-left:-35px;" class="br">
                <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                <Button @click="handleReset">重置</Button>
              </Form-item>
            </Form>
          </Row>
          <Row class="operation">
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
              sortable="custom"
              :data="data"
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

    <Modal
      :title="modalTitle"
      v-model="modalVisible"
      :mask-closable="false"
      :width="500"
    >
      <Form ref="form" :model="form" :label-width="70" :rules="formValidate">
        <FormItem label="删除原因" prop="reason">
          <Input type="textarea" v-model="form.reason" :rows="4"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="handelCancel">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="handelSubmit">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { doneList, updateInsStatus, deleteHistoricTask } from '@/api/activiti/activiti'
  import { getDictDataByType } from '@/api/system/dict-manage'
  import circleLoading from '../../../my-components/circle-loading.vue'
  import util from '@/libs/util'

  export default {
    name: 'complateManage',
    components: {
      circleLoading
    },
    data() {
      return {
        loading: true, // 表单加载状态
        operationLoading: false, // 操作加载状态
        selectCount: 0, // 多选计数
        selectList: [], // 多选数据
        searchForm: {
          // 搜索框对应data对象
          name: '',
          current: 1, // 当前页数
          size: 10 // 页面大小
        },
        modalType: 0, // 添加或编辑标识
        modalVisible: false, // 添加或编辑显示
        modalTitle: '', // 添加或编辑标题
        form: {
          // 添加或编辑表单对象初始化数据
          reason: ''
        },
        formValidate: {
          // 表单验证规则
        },
        submitLoading: false, // 添加或编辑提交状态
        columns: [
          // 表头
          {
            type: 'selection',
            align: 'center'
          },
          {
            type: 'index',
            align: 'center'
          },
          {
            title: '任务名称',
            key: 'name'
          },
          {
            title: '所属流程',
            key: 'processName'
          },
          {
            title: '委托代办人',
            key: 'owner'
          },
          {
            title: '流程发起人',
            key: 'applyer'
          },
          {
            title: '优先级',
            key: 'priority',
            sortable: true,
            render: (h, params) => {
              let text = ''
              this.dictPriority.forEach(e => {
                if (e.val == params.row.priority) {
                  text = e.title
                }
              })
              return h('div', text)
            }
          },
          {
            title: '审批操作',
            key: 'deleteReason',
            align: 'center'
          },
          {
            title: '审批意见',
            key: 'comment',
            align: 'center'
          },
          {
            title: '耗时',
            key: 'duration',
            align: 'center',
            render: (h, params) => {
              return h('div', util.millsToTime(params.row.duration))
            }
          },
          {
            title: '创建时间',
            key: 'createTime',
            sortType: 'desc',
            sortable: true
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            width: 220,
            fixed: 'right',
            render: (h, params) => {
              return h('div', [
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
                        this.detail(params.row)
                      }
                    }
                  },
                  '表单数据'
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
                        this.history(params.row)
                      }
                    }
                  },
                  '审批历史'
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
              ])
            }
          }
        ],
        data: [], // 表单数据
        total: 0, // 表单数据总数
        deleteId: '',
        dictPriority: []
      }
    },
    methods: {
      init() {
        this.getDictDataType()
        this.getDataList()
      },
      getDictDataType() {
        getDictDataByType('priority').then(res => {
          if (res.success) {
            this.dictPriority = res.data
          }
        })
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
      getDataList() {
        this.loading = true
        doneList(this.searchForm).then(res => {
          this.loading = false
          if (res.success === true) {
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
        // 重新加载数据
        this.getDataList()
      },
      showSelect(e) {
        this.selectList = e
        this.selectCount = e.length
      },
      clearSelectAll() {
        this.$refs.table.selectAll(false)
      },
      handelCancel() {
        this.modalVisible = false
      },
      handelSubmit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.submitLoading = true
            if (this.modalType === 0) {
              deleteProcessIns(this.deleteId).then(res => {
                this.submitLoading = false
                if (res.success) {
                  this.$Message.success('操作成功')
                  this.modalVisible = false
                  this.getDataList()
                }
              })
            } else if (this.modalType === 1) {
              let ids = ''
              this.selectList.forEach(function(e) {
                ids += e.id + ','
              })
              ids = ids.substring(0, ids.length - 1)
              // 批量删除
              deleteProcessIns(ids).then(res => {
                this.submitLoading = false
                if (res.success) {
                  this.$Message.success('操作成功')
                  this.modalVisible = false
                  this.clearSelectAll()
                  this.getDataList()
                }
              })
            }
          }
        })
      },
      editStatus(status, v) {
        let operation = ''
        if (status == 0) {
          operation = '暂停挂起'
        } else {
          operation = '激活运行'
        }
        this.$Modal.confirm({
          title: '确认' + operation,
          content: `您确认要${operation}流程实例${v.name}?`,
          onOk: () => {
            this.operationLoading = true
            let params = {
              status: status,
              id: v.id
            }
            updateInsStatus(params).then(res => {
              this.operationLoading = false
              if (res.success === true) {
                this.$Message.success('操作成功')
                this.getDataList()
              }
            })
          }
        })
      },
      detail(v) {
        let query = {
          id: v.tableId,
          type: 3,
          backRoute: this.$route.name
        }
        this.$router.push({
          name: v.routeName,
          query: query
        })
      },
      edit(v) {
      },
      history(v) {
        let query = { id: v.procInstId, backRoute: this.$route.name }
        this.$router.push({
          name: 'historic_detail',
          query: query
        })
      },
      remove(v) {
        this.$Modal.confirm({
          title: '确认删除',
          // 记得确认修改此处
          content: '您确认要删除 ' + v.name + ' ?',
          onOk: () => {
            this.operationLoading = true
            deleteHistoricTask(v.id).then(res => {
              this.operationLoading = false
              if (res.success === true) {
                this.$Message.success('操作成功')
                this.getDataList()
              }
            })
          }
        })
      },
      delAll() {
        if (this.selectCount <= 0) {
          this.$Message.warning('您还未选择要删除的数据')
          return
        }
        this.modalTitle = '确认要删除所选的 ' + this.selectCount + ' 条数据'
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
            deleteHistoricTask(ids).then(res => {
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
        if (to.name == '我的已办') {
          this.getDataList()
        }
      }
    }
  }
</script>
