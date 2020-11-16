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
                            <el-form-item label="简介">
                                <span>{{ props.row.introduction }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column
                    label="id"
                    prop="id">
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
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                       </el-button>
                        <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--<div class="Pagination">-->
                <!--<el-pagination-->
                    <!--@size-change="handleSizeChange"-->
                    <!--:current-page="currentPage"-->
                    <!--:page-size="20"-->
                    <!--layout="total, prev, pager, next"-->
                    <!--:total="count">-->
                <!--</el-pagination>-->
            <!--</div>-->
            <!--<el-dialog title="修改老师信息" v-model="dialogFormVisible" v-loading="loading" element-loading-text="图片上传中">-->
                <!--<el-form :model="selectTable">-->
                    <!--<el-form-item label="老师姓名" label-width="100px">-->
                        <!--<el-input v-model="selectTable.realName" auto-complete="off"></el-input>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="评分" label-width="100px">-->
                        <!--<el-input v-model="selectTable.grade"></el-input>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="教授人数" label-width="100px">-->
                        <!--<el-input v-model="selectTable.teachNum"></el-input>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="开课次数" label-width="100px">-->
                        <!--<el-input v-model="selectTable.courseNum"></el-input>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="老师简介" label-width="100px">-->
                        <!--<el-input v-model="selectTable.introduction"></el-input>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="老师照片" label-width="100px">-->
                        <!--<el-upload-->
                            <!--class="avatar-uploader"-->
                            <!--:action="baseUrl + '/api/file/upload'"-->
                            <!--:limit="1"-->
                            <!--:show-file-list="false"-->
                            <!--:on-change="imageUpload"-->
                            <!--:on-success="handleServiceAvatarScucess"-->
                            <!--:before-upload="beforeAvatarUpload">-->

                            <!--<img v-if="selectTable.head" :src="selectTable.head" class="avatar">-->
                            <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
                        <!--</el-upload>-->
                    <!--</el-form-item>-->
                <!--</el-form>-->
                <!--<div slot="footer" class="dialog-footer">-->
                    <!--<el-button @click="dialogFormVisible = false">取 消</el-button>-->
                    <!--<el-button type="primary" @click="update">确 定</el-button>-->
                <!--</div>-->
            <!--</el-dialog>-->
        </div>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {baseUrl, baseImgPath} from '@/config/env'
    import {getCourse,updateTeacher} from '@/api/getData'
    import {mapActions, mapState} from 'vuex'
	export default {
        data(){
            return{
                finishLoading:true,
                loading: false,
                baseUrl,
                courseInfo:[],
                // dialogFormVisible: false,
                selectTable: {},
                categoryOptions: [],
                selectedCategory: [],
                address: {},
            }
        },
        created(){
            this.initData();
        },
        components: {
            headTop,
        },
        methods:{
            async initData(){

                try{
                    const res = await getCourse({});
                    if (res.code === 200) {
                        // this.count = countData.count;
                        this.courseInfo=res.data;
                        this.finishLoading=false;
                        console.log(res.data)
                    }else{
                        throw new Error('获取数据失败');
                    }
                    // this.getFoods();
                }catch(err){
                    console.log('获取数据失败', err);
                }
            },
            handletype(row,column){
                return row.category === 1 ? '内训课' :  '实战营'
        },
            imageUpload(file){
              this.loading = file.status !== 'success';
            },
            handleEdit(index, row) {

                this.selectTable = row;
                this.address.address = row.address;
                // this.dialogFormVisible = true;
                // this.$router.push('courseDetail');
                this.$router.push({
                    path: "courseDetail",
                    query: { id: row.id }
                });

                // if (!this.categoryOptions.length) {
                //     this.getCategory();
                // }
            },
            handleServiceAvatarScucess(res, file) {
                console.log(res);
                console.log(this.selectTable);

                this.selectTable.head = URL.createObjectURL(file.raw);
                if (res.code === 200) {
                    console.log('上传成功');
                    this.selectTable.head = res.data;
                    // this.selectTable.head = URL.createObjectURL(file.raw);
                }else{
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
            async update(){
                this.dialogFormVisible = false;
                try{

                    console.log('submit',this.selectTable);

                    const res = await updateTeacher(this.selectTable);
                    if (res.code === 200) {
                        this.$message({
                            type: 'success',
                            message: '更新信息成功'
                        });
                        this.initData();
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.message
                        });
                    }
                }catch(err){
                    console.log('更新信息失败', err);
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
    .table_container{
        padding: 20px;
    }
    .Pagination{
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
