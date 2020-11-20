/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * baseImgPath: 图片存放地址
 *
 */
let baseUrl = '';
let routerMode = 'hash';
let baseImgPath;

if (process.env.NODE_ENV === 'development') {
	// baseUrl = '';
	baseUrl = 'http://212.64.40.135:8081';
    // baseImgPath = '/img/';
}else{
    baseUrl = 'http://212.64.40.135:8081';
    baseImgPath = 'http://212.64.40.135:8081';
}

export {
	baseUrl,
	routerMode,
	baseImgPath
}
