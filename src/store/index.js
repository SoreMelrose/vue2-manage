import Vue from 'vue'
import Vuex from 'vuex'
import {getAdminInfo} from '@/api/getData'

Vue.use(Vuex)

const state = {
	adminInfo: {
		// avatar: 'default.jpg'
	},
    token:localStorage.getItem('Authorization') ? localStorage.getItem('Authorization') : ''

};
// 只能在mutaions里修改state，actions不能直接修改state
const mutations = {
    // 更改state中状态的逻辑，同步操作
	saveAdminInfo(state, adminInfo){
		state.adminInfo = adminInfo;
	},
	saveUserInfo(state,info){
        state.adminInfo = info;
        state.token=info.Token;
        localStorage.setItem('Authorization', info.Token);
        localStorage.setItem('user_id', info.user_id);
        localStorage.setItem('role', info.role);
    }
};

const actions = {
    // 提交mutation，异步操作
	async getAdminData({commit}){
		try{
			// const res = await getAdminInfo()
			// if (res.status == 1) {
			// 	commit('saveAdminInfo', res.data);
			// }else{
			// 	throw new Error(res.type)
			// }

		}catch(err){
			// console.log(err.message)
		}
	}
}

export default new Vuex.Store({
	state,
	actions,
	mutations,
})
