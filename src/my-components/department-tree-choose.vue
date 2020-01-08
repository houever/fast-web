<template>
  <div>
    <Poptip trigger="click" placement="right" title="选择部门" width="250">
      <div style="display:flex;">
        <Input
          v-model="departmentTitle"
          readonly
          :style="{width: width}"
          style="margin-right:10px;"
          :placeholder="placeholder"
        />
        <Button icon="md-trash" @click="clearSelect">清空已选</Button>
      </div>
      <div slot="content" class="tree-bar">
        <Input
          v-model="searchKey"
          suffix="ios-search"
          @on-change="searchDept"
          placeholder="输入部门名搜索"
          clearable
        />
        <Tree
          :data="dataDepts"
          :load-data="loadData"
          @on-select-change="selectTree"
          :multiple="multiple"
        ></Tree>
        <Spin size="large" fix v-if="depLoading"></Spin>
      </div>
    </Poptip>
  </div>
</template>

<script>
  import { initDepts,loadDepts,searchDept } from "@/api/index";
  export default {
    name: "departmentTreeChoose",
    props: {
      multiple: {
        type: Boolean,
        default: false
      },
      width: {
        type: String,
        default: "200px"
      },
      placeholder: {
        type: String,
        default: "点击选择部门"
      }
    },
    data() {
      return {
        depLoading: false,
        departmentTitle: "",
        searchKey: "",
        dataDepts: [],
        selectDep: [],
        department: []
      };
    },
    methods: {
      initDeptData() {
        initDepts().then(res => {
          if (res.success === true) {
            res.data.forEach(function(e) {
              if (e.parentId==='0') {
                e.loading = false;
                e.title = e.deptName;
                e.children = [];
              }
            });
            this.dataDepts = res.data;
          }
        });
      },
      loadData(item, callback) {
        loadDepts(item.id).then(res => {
          if (res.success === true) {
            res.data.forEach(function(e) {
              e.loading = false;
              e.title = e.deptName;
            });
            callback(res.data);
          }
        });
      },
      searchDept() {
        // 搜索部门
        if (this.searchKey) {
          this.depLoading = true;
          searchDept({ deptName: this.searchKey }).then(res => {
            this.depLoading = false;
            if (res.success) {
              res.data.forEach(function(e) {
                  e.title = e.deptName;
              });
              this.dataDepts = res.data;
            }
          });
        } else {
          this.initDeptData();
        }
      },
      selectTree(v) {
        let ids = [],
          title = "";
        v.forEach(e => {
          ids.push(e.id);
          if (title == "") {
            title = e.title;
          } else {
            title = title + "、" + e.title;
          }
        });
        this.departmentId = ids;
        this.departmentTitle = title;
        this.$emit("on-change", this.departmentId);
      },
      clearSelect() {
        this.departmentId = [];
        this.departmentTitle = "";
        this.initDeptData();
        this.$emit("on-change", this.departmentId);
      },
      setSelectDep(ids, title){
        this.departmentId = ids;
        this.departmentTitle = title;
        this.$emit("on-change", this.departmentId);
      }
    },
    created() {
      this.initDeptData();
    }
  };
</script>

<style lang="scss">
  .tree-bar {
    max-height: 500px;
    overflow: auto;
    margin-top: 5px;
  }
  .tree-bar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .tree-bar::-webkit-scrollbar-thumb {
    border-radius: 4px;
    -webkit-box-shadow: inset 0 0 2px #d1d1d1;
    background: #e4e4e4;
  }
  .ivu-tree .ivu-tree-empty {
    margin-top: 10px;
    font-size: 12px;
  }
</style>
