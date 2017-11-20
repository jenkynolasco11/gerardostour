import webpack from 'webpack'
import Extract from 'extract-text-webpack-plugin'
import path from 'path'

const styles = './src/public/assets/styles'

const extractSass = new Extract({
  filename : './src/public/assets/styles/css/[name].css',
  // allChunks : true
})

export default {
  watch : true,
  entry : {
    //
    style : `${ styles }/scss/style.scss`,
    // 'dist/' : './app.js',
  }, 
  output : {
    path : path.resolve(__dirname, '.'),
    filename : 'bundle'
  },
  // exclude : [ 'node_modules' ],
    // chatClient : './chat/index.jsx',
    // chatServer : './chat-server/index.jsx'
  // output : {
  //   // path : join(__dirname,'public/js'),
  //   filename : '[name].js',
  // },
  // debug : true,
  // target : 'node',
  // externals : [nodeExternals()],
  // resolve : {
  //   modulesDirectories : ['node_modules','.','chat'],
  //   extensions : ['','*.jsx']
  // },
  module : {
    // loaders : [
    //   {
    //     test : /\.jsx?$/,
    //     exclude : /nodule_modules/,
    //     // include : [
    //     //   path.join(__dirname,'chat')
    //     // ],
    //     loader : 'babel',
    //     query : {
    //       //
    //       presets : ['es2015', 'react']
    //     }
    //   }
    // ],
    loaders : [
      {
        test : /\.css$/,
        include : [ path.resolve(__dirname, styles, 'css') ],
        loader : Extract.extract(
          { 
            use : ['css-loader?importLoaders=1'],
            fallback : 'style-loader'
          }
        ),
      },
      {
        test : /\.s(css|ass)$/,
        include : [ path.resolve(__dirname, styles, 'scss') ],
        loader : Extract.extract(
          {
            use : ['css-loader', 'sass-loader'],
            fallback : 'style-loader'
          }
        )
      }
      //   use : [
      //     { loader : 'style-loader' }, 
      //     { loader : 'css-loader' },
      //     { loader : 'sass-loader' }
      //   ]
      // }
    ]
  },
  plugins : [
    extractSass
    // new webpack.HotModuleReplacementPlugin(),
    // new webpack.NoErrorsPlugin(),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress : { warnings : false }
    // })
  ]
}