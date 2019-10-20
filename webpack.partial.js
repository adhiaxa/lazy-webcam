const ProvidePlugin = require('webpack/lib/ProvidePlugin');

module.exports = {
  resolve: {
    alias: {
      videojs: 'video.js'
    }
  },
  plugins: [
    new ProvidePlugin({
      videojs: 'video.js/dist/video.cjs.js',
      RecordRTC: 'recordrtc'
    })
  ]
}
