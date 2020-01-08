<!-- 角色列表信息 -->
<template>
  <div>
    <Button @click="addRole" type="primary" icon="md-add">添加角色</Button>
    <Alert show-icon>当前操作角色：<span style="color: red;margin-right: 50px;">{{this.selectedName}}</span>(开关为是否设置为默认角色)</Alert>
    <CellGroup class="aside-list-panel" @on-click="onSelectClick">
      <Cell
        :title="item.name"
        v-for="item in roleData"
        :name="JSON.stringify(item)"
        :selected="item.id===selectedId"
        :extra="item.remark"
        :label="item.code">
        <Icon
          type="ios-people"
          size="18"
          color="#5cadff"
          slot="icon"/>
        <span slot="extra" style="margin-right: 15px">
          <i-switch true-color="#13ce66" false-color="#ff4949" v-model="item.def===1" @on-change="changeDefaltRole">
                <span slot="open">默认</span>
                <span slot="close">否</span>
            </i-switch>
        </span>
        <span slot="extra" style="margin-right: 15px">
          <Button type="primary" size="small" @click="editRole(item)">修改</Button>
        </span>
        <span slot="extra">
          <Button type="error" icon="md-close" size="small" @click="delRole(item)">删除</Button>
        </span>
      </Cell>
    </CellGroup>
    <!-- 编辑 -->
    <Modal :title="modalTitle" v-model="roleModalVisible" :mask-closable='false' :width="500">
      <Form ref="roleForm" :model="roleForm" :label-width="80" :rules="roleFormValidate">
        <FormItem label="角色名称" prop="name">
          <Input v-model="roleForm.name" placeholder="请输入角色名称"/>
        </FormItem>
        <FormItem label="角色代码" prop="code">
          <Input v-model="roleForm.code" placeholder="按照Spring Security约定建议以‘ROLE_’开头"/>
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Input v-model="roleForm.remark"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelRole">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="submitRole">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { Icon, CellGroup, Cell } from 'iview'
  import {
    addRole,
    editRole,
    setDefaultRole,
    deleteRole
  } from '@/api/system/role-manage'
  export default {
    name: 'roleList',
    components: {
      Icon,
      CellGroup,
      Cell
    },
    props: {
      roleData: {
        type: Array,
        required: true,
        default: () => {
          return []
        }
      },
      selectedId : String
    },
    data() {
      return {
        permData: [],
        selectedName:'无',
        checkStrictly: true,
        switchValue: false,
        modalTitle: '',
        roleModalVisible: false,
        submitLoading: false,
        modalType: '0',
        roleForm: {
          name: '',
          code: '',
          remark: ''
        },
        roleFormValidate: {
          name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
        },
      }
    },
    methods: {
      //选择一个角色
      onSelectClick(role) {
        let r = JSON.parse(role)
        this.selectedName = r.name
        this.$emit('on-click', role)
      },
      // 修改默认注册角色
      changeDefaltRole(flag){
        this.$Modal.confirm({
          title: '确认设置',
          content: '您确认要设置所选的 ' + this.selectedName + ' 为注册用户默认角色?',
          onOk: () => {
            let params = {
              id: this.selectedId,
              def: flag
            }
            setDefaultRole(params).then(res => {
              if (res.success === true) {
                this.$Message.success('操作成功')
                this.$emit('reloadRoleList');
              }
            })
          }
        })
      },
      // 点击添加按钮
      addRole() {
        this.modalType = 0
        this.modalTitle = '添加角色'
        this.$refs.roleForm.resetFields()
        delete this.roleForm.id
        this.roleModalVisible = true
      },

      //点击删除按钮
      delRole(role){
        this.$Modal.confirm({
          title: '确认删除',
          content: '您确认要删除角色 ' + role.name + ' ?',
          onOk: () => {
            deleteRole(this.selectedId).then(res => {
              if (res.success === true) {
                this.$Message.success('删除成功')
                this.$emit('reloadRoleList');
              }
            })
          }
        })
      },

      // 点击修改按钮
      editRole(role){
        this.modalType = 1
        this.modalTitle = '编辑角色'
        // 转换null为""
        for (let attr in role) {
          if (role[attr] === null) {
            role[attr] = ''
          }
        }
        this.roleForm.id = role.id
        this.roleForm.code = role.code
        this.roleForm.name = role.name
        this.roleForm.remark = role.remark
        this.roleModalVisible = true
      },
      // 关闭修改窗口
      cancelRole(){
        this.roleModalVisible = false
      },
      // 修改角色信息 提交
      submitRole(){
        this.$refs.roleForm.validate(valid => {
          if (valid) {
            if (this.modalType === 0) {
              // 添加
              this.submitLoading = true
              addRole(this.roleForm).then(res => {
                this.submitLoading = false
                if (res.success === true) {
                  this.$Message.success('操作成功')
                  this.$emit('reloadRoleList');
                  this.roleModalVisible = false
                }
              })
            } else {
              this.submitLoading = true
              editRole(this.roleForm).then(res => {
                this.submitLoading = false
                if (res.success === true) {
                  this.$Message.success('操作成功')
                  this.$emit('reloadRoleList');
                  this.roleModalVisible = false
                }
              })
            }
          }
        })
      }
    }
  }
</script>
