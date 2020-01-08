<style lang="scss">
  @import "menu-manage";
</style>
<template>
  <div class="search">
    <Card>
      <Row class="operation">
        <Button @click="addMenu" type="primary" icon="md-add">添加子节点</Button>
        <Button @click="addRootMenu" icon="md-add">添加一级菜单</Button>
        <Button @click="delAll" icon="md-trash">批量删除</Button>
        <Dropdown @on-click="handleDropdown">
          <Button>更多操作
            <Icon type="md-arrow-dropdown"></Icon>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem name="refresh">刷新</DropdownItem>
            <DropdownItem name="expandOne">仅显示一级</DropdownItem>
            <DropdownItem name="expandTwo">仅展开两级</DropdownItem>
            <DropdownItem name="expandAll">展开所有</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Row>
      <Row type="flex" justify="start" class="code-row-bg">
        <Col span="6">
          <Alert show-icon>
            当前选择编辑：
            <span class="select-title">{{editTitle}}</span>
            <a class="select-clear" v-if="menuForm.id" @click="cancelEdit">取消选择</a>
          </Alert>
          <Input
            v-model="searchKey"
            suffix="ios-search"
            @on-change="search"
            placeholder="输入菜单名搜索"
            clearable
          />
          <div class="tree-bar">
            <Tree
              ref="tree"
              :data="data"
              show-checkbox
              @on-check-change="changeSelect"
              @on-select-change="selectTree"
              :render="renderContent"
            ></Tree>
          </div>
          <Spin size="large" fix v-if="loading"></Spin>
        </Col>
        <!--新增/编辑表单-->
        <Col span="9">
          <Form ref="menuForm" :model="menuForm" :label-width="85" :rules="menuFormValidate">
            <FormItem label="类型" prop="type">
              <RadioGroup v-model="menuForm.type">
                <Radio :label="0" :disabled="isButton" :true-value="1">
                  <Icon type="ios-list-box-outline" size="16" style="margin-bottom:3px;"></Icon>
                  <span>页面菜单</span>
                </Radio>
                <Radio :label="1" :disabled="isMenu" :true-value="0">
                  <Icon type="md-log-in" size="16" style="margin-bottom:3px;"></Icon>
                  <span>操作按钮</span>
                </Radio>
              </RadioGroup>
            </FormItem>
            <div v-if="menuForm.type===0">
              <FormItem label="菜单名称" prop="title">
                <Tooltip trigger="focus" placement="right" content="设置该路由在侧边栏和面包屑中展示的名字">
                  <Input v-model="menuForm.title" style="width:400px"/>
                </Tooltip>
              </FormItem>
              <FormItem label="图标" prop="icon">
                <Tooltip
                  placement="right"
                  :max-width="230"
                  transfer
                  content="设置该路由的图标"
                >
                  <Input
                    :icon="menuForm.icon"
                    placeholder="请选择选择图标"
                    v-model="menuForm.icon"
                    @on-focus="showEditIcon(0)"
                    style="width:400px"/>
                </Tooltip>
              </FormItem>
              <FormItem label="前端组件" prop="component">
                <Tooltip
                  placement="right"
                  :max-width="230"
                  transfer
                  content="组件地址，前端动态加载,vue默认加载@/views/xxxxxx"
                >
                  <Input v-model="menuForm.component" placeholder="例如:/system/monitor/monitor" style="width:400px"/>
                </Tooltip>
              </FormItem>
            </div>
            <FormItem label="路径" prop="path" v-if="menuForm.type===0">
              <Tooltip
                placement="right"
                :max-width="230"
                transfer
                content="访问此路由的路径，根据什么路径找此页面"
              >
                <Input v-model="menuForm.path" style="width:400px"/>
              </Tooltip>
            </FormItem>
            <!--菜单结束-->

            <!--按钮 开始-->
            <FormItem label="名称" prop="name" v-if="menuForm.type===1">
              <Tooltip placement="right" content="操作按钮名称不得重复">
                <Input v-model="menuForm.name" style="width:400px"/>
              </Tooltip>
            </FormItem>
            <FormItem label="请求路径" prop="path" v-if="menuForm.type===1">
              <Tooltip
                placement="right"
                :max-width="230"
                transfer
                content="填写后台请求URL，类似:  /user/add"
              >
                <Input v-model="menuForm.path" style="width:400px"/>
              </Tooltip>
            </FormItem>
            <FormItem label="按钮权限类型" prop="btnType" v-if="menuForm.type===1">
              <Select
                v-model="menuForm.btnType"
                placeholder="请选择或输入搜索"
                filterable
                clearable
                style="width:400px"
              >
                <Option
                  v-for="(item, i) in dictPermissions"
                  :key="i"
                  :value="item.val"
                >{{item.title}}
                </Option>
              </Select>
            </FormItem>
            <!--按钮 结束-->

            <!--公共字段开始-->
            <FormItem label="排序值" prop="sort">
              <InputNumber :max="1000" :min="0" v-model="menuForm.sort"></InputNumber>
              <span style="margin-left:5px">值越小越靠前，支持小数</span>
            </FormItem>
            <FormItem label="是否启用" prop="enabled">
              <i-switch size="large" v-model="menuForm.enabled" :true-value="1" :false-value="0">
                <span slot="open">启用</span>
                <span slot="close">禁用</span>
              </i-switch>
            </FormItem>
            <Form-item>
              <Button
                style="margin-right:5px"
                @click="submitEdit"
                :loading="submitLoading"
                type="primary"
                icon="ios-create-outline"
              >修改并保存
              </Button>
              <Button @click="handleReset">重置</Button>
            </Form-item>
          </Form>
        </Col>
      </Row>
    </Card>
    <!--添加子节点/添加一级菜单 弹框-->
    <Modal
      draggable
      :title="modalTitle"
      v-model="menuModalVisible"
      :mask-closable="false"
      :width="500"
      :styles="{top: '30px'}"
    >
      <Form ref="menuFormAdd" :model="menuFormAdd" :label-width="100" :rules="menuFormValidate">
        <div v-if="showParent">
          <FormItem label="上级节点：">{{parentTitle}}</FormItem>
        </div>
        <FormItem label="类型" prop="type">
          <RadioGroup v-model="menuFormAdd.type">
            <Radio :label="0" :disabled="isButtonAdd">
              <Icon type="ios-list-box-outline" size="16" style="margin-bottom:3px;"></Icon>
              <span>页面菜单</span>
            </Radio>
            <Radio :label="1" :disabled="isMenuAdd">
              <Icon type="md-log-in" size="16" style="margin-bottom:3px;"></Icon>
              <span>操作按钮</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <!--菜单属性 开始-->
        <FormItem label="菜单名称" prop="name" v-if="menuFormAdd.type===0">
          <Tooltip trigger="focus" placement="right" content="设置该路由在侧边栏和面包屑中展示的名字">
            <Input v-model="menuFormAdd.name" placeholder="请输入菜单名称"/>
          </Tooltip>
        </FormItem>
        <div v-if="menuFormAdd.type===0">
          <FormItem label="图标" prop="icon">
            <Input :icon="menuFormAdd.icon" placeholder="点击选择图标" v-model="menuFormAdd.icon"
                   @on-focus="showEditIcon(1)"/>
          </FormItem>
          <FormItem label="前端组件" prop="component">
            <Tooltip
              placement="right"
              :max-width="230"
              transfer
              content="组件地址，前端动态加载,vue默认加载@/views/xxxxxx"
            >
              <Input v-model="menuFormAdd.component" placeholder="/system/monitor/monitor"/>
            </Tooltip>
          </FormItem>
        </div>
        <FormItem label="菜单路径" prop="path" v-if="menuFormAdd.type===0">
          <Tooltip
            placement="right"
            :max-width="230"
            transfer
            content="访问此路由的路径，根据什么路径找此页面"
          >
            <Input v-model="menuFormAdd.path"/>
          </Tooltip>
        </FormItem>
        <!--菜单属性 结束-->
        <!--按钮属性开始-->
        <FormItem label="按钮名称" prop="name" v-if="menuFormAdd.type===1">
          <Tooltip trigger="focus" placement="right" content="操作按钮名称不得重复">
            <Input v-model="menuFormAdd.name" style="width:380px"/>
          </Tooltip>
        </FormItem>
        <FormItem label="按钮请求路径" prop="path" v-if="menuFormAdd.type===1">
          <Tooltip
            placement="right"
            :max-width="230"
            transfer
            content="填写后台Controller的Mapping，后台将作权限拦截"
          >
            <Input v-model="menuFormAdd.path" style="width:380px"/>
          </Tooltip>
        </FormItem>
        <FormItem label="按钮权限类型" prop="btnType" v-if="menuFormAdd.type===1">
          <Select v-model="menuFormAdd.btnType" placeholder="请选择或输入搜索" filterable clearable>
            <Option v-for="(item, i) in dictPermissions" :key="i" :value="item.val">{{item.title}}</Option>
          </Select>
        </FormItem>
        <!--按钮属性 结束-->

        <FormItem label="排序值" prop="sort" v-if="menuFormAdd.type===0">
          <InputNumber :max="1000" :min="0" v-model="menuFormAdd.sort"></InputNumber>
          <span style="margin-left:5px">值越小越靠前，支持小数</span>
        </FormItem>
        <FormItem label="是否启用" prop="status">
          <i-switch size="large" v-model="menuFormAdd.enabled" :true-value="1" :false-value="0">
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
          </i-switch>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelAdd">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="submitAdd">提交</Button>
      </div>
    </Modal>
    <Modal title="选择图标" v-model="iconModalVisible" :width="800" :styles="{top: '30px'}" footer-hide>
      <!--<icon-choose @on-select="handleSelectIcon"></icon-choose>-->
      <IconChoose @on-select="handleSelectIcon"></IconChoose>
    </Modal>
    <BackTop></BackTop>
  </div>
