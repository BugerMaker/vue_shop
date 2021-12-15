import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入iconfont字体库
import './assets/fonts/iconfont.css'
// 导入axios
import axios from 'axios'
axios.defaults.baseURL = 'http://116.62.58.95:3000/api/private/v1/'
Vue.prototype.$http = axios
axios.interceptors.request.use(config => {
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
