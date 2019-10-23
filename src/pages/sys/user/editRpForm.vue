<template>
    <el-dialog
            title="用户资源池信息"
            :visible.sync="dialogVisible"
            @opened="dialogOpen"
    >
        <el-form
                ref="form"
                :model="form"
                label-width="80px"
                size="small"
        >
            <el-form-item
                    prop="rpId"
                    label="资源池"
                    :rules="[{ required: true, message: '不能为空'}]"
            >
                <el-select v-model="form.rpId" multiple filterable placeholder="请选择">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
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
    import {mapState} from 'vuex'

    export default {
        name: "userEditForm",
        props: {
            user: Object,
            value: Boolean
        },
        computed: {
            ...mapState('d2admin/permission',[
                'allRp'
    ])

        },
        data() {
            return {
                loading: false,
                dialogVisible: false,
                form: {
                    rpId: [],
                },
                options: []


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
        created(){
            let data=this.allRp;
            let options = []
            for (let i = 0; i < data.length; i++) {
                options.push({
                    value: data[i].id,
                    label: data[i].name
                })
            }
            this.options = options


        },
        methods: {
            async dialogOpen() {
                this.$refs.form.resetFields();
                if (this.user.id) {
                    let data1 = await userService.getRp(this.user.id)
                    let result = []
                    data1.forEach(function (item) {
                        if(item.id!==0){
                            result.push(item.id)
                        }
                    })
                    this.form.rpId = result;

                } else {
                    this.form = {};
                }

            },
            saveUser() {
                this.$refs["form"].validate(valid => {
                    if (valid) {
                        this.loading = true;
                        userService
                            .saveRP({rpId: this.form.rpId, userId: this.user.id})
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

