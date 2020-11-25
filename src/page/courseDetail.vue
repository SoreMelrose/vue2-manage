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
                    <el-form-item label="课程地点（详细）" prop="address">
                        <el-input v-model="courseInfo.address"></el-input>
                    </el-form-item>
                    <el-form-item label="课程城市" prop="exactCourses[0].place" v-if="courseInfo.exactCourses">
                        <el-input v-model="courseInfo.exactCourses[0].place"></el-input>
                    </el-form-item>
                    <p style="color: red;padding: 5px">上课时间,逗号分隔的字符串，格式：11月1日 8:00-12:00,11月3日 8:00-12:00</p>
                    <el-form-item label="上课时间" prop="duration" v-if="courseInfo.exactCourses">
                        <el-input v-model="courseInfo.duration"></el-input>
                    </el-form-item>
                    <el-form-item label="课程时间" v-if="courseInfo.exactCourses">
                        <el-col :span="11" v-if="courseInfo.exactCourses">
                            <el-date-picker type="date" placeholder="选择日期" v-model="courseInfo.exactCourses[0].openingTime" style="width: 100%;"></el-date-picker>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="课程时数" prop="classHour" v-if="courseInfo.exactCourses">
                        <el-input v-model="courseInfo.classHour" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="已买人数" prop="exactCourses[0].buyNum" v-if="courseInfo.exactCourses">
                        <el-input v-model="courseInfo.exactCourses[0].buyNum" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="课程最大人数" prop="exactCourses[0].openingNum" v-if="courseInfo.exactCourses">
                        <el-input v-model="courseInfo.exactCourses[0].openingNum" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="课程主图" v-loading="loading" element-loading-text="图片上传中">
                        <el-upload
                            class="avatar-uploader"
                            :action="baseUrl + '/api/file/upload'"
                            :show-file-list="false"
                            :data="{choice:0}"
                            :limit="1"
                            :on-change="imageUpload"
                            :on-success="handleShopAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="courseInfo.mainPicture" :src="courseInfo.mainPicture" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <template>
            <!-- 图片上传组件辅助-->
            <el-upload
                class="avatar-uploader2"
                :action="baseUrl + '/api/file/upload'"
                name="file"
                :data="{choice:0}"
                :show-file-list="false"
                :on-change="quillUpload"
                :on-success="uploadSuccessEdit"
                :before-upload="beforeUploadEdit"
            >
            </el-upload>
            <el-upload
                class="avatar-uploader3"
                :action="baseUrl + '/api/file/upload'"
                name="file"
                :data="{choice:0}"
                :show-file-list="false"
                :on-change="quillUpload"
                :on-success="uploadSuccessEditVideo"
                :before-upload="beforeAvatarUploadVideo"
            >
            </el-upload>
            <div>
                <quill-editor class="editer" v-model="courseInfo.introduction" ref="myQuillEditor"
                              v-loading="uploadLoading" element-loading-text="上传中"
                              style="height: 300px;width: 90%;position: relative;left: 5%" :options="editorOption" @ready="onEditorReady($event)">
                </quill-editor>
            </div>
        </template>
        <el-form>
        <el-form-item class="button_submit" style="text-align:center;margin-top: 100px">
            <el-button type="" @click="back" style="width: 150px;margin-top: 100px">返回</el-button>
            <el-button type="primary" @click="submitForm('courseInfo')" style="width: 150px;margin-top: 100px">修改课程</el-button>
        </el-form-item>
        </el-form>
    </div>
</template>

