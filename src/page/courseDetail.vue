<template>
    <div>
        <head-top></head-top>
        <el-button type="" @click="back" style="width: 60px;margin: 20px;background-color:lightgrey">返回</el-button>
        <el-row style="margin-top: 10px;">
            <el-col :span="12" :offset="4">
                <el-form :model="courseInfo" :rules="rules" ref="courseInfo" label-width="110px" class="demo-courseInfo">
                    <el-form-item label="课程标题" prop="title">
                        <el-input v-model="courseInfo.title"></el-input>
                    <el-form-item label="课程类型" prop="category" style="margin-top: 20px;align-items: left;position: relative;right: 110px">
                        <el-select v-model="courseInfo.category" placeholder="请选择课程类型">
                            <el-option label="内训课" value=1></el-option>
                            <el-option label="实战营" value=2></el-option>
                        </el-select>
                    </el-form-item>
                    </el-form-item>  <el-form-item label="价格" prop="price">
                        <el-input v-model="courseInfo.price" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="课程服务" prop="serveice">
                        <el-input v-model="courseInfo.serveice" ></el-input>
                    </el-form-item>
                    <el-form-item label="课程地点" prop="place" v-if="courseInfo.exactCourses">
                        <el-input v-model="courseInfo.exactCourses[0].place" ></el-input>
                    </el-form-item>
                    <el-form-item label="课程时间" v-if="courseInfo.exactCourses">
                        <el-col :span="11" v-if="courseInfo.exactCourses">
                            <el-date-picker type="date" placeholder="选择日期" v-model="courseInfo.exactCourses[0].openingTime" style="width: 100%;"></el-date-picker>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="已买人数" prop="buyNum" v-if="courseInfo.exactCourses">
                        <el-input v-model="courseInfo.exactCourses[0].buyNum" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="课程最大人数" prop="openingNum" v-if="courseInfo.exactCourses">
                        <el-input v-model="courseInfo.exactCourses[0].openingNum" type="number"></el-input>
                    </el-form-item>

                    <el-form-item label="课程简介" prop="introduction">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 4, maxRows: 50}"
                            v-model="courseInfo.introduction">
                        </el-input>
                    </el-form-item>

                    <el-form-item label="课程主图" v-loading="loading" element-loading-text="图片上传中">
                        <el-upload
                            class="avatar-uploader"
                            :action="baseUrl + '/api/file/upload'"
                            :show-file-list="false"
                            :limit="1"
                            :on-change="imageUpload"
                            :on-success="handleShopAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="courseInfo.mainPicture" :src="courseInfo.mainPicture" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item class="button_submit" style="text-align:center;">
                        <el-button type="" @click="back" style="width: 150px;margin-top: 20px">返回</el-button>
                        <el-button type="primary" @click="submitForm('courseInfo')" style="width: 150px;margin-top: 20px">修改课程</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {baseUrl, baseImgPath} from '@/config/env'
    import {getCourseDetail,updateCourse} from '@/api/getData'
	export default {
        data(){
            return {
                city: {},
                loading:false,
                courseInfo: {
                    type:'',
                    category:''
                },
                rules: {
                    title: [
                        { required: true, message: '请输入课程标题', trigger: 'blur' },
                    ],
                    introduction: [
                        { required: true, message: '请输入个人简介', trigger: 'blur' },
                    ],
                    mainPicture: [
                        { required: true, message: '请上传照片' },
                        // { type: 'number', message: '教授人数必须是数字' }
                    ],
                },
                baseUrl,
                baseImgPath,
                categoryOptions: [],
            }
        },
        created(){
            this.initData();
        },
        methods: {
            async initData(){
                console.log(this.$route.query.id);
                try{
                    const res = await getCourseDetail(this.$route.query.id);
                    if (res.code === 200) {
                        // this.count = countData.count;
                        this.courseInfo=res.data;
                        this.courseInfo.category=this.courseInfo.category.toString();
                        console.log(res.data)
                        console.log(res.data.exactCourses[0].place);
                    }else{
                        throw new Error('获取数据失败');
                    }
                    // this.getFoods();
                }catch(err){
                    console.log('获取数据失败', err);
                }
            },
            back(){
                this.$router.go(-1);//返回上一层
            },
            submitForm(formName) {
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                        try{
                            console.log(this.courseInfo);
                            let result = await updateCourse(this.courseInfo);
                            if (result.code === 200) {
                                this.$message({
                                    type: 'success',
                                    message: '修改成功'
                                });
                                this.formData = {
                                    courseNum: "",
                                    grade: "",
                                    head: "",
                                    introduction: "",
                                    realName: "",
                                    teachNum: ""
                                };
                            }else{
                                this.$message({
                                    type: 'error',
                                    message: result.message
                                });
                            }
                            console.log(result)
                        }catch(err){
                            console.log(err)
                        }
                    } else {
                        this.$notify.error({
                            title: '错误',
                            message: '请检查输入是否正确',
                            offset: 100
                        });
                        return false;
                    }
                });
            },
            handleShopAvatarSuccess(res, file) {
                if (res.code === 200) {
                    this.courseInfo.mainPicture = res.data;
                }else{
                    this.$message.error('上传图片失败！');
                }
            },
            imageUpload(file){
                this.loading = file.status !== 'success';
            },
            beforeAvatarUpload(file) {
                const isRightType = (file.type === 'image/jpeg') || (file.type === 'image/png');
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isRightType) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isRightType && isLt2M;
            },
            handleDelete(index){
                this.activities.splice(index, 1)
            },
        },

        components: {
            headTop,
        },
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
        width: 700px;
        height: 300px;
        display: block;
    }
</style>
