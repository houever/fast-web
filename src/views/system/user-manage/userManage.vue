<style lang="scss">
  @import "user-manage";
</style>
<template>
  <div style="background:#eee;padding:7px;height: 90%">
    <Card :bordered="false">
      <Row>
        <Form :model="searchFrom" ref="searchFrom" :label-width="60" inline>
          <FormItem label="用户名:" prop="username">
            <Input type="text" v-model="searchFrom.username" placeholder="请输入用户名" :clearable="true"></Input>
          </FormItem>
          <FormItem label="手机号:" prop="phone">
            <Input v-model="searchFrom.phone" placeholder="请输入手机号" number></Input>
          </FormItem>
          <FormItem label="邮箱:" prop="email">
            <Input v-model="searchFrom.email" placeholder="请输入邮箱"></Input>
          </FormItem>
          <FormItem label="性别:" prop="gender">
            <Select v-model="searchFrom.gender">
              <Option value="1">男</Option>
              <Option value="0">女</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="searchUser">查询</Button>
            <Button style="margin-left: 8px" @click="resetSearchForm">重置</Button>
          </FormItem>
        </Form>
      </Row>
      <Row class="operation">
        <Button v-hasPermission="'sys_account_add'" @click="add" type="primary" icon="md-add">添加用户</Button>
        <Button @click="delAll" icon="md-trash">批量删除</Button>
        <Dropdown @on-click="handleDropdown">
          <Button>更多操作
            <Icon type="md-arrow-dropdown"/>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem name="refresh">刷新</DropdownItem>
            <DropdownItem name="exportData">导出所选数据</DropdownItem>
            <DropdownItem name="exportAll">导出全部数据</DropdownItem>
            <DropdownItem name="importData">导入数据</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Row>
      <Row>
        <Alert show-icon>
          已选择
          <span class="select-count">{{selectCount}}</span> 项
          <a class="select-clear" @click="clearSelectAll">清空</a>
        </Alert>
      </Row>
      <div>
        <Table :data="tableData"
               :loading="loading"
               border
               sortable="custom"
               :columns="tableColumns"
               ref="table"
               @on-selection-change="showSelect"
               stripe>
          <template slot-scope="{ row, index }" slot="action">
            <Button v-hasPermission="'sys_account_edit'" type="primary" size="small" @click="edit(row)">编辑</Button>
            <Button v-hasPermission="'sys_account_disable'" type="default" size="small" v-if="row.enabled==0"
                    style="background-color: #B22222" ghost
                    @click="enable(row)">启用
            </Button>
            <Button v-hasPermission="'sys_account_disable'" type="default" size="small" v-if="row.enabled==1"
                    style="background-color: #5c5c5c" ghost
                    @click="disable(row)">禁用
            </Button>
            <Button v-hasPermission="'sys_account_del'" type="error" size="small" @click="removeUser(row)">删除</Button>
          </template>
        </Table>
        <Table
          :loading="loading"
          :columns="exportColumns"
          :data="exportData"
          ref="exportTable"
          style="display:none"
        ></Table>
        <!--分页插件-->
        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <Page :total="total" :current="current" :page-size="size"
                  @on-change="changePage"
                  @on-page-size-change="changePageSize"
                  prev-text="上一页"
                  next-text="下一页"
                  show-total
                  show-elevator
                  show-sizer
                  :transfer="true"></Page>
          </div>
        </div>
      </div>
    </Card>
    <Modal
      :title="modalTitle"
      v-model="userModalVisible"
      :mask-closable="false"
      :width="500"
      :styles="{top: '30px'}"
    >
      <Form ref="userForm" :model="userForm" :label-width="60" :rules="userFormValidate">
        <FormItem label="用户名" prop="username">
          <Input type="text" v-model="userForm.username" autocomplete="off" inline="true"/>
        </FormItem>
        <FormItem label="密码" prop="password" v-if="modalType===0" :error="errorPass">
          <Input type="password" v-model="userForm.password" autocomplete="off"/>
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input type="text" v-model="userForm.email"/>
        </FormItem>
        <FormItem label="手机号" prop="phone">
          <Input type="text" v-model="userForm.phone"/>
        </FormItem>
        <FormItem label="头像" prop="avatar">
          <Input type="text" v-model="userForm.avatar"/>
          <div class="demo-upload-list" v-for="item in uploadList">
            <template v-if="item.status === 'finished'">
              <img :src="item.url">
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
              </div>
            </template>
            <template v-else>
              <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
          </div>
          <Upload
            ref="upload"
            :show-upload-list="false"
            :default-file-list="defaultList"
            :on-success="handleSuccess"
            :format="['jpg','jpeg','png']"
            :max-size="2048"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            multiple
            type="drag"
            :action=uploadFileAction
            style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
          <Modal title="View Image" v-model="visible">
            <img :src="this.userForm.avatar" v-if="visible" style="width: 100%">
          </Modal>
        </FormItem>
        <FormItem label="所属部门" prop="deptId">
          <department-tree-choose width="285px" @on-change="handleSelectDepTree" ref="depTree"></department-tree-choose>
        </FormItem>
        <FormItem label="角色" prop="rids">
          <Select v-model="userForm.rids" multiple>
            <Option v-for="item in roleList" :value="item.id" :key="item.id" :label="item.name">
              <!-- <div style="display:flex;flex-direction:column"> -->
              <span style="margin-right:10px;">{{ item.name }}</span>
              <span style="color:#ccc;">{{ item.description }}</span>
              <!-- </div> -->
            </Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelUser">取消</Button>
        <Button size="large" type="primary" :loading="submitLoading" @click="submitUser">提交</Button>
      </div>
    </Modal>
    <Modal
      title="查看大图"
      v-model="userAvatarModel"
      footer-hide
      class-name="vertical-center-modal">
      <img :src="userAvatar" v-if="userAvatarModel" style="width: 100%">
    </Modal>
  </div>
