<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container" v-loading="finishLoading">
            <el-table
                :data="courseInfo"
                style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="课程ID">
                                <span>{{ props.row.id }}</span>
                            </el-form-item>
                            <el-form-item label="简介">
                                <span v-html="props.row.introduction"></span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column
                    label="名称"
                    prop="title">
                </el-table-column>
                <el-table-column
                    label="价格"
                    prop="price">
                </el-table-column>
                <el-table-column
                    label="课程类型"
                    :formatter='handletype'
                    prop="category">
                </el-table-column>
                <el-table-column
                    label="课程排序"
                    prop="courseOrder">
                </el-table-column>
                <el-table-column
                    label="课程服务"
                    prop="serveice">
                </el-table-column>
                <el-table-column label="操作" width="300"  key="option" align="center">
                    <template slot-scope="scope">
                        <el-button
                            v-if="scope.row.status!==-1"
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)">编辑
                        </el-button>
                        </el-button>
                        <el-button
                            v-if="scope.row.status!==-1"
                            size="mini"
                            type="info"
                            @click="handleOff(scope.$index, scope.row)">下架
                        </el-button>
                        <el-button
                            v-if="scope.row.status!==-1"
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                        <el-tag type="warning"  v-if="scope.row.status===-1">已下架</el-tag>
                        <el-button
                            v-if="scope.row.status===-1"
                            size="mini"
                            @click="handleOn(scope.$index, scope.row)">重新上架
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="30%">
                <span>{{showMessage}}</span>
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
    import {baseUrl, baseImgPath} from '@/config/env'
    import {getCourse, updateTeacher, deleteCourse} from '@/api/getData'
    import {mapActions, mapState} from 'vuex'

    export default {
        data() {
            return {
                deleteId: '',
                showMessage:'',
                deleteChoice: 0,
                dialogVisible: false,
                finishLoading: true,
                loading: false,
                baseUrl,
                courseInfo: [],
                // dialogFormVisible: false,
                selectTable: {},
                categoryOptions: [],
                selectedCategory: [],
                address: {},
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
                    const res = await getCourse({});
                    if (res.code === 200) {
                        // this.count = countData.count;
                        this.courseInfo = res.data;
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
            handletype(row, column) {
                return row.category === 1 ? '内训课' : '实战营'
            },
            imageUpload(file) {
                this.loading = file.status !== 'success';
            },
            handleEdit(index, row) {
                this.selectTable = row;
                this.address.address = row.address;
                // this.dialogFormVisible = true;
                // this.$router.push('courseDetail');
                this.$router.push({
                    path: "courseDetail",
                    query: {id: row.id}
                });

                // if (!this.categoryOptions.length) {
                //     this.getCategory();
                // }
            },

            // 0下架/1删除/2上架
            handleOff(index, row) {
                this.dialogVisible = true;
                this.deleteId = row.id;
                this.deleteChoice = 0;
                this.showMessage = '确认下架课程？';
            },
            handleOn(index, row) {
                this.dialogVisible = true;
                this.deleteId = row.id;
                this.deleteChoice = 2;
                this.showMessage = '确认上架课程？';

            }, handleDelete(index, row) {
                this.dialogVisible = true;
                this.deleteId = row.id;
                this.deleteChoice = 1;
                this.showMessage = '确认删除课程？';
            },
            async confirm() {
                this.dialogVisible = false;
                try {
                    const res = await deleteCourse({id: this.deleteId, n: this.deleteChoice});
                    if (res.code === 200) {
                        this.$message({
                            type: 'success',
                            message: '删除课程成功'
                        });
                        this.initData();
                        console.log(res.data)
                    } else {
                        throw new Error('获取数据失败');
                    }
                    // this.getFoods();
                } catch (err) {
                    console.log('获取数据失败', err);
                }
            },
            handleServiceAvatarScucess(res, file) {
                console.log(res);
                console.log(this.selectTable);

                this.selectTable.head = URL.createObjectURL(file.raw);
                if (res.code === 200) {
                    console.log('上传成功');
                    this.selectTable.head = res.data;
                    // this.selectTable.head = URL.createObjectURL(file.raw);
                } else {
                    this.$message.error('上传图片失败！');
                }
            },
            beforeAvatarUpload(file) {
                const isRightType = (file.type === 'image/jpeg') || (file.type === 'image/png');
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isRightType) {
                    this.$message.error('上传头像图片只能是JPG或PNG格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isRightType && isLt2M;
            },
            async update() {
                this.dialogFormVisible = false;
                try {

                    console.log('submit', this.selectTable);

                    const res = await updateTeacher(this.selectTable);
                    if (res.code === 200) {
                        this.$message({
                            type: 'success',
                            message: '更新信息成功'
                        });
                        this.initData();
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.message
                        });
                    }
                } catch (err) {
                    console.log('更新信息失败', err);
                }
            },
        }
    }
</script>

<style lang="less">
    @import '../style/mixin.less';

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