<script>
    // 工具栏配置
    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{'header': 1}, {'header': 2}],               // custom button values
        [{'list': 'ordered'}, {'list': 'bullet'}],
        [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
        [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
        [{'direction': 'rtl'}],                         // text direction

        [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
        [{'header': [1, 2, 3, 4, 5, 6, false]}],

        [{'color': []}, {'background': []}],          // dropdown with defaults from theme
        [{'font': []}],
        [{'align': []}],
        ['link', 'image', 'video'],
        ['clean']                                         // remove formatting button
    ];
    import headTop from '../components/headTop'
    import * as Quill from 'quill'
    import Video from '../quill/video'
    Quill.register(Video, true);
    import {quillEditor} from 'vue-quill-editor'
    import {baseUrl, baseImgPath} from '@/config/env'
    import {getCourseDetail,updateCourse} from '@/api/getData'
	export default {
        data(){
            return {
                city: {},
                loading:false,
                uploadLoading: false,
                quillUpdateImg: false,
                editorOption: {
                    placeholder: '',
                    theme: 'snow',  // or 'bubble'
                    modules: {
                        toolbar: {
                            container: toolbarOptions,  // 工具栏
                            handlers: {
                                'image': function (value) {
                                    if (value) {
                                        // 触发input框选择图片文件
                                        document.querySelector('.avatar-uploader2 input').click()
                                    } else {
                                        this.quill.format('image', false);
                                    }
                                },
                                'video':function(val){
                                    console.log('video');
                                    document.querySelector('.avatar-uploader3 input').click()
                                }
                            }
                        }
                    }
                },
                courseInfo: {
                    type:'',
                    category:''
                },
                rules: {
                    title: [
                        {required: true, message: '请输入课程标题', trigger: 'blur'},
                    ],
                    price: [
                        {required: true, message: '请输入价格', trigger: 'blur',type:"number"},
                    ],
                    serveice: [
                        {required: true, message: '请输入课程服务', trigger: 'blur'},
                    ],
                    duration: [
                        {required: true, message: '请输入上课时间', trigger: 'blur'},
                    ],
                    address: [
                        {required: true, message: '请输入课程地址', trigger: 'blur'},
                    ],
                    classHour: [
                        {required: true, message: '请输入课程时数', trigger: 'blur',type:"number"},
                    ],
                    'exactCourses[0].place': [
                        {required: true, message: '请输入地址', trigger: 'blur'},
                    ],
                    'exactCourses[0].buyNum': [
                        {required: true, message: '请输入购买人数', trigger: 'blur',type:"number"},
                    ],
                    'exactCourses[0].openingNum': [
                        {required: true, message: '请输入总人数', trigger: 'blur',type:"number"},
                    ],
                    'exactCourses[0].openingTime': [
                        {required: true, message: '请选择时间', trigger: 'blur'},
                    ],
                    teacherId: [
                        {required: true, message: '请选择老师', trigger: 'blur'},
                    ],
                    introduction: [
                        {required: true, message: '请输入个人简介', trigger: 'blur'},
                    ],
                    mainPicture: [
                        {required: true, message: '请上传照片'},
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
        activated(){
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
                        console.log(res.data.state);
                        console.log(res.data.exactCourses[0].place);
                    }else{
                        throw new Error('获取数据失败');
                    }
                    // this.getFoods();
                }catch(err){
                    console.log('获取数据失败', err);
                }
            },
            onEditorReady(editor) {
                console.log('editor ready!', editor)
            },
            back(){
                this.$router.go(-1);//返回上一层
            },
            quillUpload(file) {
                this.uploadLoading = file.status !== 'success';
            },
            beforeAvatarUploadVideo(file) {
                const isRightType = (file.type === 'video/mp4') || (file.type === 'video/avi');
                // const isLt2M = file.size / 1024 / 1024 < 4;
                if (!isRightType) {
                    this.$message.error('上传头像图片只能是视频格式!');
                }
                // if (!isLt2M) {
                //     this.$message.error('上传头像图片大小不能超过 4MB!');
                // }
                return isRightType;
            },
            // 上传图片前
            beforeUploadEdit(res, file) {
                // 显示loading动画
                this.quillUpdateImg = true
            },
            uploadSuccessEditVideo(res, file) {
                // res为图片服务器返回的数据
                // 获取富文本组件实例
                let quill = this.$refs.myQuillEditor.quill;
                // 如果上传成功
                if (res.code === 200) {
                    // 获取光标所在位置
                    let length = quill.getSelection().index;
                    // 插入图片  res.data.url为服务器返回的图片地址
                    quill.insertEmbed(length, 'video', res.data);
                    // 调整光标到最后
                    quill.setSelection(length + 1);
                    console.log(this.courseInfo.introduction);
                } else {
                    this.$message.error('视频插入失败')
                }
                // loading动画消失
                this.quillUpdateImg = false
            },
            // 上传图片成功
            uploadSuccessEdit(res, file) {
                // res为图片服务器返回的数据
                // 获取富文本组件实例
                let quill = this.$refs.myQuillEditor.quill
                // 如果上传成功
                if (res.code === 200) {
                    // 获取光标所在位置
                    let length = quill.getSelection().index;
                    // 插入图片  res.data.url为服务器返回的图片地址
                    quill.insertEmbed(length, 'image', res.data);
                    // 调整光标到最后
                    quill.setSelection(length + 1);
                    console.log(this.courseInfo.introduction);

                } else {
                    this.$message.error('图片插入失败')
                }
                // loading动画消失
                this.quillUpdateImg = false
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
        computed: {
            editor() {
                return this.$refs.myQuillEditor.quill
            }
        },
        components: {
            headTop,
            quillEditor,
        },
	}
</script>

<style lang="less">
    @import '../style/mixin';
    .demo-table-expand {
        font-size: 0;
    }
    .editer {
        min-height: 500px;
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
