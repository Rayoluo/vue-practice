import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Login.vue')
// import Login from '../components/Login'
const Home = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Home.vue')
// import Home from '../components/Home'
const Welcome = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Welcome.vue')
// import Welcome from '../components/Welcome'
const Users = () => import(/* webpackChunkName:"user" */ '../components/user/Users.vue')
// import Users from '../components/user/Users'
const Rights = () => import(/* webpackChunkName:"power" */ '../components/power/Rights.vue')
// import Rights from '../components/power/Rights'
const Roles = () => import(/* webpackChunkName:"power" */ '../components/power/Roles.vue')
// import Roles from '../components/power/Roles'
const Cate = () => import(/* webpackChunkName:"goods" */ '../components/goods/Cate.vue')
// import Cate from '../components/goods/Cate'
// import Params from '../components/goods/Params'
const Params = () => import(/* webpackChunkName:"goods" */ '../components/goods/Params.vue')
// import GoodList from '../components/goods/List'
const GoodList = () => import(/* webpackChunkName:"goods" */ '../components/goods/List.vue')
// import Add from '../components/goods/Add'
const Add = () => import(/* webpackChunkName:"goods" */ '../components/goods/Add.vue')
// import Order from '../components/order/Order'
const Order = () => import(/* webpackChunkName:"order" */ '../components/order/Order.vue')
// import Report from '../components/report/Report'
const Report = () => import(/* webpackChunkName:"report" */ '../components/report/Report.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: GoodList },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to将要访问的路径
  // from 代表从哪个路径跳转而来
  // next是一个函数，表示放行
  //  next() 放行 next('/login') 强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenstr = window.sessionStorage.getItem('token')
  if (!tokenstr) {
    return next('/login')
  }
  return next()
})

export default router
