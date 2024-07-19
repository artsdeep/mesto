const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');
const {dependencies: deps} = require("./package.json");

module.exports = {
  entry: './src/index',
  mode: 'development',
  devServer: {
    static: path.join(__dirname, 'dist'),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
    port: 3301,
  },
  output: {
    publicPath: 'auto',
  },
  resolve: {
    alias: {
      'frontend_shared-context': path.resolve(__dirname, '../shared-context'),
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-react'],
        },
      },{
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash:8].[ext]',
              outputPath: 'fonts/', // Optional: where to output the fonts
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash:8].[ext]',
              outputPath: 'images/', // Optional: where to output the images
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // To learn more about the usage of this plugin, please visit https://webpack.js.org/plugins/module-federation-plugin/
    new ModuleFederationPlugin({
      name: 'mf_layout',
      filename: 'remoteEntry.js',
      remotes: {
        mf_card: "mf_card@http://localhost:3305/remoteEntry.js"
      },
      exposes: {
        './App': './src/App',
        './Footer': './src/Components/Footer',
        './Header': './src/Components/Header',
        './Main': './src/Components/Main',
      },
      shared: [{
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
        'frontend_shared-context': {
          import: 'frontend_shared-context',
          requiredVersion: require('../shared-context/package.json').version,
        },
      }]
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};
