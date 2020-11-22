import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import 'vue-directive-image-previewer/dist/assets/style.css'
import VueDirectiveImagePreviewer from 'vue-directive-image-previewer'
import moment from 'moment'
import router from './router'
import store from './store/'
Vue.use(VueDirectiveImagePreviewer);
Vue.use(require('vue-moment'));
Vue.prototype.moment = moment;

Vue.filter('dateYMDHMSFormat',function(dateStr,pattern='YYYY-MM-DD HH:mm:ss'){
    return moment(dateStr).format(pattern);
});
Vue.config.productionTip = false;

Vue.use(ElementUI);

new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: { App }
})
