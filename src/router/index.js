import Vue from 'vue'
import Router from 'vue-router'
// import * as router from "mocha";

Vue.use(Router);

const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const home = r => require.ensure([], () => r(require('@/page/home')), 'home');
const addShop = r => require.ensure([], () => r(require('@/page/addShop')), 'addShop');
const addGoods = r => require.ensure([], () => r(require('@/page/addGoods')), 'addGoods');
const addTeacher = r => require.ensure([], () => r(require('@/page/addTeacher')), 'addTeacher');
const addCourse = r => require.ensure([], () => r(require('@/page/addCourse')), 'addCourse');
const userList = r => require.ensure([], () => r(require('@/page/userList')), 'userList');
const shopList = r => require.ensure([], () => r(require('@/page/shopList')), 'shopList');
const teacherList = r => require.ensure([], () => r(require('@/page/teacherList')), 'teacherList');
const orderList = r => require.ensure([], () => r(require('@/page/orderList')), 'orderList');
const courseList = r => require.ensure([], () => r(require('@/page/courseList')), 'courseList');
const adminList = r => require.ensure([], () => r(require('@/page/adminList')), 'adminList');
const checkFeedback = r => require.ensure([], () => r(require('@/page/checkFeedback')), 'checkFeedback');
const courseDetail = r => require.ensure([], () => r(require('@/page/courseDetail')), 'courseDetail');
const visitor = r => require.ensure([], () => r(require('@/page/visitor')), 'visitor');
const newMember = r => require.ensure([], () => r(require('@/page/newMember')), 'newMember');
const uploadImg = r => require.ensure([], () => r(require('@/page/uploadImg')), 'uploadImg');
const vueEdit = r => require.ensure([], () => r(require('@/page/vueEdit')), 'vueEdit');
const adminSet = r => require.ensure([], () => r(require('@/page/adminSet')), 'adminSet');
const sendMessage = r => require.ensure([], () => r(require('@/page/sendMessage')), 'sendMessage');
const explain = r => require.ensure([], () => r(require('@/page/explain')), 'explain');

const router = new Router({
    routes : [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            component: login,
            name:'login'
        },

        {
            path: '/manage',
            component: manage,
            name: '',
            children: [{
                path: '',
                component: home,
                meta: [],
            },{
                path: '/courseDetail',
                component: courseDetail,
                meta: ['数据管理', '课程管理','课程详情'],
            },{
                path: '/addShop',
                component: addShop,
                meta: ['添加数据', '添加商铺'],
            },{
                path: '/addGoods',
                component: addGoods,
                meta: ['添加数据', '添加商品'],
            },{
                path: '/addTeacher',
                component: addTeacher,
                meta: ['添加数据', '添加老师'],
            },{
                path: '/addCourse',
                component: addCourse,
                meta: ['添加数据', '添加课程'],
            },{
                path: '/userList',
                component: userList,
                meta: ['数据管理', '用户列表'],
            },{
                path: '/shopList',
                component: shopList,
                meta: ['数据管理', '商家列表'],
            },{
                path: '/teacherList',
                component: teacherList,
                meta: ['数据管理', '教师管理'],
            },{
                path: '/courseList',
                component: courseList,
                meta: ['数据管理', '课程管理'],
            },{
                path: '/orderList',
                component: orderList,
                meta: ['数据管理', '订单列表'],
            },{
                path: '/checkFeedback',
                component: checkFeedback,
                meta: ['数据管理', '用户反馈'],
            },{
                path: '/adminList',
                component: adminList,
                meta: ['数据管理', '管理员列表'],
            },{
                path: '/visitor',
                component: visitor,
                meta: ['图表', '用户分布'],
            },{
                path: '/newMember',
                component: newMember,
                meta: ['图表', '用户数据'],
            },{
                path: '/uploadImg',
                component: uploadImg,
                meta: ['文本编辑', 'MarkDown'],
            },{
                path: '/vueEdit',
                component: vueEdit,
                meta: ['编辑', '文本编辑'],
            },{
                path: '/adminSet',
                component: adminSet,
                meta: ['设置', '管理员设置'],
            },{
                path: '/sendMessage',
                component: sendMessage,
                meta: ['设置', '发送通知'],
            },{
                path: '/explain',
                component: explain,
                meta: ['说明', '说明'],
            }]
        }
    ]
});


// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆

router.beforeEach((to, from, next) => {
    console.log(to.path);
    if (to.path === '/login') {
        console.log('login');
        next();
    } else {
        let token = localStorage.getItem('Authorization');

        if (token === null || token === '') {
            console.log('no token');
            alert('用户未登录');
            next('/login');
        } else {
            console.log('have token');
            next();
        }
    }
});

// router.beforeEach((to, from, next) => {
//     console.log(to.path);   // 即将要进入路由的对象
//     console.log(from.path); // 当前导航要离开的路由对象
//     console.log(next); // 调用next该方法，才能进入下一个路由
//     next();
// });

// export default new Router({
// 	routes,
// 	strict: process.env.NODE_ENV !== 'production',
// })
export default router;
