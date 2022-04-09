import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'hash',    //模式history/hash
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/fileCode/:fileCode',
      name: 'fileCode',
      component: Home
    }
  ]
})
