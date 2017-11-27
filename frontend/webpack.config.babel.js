import webpack from 'webpack'

import Extract from 'extract-text-webpack-plugin'
import path from 'path'

const styles = './src/styles/'

const extractSass = new Extract({ filename : '[name].css'/*, allChunks : true */ })

const uglify = new webpack.optimize.UglifyJsPlugin({ compress : { warnings : false }})

export const cssConfig = {
  watch : true,
  entry : {
    dashboard : `${ styles }/scss/dashboard.scss`,
  }, 
  output : { 
    path : path.resolve(__dirname, styles, 'css' ),
    filename : '[name].css'
  },
  module : {
    loaders : [
      {
        test : /\.s(css|ass)$/,
        loader : Extract.extract(
          {
            use : ['css-loader', 'sass-loader'],
            fallback : 'style-loader'
          }
        )
      }
    ]
  },
  plugins : [ /*uglify, */extractSass ],
  resolve : { extensions : ['.js', '.css', '.scss'] },
  devtool : 'inline-source-map',
}

export default [ cssConfig ]