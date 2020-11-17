<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container" v-loading="finishLoading">
            <el-table
                :data="feedData"
                style="width: 100%">
                <!--<el-table-column type="expand">-->
                <!--<template slot-scope="props">-->
                <!--<el-form label-position="left" inline class="demo-table-expand">-->
                <!--<el-form-item label="id">-->
                <!--<span>{{ props.row.id }}</span>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="内容">-->
                <!--<span>{{ props.row.content }}</span>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="手机号">-->
                <!--<span>{{ props.row.phone }}</span>-->
                <!--</el-form-item>-->
                <!--</el-form>-->
                <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column
                    label="id"
                    prop="id">
                </el-table-column>
                <el-table-column
                    label="内容"
                    prop="content">
                </el-table-column>
                <el-table-column
                    label="手机号"
                    prop="phone">
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)">编辑
                        </el-button>
                        </el-button>
                        <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="30%">
                <span>确认删除此条反馈？</span>
                <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirm">确 定</el-button>
              </span>
            </el-dialog>
        </div>


    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {checkFeedback, deleteFeedback} from '@/api/getData'
    import {mapActions, mapState} from 'vuex'

    export default {
        data() {
            return {
                finishLoading: true,
                dialogVisible: false,
                feedData: [],
                deleteId: ''
            }
        },
        created() {
            this.initData();
        },
        components: {
            headTop,
        },
        methods: {
            async initData() {
                try {
                    const res = await checkFeedback({});
                    if (res.code === 200) {
                        // this.count = countData.count;
                        this.feedData = res.data;
                        this.finishLoading = false;
                        console.log(res.data)
                    } else {
                        throw new Error('获取数据失败');
                    }
                    // this.getFoods();
                } catch (err) {
                    console.log('获取数据失败', err);
                }
            },
            handleDelete(index, row) {
                this.dialogVisible = true;
                this.deleteId = row.id;
            },
            async confirm() {
                const res = await deleteFeedback({id: this.deleteId});
                if (res.code === 200) {
                    // this.count = countData.count;
                    this.$message({
                        type: 'success',
                        message: '删除反馈成功'
                    });
                    console.log(res.data)
                } else {
                    throw new Error('获取数据失败');
                }
            },
        }
    }
</script>

<style lang="less">
    @import '../style/mixin';

    .demo-table-expand {
        font-size: 0;
    }

    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }

    .table_container {
        padding: 20px;
    }

    .Pagination {
        display: flex;
        justify-content: flex-start;
        margin-top: 8px;
    }

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #20a0ff;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 120px;
        height: 120px;
        line-height: 120px;
        text-align: center;
    }

    .avatar {
        width: 120px;
        height: 120px;
        display: block;
    }
</style>
