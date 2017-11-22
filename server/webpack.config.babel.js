import webpack from 'webpack'

import Extract from 'extract-text-webpack-plugin'
import path from 'path'

const assets = './src/public/assets'

const styles = `${ assets }/styles`
const js = `${ assets }/js`
const components = './src/components'

const extractSass = new Extract({
  filename : '[name].css',
  // allChunks : true
})

const uglify = new webpack.optimize.UglifyJsPlugin({ compress : { warnings : false }})

const cssConfig = {
  watch : true,
  entry : { style : `${ styles }/scss/style.scss` }, 
  output : { 
    path : path.resolve(__dirname, styles, 'css' ),
    filename : '[name].css'
  },
  module : {
    loaders : [
      {
        test : /\.css$/,
        // include : [ path.resolve(__dirname, styles, 'css') ],
        loader : Extract.extract(
          { 
            use : ['css-loader?importLoaders=1'],
            fallback : 'style-loader'
          }
        ),
      },
      {
        test : /\.s(css|ass)$/,
        // include : [ path.resolve(__dirname, styles, 'scss') ],
        loader : Extract.extract(
          {
            use : ['css-loader', 'sass-loader'],
            fallback : 'style-loader'
          }
        )
      }
    ]
  },
  plugins : [ extractSass ],
  resolve : { extensions : ['.css', '.scss'] }
}

const bundleConfig = {
  watch : true,
  entry : {
    // polyfill : 'babel-polyfill',
    login : ['babel-polyfill', `${ components }/login/index.jsx`],
    // ax : `${ components }/index.jsx`
  }, 
  output : {
    path : path.resolve(__dirname, js),
    filename : '[name].js'
  },
  module : {
    loaders : [
      {
        test : /\.jsx?$/,
        loader : 'babel-loader',
        exclude : /(nodule_modules|\.git)/,
        // options : {
        //   babelrc : true,
        //   cacheDirectory : true,
        //   presets : ['es2015', 'react'],
        // },
        query : {
          // cacheDirectory: true,
          presets : ['es2015', 'react', 'stage-2'],
          // plugins : [ 'syntax-async-functions', 'transform-regenerator' ]
        },
      }
    ],
  },
  // plugins : [ uglify ],
  resolve: { extensions: ['.js', '.jsx'] },
}

export default [ /*cssConfig, */bundleConfig ]