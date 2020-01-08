<template>
  <div class="role">
    <Row style="background:#f8f8f9;">
      <Col span="8">
        <div style="background: #f8f8f9">
          <Card title="系统角色列表" icon="md-person">
            <role-list :selected-id="this.cellSelectId" :roleData="roleList" @on-click="clickCell" @reloadRoleList="getRoleList"></role-list>
          </Card>
        </div>
      </Col>
      <Col span="6">
        <div>
          <Card title="系统角色列表" icon="md-build">
            <role-permissions :role-id="this.cellSelectId" :perm-data="this.permData" @reloadRoleList="getRoleList"></role-permissions>
            <!--<Tabs value="name1" :animated="false">
              <TabPane label="菜单权限" icon="ios-options" name="name1">
                <role-permissions :perm-data="this.permData"></role-permissions>
              </TabPane>
              <TabPane label="数据权限" icon="md-settings" name="name2">标签二的内容</TabPane>
            </Tabs>-->
          </Card>
        </div>
      </Col>
      <Col span="10">
        <Card shadow>
          <p slot="title" style="text-align: center">
            <Icon type="md-appstore"></Icon>
            数据权限
          </p>
          <div class="role-data-permission">
            <Form :label-width="65">
              <FormItem label="数据范围">
                <Select :v-model="this.dataType">
                  <Option :value="0">全部数据权限</Option>
                  <Option :value="1">自定义数据权限</Option>
                </Select>
              </FormItem>
            </Form>
            <Alert show-icon>
              默认可查看全部数据，自定义数据范围请点击选择下方数据
            </Alert>
            <div v-if="this.dataType !== 0" style="margin-top:15px">
              <Tree ref="depTree" :data="depData" multiple show-checkbox check-strictly check-directly
                    style="margin-top:15px"></Tree>
            </div>
            <Button type="primary" :loading="submitDepLoading" @click="submitDepEdit">提交</Button>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
  import {
    getRoleList,
    getAllPermissionList,
    getDeptTree,
    editRoleDep
  } from '@/api/system/role-manage'
  import roleList from './role-list'
  import RolePermissions from './role-permissions'

  export default {
    components: { RolePermissions, roleList },
    props: {},
    data() {
      return {
        treeLoading: false,
        cellSelectId: '',
        roleList: [],
        permData: [],
        pids: [],
        depData: [],
        deptIds: [],
        dataType: 0,
        submitDepLoading: false,
        switchValue: true,
      }
    },
    methods: {
      //初始化数据
      init() {
        this.getRoleList()
        this.getPermList()
        this.getDeptList()
      },
      //角色列表
      getRoleList() {
        this.loading = true
        let params = {
          current: 1,
          size: 100,
          sort: 'id',
          order: ''
        }
        getRoleList(params).then(res => {
          this.loading = false
          if (res.success === true) {
            this.roleList = res.data.records
          }
        })
      },
      // 权限列表
      getPermList() {
        this.treeLoading = true
        getAllPermissionList().then(res => {
          this.treeLoading = false
          if (res.success === true) {
            this.permData = res.data
          }
        })
      },

      // 加载部门树列表
      getDeptList() {
        getDeptTree().then(res => {
          if (res.success === true) {
            this.depData = res.data
          }
        })
      },

      // 点击角色
      clickCell(r) {
        let role = JSON.parse(r)
        this.cellSelectId = role.id
        if (role.pids === undefined) {
          role.pids = ''
        }
        this.pids = role.pids.split(',')
        // 菜单权限-递归选中子节点
        this.checkPermTree(this.permData, this.pids)
        // 数据权限
        if (role.dataType) {
          this.dataType = role.dataType
        }
        if (role.depts === undefined) {
          role.depts = ''
        }
        // 匹配勾选
        this.deptIds = role.depts.split(',')

        let deptTree = this.filterDeptTree(this.depData)
        this.depData =deptTree
        this.checkDepts(this.depData,this.deptIds)
      },
      editRole(role) {
        console.log('修改', role)
      },
      deleteRole(role) {
        console.log('删除', role)
      },
      // 递归判断子节点
      checkPermTree(permData, rolePerms) {
        let that = this
        permData.forEach(function(p) {
          p.selected = false
          p.checked = false
          if (that.hasPerm(p, rolePerms)) {
            p.selected = true
            p.checked = true
          }
          if (p.children && p.children.length > 0) {
            that.checkPermTree(p.children, rolePerms)
          }
        })
      },
      // 判断角色拥有的权限节点勾选
      hasPerm(p, rolePerms) {
        let flag = false
        for (let i = 0; i < rolePerms.length; i++) {
          if (p.id === rolePerms[i]) {
            flag = true
            break
          }
        }
        if (flag) {
          return true
        }
        return false
      },
      filterDeptTree(data) {
        let that = this
        const result = []
        data.forEach(function(dep) {
          const id = dep.id
          const title = dep.title
          const expand = true
          const checked = false
          let children = []
          if (dep.children && dep.children.length > 0) {
            children = that.filterDeptTree(dep.children)
          }
          result.push({
            id,
            title,
            expand,
            checked,
            children
          })
        })
        return result
      },
      checkDepts(data, roleDepIds) {
        let that = this
        data.forEach(function(dep) {
          dep.expand = true
          dep.checked = false
          if (that.hasPerm(dep, roleDepIds)) {
            dep.checked = true
          }
          if (dep.children && dep.children.length > 0) {
            that.checkDepts(dep.children, roleDepIds)
          }
        })
      },
      submitDepEdit(){
        let depIds = ''
        if (this.dataType != 0) {
          let selectedNodes = this.$refs.depTree.getCheckedAndIndeterminateNodes()
          if (selectedNodes.length < 1) {
            this.$Message.error('请至少选择一条数据')
            return
          }
          selectedNodes.forEach(function(e) {
            depIds += e.id + ','
          })
          depIds = depIds.substring(0, depIds.length - 1)
        }
        this.submitDepLoading = true
        editRoleDep({
          id: this.cellSelectId,
          dataType: this.dataType,
          depts: depIds
        }).then(res => {
          this.submitDepLoading = false
          if (res.success === true) {
            this.$Message.success('操作成功')
            this.getRoleList()
          }
        })
      }
    },
    mounted() {
      this.init()
    }
  }
</script>
