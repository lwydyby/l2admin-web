<template>
  <el-dialog :visible.sync="dialogVisible" @open="dialogOpen" >
    <div slot="title">维护
      <el-tag>{{role.name}}</el-tag>用户</div>
    <el-form :inline="true" :model="searchForm" ref="searchForm" size="mini" style="margin-bottom: -18px;">
      <el-form-item label="名称" prop="name">
        <el-input v-model="searchForm.name" placeholder="名称" style="width: 100px;" />
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="searchForm.email" placeholder="邮箱" style="width: 120px;" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearchFormSubmit">
          <d2-icon name="search" /> 查询
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addRoleUser">
          <d2-icon name="add" /> 添加
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleSearchFormReset">
          <d2-icon name="refresh" /> 重置
        </el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" v-loading="loading" size="small" stripe highlight-current-row style="width: 100%;" @sort-change="handleSortChange">
      <el-table-column label="账号名称" prop="name">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="用户名称" prop="trueName">
        <template slot-scope="scope">
          {{scope.row.trueName}}
        </template>
      </el-table-column>
      <el-table-column label="邮箱" prop="email" sortable="custom" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.email}}
        </template>
      </el-table-column>
      <el-table-column label="phone" prop="phone">
        <template slot-scope="scope">
          {{scope.row.phone}}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="isAdd">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isAdd==2" size="mini" type="info">未添加</el-tag>
          <el-tag v-if="scope.row.isAdd==1" size="mini" type="success">已添加</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.isAdd==2" type="primary" title="添加" size="mini" icon="el-icon-plus" circle @click="modifyRoleUser(scope.row.id,1)"></el-button>
          <el-button v-if="scope.row.isAdd==1" type="danger" title="移除" size="mini" icon="el-icon-minus" circle @click="modifyRoleUser(scope.row.id,2)"></el-button>
        </template>
      </el-table-column>

    </el-table>
    <div slot="footer">
      <el-pagination :current-page="page.current" :page-size="page.size" :total="page.total" :page-sizes="[1,100, 200, 300, 400]" layout="total, sizes, prev, pager, next, jumper" style="margin: -10px;" @size-change="handleSizeChange" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <el-drawer
            title="添加用户"
            :visible.sync="addUserVisible"
            direction="ttb"
            :modal=false
            size="20%"
            :before-close="handleClose">
      <el-row>
        <el-col :offset="10">
          <el-form :inline="true"  size="mini" >
            <el-form-item label="用户" prop="name">
              <el-select v-model="userId" placeholder="请选择">
                <el-option
                        v-for="item in userList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleAddUser">
                <d2-icon name="add" /> 添加
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-drawer>
  </el-dialog>


</template>
<script>
import * as userService from "@/api/sys/user";
export default {
  name: "roleUser",
  props: {
    role: Object,
    value: Boolean
  },
  data() {
    return {
      dialogVisible: false,
      searchForm: {
        name: "",
        email: ""
      },
      loading: false,
      addUserVisible:false,
      tableData: [],
      page: {
        current: 1,
        size: 100,
        total: 0
      },
      sort: {
        prop: "",
        order: ""
      },
      userList:[],
      userId:null
    };
  },
  created() {
    userService.getAllUser().then(
            data => {
              this.userList=data;
            }
    )
  },
  watch: {
    value(val) {
      this.dialogVisible = val;
    },
    dialogVisible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    addRoleUser(){
      this.userId=null;
      this.addUserVisible=!this.addUserVisible
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
              .then(_ => {
                done();
              })
              .catch(_ => {});
    },
    handleAddUser(){
      userService.addRole({
        userId:this.userId,
        roleId:this.role.id
      }).then(data=>{
        this.addUserVisible=!this.addUserVisible
        this.dialogVisible=false

      })
    },
    async dialogOpen() {
      this.getTableData();
    },
    getTableData() {
      let filter={ ...this.searchForm, roleId: this.role.id }
      let query = {
        page: this.page.current,
        limit: this.page.size,
        sortBy: this.sort.prop,
        descending: this.sort.order === "descending",
        ...filter
      };
      userService.getUserPagedList(query).then(data => {
        this.tableData = data.content;
        this.page.total = data.totalElements;
      });
    },
    handleSearchFormSubmit() {
      this.getTableData();
    },
    handleSearchFormReset() {
      this.$refs.searchForm.resetFields();
    },
    handleSortChange(val) {
      this.sort.prop = val.prop;
      this.sort.order = val.order;
      this.getTableData();
    },
    handleSizeChange(val) {
      this.page.size = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.page.current = val;
      this.getTableData();
    },
    modifyRoleUser(userId, action) {
      userService
        .editRoleUser({
          roleId: this.role.id,
          userId: userId,
          action: action
        })
        .then(() => {
          let msg = action == 1 ? "已添加" : "已移除";
          this.$notify({
            title: "操作成功",
            message: msg,
            type: "success"
          });
          this.getTableData();
        });
    }
  }
};
</script>

