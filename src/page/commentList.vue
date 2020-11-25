<template>
    <div class="fillcontain">
        <head-top></head-top>
        <p style="padding-left: 30px;padding-top: 20px">按课程查询订单</p>
        <div style="padding:20px;display: flex;justify-content: space-around">
            <el-select v-model="searchId"  style="width:100%;padding-right:60px"  placeholder="请选择课程名">
                <el-option
                    v-for="item in courseAll"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id">
                </el-option>
            </el-select>
            </el-date-picker>
            <el-button type="primary" @click="Search" style="width: 150px;">查询
            </el-button>
        </div>
        <div class="table_container" v-loading="finishLoading">
            <el-table
                :data="commentInfo"
                style="width: 100%">
                <el-table-column
                    label="ID"
                    prop="id">
                </el-table-column>
                <el-table-column
                    label="评价内容"
                    prop="content">
                </el-table-column>
                <el-table-column
                    label="姓名"
                    prop="user.realName">
                </el-table-column>
                <el-table-column
                    label="昵称"
                    prop="user.nickname">
                </el-table-column>
                <el-table-column
                    label="手机号"
                    prop="user.phone">
                </el-table-column>
                <!--状态0未评价/1已评价未审核/2审核通过/3审核不通过-->
                <el-table-column label="操作" width="300"  key="option" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status===0">未评价</el-tag>
                        <el-tag type="success"  v-if="scope.row.status===2">审核通过</el-tag>
                        <el-tag type="danger"  v-if="scope.row.status===3">审核不通过</el-tag>
                        <el-button
                            size="mini"
                            v-if="scope.row.status===1"
                            @click="handleJudge(scope.$index, scope.row)">审批
                        </el-button>
                        </el-button>
                        <el-button
                            size="mini"
                            type="danger"
                            v-if="scope.row.status!==0"
                            @click="handleModify(scope.$index, scope.row)">修改
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="30%">
                <span>审核通过将会展现给用户,确定通过审核吗</span>
                <!--<span>{{showMessage}}</span>-->
                <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirm(3)">不通过</el-button>
                <el-button type="primary" @click="confirm(2)">通过</el-button>
              </span>
            </el-dialog>

            <el-dialog title="修改评论" v-model="dialogFormVisibleChange">
                <el-form>
                    <el-form-item label="内容" label-width="100px">
                        <el-input v-model="content" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisibleChange = false">取 消</el-button>
                    <el-button type="primary" @click="update">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {baseUrl, baseImgPath} from '@/config/env'
    import {getcomments, updatecComments,getCourse,changeComments} from '@/api/getData'
    import {mapActions, mapState} from 'vuex'

    export default {
        data() {
            return {
                chooseId: '',
                showMessage:'通过审核吗？',
                deleteChoice: 0,
                dialogVisible: false,
                dialogFormVisibleChange:false,
                changeId:'',
                finishLoading: true,
                loading: false,
                baseUrl,
                userId:'',
                courseId:'',
                courseAll:[],
                commentInfo: [],
                // dialogFormVisible: false,
                selectTable: {},
                content:'',
                searchId:''
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
                    const res = await getcomments('all');
                    const res2 = await getCourse();
                    if (res.code === 200) {
                        // this.count = countData.count;
                        this.commentInfo = res.data;
                        this.courseAll=res2.data;
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
            async Search(){
                try{
                    this.finishLoading=true;
                    const res = await getcomments(this.searchId);
                    if (res.code === 200) {
                        // this.count = countData.count;
                        this.commentInfo=res.data;
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
            handleJudge(index, row) {
                this.dialogVisible=true;
                this.chooseId=row.id;
                // this.dialogFormVisible = true;
            },
            handleModify(index, row) {
                this.dialogFormVisibleChange = true;
                this.changeId = row.id;
                this.courseId = row.courseId;
                this.content=row.content;
                this.userId=row.user.userId;
                this.deleteChoice = 1;
            },
            async confirm(type) {
                this.dialogVisible = false;
                try {
                    const res = await updatecComments({id: this.chooseId, status: type});
                    if (res.code === 200) {
                        this.$message({
                            type: 'success',
                            message: '审核通过'
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
            async update() {
                this.dialogFormVisibleChange = false;
                try {
                    const res = await changeComments({
                        id: this.changeId,
                        content: this.content,
                        courseId: this.courseId,
                        userId:this.userId
                    });
                    if (res.code === 200) {
                        this.$message({
                            type: 'success',
                            message: '更新成功'
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
