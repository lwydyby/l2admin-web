<template>
    <el-table
            v-loading="listLoading"
            :data="tableData"
            border
            fit
            size="mini"
            highlight-current-row
            style="width: 100%;margin-top: 20px"
            @selection-change="handleSelectionChange"
            @sort-change="changeSort"
            @header-contextmenu="rightClick"
            @header-dragend="dragWidth"
            ref="filterTable"
    >
        <el-table-column
                type="selection"
                fixed="left"
                width="55">
        </el-table-column>
        <el-table-column type="index" align="center" width="50"   fixed="left">
        </el-table-column>
        <el-table-column v-for="(item, index) in col"
                         v-if="col[index].prop!=='select'&&col[index].prop!=='index'"
                         align="center"
                         :index="index"
                         :sortable="dropCol[index].sort"
                         show-overflow-tooltip
                         :width="dropCol[index].width?dropCol[index].width:'200px'"
                         :key="`col_${index}`"
                         :fixed="dropCol[index].fixed"
                         :prop="dropCol[index].prop"
                         :label="item.label">
            <template slot-scope="scope">
                <span>{{ !dropCol[index].type?scope.row[dropCol[index].prop]:getValue(scope.row,dropCol[index].type),dropCol[index].prop }}</span>
            </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="200" class-name="small-padding fixed-width">
            <template slot-scope="scope">
                <el-dropdown trigger="hover">
            <span class="el-dropdown-link">
              操作菜单<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item class="el-dropdown-link" v-for="item in editData" @click.native="emitParentMethod(scope.row,item.methodName)">{{item.name}}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </template>
        </el-table-column>
        <div v-show="menuVisible">
            <v-contextmenu ref="contextmenu" id="menu">
                <v-contextmenu-item @click="lock">锁定</v-contextmenu-item>
                <v-contextmenu-item @click="unlock">解锁</v-contextmenu-item>
            </v-contextmenu>
        </div>
    </el-table>

</template>

<script>
    import Sortable from 'sortablejs'
    import {mapState} from 'vuex'
    export default {
        name: "table-plus",
        computed: {
            ...mapState('d2admin/permission', [
                'ownRp', 'cols', 'orders', 'allRp'
            ]),
        },
        data() {
            return {
                menuVisible:false,
                dropCol:[],
                col:[]
            }
        },
        props:{
            listLoading: {
                required: true
            },
            multipleSelection:{
                required:true
            },
            allCols:{
                required: true
            },
            colKey:{
                required:true  //存储map的key
            },
            tableData:{
                required:true
            },
            editData:{
                required:true
            },
        },
        mounted(){
            this.columnDrop()
            this.col = this.getDropCol();
            this.dropCol = this.getDropCol();

        },
        methods:{
            getValue(row, type, prop) {
                switch (type) {
                    case 'cluster':
                        return row.cluster.name
                    case 'date':
                        return this.getDate(row[prop])
                    case "resourcePool":
                        return this.transRP(row.resourcePool)
                    case "status":
                        return this.getStatus(row.tags)

                }
            },
            getStatus(status) {
                for (let i = 0; i < status.length; i++) {
                    let data = status[i]
                    if (data.type === "status") {
                        return data.value
                    }
                }
                return "暂无状态"
            },
            transRP(id) {
                for (let i = 0; i < this.allRp.length; i++) {
                    if (this.allRp[i].id === id) {
                        return this.allRp[i].name;
                    }
                }
                return "未知"
            },
            emitParentMethod(row,methodName){
                this.$emit(methodName,row);
            },
            getList(){
                this.$emit('getTableData')
            },
            changeSort(row) {
                this.sortMap = new Map();
                let prop = row.prop;
                let order = row.order;
                if (this.sortMap.has(prop)) {
                    if (!order) {
                        this.sortMap.delete(prop)
                    } else if (order === "ascending") {
                        this.sortMap.set(prop, "ASC")
                    } else {
                        this.sortMap.set(prop, "DESC")
                    }
                } else {
                    if (!order) {
                    } else if (order === "ascending") {
                        this.sortMap.set(prop, "ASC")
                    } else {
                        this.sortMap.set(prop, "DESC")
                    }
                }
                this.getList()
            },

            getCol() {
                let allCols = this.allCols
                if (this.cols && this.cols.hasOwnProperty(this.colKey)) {
                    if (!this.cols[this.colKey]) {
                        return allCols;
                    }
                    let str = this.cols[this.colKey];
                    let data = this.utils.str2Arr(str);

                    let result = []
                    result.push({prop: "select", label: "选择"})
                    result.push({prop: "index", label: "序号"})
                    data.forEach(function (item) {
                        allCols.forEach(function (col) {
                            if (col.prop === item) {
                                result.push(col);
                            }
                        })
                    })
                    return result;
                } else {
                    return allCols;
                }

            },
            getDropCol() {
                if (this.orders && this.orders.hasOwnProperty(this.colKey) && this.orders['device'] !== null && this.orders['device'] !== '') {
                    return JSON.parse(this.orders[this.colKey])
                }
                return this.getCol()
            },
            handleSelectionChange(rows) {
                let data = [];
                rows.forEach(function (item) {
                    data.push(item.id)
                })
                // this.multipleSelection = data
                this.$emit('update:multipleSelection', data)
            },
            //列拖拽
            columnDrop() {
                const wrapperTr = document.querySelector('.el-table__header-wrapper tr')
                this.sortable = Sortable.create(wrapperTr, {
                    animation: 180,
                    delay: 0,
                    onEnd: evt => {
                        const oldItem = this.dropCol[evt.oldIndex]
                        this.dropCol.splice(evt.oldIndex, 1)
                        this.dropCol.splice(evt.newIndex, 0, oldItem)
                    }
                })
            },
            //右键点击
            rightClick(column, event) { // 鼠标右击触发事件
                document.oncontextmenu = function(){
                    return false;
                }
                this.menuVisible = false // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
                this.menuVisible = true  // 显示模态窗口，跳出自定义菜单栏
                let menu = document.querySelector('#menu')
                document.addEventListener('click', this.foo) // 给整个document添加监听鼠标事件，点击任何位置执行foo方法
                menu.style.display = "block";
                menu.style.left = event.clientX + 'px'
                menu.style.top = event.clientY + 'px'
                this.index=column.index

            },
            dragWidth(newWidth, oldWidth, column, event){
                let index=column.index;
                this.dropCol[index].width=newWidth;

            },
            lock(){
                this.dropCol[this.index].fixed="left"
                document.oncontextmenu = function(){
                    return true;
                }

            },
            unlock(){
                this.dropCol[this.index].fixed=false
                document.oncontextmenu = function(){
                    return true;
                }
            },
            foo() { // 取消鼠标监听事件 菜单栏
                let menu = document.querySelector('#menu')
                this.menuVisible = false
                menu.style.display = "none";

                document.removeEventListener('click', this.foo) // 要及时关掉监听，不关掉的是一个坑，不信你试试，虽然前台显示的时候没有啥毛病，加一个alert你就知道了
                document.oncontextmenu = function(){
                    return true;
                }
            },
        }
    }
</script>

<style>

    .el-dropdown-link {
        cursor: pointer;
        color: #409EFF;
    }

    .el-table--striped .el-table__body tr.el-table__row--striped.current-row td,
    .el-table__body tr.current-row > td {
        background-color: #a0cfff;
    }

    .el-table--striped .el-table__body tr.hover-row.el-table__row--striped > td,
    .el-table__body tr.hover-row > td {
        background-color: #d9ecff !important;
    }
</style>