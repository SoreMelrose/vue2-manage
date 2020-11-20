<template>
    <div>
        <head-top></head-top>
        <el-row style="margin-top: 60px;">
  			<el-col :span="12" :offset="4">
		        <el-form :model="formData" :rules="rules" ref="formData" label-width="110px" class="demo-formData">
					<el-form-item label="姓名" prop="realName">
						<el-input v-model="formData.realName" ></el-input>
					</el-form-item>
					<el-form-item label="电话" prop="phone">
						<el-input v-model="formData.phone" type="number"></el-input>
					</el-form-item>
					<el-form-item label="上传老师照片" v-loading="loading" prop="head" element-loading-text="图片上传中">
						<el-upload
						  class="avatar-uploader"
						  :action="baseUrl + '/api/file/upload'"
						  :show-file-list="false"
                          :limit="1"
                          :on-change="imageUpload"
						  :on-success="handleShopAvatarSuccess"
						  :before-upload="beforeAvatarUpload">
						  <img v-if="formData.head" :src="formData.head" class="avatar">
						  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
					</el-form-item>
					<el-form-item class="button_submit">
						<el-button type="primary" @click="submitForm('formData')">增加员工</el-button>
					</el-form-item>
				</el-form>
  			</el-col>
  		</el-row>
    </div>
</template>

<script>
    import headTop from '@/components/headTop'
    import {addStaff} from '@/api/getData'
    import {baseUrl, baseImgPath} from '@/config/env'
    export default {
    	data(){
    		return {
    			city: {},
                loading:false,
    			formData: {
                    phone: "",
                    head: "",
                    realName: "",
		        },
		        rules: {
                    realName: [
						{ required: true, message: '请输入姓名', trigger: 'blur' },
					],
                    phone: [
                        { required: true, message: '请输入手机号', trigger: 'blur' },
                    ],
                    head: [
                        { required: true, message: '请上传照片' },
                        // { type: 'number', message: '教授人数必须是数字' }
                    ],
				},
			    baseUrl,
			    baseImgPath,
			    categoryOptions: [],
    		}
    	},
    	components: {
    		headTop,
    	},
    	mounted(){
    	},
    	methods: {
			handleShopAvatarSuccess(res, file) {
				if (res.code === 200) {
					this.formData.head = res.data;
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
		    submitForm(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						try{
						    console.log(this.formData);
							let result = await addStaff(this.formData);
							if (result.code === 200) {
								this.$message({
					            	type: 'success',
					            	message: '添加成功'
					          	});
					          	this.formData = {
                                    phone: "",
                                    head: "",
                                    realName: "",
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
		}
    }
</script>

<style lang="less">
	@import '../style/mixin';
	.button_submit{
		text-align: center;
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
	.el-table .info-row {
	    background: #c9e5f5;
	}

	.el-table .positive-row {
	    background: #e2f0e4;
	}
</style>
