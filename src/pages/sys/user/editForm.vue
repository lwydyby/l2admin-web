<template>
    <el-dialog
            title="用户信息"
            :visible.sync="dialogVisible"
            @opened="dialogOpen"
    >
        <el-form
                ref="form"
                :model="form"
                label-width="120px"
                size="small"
        >
            <el-form-item
                    prop="name"
                    label="账号"
                    :rules="[{ required: true, message: '不能为空'}]"
            >
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item
                    prop="trueName"
                    label="真实姓名"
                    :rules="[{ required: true, message: '不能为空'}]"
            >
                <el-input v-model="form.trueName"></el-input>
            </el-form-item>
            <el-form-item
                    prop="password"
                    label="密码"
                    :rules="[{ required: true, message: '不能为空'}]"
            >
                <el-input v-model="form.password" show-password></el-input>
            </el-form-item>
            <el-form-item
                    prop="email"
                    label="邮箱"
            >
                <el-input v-model="form.email"></el-input>
            </el-form-item>
            <el-form-item
                    prop="phone"
                    label="phone"
            >
                <el-input v-model="form.phone"></el-input>
            </el-form-item>
            <el-form-item
                    prop="isAdmin"
                    label="管理员"
            >
                <el-switch
                        v-model="form.isAdmin"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        active-value="0"
                        inactive-value="1">
                </el-switch>
            </el-form-item>
            <el-form-item>
                <el-button
                        type="primary"
                        :loading="loading"
                        @click="saveUser"
                >保存
                </el-button>
                <el-button @click="close">取消</el-button>
            </el-form-item>
        </el-form>

    </el-dialog>

</template>
<script>
    import * as userService from "@/api/sys/user";

    export default {
        name: "userEditForm",
        props: {
            user: Object,
            value: Boolean
        },
        data() {
            return {
                loading: false,
                dialogVisible: false,
                form: {
                    name: "",
                    trueName: "",
                    phone: "",
                    email: "",
                    password: "",
                    isAdmin:0
                },

            };
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
            dialogOpen() {
                this.$refs.form.resetFields();
                if (this.user.id) {
                    userService.getUser(this.user.id).then(data => {
                        let form = {};
                        form.name = data.name;
                        form.trueName = data.trueName;
                        form.phone = data.phone;
                        form.email = data.email;
                        form.isAdmin=data.isAdmin+"";
                        this.form = form;
                    });
                } else {
                    this.form = {};
                }
            },
            saveUser() {
                this.$refs["form"].validate(valid => {
                    if (valid) {
                        this.loading = true;
                        console.log(this.form)
                        userService
                            .saveUser({...this.form, id: this.user.id})
                            .then(data => {
                                this.loading = false;
                                this.dialogVisible = false;
                                this.$emit("submit");
                            });
                    } else {
                        return false;
                    }
                });
            },
            close() {
                this.$refs["form"].resetFields();
                this.dialogVisible = false;
            }
        }
    };
</script>

