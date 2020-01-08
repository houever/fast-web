<style lang="scss">
  @import "process-manage";
</style>
<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <p slot="title">{{processName}} 流程节点设置</p>
          <Row type="flex" justify="start" class="code-row-bg">
            <Col span="6">
              <Alert show-icon>
                当前选择编辑：
                <span class="select-title">{{editTitle}}</span>
                <a class="select-clear" v-if="form.id" @click="cancelEdit">取消选择</a>
              </Alert>
              <div class="tree-bar">
                <Tree
                  ref="tree"
                  :data="data"
                  :render="renderContent"
                  @on-select-change="selectTree"
                ></Tree>
              </div>
              <Spin size="large" fix v-if="loading"></Spin>
            </Col>
            <Col span="9">
              <Form
                ref="form"
                :model="form"
                :label-width="90"
                :rules="formValidate"
                style="position:relative"
              >
                <FormItem label="节点名称" prop="title">{{form.title}}</FormItem>
                <Form-item label="节点类型" prop="type">
                  <Select v-model="form.type" disabled placeholder>
                    <Option
                      v-for="(item, i) in dictNodeType"
                      :key="i"
                      :value="item.val"
                    >{{item.title}}</Option>
                  </Select>
                </Form-item>
                <div v-if="form.type==1">
                  <FormItem label="可审批人员">
                    <Checkbox v-model="chooseRole" label="0" @on-change="clickRole">
                      <Icon type="md-people" size="14" style="margin:0 2px 2px 0"></Icon>
                      <span>根据角色选择</span>
                    </Checkbox>
                    <Checkbox v-model="chooseDept" label="0" @on-change="clickDept">
                      <Icon type="md-people" size="14" style="margin:0 2px 2px 0"></Icon>
                      <span>根据部门选择</span>
                    </Checkbox>
                    <Checkbox v-model="chooseUser" label="1" @on-change="clickUser">
                      <Icon type="md-person" style="margin:0 2px 2px 0"></Icon>
                      <span>直接选择人员</span>
                    </Checkbox>
                  </FormItem>
                  <FormItem label="选择角色" v-if="chooseRole">
                    <Select v-model="form.roles" multiple>
                      <Option
                        v-for="item in roleList"
                        :value="item.id"
                        :key="item.id"
                        :label="item.name"
                      >
                        <span style="margin-right:10px;">{{ item.name }}</span>
                        <span style="color:#ccc;">{{ item.description }}</span>
                      </Option>
                    </Select>
                  </FormItem>
                  <FormItem label="选择部门" v-if="chooseDept">
                    <Poptip trigger="click" placement="right" title="选择部门" width="250">
                      <div style="display:flex;">
                        <Input v-model="deptNames" readonly style="margin-right:10px;"/>
                        <Button icon="md-trash" @click="clearSelectDept">清空已选</Button>
                      </div>
                      <div slot="content" class="tree-bar">
                        <Input
                          v-model="searchKey"
                          suffix="ios-search"
                          placeholder="输入部门名称搜索"
                          clearable
                        />
                        <Tree
                          ref="deptTree"
                          :data="deptTreeData"
                          :load-data="loadDeptTree"
                          multiple
                          @on-select-change="selectDeptTree"
                        ></Tree>
                      </div>
                    </Poptip>
                  </FormItem>
                  <div v-if="chooseUser">
                    <FormItem label="选择用户">
                      <Button @click="userModalVisible=true" icon="md-person-add">选择用户</Button>
                    </FormItem>
                    <FormItem label>
                      <Collapse simple>
                        <Panel name="1">
                          已选择
                          <span class="select-count">{{selectUserCount}}</span> 人
                          <p slot="content">
                            <Tag
                              v-for="(item, i) in selectUsers"
                              :key="i"
                              :name="item.id"
                              color="default"
                              closable
                              @on-close="handleCancelUser"
                            >{{item.username}}</Tag>
                          </p>
                        </Panel>
                      </Collapse>
                    </FormItem>
                  </div>
                </div>
                <Form-item class="br">
                  <Button
                    type="primary"
                    :loading="submitLoading"
                    @click="handelSubmit"
                    icon="ios-create-outline"
                  >保存并提交</Button>
                  <Button @click="closeCurrentPage">关闭</Button>
                </Form-item>
                <Spin size="large" fix v-if="nodeLoading"></Spin>
              </Form>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
    <!-- Drawer抽屉式选择用户 -->
    <Drawer title="选择用户" closable v-model="userModalVisible" width="800">
      <Form
        ref="searchUserForm"
        :model="searchUserForm"
        inline
        :label-width="55"
        class="search-form"
      >
        <Form-item label="用户名" prop="username">
          <Input
            type="text"
            v-model="searchUserForm.username"
            clearable
            placeholder="请输入用户名"
            style="width: 200px"
          />
        </Form-item>
        <Form-item style="margin-left:-35px;" class="br">
          <Button @click="handleSearchUser" type="primary" icon="ios-search">搜索</Button>
          <Button @click="handleResetUser">重置</Button>
        </Form-item>
      </Form>
      <Table :loading="userLoading" border :columns="userColumns" :data="userData" ref="userTable"></Table>
      <Row type="flex" justify="end" class="code-row-bg page" style="margin: 10px 0;">
        <Page
          :current="searchUserForm.current"
          :total="totalUser"
          :page-size="searchUserForm.size"
          @on-change="changeUserPage"
          @on-page-size-change="changeUserPageSize"
          :page-size-opts="[5,10,15]"
          size="small"
          show-total
          show-elevator
          show-sizer
        ></Page>
      </Row>
      <div class="drawer-footer">
        已选择
        <span class="select-count">{{selectUserCount}}</span> 人
        <Button @click="clearSelectAllUser" style="margin-left:10px">清空已选</Button>
        <Button @click="userModalVisible=false" style="margin-left:5px" type="primary">关闭</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
