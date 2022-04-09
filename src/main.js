// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'
import VueClipboard from 'vue-clipboard2'
import utils from './assets/utils'
import axios from './assets/axios'
import VueCookies from 'vue-cookies'

Vue.use(ViewUI)
Vue.use(VueClipboard)
Vue.use(VueCookies)

Vue.config.productionTip = false
Vue.prototype.axios = axios
Vue.prototype.utils = utils
Vue.prototype.API_ROOT = process.env.API_ROOT

//百度统计
router.afterEach((to, from, next) => {
  setTimeout(() => {
    // eslint-disable-next-line
    var _hmt = _hmt || [];
    // eslint-disable-next-line
    window._hmt = _hmt; // 必须把_hmt挂载到window下，否则找不到
    (function () {
      // 每次执行前，先移除上次插入的代码
      document.getElementById('baidu_tj') && document.getElementById('baidu_tj').remove();
      var hm = document.createElement("script");
      hm.src = "https://hm.baidu.com/hm.js?23bd70f6dc0674bedc893baa804a54b4";
      hm.id = "baidu_tj"
      var s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(hm, s);
    })();
  }, 0);
});

/* eslint-disable no-new */
let vue = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

export default { aa: "1" }