</template>

<script>
  import {
    getMenuTree,
    addPermission,
    editPermission,
    deletePermission,
    searchPermission,
    getDictDataByType
  } from '@/api/system/menu-manage'
  import IconChoose from '@/my-components/icon-choose'
  export default {
    name: 'menu-manage',
    components: {
      IconChoose
    },
    data() {
      return {
        loading: true,
        /*默认展开级别*/
        expandLevel: 2,
        menuModalVisible: false,
        iconModalVisible: false,
        selectList: [],
        selectCount: 0,
        showParent: false,
        searchKey: '',
        parentTitle: '',
        isButtonAdd: false,
        isMenuAdd: false,
        isMenu: false,
        isButton: false,
        editTitle: '',
        modalTitle: '',
        menuForm: {
          id: '',
          name: '',
          path: '',
          component: '',
          title: '',
          icon: '',
          parentId: '',
          btnType: '',
          type: 0,
          sort: 0,
          level: 0,
          enabled: 1
        },
        //新增菜单form
        menuFormAdd: {
          name: '',
          icon: '',
          btnType: ''
        },
        menuFormValidate: {
          name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
          title: [{ required: true, message: '路由英文名不能为空', trigger: 'blur' }],
          icon: [{ required: true, message: '图标不能为空', trigger: 'click' }],
          path: [{ required: true, message: '路径不能为空', trigger: 'blur' }],
          component: [
            { required: true, message: '前端组件不能为空', trigger: 'blur' }
          ]
        },
        submitLoading: false,
        data: [],
        dictPermissions: [],
        iconType: 0
      }
    },
    methods: {
      init() {
        this.getAllList()
        this.getDictPermissions()
      },
      getDictPermissions() {
        getDictDataByType({ type: 'btns' }).then(res => {
          if (res.success) {
            this.dictPermissions = res.data
          }
        })
      },
      showEditIcon(v) {
        this.iconType = v
        this.iconModalVisible = true
      },
      handleSelectIcon(v) {
        if (this.iconType === 0) {
          this.menuForm.icon = v
        } else {
          this.menuFormAdd.icon = v
        }
        this.iconModalVisible = false
      },
      handleDropdown(name) {
        if (name === 'expandOne') {
          this.expandLevel = 1
          this.getAllList()
        } else if (name === 'expandTwo') {
          this.expandLevel = 2
          this.getAllList()
        } else if (name === 'expandAll') {
          this.expandLevel = 3
          this.getAllList()
        } else if (name === 'refresh') {
          this.getAllList()
        }
      },
      getAllList() {
        this.loading = true
        getMenuTree().then(res => {
          this.loading = false
          if (res.success === true) {
            // 仅展开指定级数 默认一级
            let expandLevel = this.expandLevel
            res.data.forEach(function(e) {
              if (expandLevel === 1) {
                if (e.level === 1) {
                  e.expand = false
                }
                if (e.children && e.children.length > 0) {
                  e.children.forEach(function(c) {
                    if (c.level === 2) {
                      c.expand = false
                    }
                  })
                }
              } else {
                if (e.children && e.children.length > 0) {
                  e.children.forEach(function(c) {
                    if (expandLevel === 2) {
                      if (c.level === 2) {
                        c.expand = false
                      }
                    }
                  })
                }
              }
            })

            this.data = res.data
          }
        })
      },
      search() {
        if (this.searchKey) {
          this.loading = true
          searchPermission({ title: this.searchKey }).then(res => {
            this.loading = false
            if (res.success) {
              this.data = res.result
            }
          })
        } else {
          this.getAllList()
        }
      },
      /**
       * 当前已选中的节点数组、当前项
       * @param v
       * @param n
       */
      selectTree(v, n) {
        if (n.level === 1 || n.level === 2) {
          this.isButton = false
          this.isMenu = true
        } else {
          this.isButton = true
          this.isMenu = false
        }

        if (n.enabled === 0) {
          this.editStatus = false
        } else {
          this.editStatus = true
        }
        let str = JSON.stringify(n)
        let menu = JSON.parse(str)
        this.menuForm = menu
        this.editTitle = menu.title
      },
      cancelEdit() {
        let data = this.$refs.tree.getSelectedNodes()[0]
        if (data) {
          data.selected = false
        }
        this.isMenu = false
        this.isButton = false
        this.$refs.menuForm.resetFields()
        delete this.menuForm.id
        this.editTitle = ''
      },
      cancelAdd() {
        this.menuModalVisible = false
      },
      handleReset() {
        let type = this.menuForm.type
        this.$refs.menuForm.resetFields()
        this.editStatus = true
        this.menuForm.type = type
      },
      submitEdit() {
        this.$refs.menuForm.validate(valid => {
          if (valid) {
            if (!this.menuForm.id) {
              this.$Message.warning('请先点击选择要修改的菜单节点')
              return
            }
            this.submitLoading = true
            if (this.menuForm.sortOrder === null) {
              this.menuForm.sortOrder = ''
            }
            if (this.menuForm.btnType === null) {
              this.menuForm.btnType = ''
            }
            if (this.menuForm.type == 1) {
              this.menuForm.icon = ''
              this.menuForm.component = ''
            }
            if (this.menuForm.type === 0) {
              delete this.menuForm.parentId
              console.log("this.menuForm==>",this.menuForm)
            }
            this.menuForm.name = this.menuForm.title
            editPermission(this.menuForm).then(res => {
              this.submitLoading = false
              if (res.success === true) {
                this.$Message.success('编辑成功')
                //util.initRouter(this);
                this.init()
                this.menuModalVisible = false
              }
            })
          }
        })
      },
      submitAdd() {
        this.$refs.menuFormAdd.validate(valid => {
          if (valid) {
            this.submitLoading = true
            if (this.menuFormAdd.sort === null) {
              this.menuFormAdd.sort = ''
            }
            //如果是按钮
            if (this.menuFormAdd.type == 1) {
              this.menuFormAdd.title = ''
              this.menuFormAdd.icon = ''
              this.menuFormAdd.component = ''
            } else {
              this.menuFormAdd.title = this.menuFormAdd.name
            }
            addPermission(this.menuFormAdd).then(res => {
              this.submitLoading = false
              if (res.success === true) {
                this.$Message.success('添加成功')
                //util.initRouter(this);
                this.init()
                this.menuModalVisible = false
              }
            })
          }
        })
      },
      addMenu() {
        if (this.menuForm.id == '' || this.menuForm.id == null) {
          this.$Message.warning('请先点击选择一个菜单权限节点')
          return
        }
        this.parentTitle = this.menuForm.title
        this.modalTitle = '添加菜单权限(可拖动)'
        this.showParent = true
        let type = 0
        if (this.menuForm.level === 1) {
          type = 0
          this.isMenuAdd = true
          this.isButtonAdd = false
        } else if (this.menuForm.level === 2) {
          type = 1
          this.isMenuAdd = false
          this.isButtonAdd = true
        } else if (this.menuForm.level === 3) {
          this.$Modal.warning({
            title: '不能添加',
            content: '仅支持2级菜单目录'
          })
          return
        } else {
          type = 0
          this.isMenuAdd = false
          this.isButtonAdd = false
        }
        this.menuFormAdd = {
          type: type,
          parentId: this.menuForm.id,
          level: Number(this.menuForm.level) + 1,
          sort: 0,
          btnType: '0',
          enabled: 1
        }
        this.menuModalVisible = true
      },
      addRootMenu() {
        this.modalTitle = '添加一级菜单(可拖动)'
        this.isMenuAdd = true
        this.isButtonAdd = false
        this.showParent = false
        this.menuFormAdd = {
          parentId:'0',
          type: 0,
          level: 1,
          sort: 0
        }
        this.menuModalVisible = true
      },
      changeSelect(v) {
        this.selectCount = v.length
        this.selectList = v
      },
      delAll() {
        if (this.selectCount <= 0) {
          this.$Message.warning('您还未勾选要删除的数据')
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
            deletePermission(ids).then(res => {
              if (res.success === true) {
                this.$Message.success('删除成功')
                //util.initRouter(this);
                this.selectList = []
                this.selectCount = 0
                this.cancelEdit()
                this.init()
              }
            })
          }
        })
      },
      renderContent(h, { root, node, data }) {
        let icon = ''
        if (data.level === 1) {
          icon = 'md-medical'
        } else if (data.level === 2) {
          icon = 'md-fastforward'
        } else if (data.level === 3) {
          icon = 'md-options'
        } else if (data.level === 4) {
          icon = 'md-nuclear'
        } else {
          icon = 'md-nuclear'
        }
        return h('span', {
          style: {
            display: 'inline-block',
            width: '100%',
            cursor: 'pointer'
          },
          attrs: {
            draggable: 'true'
          },
          on: {
            dragstart: () => this.handleDragStart(root, node, data),
            dragover: () => this.handleDragOver(root, node, data),
            dragend: () => this.handleDragEnd(root, node, data),
            drop: () => this.handleDrop(root, node, data)
          }
        }, [
          h('span', [
            h('Icon', {
              props: {
                type: icon,
                size: '16'
              },
              style: {
                marginRight: '8px',
                marginBottom: '0px'
              }
            }),
            h('span',
              {
                style: {
                  marginRight: '8px',
                  marginTop: '5px'
                },
                class: {
                  'ivu-tree-title': true,
                  'ivu-tree-title-selected': data.id == this.menuForm.id
                },
                on: {
                  click: () => {
                    this.selectTree(node, data)
                  }
                }
              },
              data.title)
          ]),
          h('span', {
            style: {
              // display: 'inline-block',
              fontSize: '18px',
              marginTop: '-5px',
              marginRight: '30px',
              marginLeft: '10px'
            }
          }, [
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                // type: 'primary',
                icon: 'md-menu',
                shape: 'circle'
              }),
              style: {
                marginRight: '8px'
              },
              on: {
                click: () => {
                  this.appendMenu(data)
                }
              }
            }),
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'md-disc',
                shape: 'circle'
              }),
              style: {
                marginRight: '8px'
              },
              on: {
                click: () => {
                  this.appendBtn(data)
                }
              }
            }),
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'md-trash',
                shape: 'circle'
              }),
              on: {
                click: () => {
                  this.remove(data)
                }
              }
            })
          ])
        ])
      },
      appendMenu(data) {
        if (data.type !== 1) {
          const children = data.children || []
          children.push({
            id: '0',
            name: '新增菜单(临时)',
            title: '新增菜单(临时)',
            parentId: data.id,
            expand: true,
            enabled: 1,
            level: data.level + 1,
            type: 0
          })
          this.$set(data, 'children', children)
        } else {
          this.$Message.info('按钮下不允许新增菜单')
        }

      },
      appendBtn(data) {
        //如果是不是一级菜单
        if (data.type === 0 && data.level !== 0) {
          const children = data.children || []
          children.push({
            id: '0',
            title: '新增按钮(临时)',
            level: data.level + 1,
            parentId: data.id,
            expand: true,
            selected: true,
            enabled: 1,
            disabled: false,
            type: 1
          })
          this.$set(data, 'children', children)
        } else {
          this.$Message.info('只能在菜单下面添加按钮')
        }
      },
      remove(data) {
        this.$Modal.confirm({
          title: '确认删除此节点',
          content: '是否确认提交？',
          onOk: () => {
            deletePermission(data.id).then(res => {
              this.submitLoading = false
              if (res.success === true) {
                this.$Message.success('删除成功')
                this.init()
              }
            })
          },
          onCancel: () => {
            this.$Message.info('取消删除')
          }
        })
        // const parentKey = root.find(el => el === node).parent
        // const parent = root.find(el => el.nodeKey === parentKey).node
        // const index = parent.children.indexOf(data)
        // parent.children.splice(index, 1)
      },
      handleDragStart(root, node, data) {
        const event = window.event || arguments[0]
        this.dragstartNode = node
        this.dragstartData = data
      },
      handleDragOver(root, node, data) {
        const event = window.event || arguments[0]
        event.preventDefault()
      },
      handleDragEnd(root, node, data) {
        const event = window.event || arguments[0]
        event.preventDefault()
      },
      handleDrop(root, node, data) {
        event.preventDefault()
        const parentKey = root.find(el => el === node).parent !== 'undefined' ? root.find(el => el === node).parent : ''
        if (parentKey === 0 || parentKey) {
          const parent = root.find(el => el.nodeKey === parentKey).node
          const index = parent.children.indexOf(data)
          parent.children.splice(index, 1)
        } else {
          for (let i = 0; i < this.data.length; i++) {
            if (data.id === this.data[i].id) {
              this.data.splice(i, 1)
              break
            }
          }
        }
      }
      // ---------------------
      // 原文：https://blog.csdn.net/zhongmei121/article/details/87541211
    },
    mounted() {
      this.init()
    }
  }
</script>
