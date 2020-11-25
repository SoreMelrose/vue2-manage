<template>
    <div class="fillcontain">
        <head-top></head-top>
        <header class="admin_title">管理员信息</header>
        <div class="admin_set">
            <ul>
                <li>
                    <span>权限：</span><span>{{role}}</span>
                </li>
                <li>
                    <span>管理员 ID：</span><span>{{user_id}}</span>
                </li>
                <el-form :model="info" :rules="rules">
                    <el-form-item  prop="username">
                        <el-input v-model="info.username" placeholder="输入用户名" style="padding: 10px;"></el-input>
                    </el-form-item>
                    <el-form-item  prop="old">
                        <el-input v-model="info.old" placeholder="输入原密码" style="padding: 10px;"></el-input>
                    </el-form-item>
                    <el-form-item  prop="input1">
                        <el-input v-model="info.input1" placeholder="输入新密码" style="padding: 10px;"></el-input>
                    </el-form-item>
                    <el-form-item prop="input2">
                        <el-input v-model="info.input2" placeholder="再次输入" style="padding: 10px;"></el-input>
                    </el-form-item>
                </el-form>
                <div align="center" style="padding: 20px;">
                    <el-button type="success" @click="submit">重置密码</el-button>
                </div>
            </ul>
        </div>
    </div>
</template>

<script>
	import headTop from '../components/headTop'
    import {mapState} from 'vuex'
    import {changeCode} from '@/api/getData'
    import {baseUrl, baseImgPath} from '@/config/env'

    export default {
        data(){
            return {
                info: {
                    old:'',
                    input1: '',
                    input2: '',
                    username: '',
                },
                user_id:'',
                role:'',
                baseUrl,
                baseImgPath,
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                    ],
                    old: [
                        { required: true, message: '请输入原密码', trigger: 'blur' },
                    ],
                    input1: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                    ],
                    input2: [
                        { required: true, message: '请再次输入密码', trigger: 'blur' }
                    ],

                },
            }
        },
    	components: {
    		headTop,
    	},
        // computed: {
        //     ...mapState(['adminInfo']),
        // },
        created() {
            this.initData();
        },
        methods: {
            initData() {
                this.user_id=localStorage.getItem('user_id');
                this.role=localStorage.getItem('role');
                // console.log(this.adminInfo);
            },
            submit(){
                if(this.info.input1!==this.info.input2)
                {
                    this.$message({
                        message: '两次密码不同！'
                    });
                }
                else{
                    this.confirm();
                }
            },
            async confirm() {
                try {
                    const res = await changeCode(
                        {
                            password:this.info.old,
                            new_password:this.info.input1,
                            user_id:this.user_id,
                            username:this.info.username
                        }
                    );
                    if (res.code === 200) {
                        this.$message({
                            type: 'success',
                            message: '重置成功'
                        });
                        localStorage.clear();
                        this.$router.push('/login');
                        console.log(res.data)
                    } else {
                        this.$message({
                            message: res.message
                        });
                        throw new Error('获取数据失败');
                    }
                    // this.getFoods();
                } catch (err) {
                    console.log('获取数据失败', err);
                }
            },
        },
    }
</script>

<style lang="less">
	@import '../style/mixin';
	.explain_text{
		margin-top: 20px;
		text-align: center;
		font-size: 20px;
		color: #333;
	}
    .admin_set{
        width: 60%;
        background-color: #F9FAFC;
        min-height: 170px;
        margin: 20px auto 0;
        border-radius: 10px;
        ul > li{
            padding: 20px;
            span{
                color: #666;
            }
        }
    }
    .admin_title{
        margin-top: 20px;
        .sc(24px, #666);
        text-align: center;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        margin-top: 10px;
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
