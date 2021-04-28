module.exports = {
  chainWebpack: config => {
    // 发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      // entry找到默认的打包入口，调用clear删除默认的打包入口
      // add添加新的打包入口
      config.entry('app').clear().add('./src/main-prod.js')

      // 通过设置externals加载外部的CDN资源对项目进行优化
      // key是js文件名，val是导出的对象名
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })
      
      // 不加这部分的话会因为重复定义router属性而导致开发模式出错，因为
      // 在index.html引入了vue-router的CDN, 同时又在本地环境中加载了该CDN
      // 在发布模式不会出现问题是在config中指定了vue-router从CDN加载
      config.plugin('html').tap(args => {
        // 添加参数isProd
        args[0].isProd = true
        return args
      })
    })
    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')

      // 使用插件
      config.plugin('html').tap(args => {
        // 添加参数isProd
        args[0].isProd = false
        return args
      })
    })
  }
}