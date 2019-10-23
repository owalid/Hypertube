module.exports = {
  chainWebpack: config => {
      config.module
        .rule('vue')
        .use('vue-loader')
        .loader('vue-loader')

      config.module
        .rule('media')
        .test(/\.(srt|vtt|mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/)
          },
  }