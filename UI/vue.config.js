const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: './',
  assetsDir: './',
  transpileDependencies: true,
  devServer: {
    host: '192.168.1.231',
    proxy: 'http://localhost:3000'
  }
})
