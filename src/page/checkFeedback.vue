<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container">
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
                <!--@current-change="handleCurrentChange"-->
                <!--:current-page="currentPage"-->
                <!--:page-size="20"-->
                <!--layout="total, prev, pager, next"-->
                <!--:total="count">-->
            <!--</el-pagination>-->
        <!--</div>-->
            <!--<el-dialog title="修改店铺信息" v-model="dialogFormVisible">-->
                <!--<el-form :model="selectTable">-->
                    <!--<el-form-item label="店铺名称" label-width="100px">-->
                        <!--<el-input v-model="selectTable.name" auto-complete="off"></el-input>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="详细地址" label-width="100px">-->
                        <!--<el-autocomplete-->
                            <!--v-model="address.address"-->
                            <!--:fetch-suggestions="querySearchAsync"-->
                            <!--placeholder="请输入地址"-->
                            <!--style="width: 100%;"-->
                            <!--@select="addressSelect"-->
                        <!--&gt;</el-autocomplete>-->
                        <!--<span>当前城市：{{city.name}}</span>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="店铺介绍" label-width="100px">-->
                        <!--<el-input v-model="selectTable.description"></el-input>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="联系电话" label-width="100px">-->
                        <!--<el-input v-model="selectTable.phone"></el-input>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="店铺分类" label-width="100px">-->
                        <!--<el-cascader-->
                            <!--:options="categoryOptions"-->
                            <!--v-model="selectedCategory"-->
                            <!--change-on-select-->
                        <!--&gt;</el-cascader>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="商铺图片" label-width="100px">-->
                        <!--<el-upload-->
                            <!--class="avatar-uploader"-->
                            <!--:action="baseUrl + '/v1/addimg/shop'"-->
                            <!--:show-file-list="false"-->
                            <!--:on-success="handleServiceAvatarScucess"-->
                            <!--:before-upload="beforeAvatarUpload">-->
                            <!--<img v-if="selectTable.image_path" :src="baseImgPath + selectTable.image_path" class="avatar">-->
                            <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
                        <!--</el-upload>-->
                    <!--</el-form-item>-->
                <!--</el-form>-->
                <!--<div slot="footer" class="dialog-footer">-->
                    <!--<el-button @click="dialogFormVisible = false">取 消</el-button>-->
                    <!--<el-button type="primary" @click="updateShop">确 定</el-button>-->
                <!--</div>-->
            <!--</el-dialog>-->
        </div>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {checkFeedback} from '@/api/getData'
    import {mapActions, mapState} from 'vuex'
	export default {
        data(){
            return{
                feedData:[{
                    "id": 1,
                    "content": "这里是对平台的反馈信息",
                    "phone": "17364527412"
                },
                    {
                        "id": 2,
                        "content": "这个平台很不错啊",
                        "phone": "17364527412"
                    },
                    {
                        "id": 4,
                        "content": "string",
                        "phone": "13066"
                    },
                    {
                        "id": 5,
                        "content": "wd",
                        "phone": "123"
                    },
                    {
                        "id": 6,
                        "content": "123",
                        "phone": "123"
                    },
                    {
                        "id": 7,
                        "content": "123",
                        "phone": null
                    },]
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
                    const res = await checkFeedback({});
                    if (res.code == 200) {
                        // this.count = countData.count;
                        this.feedData=res.data
                        console.log(res.data)
                    }else{
                        throw new Error('获取数据失败');
                    }
                    // this.getFoods();
                }catch(err){
                    console.log('获取数据失败', err);
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
