const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const cssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const terserWebpackPlugin = require('terser-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
console.log(isDev);


const optimization = () =>{
  const config = {
    splitChunks: {
      chunks: 'all',
    }
  }

  if(isProd){
    config.minimizer = [
      new cssMinimizerWebpackPlugin(),
      new terserWebpackPlugin()
    ]
  }
  return config;
}


module.exports = {
  //context: path.resolve(__dirname, 'src'),                                               //буде відштовхуватися тільки від цієї папки
  entry : {
    main: path.resolve(__dirname, './src/index.js')
  },

  output : {
    path: path.resolve(__dirname , './dist'),
    filename: '[name].js'
  },

  optimization: optimization(),

  devServer: {
    hot: isDev,
  },

  plugins: [

    new HtmlWebpackPlugin({
      title: 'Succes Corp',                                            // тайтл за замовчуванням
      template: path.resolve(__dirname, './src/template.html'), // шаблон де веду розробку
      filename: 'index.html',                                   // назва вихідного файлу
      //favicon: './src/assets/favicon.png',                       // додав фавікон так, але хз
      minify: {
          collapseWhitespace: isProd,
      }
    }),

    new CopyPlugin({
      patterns: [
          {
            from: path.resolve(__dirname, 'src/assets'),
            to:   path.resolve(__dirname, 'dist/assets'),
            noErrorOnMissing: true,
          }
        ]
      }),

    new CleanWebpackPlugin(),

    new miniCssExtractPlugin({
      filename: '[name].css'
    }),
  ],

  module: {

    rules: [ 

      {
        test: /\.js$/,            //для js файлів
        exclude: /node_modules/,
        use: ['babel-loader',],
      }, 

      {
        test: /\.(scss|css)$/,    // для стилів
        use: [miniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
      },

      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,     //для картинок
        type: 'asset/resource',
      },

      {
        test: /\.(ttf|otf|eot|svg|woff|woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: `fonts/[name].[ext]`,
              publicPath: '../'
            }
          }
        ]
      },

    ],

  }

};
