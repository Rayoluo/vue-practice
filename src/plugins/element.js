import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'

Vue.use(Button)
// 将导入的组件注册为全局可用
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// Message的使用方式略微不同，需要进行挂载
// 将Message组件挂载到Vue的原型对象上，这样每个组件都可以通过this.$message使用该组件
Vue.prototype.$message = Message
