<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div style="padding:20px;display: flex;justify-content: space-around">
            <el-select v-model="query.choice" placeholder="请选择课程类型">
                <el-option label="全部分享排名" value=0></el-option>
                <el-option label="有效分享排名" value=1></el-option>
            </el-select>
            <el-input v-model="query.n" placeholder="前n名" type="number" style="width: 200px;"></el-input>
            <el-date-picker
                v-model="query.time"
                type="date"
                format="yyyy 年 MM 月 dd 日"
                placeholder="选择指定该时间之前"
                value-format="yyyy-MM-dd"
                >
            </el-date-picker>
            <el-button type="primary" @click="getShare" style="width: 150px;">查询
            </el-button>
        </div>
        <div class="table_container">
            <el-table
                :data="shareInfo"
                align="center"
                style="width: 100%">
                <el-table-column
                    label="id"
                    width="60"
                    prop="id">
                </el-table-column>
                <el-table-column
                    label="姓名"
                    prop="realName">
                </el-table-column>
                <el-table-column
                    label="分享数量"
                    prop="shareNum">
                </el-table-column>
                <el-table-column
                    label="有效分享数量"
                    prop="activeShareNum">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import headTop from '../components/headTop'
    import {baseUrl, baseImgPath} from '@/config/env'
    import {getShare} from '@/api/getData'
    import {mapActions, mapState} from 'vuex'

    export default {
        data() {
            return {
                query:{
                    choice:'',
                    n:3,
                    time:''
                },
                baseUrl,
                shareInfo: [],
                dialogFormVisible: false,
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                },
            }
        },
        components: {
            headTop,
        },

        methods: {
            async getShare() {
                try {
                    this.query.time=moment(this.query.time).format('YYYY-MM-DD');
                    console.log(this.query);
                    const res = await getShare(this.query);
                    if (res.code === 200) {
                        console.log(res.data)
                    } else {
                        throw new Error('获取数据失败');
                    }
                } catch (err) {
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