</template>

<script>
  import expandRow from './userExpand.vue'
  import { uploadFileAction } from '@/api/index'
  import {
    getUserListPage,
    addUser,
    editUser,
    disableUser,
    delUser,
    getAll
  } from '@/api/system/user-manage'
  import { getAllRoleList } from '@/api/system/role-manage'
  import departmentTreeChoose from '@/my-components/department-tree-choose'
  import circleLoading from '../../../my-components/circle-loading.vue'

  export default {
    name: 'userManage',
    components: {
      expandRow,
      departmentTreeChoose,
      circleLoading
    },
    data() {
      const validateMobile = (rule, value, callback) => {
        var reg = /^[1][3,4,5,7,8][0-9]{9}$/
        if (!reg.test(value)) {
          callback(new Error('手机号格式错误'))
        } else {
          callback()
        }
      }
      return {
        defaultList: [
          {
            'name': 'a42bdcc1178e62b4694c830f028db5c0',
            'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
          },
          {
            'name': 'bc7521e033abdd1e92222d733590f104',
            'url': 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
          }
        ],
        imgName: '',
        visible: false,
        uploadList: [],
        uploadFileAction: '',
        file: {
          url: '',
          name: ''
        },
        loading: true, // 表单加载状态
        userAvatarModel: false,
        userAvatar: '',
        modalType: 0,
        submitLoading: false,
        /* 总页数*/
        current: 1,
        size: 10,
        total: 0,
        selectCount: 0,
        /* 搜索表单*/
        searchFrom: {
          username: '',
          phone: '',
          email: '',
          gender: '',
          deptName: ''
        },
        roleList: [],
        dictSex: [],
        /* 添加用户表单字段*/
        userForm: {
          username: '',
          password: '',
          phone: '',
          email: '',
          sex: 1,
          avatar: '',
          deptId: '',
          rids: []
        },
        userFormValidate: {
          username: [
            { required: true, message: '账号不能为空', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '手机号不能为空', trigger: 'blur' },
            { validator: validateMobile, trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱地址' },
            { type: 'email', message: '邮箱格式不正确' }
          ],
          rids: [{ required: true, message: '请选择角色' }]
        },
        /* 对话框数据*/
        modalTitle: '',
        userModalVisible: false,
        errorPass: '',
        loading: true,
        operationLoading: false,
        loadingExport: true,
        modalExportAll: false,
        drop: false,
        dropDownContent: '展开',
        dropDownIcon: 'ios-arrow-down',
        /** 表格数据 **/
        tableData: [],
        /** 表格字段 **/
        tableColumns: [
          {
            type: 'selection',
            width: 60,
            align: 'center',
            fixed: 'left'
          },
          {
            type: 'expand',
            width: 50,
            fixed: 'left',
            render: (h, params) => {
              return h(expandRow, {
                props: {
                  row: params.row
                }
              })
            }
          },
          {
            type: 'index',
            width: 80,
            align: 'center',
            fixed: 'left',
            title: '序号'
          },
          {
            title: '用户名',
            width: 200,
            align: 'center',
            key: 'username',
            fixed: 'left',
            sortable: true
          },
          {
            title: '头像',
            width: 120,
            align: 'center',
            key: 'avatar',
            render: (h, params) => {
              const row = params.row
              return h('div', [
                  h('img', {
                    style: {
                      'margin-top': '10px',
                      'margin-bottom': '10px',
                      'border-radius': '4px',
                      width: '50px',
                      height: '50px',
                      cursor: 'pointer'
                    },
                    attrs: {
                      'src': row.avatar,
                      onerror: row.avatar
                    },
                    on: {
                      click: (e) => {
                        this.handleAvatarView(e.srcElement.currentSrc)
                      }
                    }
                  })
                ]
              )
            }
          },
          {
            title: '所属部门',
            width: 120,
            align: 'center',
            key: 'deptName'
          },
          {
            title: '手机',
            align: 'center',
            width: 180,
            key: 'phone'
          },
          {
            title: '邮箱',
            align: 'center',
            width: 160,
            key: 'email'
          },
          {
            title: '性别',
            width: 70,
            align: 'center',
            key: 'gender',
            render: (h, params) => {
              const gender = params.row.gender
              if (gender === 1) {
                return h('span', '男')
              } else {
                return h('span', '女')
              }
            }
          },
          {
            title: '用户类型',
            width: 140,
            align: 'center',
            key: 'type',
            render: (h, params) => {
              const row = params.row

              if (row.type === 1) {
                return h('Tag', {
                  props: {
                    color: '#FF0000'
                  }
                }, '超级管理员')
              } else {
                return h('Tag', {
                  props: {
                    color: '#FF6347'
                  }
                }, '普通管理员')
              }
            }
          },
          {
            title: '状态',
            key: 'enabled',
            width: 110,
            align: 'center',
            render: (h, params) => {
              const row = params.row

              if (row.enabled === 1) {
                return h('Tag', {
                  props: {
                    color: 'success'
                  }
                }, '启用')
              } else {
                return h('Tag', {
                  props: {
                    color: 'error'
                  }
                }, '禁用')
              }
            }
          },
          {
            title: '创建时间',
            align: 'center',
            width: 160,
            key: 'createTime'
          },
          {
            title: '操作',
            slot: 'action',
            width: 200,
            align: 'center',
            fixed: 'right'
          }
        ],
        exportColumns: [
          {
            title: '用户名',
            key: 'username'
          },
          {
            title: '头像',
            key: 'avatar'
          },
          {
            title: '所属部门ID',
            key: 'departmentId'
          },
          {
            title: '所属部门',
            key: 'departmentTitle'
          },
          {
            title: '手机',
            key: 'mobile'
          },
          {
            title: '邮箱',
            key: 'email'
          },
          {
            title: '性别',
            key: 'sex'
          },
          {
            title: '用户类型',
            key: 'type'
          },
          {
            title: '状态',
            key: 'status'
          },
          {
            title: '删除标志',
            key: 'delFlag'
          },
          {
            title: '创建时间',
            key: 'createTime'
          },
          {
            title: '更新时间',
            key: 'updateTime'
          }
        ],
        data: [],
        exportData: []
      }
    },
    methods: {
      // 注意事项：对DOM一系列的js操作最好都要放进Vue.nextTick()的回调函数中
      // this.$nextTick(()=>{
      //   this.$refs[formName].resetFields();
      // })
      searchUser() {
        this.getUserList()
      },
      resetSearchForm() {
        this.$refs.searchFrom.resetFields()
      },
      cancelUser() {
        this.userModalVisible = false
        this.$refs.userForm.resetFields()
      },
      submitUser() {
        this.submitLoading = true
        this.$refs.userForm.validate(valid => {
          if (valid) {
            if (this.modalType === 0) {
              delete this.userForm.id
              delete this.userForm.status
              if (
                this.userForm.password === '' ||
                this.userForm.password === undefined
              ) {
                this.errorPass = '密码不能为空'
                return
              }
              if (this.userForm.password.length < 6) {
                this.errorPass = '密码长度不得少于6位'
                return
              }
              this.submitLoading = true
              this.$Modal.confirm({
                title: '确认添加',
                content: '是否确认提交？',
                onOk: () => {
                  addUser(this.userForm).then(res => {
                    this.submitLoading = false
                    if (res.success === true) {
                      this.$Message.success('操作成功')
                      this.getUserList()
                      this.userModalVisible = false
                    }
                  })
                },
                onCancel: () => {
                  this.$Message.info('Clicked cancel')
                }
              })
            } else {
              // 编辑
              this.submitLoading = true
              this.$Modal.confirm({
                title: '编辑提交',
                content: '<p>是否确认提交</p>',
                onOk: () => {
                  editUser(this.userForm).then(res => {
                    this.submitLoading = false
                    if (res.success === true) {
                      this.$Message.success('操作成功')
                      this.getUserList()
                      this.userModalVisible = false
                    }
                  })
                }
              })
            }
          }
          this.submitLoading = false
        })
      },
      changePage(v) {
        this.searchFrom.current = v
        this.getUserList()
      },
      changePageSize(v) {
        this.searchFrom.size = v
        this.getUserList()
      },
      /* 下拉操作*/
      handleDropdown(name) {
        if (name === 'refresh') {
          this.getUserList()
        } else if (name === 'exportData') {
          if (this.selectCount <= 0) {
            this.$Message.warning('您还未选择要导出的数据')
            return
          }
          this.$Modal.confirm({
            title: '确认导出',
            content: '您确认要导出所选 ' + this.selectCount + ' 条数据?',
            onOk: () => {
              this.$refs.exportTable.exportCsv({
                filename: '用户数据'
              })
            }
          })
        } else if (name === 'exportAll') {
          this.exportAll()
        }
      },
      /* 导出全部*/
      exportAll() {
        getAll().then(res => {
          this.modalExportAll = false
          if (res.success) {
            this.exportData = res.data
            setTimeout(() => {
              this.$refs.exportTable.exportCsv({
                filename: '用户全部数据'
              })
            }, 1000)
          }
        })
      },
      /* 点击添加*/
      add() {
        this.modalType = 0
        this.modalTitle = '添加用户'
        this.$refs.userForm.resetFields()
        this.userForm.deptId = []
        this.userModalVisible = true
        this.submitLoading = false
      },
      /* 点击编辑*/
      edit(row) {
        this.modalType = 1
        this.modalTitle = '编辑用户'
        this.$refs.userForm.resetFields()
        this.userModalVisible = true
        // 转换null为""
        for (const attr in row) {
          if (row[attr] === null) {
            row[attr] = ''
          }
        }
        const str = JSON.stringify(row)
        const data = JSON.parse(str)
        this.userForm.id = data.id
        this.userForm.username = data.username
        this.userForm.password = data.password
        this.userForm.phone = data.phone
        this.userForm.email = data.email
        this.userForm.avatar = data.avatar
        if (data.roles !== undefined) {
          this.userForm.rids = data.roles.split(',')
        }
        this.$refs.depTree.setSelectDep([data.deptId], data.deptName)
      },
      /* 禁用*/
      disable(row) {
        this.$Modal.confirm({
          title: '确认禁用',
          content: '您确认要禁用用户 ' + row.username + ' ?',
          onOk: () => {
            this.operationLoading = true
            disableUser({ id: row.id, enabled: 0 }).then(res => {
              if (res.success === true) {
                this.getUserList()
              }
            })
          }
        })
      },
      /* 启用*/
      enable(row) {
        this.$Modal.confirm({
          title: '确认禁用',
          content: '您确认要启用用户 ' + row.username + ' ?',
          onOk: () => {
            this.operationLoading = true
            disableUser({ id: row.id, enabled: 1 }).then(res => {
              if (res.success === true) {
                this.getUserList()
              }
            })
          }
        })
      },
      /* 删除用户*/
      removeUser(row) {
        this.$Modal.confirm({
          title: '确认删除',
          content: '您确认要删除用户 ' + row.username + ' ?',
          onOk: () => {
            this.operationLoading = true
            delUser(row.id).then(res => {
              this.operationLoading = false
              if (res.success === true) {
                this.$Message.success('删除成功')
                this.getUserList()
              }
            })
          }
        })
      },
      handleSelectDepTree(v) {
        this.userForm.deptId = v[0]
      },
      /* 加载列表数据*/
      init() {
        this.getUserList()
      },
      /* 查询用户列表*/
      getUserList() {
        getUserListPage(this.current,this.size,this.searchFrom).then(res => {
          this.current = res.data.current
          this.total = res.data.total
          const data = res.data.records
          this.tableData = data
          this.loading = false
        })
      },
      /* 查看*/
      show(index) {
        this.$Modal.info({
          title: 'User Info',
          content: `Name：${this.data6[index].name}<br>Age：${this.data6[index].age}<br>Address：${this.data6[index].address}`
        })
      },
      showSelect(e) {
        this.exportData = e
        this.selectList = e
        this.selectCount = e.length
      },
      /* 批量删除*/
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
            this.operationLoading = true
            delUser(ids).then(res => {
              this.operationLoading = false
              if (res.success === true) {
                this.$Message.success('删除成功')
                this.clearSelectAll()
                this.getUserList()
              }
            })
          }
        })
      },
      clearSelectAll() {
        this.$refs.table.selectAll(false)
      },
      getRolesList() {
        getAllRoleList().then(res => {
          if (res.success === true) {
            this.roleList = res.data
          }
        })
      },
      //预览头像
      handleAvatarView(url) {
        this.userAvatarModel = true
        this.userAvatar = url
      },
      //上传头像成功
      handleView(name) {
        this.imgName = name
        this.visible = true
      },
      //删除头像
      handleRemove(file) {
        const fileList = this.uploadList
        this.uploadList.splice(fileList.indexOf(file), 1)
      },
      //上传头像成功
      handleSuccess(res, file) {
        this.userForm.avatar = res.data
        file.url = res.data
        file.name = '7eb99afb9d5f317c912f08b5212fd69a'
        this.uploadList.push(file)
      },
      handleFormatError(file) {
        this.$Notice.warning({
          title: 'The file format is incorrect',
          desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
        })
      },
      handleMaxSize(file) {
        this.$Notice.warning({
          title: 'Exceeding file size limit',
          desc: 'File  ' + file.name + ' is too large, no more than 2M.'
        })
      },
      handleBeforeUpload() {
        const check = this.uploadList.length < 5
        if (!check) {
          this.$Notice.warning({
            title: 'Up to five pictures can be uploaded.'
          })
        }
        return check
      }
    },
    mounted() {
      this.uploadFileAction = uploadFileAction
      this.init()
      this.getRolesList()
    }
  }
</script>
