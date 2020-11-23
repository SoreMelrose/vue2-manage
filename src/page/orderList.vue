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
                :data="orderInfo"
                style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="订单ID">
                                <span>{{ props.row.id }}</span>
                            </el-form-item>
                            <el-form-item label="报名信息ID">
                                <span>{{ props.row.regId }}</span>
                            </el-form-item>
                            <el-form-item label="课程ID">
                                <span>{{ props.row.generalId }}</span>
                            </el-form-item>
                            <el-form-item label="期次ID">
                                <span>{{ props.row.courseId }}</span>
                            </el-form-item>
                            <el-form-item label="报名信息ID">
                                <span>{{ props.row.regId }}</span>
                            </el-form-item>
                            <el-form-item label="支付单号">
                                <span>{{ props.row.payNo }}</span>
                            </el-form-item>
                            <el-form-item label="状态">
                                <span>{{ props.row.status }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>

                <el-table-column
                    label="姓名"
                    prop="realName"
                    align="center">
                </el-table-column>
                <el-table-column
                    label="联系方式"
                    prop="phone"
                    width="150px"
                    align="center">
                </el-table-column>
                <el-table-column
                    label="报名人数"
                    prop="peopleNum"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    label="总价格"
                    prop="sumPrice"
                    align="center">
                </el-table-column>
                <el-table-column
                    label="实付价格"
                    prop="realPrice"
                    align="center">
                </el-table-column>

                <el-table-column
                    label="创建时间"
                    prop="gmtCreate"
                    align="center"
                    width="250">
                    <template slot-scope="scope">{{scope.row.gmtCreate| dateYMDHMSFormat}}</template>

                </el-table-column>
                <el-table-column
                    label="分享人ID"
                    prop="shareId"
                    align="center"
                    >
                </el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            @click="handleJump(scope.$index, scope.row)">查看课程详情</el-button>
                        </el-button>
                        <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {baseUrl, baseImgPath} from '@/config/env'
    import {getOrder,updateTeacher,getCourse} from '@/api/getData'
    import {mapActions, mapState} from 'vuex'
    export default {
        data(){
            return{
                searchId:'',
                finishLoading:true,
                loading: false,
                courseAll:[],
                baseUrl,
                orderInfo:[],
                dialogFormVisible: false,
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
                    const res = await getOrder('all');
                    const res2 = await getCourse();

                    if (res.code === 200) {
                        // this.count = countData.count;
                        this.orderInfo=res.data;
                        this.courseAll=res2.data;
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
            async Search(){
                try{
                    this.finishLoading=true;
                    const res = await getOrder(this.searchId);
                    if (res.code === 200) {
                        // this.count = countData.count;
                        this.orderInfo=res.data;
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
            // intToString(row,column){
            //     return row.peopleNum=row.peopleNum.toString();
            // },
            imageUpload(file){
                this.loading = file.status !== 'success';
            },
            handleJump(index, row){
                this.$router.push({
                    path: "courseDetail",
                    query: {id: row.generalId}
                });
            },
            handleEdit(index, row) {
                this.selectTable = row;
                this.address.address = row.address;
                this.dialogFormVisible = true;
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