import { getProcessNode, editNodeUser } from "@/api/activiti/process-manage";
import { initDepartment,initDeptByNode,loadDepartment } from '@/api/system/dept-manage';
import { getUserListData } from "@/api/system/user-manage";
import { getAllRoleList } from '@/api/system/role-manage';
import { getDictDataByType } from "@/api/system/dict-manage";
export default {
  name: "process_node_edit",
  data() {
    return {
      loading: false, // 表单加载状态
      nodeLoading: false,
      userLoading: true,
      data: [],
      searchKey:'',
      deptTreeData:[],
      editTitle: "",
      selectUserCount: 0,
      selectUsers: [],
      userModalVisible: false,
      modalTitle: "", // 添加或编辑标题
      deptNames:'',
      form: {
        // 添加或编辑表单对象初始化数据
        title: "",
        content: "",
        type: null,
        roles: [],
        deptIds:[],
      },
      roleList: [],
      searchUserForm: {
        username: "",
        type: "",
        status: "",
        current: 1, // 当前页数
        size: 9, // 页面大小
        sort: "createTime", // 默认排序字段
        order: "desc" // 默认排序方式
      },
      formValidate: {
        // 表单验证规则
      },
      submitLoading: false, // 添加或编辑提交状态
      chooseRole: false,
      chooseDept: false,
      chooseUser: false,
      userColumns: [
        {
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "用户名",
          key: "username",
          width: 145,
          sortable: true
        },
        {
          title: "头像",
          key: "avatar",
          width: 80,
          align: "center",
          render: (h, params) => {
            return h("Avatar", {
              props: {
                src: params.row.avatar
              }
            });
          }
        },
        {
          title: "所属部门",
          key: "departmentTitle",
          width: 120
        },
        {
          title: "手机",
          key: "mobile",
          width: 115,
          sortable: true
        },
        {
          title: "邮箱",
          key: "email",
          width: 180,
          sortable: true
        },
        {
          title: "性别",
          key: "sex",
          width: 70,
          align: "center",
          render: (h, params) => {
            let re = "";
            this.dictSex.forEach(e => {
              if (e.value == params.row.sex) {
                re = e.title;
              }
            });
            return h("div", re);
          }
        },
        {
          title: "用户类型",
          key: "type",
          align: "center",
          width: 100,
          render: (h, params) => {
            let re = "";
            if (params.row.type === 1) {
              re = "管理员";
            } else if (params.row.type === 0) {
              re = "普通用户";
            }
            return h("div", re);
          }
        },
        {
          title: "状态",
          key: "enabled",
          align: "center",
          width: 120,
          render: (h, params) => {
            if (params.row.status === 1) {
              return h("div", [
                h(
                  "Tag",
                  {
                    props: {
                      color: "green"
                    }
                  },
                  "正常启用"
                )
              ]);
            } else if (params.row.status === -1) {
              return h("div", [
                h(
                  "Tag",
                  {
                    props: {
                      color: "red"
                    }
                  },
                  "禁用"
                )
              ]);
            }
          }
        },
        {
          title: "创建时间",
          key: "createTime",
          sortable: true,
          sortType: "desc",
          width: 150
        },
        {
          title: "操作",
          key: "action",
          width: 130,
          align: "center",
          fixed: "right",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "info",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.selectUser(params.row);
                    }
                  }
                },
                "添加该用户"
              )
            ]);
          }
        }
      ],
      userData: [],
      totalUser: 0,
      dictNodeType: [],
      dictSex: [],
      backRoute: "",
      processName: "",
      processId: ""
    };
  },
  methods: {
    init() {
      this.backRoute = this.$route.query.backRoute;
      this.processId = this.$route.query.id;
      this.processName = this.$route.query.name;
      this.getUserDataList();
      this.getDictDataType();
      this.initDeptTreeData();
      this.getRoleList();
    },
    initDeptTreeData(){
      initDeptByNode('0').then(res=>{
        if (res.success === true) {
          res.data.forEach(function(e) {

            if (e.isParent) {
              e.loading = false
              e.title = e.deptName
              e.children = []
            }
          })
          this.deptTreeData = res.data
        }
      });
    },
    //加载部门树
    loadDeptTree(item, callback){
      loadDepartment(item.id).then(res => {
        if (res.success === true) {
          res.data.forEach(function(e) {
            if (e.isParent) {
              e.loading = false;
              e.title = e.deptName;
              e.children = [];
            }else{
              e.loading = false;
              e.title = e.deptName;
            }
          });
          callback(res.data);
        }
      });
    },
    //选择部门树
    selectDeptTree(v,n){
      this.deptNames='';
      let data = this.$refs.deptTree.getSelectedNodes();
      let ids = [];
      let names = '';
      data.forEach(e=>{
        names += e.title;
        ids.push(e.id);
      })
      this.deptNames = names;
    },
    clearSelectDept(){
      this.deptNames = '';
    },
    //获取节点的字典数据
    getDictDataType() {
      getDictDataByType("process_node_type").then(res => {
        if (res.success) {
          this.dictNodeType = res.data;
          this.getData();
        }
      });
      // 获取性别字典数据
      getDictDataByType("sex").then(res => {
        if (res.success) {
          this.dictSex = res.data;
        }
      });
    },
    getRoleList() {
      getAllRoleList().then(res => {
        if (res.success === true) {
          this.roleList = res.data;
        }
      });
    },
    getData() {
      this.loading = true;
      getProcessNode(this.processId).then(res => {
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
          data.forEach(e => {
            this.dictNodeType.forEach(t => {
              t.val = Number(t.val);
              if (!e.title && e.type == t.val) {
                e.title = t.title;
              }
            });
          });
          this.data = data;
        }
      });
    },
    renderContent(h, { root, node, data }) {
      let color = "",
        word = "";
      if (data.type == 0) {
        color = "#47cb89";
        word = "开";
      } else if (data.type == 1) {
        color = "#2db7f5";
        word = "审";
      } else if (data.type == 2) {
        word = "结";
      } else {
        color = "#f90";
        word = "其他";
      }
      return h(
        "span",
        {
          style: {
            display: "inline-block",
            cursor: "pointer"
          },
          on: {
            click: () => {
              this.selectTree(data);
            }
          }
        },
        [
          h("span", [
            h(
              "Avatar",
              {
                props: {
                  size: "small"
                },
                style: {
                  background: color,
                  "margin-right": "5px"
                }
              },
              word
            ),
            h("span", data.title)
          ])
        ]
      );
    },
    selectTree(v) {
      if (v) {
        // 转换null为""
        for (let attr in v) {
          if (v[attr] === null) {
            v[attr] = "";
          }
        }
        let str = JSON.stringify(v);
        let data = JSON.parse(str);
        this.selectUsers = data.users;
        this.selectUserCount = data.users.length;
        this.editTitle = data.title;
        if (data.users && data.users.length > 0) {
          this.chooseUser = true;
        } else {
          this.chooseUser = false;
        }
        if (data.roles && data.roles.length > 0) {
          this.chooseRole = true;
          let roleIds = [];
          data.roles.forEach(e => {
            roleIds.push(e.id);
          });
          data.roles = roleIds;
        } else {
          this.chooseRole = false;
        }
        this.form = data;
      } else {
        this.cancelEdit();
      }
    },
    cancelEdit() {
      let data = this.$refs.tree.getSelectedNodes()[0];
      if (data) {
        data.selected = false;
      }
      this.isMenu = false;
      this.isButton = false;
      this.$refs.form.resetFields();
      delete this.form.id;
      this.editTitle = "";
    },
    changeUserPage(v) {
      this.searchUserForm.current = v;
      this.getUserDataList();
    },
    changeUserPageSize(v) {
      this.searchUserForm.size = v;
      this.getUserDataList();
    },
    getUserDataList() {
      this.userLoading = true;
      getUserListData(this.searchUserForm).then(res => {
        this.userLoading = false;
        if (res.success === true) {
          this.userData = res.data.records;
          this.totalUser = res.data.total;
        }
      });
    },
    handleSearchUser() {
      this.searchUserForm.current = 1;
      this.searchUserForm.size = 9;
      this.getUserDataList();
    },
    handleResetUser() {
      this.$refs.searchUserForm.resetFields();
      this.searchUserForm.current = 1;
      this.searchUserForm.size = 9;
      // 重新加载数据
      this.getUserDataList();
    },
    handelSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.nodeId = this.form.id;
          this.submitLoading = true;
          // 用户id数据
          if (this.chooseUser) {
            let ids = [];
            this.selectUsers.forEach(e => {
              ids.push(e.id)
            });
            this.form.userIds = ids;
          } else {
            this.form.userIds = [];
          }
          if (this.chooseRole) {
            this.form.roleIds = this.form.roles;
          } else {
            this.form.roleIds = [];
          }
          if(this.chooseDept){
            let data = this.$refs.deptTree.getSelectedNodes();
            let ids = [];
            data.forEach(e=>{
              ids.push(e.id)
            })
            this.form.deptIds = ids;
          }else{
            this.form.deptIds = [];
          }
          editNodeUser(this.form).then(res => {
            this.submitLoading = false;
            if (res.success) {
              this.$Message.success(res.data);
              this.getData();
            }
          });
        }
      });
    },
    clickRole(v) {
      this.chooseRole = v;
    },
    clickDept(v){
      this.chooseDept = v;
    },
    clickUser(v) {
      this.chooseUser = v;
    },
    selectUser(v) {
      // 去重
      let that = this;
      let flag = true;
      if(this.selectUsers===""){
        this.selectUsers = [];
      }
      this.selectUsers.forEach(e => {
        if (v.id == e.id) {
          that.$Message.warning("已经添加该用户，请勿重复选择");
          flag = false;
        }
      });
      if (flag) {
        let u = {
          id: v.id,
          username: v.username
        };
        this.selectUsers.push(u);
        this.selectUserCount += 1;
        this.$Message.success("添加用户"+v.username+"成功");
      }
    },
    handleCancelUser(e, id) {
      // 删除所选用户
      let newArray = [];
      this.selectUsers.forEach(e => {
        if (id != e.id) {
          newArray.push(e);
        }
      });
      this.selectUsers = newArray;
      this.selectUserCount = newArray.length;
      this.$Message.success("删除所选用户成功");
    },
    clearSelectAllUser() {
      this.selectUserCount = 0;
      this.selectUsers = [];
    },
    // 关闭当前页面
    closeCurrentPage() {
      this.$store.commit("removeTag", "process_node_edit");
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
      if (to.name == "process_node_edit") {
        this.init();
      }
    }
  }
};
</script>
