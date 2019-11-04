<template>
  <el-dropdown size="small" class="d2-mr">
    <span class="btn-text">你好 {{info.name}}</span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item @click.native="logOff">
        <d2-icon name="power-off" class="d2-mr-5" /> 注销
      </el-dropdown-item>
      <el-dropdown-item @click.native="resetUser">
        <i class="el-icon-postcard"></i> 查看个人信息
      </el-dropdown-item>
    </el-dropdown-menu>
    <edit-form
            :user="user"
            v-model="editFormVisible"
            @submit="getTableData"
    />
  </el-dropdown>

</template>

<script>
  import {mapActions, mapState} from "vuex";
  import editForm from "@/pages/sys/user/editForm";
  import util from '@/libs/util.js'

  export default {
    computed: {
      ...mapState("d2admin/user", ["info"])
    },
    components: { editForm},
    data() {
      return{
        user: {},
        editFormVisible: false,
      }
    },
    methods: {
      ...mapActions("d2admin/account", ["logout"]),
      /**
       * @description 登出
       */
      logOff() {
        this.logout({
          vm: this,
          confirm: true
        });
      },
      resetUser() {
        let id=util.cookies.get('uuid')
        this.user={
          id:id
        }
        this.editFormVisible = true;
      },
      getTableData() {
        // this.$message({
        //   type: 'success',
        //   message: '保存成功'
        // });
      },
    }
  };
</script>
