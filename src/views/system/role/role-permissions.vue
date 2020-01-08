<template>
  <div class="role-permissions">
    <Button type="primary" @click="selectTreeAll">全选/反选</Button>
    <Tree ref="permTree" :data="permData" show-checkbox check-strictly @on-check-change="checkTree"
          @on-select-change="selectTree"
          multiple></Tree>
    <Button type="success" long :loading="saveLoading" @click="editRolePermissions">保存</Button>
  </div>

</template>
<script>
  import {
    editRolePerm
  } from '@/api/system/role-manage'

  export default {
    name: 'role-permissions',
    props: {
      permData: {
        type: Array,
        required: true,
        default: () => {
          return []
        }
      },
      roleId: String
    },
    data() {
      return {
        saveLoading: false,
        selectAllFlag: false
      }
    },
    methods: {
      editRolePermissions() {
        this.saveLoading = true
        let permIds = ''
        let selectedNodes = this.$refs.permTree.getCheckedAndIndeterminateNodes()
        selectedNodes.forEach(function(e) {
          permIds += e.id + ','
        })
        permIds = permIds.substring(0, permIds.length - 1)
        console.log('角色id' + this.roleId)
        if (this.roleId === ''){
          this.$Notice.warning({
            title: '操作被禁止',
            desc: '请选择角色后再进行保存'
          });
          this.saveLoading = false
          return
        }
        editRolePerm({
          id: this.roleId,
          pids: permIds
        }).then(res => {
          this.saveLoading = false
          if (res.success === true) {
            this.$Message.success('操作成功')
            this.$emit('reloadRoleList');
          }
        })
          },
      //选择菜单节点
      selectTree(v, n) {
        if (n.checked === false) {
          n.checked = true
        } else {
          n.selected = false
          n.checked = false
        }
      },
      //选中菜单节点
      checkTree(v, n) {
        if (n.selected === false) {
          n.selected = true
        } else {
          n.checked = false
          n.selected = false
        }
      },

      // 全选反选
      selectTreeAll() {
        this.selectAllFlag = !this.selectAllFlag
        let select = this.selectAllFlag
        this.selectedTreeAll(this.permData, select)
      },
      // 递归全选节点
      selectedTreeAll(permData, select) {
        let that = this
        permData.forEach(function(e) {
          e.selected = select
          e.checked = select
          if (e.children && e.children.length > 0) {
            that.selectedTreeAll(e.children, select)
          }
        })
      }
    }
  }
</script>
<style scoped>
  .role-permissions {

  }
</style>
